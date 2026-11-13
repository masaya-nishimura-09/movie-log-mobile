import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));
vi.mock("expo-file-system", () => ({
  File: class {
    constructor(readonly uri: string) {}
    bytes() {
      return Promise.resolve(new Uint8Array([1, 2, 3]));
    }
  },
}));
vi.mock("@/api/client/request-json", () => ({
  jsonBody: (body: unknown, method = "POST") => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
}));

beforeEach(() => {
  apiFetch.mockReset();
});

const { uploadPoster } = await import("@/api/media/upload-poster");

describe("uploadPoster", () => {
  it("posts the file to /media/ as form data", async () => {
    apiFetch.mockResolvedValue("https://example.com/a.png");
    const append = vi.spyOn(FormData.prototype, "append");
    const file = { uri: "file:///a.png", name: "a.png", type: "image/png" };
    await expect(uploadPoster(file)).resolves.toBe("https://example.com/a.png");
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/media/");
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
    expect(append).toHaveBeenCalledWith("file", expect.objectContaining(file));
    const part = append.mock.calls[0]?.[1] as unknown as {
      bytes: () => Promise<Uint8Array>;
    };
    await expect(part.bytes()).resolves.toEqual(new Uint8Array([1, 2, 3]));
    append.mockRestore();
  });
});
