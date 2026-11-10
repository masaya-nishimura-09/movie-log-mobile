import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeJwt } from "@/test/fake-jwt";

let mockFetch: typeof import("@/api/mock/mock-fetch").mockFetch;

beforeEach(async () => {
  const store = globalThis as Record<string, unknown>;
  delete store.mockRecords;
  delete store.mockRecordOwners;
  delete store.mockAccounts;
  vi.resetModules();
  vi.stubEnv("MOCK_DATASET", "");
  vi.stubEnv("MOCK_LANGUAGE", "");
  ({ mockFetch } = await import("@/api/mock/mock-fetch"));
});

function post(body: unknown, method = "POST", headers: HeadersInit = {}) {
  return {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

async function tokens(email = "demo@example.com", password = "password") {
  const response = await mockFetch("/auth/login", post({ email, password }));
  return response.json();
}

async function auth(email?: string, password?: string) {
  const { access_token } = await tokens(email, password);
  return { Authorization: `Bearer ${access_token}` };
}

async function register(name = "tester", email = "tester@example.com") {
  await mockFetch(
    "/users/register",
    post({ name, email, password: "password" }),
  );
  return auth(email);
}

const newRecord = {
  title: "Arrival",
  release_year: 2016,
  runtime: 116,
  genres: ["drama"],
  countries: ["US"],
  language: "en",
  credits: [],
  poster_url: "",
  watched_at: "2026-10-01T12:00:00Z",
  platform: "netflix",
  score: 5,
  mood_tags: ["moving"],
};

async function list(headers: HeadersInit, query = "") {
  const response = await mockFetch(`/records/?${query}`, { headers });
  return { status: response.status, body: await response.json() };
}

describe("mockFetch: 認証", () => {
  it("logs in the demo account and rejects a wrong password", async () => {
    const ok = await mockFetch(
      "/auth/login",
      post({ email: "demo@example.com", password: "password" }),
    );
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({
      access_token: expect.stringMatching(/\.mock$/),
      refresh_token: expect.stringMatching(/^mock-refresh-1\./),
    });
    const ng = await mockFetch(
      "/auth/login",
      post({ email: "demo@example.com", password: "wrong" }),
    );
    expect(ng.status).toBe(401);
    expect(await ng.json()).toMatchObject({ code: "INVALID_CREDENTIALS" });
  });

  it("refreshes tokens with a valid refresh token only", async () => {
    const { refresh_token } = await tokens();
    const ok = await mockFetch("/auth/refresh", post({ refresh_token }));
    expect(ok.status).toBe(200);
    const ng = await mockFetch(
      "/auth/refresh",
      post({ refresh_token: "invalid" }),
    );
    expect(await ng.json()).toMatchObject({ code: "INVALID_REFRESH_TOKEN" });
  });

  it("logs out", async () => {
    const response = await mockFetch("/auth/logout", post({}));
    expect(response.status).toBe(204);
  });

  it("rejects requests without a valid access token", async () => {
    const none = await mockFetch("/users/", {});
    expect(await none.json()).toMatchObject({ code: "UNAUTHENTICATED" });
    const invalid = await mockFetch("/users/", {
      headers: { Authorization: "Bearer invalid" },
    });
    expect(await invalid.json()).toMatchObject({
      code: "INVALID_ACCESS_TOKEN",
    });
    const expired = await mockFetch("/users/", {
      headers: {
        Authorization: `Bearer ${fakeJwt({ sub: "1", exp: 1 }, "mock")}`,
      },
    });
    expect(await expired.json()).toMatchObject({
      code: "INVALID_ACCESS_TOKEN",
    });
  });
});

describe("mockFetch: ユーザー", () => {
  it("registers a user and rejects a duplicate email", async () => {
    const created = await mockFetch(
      "/users/register",
      post({
        name: "tester",
        email: "tester@example.com",
        password: "password",
      }),
    );
    expect(created.status).toBe(201);
    expect(await created.json()).toEqual({
      user_id: "2",
      username: "tester",
      email: "tester@example.com",
    });
    const duplicate = await mockFetch(
      "/users/register",
      post({ name: "x", email: "demo@example.com", password: "password" }),
    );
    expect(await duplicate.json()).toMatchObject({
      code: "USER_ALREADY_EXISTS",
    });
  });

  it("gets, updates and deletes the current user", async () => {
    const headers = await register();
    const current = await mockFetch("/users/", { headers });
    expect(await current.json()).toEqual({
      user_id: "2",
      username: "tester",
      email: "tester@example.com",
    });
    await mockFetch(
      "/users/username",
      post({ name: "renamed" }, "PUT", headers),
    );
    await mockFetch(
      "/users/email",
      post(
        { email: "renamed@example.com", password: "password" },
        "PUT",
        headers,
      ),
    );
    await mockFetch(
      "/users/password",
      post(
        { old_password: "password", new_password: "password2" },
        "PUT",
        headers,
      ),
    );
    const updated = await mockFetch("/users/", { headers });
    expect(await updated.json()).toEqual({
      user_id: "2",
      username: "renamed",
      email: "renamed@example.com",
    });
    const relogin = await mockFetch(
      "/auth/login",
      post({ email: "renamed@example.com", password: "password2" }),
    );
    expect(relogin.status).toBe(200);
    const deleted = await mockFetch("/users/", { method: "DELETE", headers });
    expect(deleted.status).toBe(204);
    const login = await mockFetch(
      "/auth/login",
      post({ email: "renamed@example.com", password: "password2" }),
    );
    expect(login.status).toBe(401);
  });

  it("rejects an email used by another user and a wrong current password", async () => {
    const headers = await register();
    const taken = await mockFetch(
      "/users/email",
      post({ email: "demo@example.com", password: "password" }, "PUT", headers),
    );
    expect(await taken.json()).toMatchObject({ code: "USER_ALREADY_EXISTS" });
    const wrongForEmail = await mockFetch(
      "/users/email",
      post({ email: "new@example.com", password: "wrongpass" }, "PUT", headers),
    );
    expect(await wrongForEmail.json()).toMatchObject({
      code: "INVALID_CURRENT_PASSWORD",
    });
    const wrongForPassword = await mockFetch(
      "/users/password",
      post(
        { old_password: "wrongpass", new_password: "password3" },
        "PUT",
        headers,
      ),
    );
    expect(await wrongForPassword.json()).toMatchObject({
      code: "INVALID_CURRENT_PASSWORD",
    });
  });
});

describe("mockFetch: 記録", () => {
  it("creates, gets, updates and deletes a record of the current user", async () => {
    const headers = await register();
    const created = await mockFetch(
      "/records/",
      post(newRecord, "POST", headers),
    );
    expect(created.status).toBe(201);
    const { record_id, created_at } = await created.json();
    const got = await mockFetch(`/records/${record_id}`, { headers });
    expect(await got.json()).toMatchObject({ ...newRecord, record_id });
    const updated = await mockFetch(
      `/records/${record_id}`,
      post({ ...newRecord, title: "Arrival 2" }, "PUT", headers),
    );
    expect(await updated.json()).toMatchObject({
      title: "Arrival 2",
      record_id,
      created_at,
    });
    const deleted = await mockFetch(`/records/${record_id}`, {
      method: "DELETE",
      headers,
    });
    expect(deleted.status).toBe(204);
    const gone = await mockFetch(`/records/${record_id}`, { headers });
    expect(await gone.json()).toMatchObject({ code: "RECORD_NOT_FOUND" });
  });

  it("filters by score, platform, mood tags, genres and keyword", async () => {
    const headers = await register();
    const records = [
      {
        ...newRecord,
        title: "zz-Alpha",
        score: 5,
        platform: "netflix",
        mood_tags: ["moving", "dark"],
        genres: ["drama", "crime"],
      },
      {
        ...newRecord,
        title: "zz-Beta",
        score: 4,
        platform: "hulu",
        mood_tags: ["moving"],
        genres: ["drama"],
      },
      {
        ...newRecord,
        title: "zz-Gamma",
        score: 5,
        platform: "hulu",
        mood_tags: ["dark"],
        genres: ["crime"],
      },
    ];
    for (const record of records) {
      await mockFetch("/records/", post(record, "POST", headers));
    }
    const titles = async (query: string) =>
      (await list(headers, `${query}&keyword=zz-`)).body.records
        .map((r: { title: string }) => r.title)
        .sort();
    expect(await titles("score=5")).toEqual(["zz-Alpha", "zz-Gamma"]);
    expect(await titles("platform=hulu")).toEqual(["zz-Beta", "zz-Gamma"]);
    expect(await titles("mood_tags=moving&mood_tags=dark")).toEqual([
      "zz-Alpha",
    ]);
    expect(await titles("genres=crime")).toEqual(["zz-Alpha", "zz-Gamma"]);
    expect(await titles("keyword=ZZ-ALP")).toEqual(["zz-Alpha"]);
    expect(
      (await list(headers, "score=5&keyword=zz-")).body.filtered_count,
    ).toBe(2);
  });

  it("sorts by each field in both orders, then by newest ID", async () => {
    const headers = await register();
    const records = [
      {
        ...newRecord,
        title: "zz-B",
        score: 3,
        release_year: 2000,
        watched_at: "2026-01-02T00:00:00Z",
      },
      {
        ...newRecord,
        title: "zz-A",
        score: 5,
        release_year: 2010,
        watched_at: "2026-01-01T00:00:00Z",
      },
      {
        ...newRecord,
        title: "zz-C",
        score: 3,
        release_year: 1990,
        watched_at: "2026-01-03T00:00:00Z",
      },
    ];
    for (const record of records) {
      await mockFetch("/records/", post(record, "POST", headers));
    }
    const titles = async (field: string, order: string) =>
      (
        await list(
          headers,
          `sort_field=${field}&sort_order=${order}&keyword=zz-`,
        )
      ).body.records.map((r: { title: string }) => r.title);
    expect(await titles("watched_at", "desc")).toEqual([
      "zz-C",
      "zz-B",
      "zz-A",
    ]);
    expect(await titles("watched_at", "asc")).toEqual(["zz-A", "zz-B", "zz-C"]);
    expect(await titles("score", "desc")).toEqual(["zz-A", "zz-C", "zz-B"]);
    expect(await titles("release_year", "desc")).toEqual([
      "zz-A",
      "zz-B",
      "zz-C",
    ]);
    expect(await titles("title", "asc")).toEqual(["zz-A", "zz-B", "zz-C"]);
  });

  it("rejects an unknown sort", async () => {
    const headers = await auth();
    expect((await list(headers, "sort_field=unknown")).status).toBe(400);
    expect((await list(headers, "sort_order=up")).status).toBe(400);
  });

  it("splits the list into pages", async () => {
    const headers = await auth();
    const all = (await list(headers, "per_page=100")).body.records;
    const second = (await list(headers, "per_page=5&page=2")).body.records;
    expect(second).toEqual(all.slice(5, 10));
  });
});

describe("mockFetch: 映画とメディア", () => {
  it("searches movies by title and gets a movie", async () => {
    const headers = await auth();
    const search = await mockFetch("/movies/search?title=%E5%8B%9D%E6%89%8B", {
      headers,
    });
    const { movies } = await search.json();
    expect(movies[0]).toMatchObject({ id: 1, title: "勝手にしやがれ" });
    const movie = await mockFetch("/movies/1", { headers });
    expect(await movie.json()).toMatchObject({
      title: "勝手にしやがれ",
      release_year: 1960,
      origin_country: ["FR"],
    });
    const missing = await mockFetch("/movies/999999", { headers });
    expect(await missing.json()).toMatchObject({ code: "MOVIE_NOT_FOUND" });
    const empty = await mockFetch("/movies/search?title=", { headers });
    expect(empty.status).toBe(400);
  });

  it("returns 404 for an unknown path", async () => {
    const response = await mockFetch("/unknown", { headers: await auth() });
    expect(await response.json()).toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("mockFetch: ノート", () => {
  const note = (text: string) => ({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  });

  it("saves, returns, updates and deletes the note of a record", async () => {
    const headers = await auth();
    const created = await (
      await mockFetch(
        "/records/",
        post({ ...newRecord, note: note("最初") }, "POST", headers),
      )
    ).json();
    expect(created.note).toEqual(note("最初"));
    const path = `/records/${created.record_id}`;
    const read = async () => (await mockFetch(path, { headers })).json();
    expect((await read()).note).toEqual(note("最初"));
    await mockFetch(
      path,
      post({ ...newRecord, note: note("二回目") }, "PUT", headers),
    );
    expect((await read()).note).toEqual(note("二回目"));
    await mockFetch(path, post({ ...newRecord, note: null }, "PUT", headers));
    expect((await read()).note).toBeNull();
    await mockFetch(
      path,
      post({ ...newRecord, note: note("三回目") }, "PUT", headers),
    );
    await mockFetch(path, post({ ...newRecord }, "PUT", headers));
    expect((await read()).note).toBeNull();
  });

  it("finds records by the text of their notes", async () => {
    const headers = await auth();
    await mockFetch(
      "/records/",
      post(
        { ...newRecord, title: "別の題名", note: note("宇宙船の場面") },
        "POST",
        headers,
      ),
    );
    const found = await list(
      headers,
      `keyword=${encodeURIComponent("宇宙船の場面")}`,
    );
    expect(found.body.records.map((r: { title: string }) => r.title)).toEqual([
      "別の題名",
    ]);
  });

  it("seeds notes for the initial records", async () => {
    const headers = await auth();
    const got = await (await mockFetch("/records/1", { headers })).json();
    expect(got.note).toMatchObject({ type: "doc" });
  });
});

describe("mockFetch: 添付", () => {
  function upload(type = "image/png") {
    const part = {
      fieldName: "file",
      uri: "file:///a.png",
      name: "a.png",
      type,
    };
    return { getParts: () => [part] } as unknown as FormData;
  }

  it("lists, adds and deletes the attachments of a record", async () => {
    const headers = await auth();
    const path = "/records/1/attachments";
    const count = async () =>
      (await (await mockFetch(path, { headers })).json()).attachments.length;
    const before = await count();
    const added = await mockFetch(path, {
      method: "POST",
      headers,
      body: upload(),
    });
    expect(added.status).toBe(201);
    const { attachment_id, image_url } = await added.json();
    expect(image_url).toBe("file:///a.png");
    expect(await count()).toBe(before + 1);
    const removed = await mockFetch(`${path}/${attachment_id}`, {
      method: "DELETE",
      headers,
    });
    expect(removed.status).toBe(204);
    expect(await count()).toBe(before);
    const gone = await mockFetch(`${path}/${attachment_id}`, {
      method: "DELETE",
      headers,
    });
    expect(await gone.json()).toMatchObject({ code: "ATTACHMENT_NOT_FOUND" });
  });

  it("refuses a file that is not an image and a missing record", async () => {
    const headers = await auth();
    const gif = await mockFetch("/records/1/attachments", {
      method: "POST",
      headers,
      body: upload("image/gif"),
    });
    expect(gif.status).toBe(400);
    const missing = await mockFetch("/records/999999/attachments", {
      headers,
    });
    expect(await missing.json()).toMatchObject({ code: "RECORD_NOT_FOUND" });
  });
});
