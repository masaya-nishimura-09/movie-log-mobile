import { mockAttachments } from "@/api/mock/mock-attachments";
import { mockNotes } from "@/api/mock/mock-notes";
import { mockRecords } from "@/api/mock/mock-records";
import { mockAccounts, toUserResponse } from "@/api/mock/mock-user";
import {
  encodeBase64Url,
  isTokenExpired,
  readJwtPayload,
} from "@/lib/auth/jwt";
import type { ApiErrorResponse } from "@/schemas/error/api-error";
import { posterContentTypes } from "@/schemas/media/media";
import { maxAttachments } from "@/schemas/record/attachment";
import type { RecordResponse } from "@/schemas/record/record";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function error(status: number, code: ApiErrorResponse["code"]): Response {
  return json({ code, message: code } satisfies ApiErrorResponse, status);
}

function randomId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

type SortField = "watched_at" | "release_year" | "score" | "title";

const comparators: Record<
  SortField,
  (a: RecordResponse, b: RecordResponse) => number
> = {
  watched_at: (a, b) => a.watched_at.localeCompare(b.watched_at),
  release_year: (a, b) => a.release_year - b.release_year,
  score: (a, b) => a.score - b.score,
  title: (a, b) => a.title.localeCompare(b.title, "ja"),
};

function isSortField(value: string): value is SortField {
  return value in comparators;
}

function byIdDesc(a: RecordResponse, b: RecordResponse): number {
  return Number(b.record_id) - Number(a.record_id);
}

type Filter = {
  score: string | null;
  platform: string | null;
  mood_tags: string[];
  genres: string[];
  title: string;
};

function allOf(selected: string[], values: string[]): boolean {
  return selected.every((value) => values.includes(value));
}

function plainText(node: unknown): string {
  const { text, content } = node as { text?: string; content?: unknown[] };
  return `${text ?? ""}${(content ?? []).map(plainText).join(" ")}`;
}

function noteText(recordId: string): string {
  const note = mockNotes.get(recordId);
  return note ? plainText(note) : "";
}

function matches(record: RecordResponse, filter: Filter): boolean {
  const keyword = filter.title.toLowerCase();
  return (
    (filter.score === null || filter.score === String(record.score)) &&
    (filter.platform === null || filter.platform === record.platform) &&
    allOf(filter.mood_tags, record.mood_tags) &&
    allOf(filter.genres, record.genres) &&
    (record.title.toLowerCase().includes(keyword) ||
      noteText(record.record_id).toLowerCase().includes(keyword))
  );
}

function withNote(record: RecordResponse) {
  return { ...record, note: mockNotes.get(record.record_id) ?? null };
}

function listRecords(params: URLSearchParams): Response {
  const filter: Filter = {
    score: params.get("score"),
    platform: params.get("platform"),
    mood_tags: params.getAll("mood_tags"),
    genres: params.getAll("genres"),
    title: params.get("keyword") ?? "",
  };
  const sortField = params.get("sort_field") ?? "watched_at";
  const sortOrder = params.get("sort_order") ?? "desc";
  const page = Number(params.get("page") ?? "1");
  const perPage = Number(params.get("per_page") ?? "20");
  if (!isSortField(sortField) || !["asc", "desc"].includes(sortOrder)) {
    return error(400, "INVALID_INPUT");
  }
  const compare = comparators[sortField];

  const filtered = mockRecords
    .filter((record) => matches(record, filter))
    .sort(
      (a, b) =>
        (sortOrder === "asc" ? compare(a, b) : compare(b, a)) || byIdDesc(a, b),
    );

  return json({
    records: filtered.slice((page - 1) * perPage, page * perPage),
    filtered_count: filtered.length,
    total_count: mockRecords.length,
  });
}

function getRecord(id: string): Response {
  const record = mockRecords.find((r) => r.record_id === id);
  if (!record) return error(404, "RECORD_NOT_FOUND");
  return json(withNote(record));
}

const accessTokenLifetime = 60 * 60;
const refreshTokenPrefix = "mock-refresh-";

type Account = (typeof mockAccounts)[number];

function issueTokens(account: Account): Response {
  const exp = Math.floor(Date.now() / 1000) + accessTokenLifetime;
  const sub = account.user_id;
  const header = encodeBase64Url(JSON.stringify({ alg: "none" }));
  const payload = encodeBase64Url(JSON.stringify({ sub, exp }));
  return json({
    access_token: `${header}.${payload}.mock`,
    refresh_token: `${refreshTokenPrefix}${sub}.${randomId()}`,
  });
}

function readJson(init: RequestInit): Record<string, unknown> {
  try {
    return JSON.parse(String(init.body));
  } catch {
    return {};
  }
}

function login(init: RequestInit): Response {
  const { email, password } = readJson(init);
  const account = mockAccounts.find((a) => a.email === email);
  if (!account || account.password !== password) {
    return error(401, "INVALID_CREDENTIALS");
  }
  return issueTokens(account);
}

function refresh(init: RequestInit): Response {
  const { refresh_token: token } = readJson(init);
  const userId =
    typeof token === "string" && token.startsWith(refreshTokenPrefix)
      ? token.slice(refreshTokenPrefix.length).split(".")[0]
      : undefined;
  const account = mockAccounts.find((a) => a.user_id === userId);
  if (!account) return error(401, "INVALID_REFRESH_TOKEN");
  return issueTokens(account);
}

function authenticate(init: RequestInit): Account | Response {
  const authorization = new Headers(init.headers).get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return error(401, "UNAUTHENTICATED");
  }
  const token = authorization.slice("Bearer ".length);
  if (!token.endsWith(".mock") || isTokenExpired(token)) {
    return error(401, "INVALID_ACCESS_TOKEN");
  }
  const sub = readJwtPayload(token)?.sub;
  return (
    mockAccounts.find((a) => a.user_id === sub) ?? error(401, "UNAUTHENTICATED")
  );
}

type UserBody = { name?: unknown; email?: unknown; password?: unknown };

function emailTaken(email: unknown, except?: Account): boolean {
  return mockAccounts.some((a) => a.email === email && a !== except);
}

function register(init: RequestInit): Response {
  const { name, email, password } = readJson(init) as UserBody;
  if (emailTaken(email)) return error(409, "USER_ALREADY_EXISTS");
  const account: Account = {
    user_id: String(mockAccounts.length + 1),
    username: String(name),
    email: String(email),
    password: String(password),
  };
  mockAccounts.push(account);
  return json(toUserResponse(account), 201);
}

function updateUsername(account: Account, init: RequestInit): Response {
  const { name } = readJson(init) as UserBody;
  account.username = String(name);
  return json(toUserResponse(account));
}

function updateEmail(account: Account, init: RequestInit): Response {
  const { email, password } = readJson(init) as UserBody;
  if (account.password !== password) {
    return error(400, "INVALID_CURRENT_PASSWORD");
  }
  if (emailTaken(email, account)) return error(409, "USER_ALREADY_EXISTS");
  account.email = String(email);
  return json(toUserResponse(account));
}

function updatePassword(account: Account, init: RequestInit): Response {
  const { old_password: oldPassword, new_password: newPassword } = readJson(
    init,
  ) as UserBody & { old_password?: unknown; new_password?: unknown };
  if (account.password !== oldPassword) {
    return error(400, "INVALID_CURRENT_PASSWORD");
  }
  account.password = String(newPassword);
  return json(toUserResponse(account));
}

function deleteUser(account: Account): Response {
  mockAccounts.splice(mockAccounts.indexOf(account), 1);
  return new Response(null, { status: 204 });
}

type RecordBody = Omit<
  RecordResponse,
  "record_id" | "created_at" | "updated_at"
> & { note?: object | null };

function saveNote(recordId: string, note: object | null | undefined) {
  if (note) mockNotes.set(recordId, note);
  else mockNotes.delete(recordId);
}

function createRecord(init: RequestInit): Response {
  const now = new Date().toISOString();
  const lastId = Math.max(0, ...mockRecords.map((r) => Number(r.record_id)));
  const { note, ...body } = readJson(init) as RecordBody;
  const record: RecordResponse = {
    ...body,
    record_id: String(lastId + 1),
    created_at: now,
    updated_at: now,
  };
  mockRecords.push(record);
  saveNote(record.record_id, note);
  return json(withNote(record), 201);
}

function updateRecord(id: string, init: RequestInit): Response {
  const index = mockRecords.findIndex((r) => r.record_id === id);
  const current = mockRecords[index];
  if (!current) return error(404, "RECORD_NOT_FOUND");
  const { note, ...body } = readJson(init) as RecordBody;
  const record: RecordResponse = {
    ...body,
    record_id: id,
    created_at: current.created_at,
    updated_at: new Date().toISOString(),
  };
  mockRecords[index] = record;
  saveNote(id, note);
  return json(withNote(record));
}

function deleteRecord(id: string): Response {
  const index = mockRecords.findIndex((r) => r.record_id === id);
  if (index === -1) return error(404, "RECORD_NOT_FOUND");
  mockRecords.splice(index, 1);
  mockNotes.delete(id);
  for (let i = mockAttachments.length - 1; i >= 0; i -= 1) {
    if (mockAttachments[i]?.record_id === id) mockAttachments.splice(i, 1);
  }
  return new Response(null, { status: 204 });
}

function searchMovies(params: URLSearchParams): Response {
  const title = (params.get("title") ?? "").toLowerCase();
  if (title === "") return error(400, "INVALID_INPUT");
  const movies = mockRecords
    .filter((r) => r.title.toLowerCase().includes(title))
    .map((r) => ({
      id: Number(r.record_id),
      original_language: r.language,
      original_title: r.title,
      title: r.title,
      overview: "",
      poster_url: r.poster_url,
      release_year: r.release_year,
    }));
  return json({
    page: 1,
    total_pages: 1,
    total_results: movies.length,
    movies,
  });
}

function getMovie(id: string): Response {
  const record = mockRecords.find((r) => r.record_id === id);
  if (!record) return error(404, "MOVIE_NOT_FOUND");
  return json({
    id: Number(record.record_id),
    title: record.title,
    original_title: record.original_title || record.title,
    overview: record.overview ?? "",
    genres: record.genres,
    poster_url: record.poster_url,
    release_year: record.release_year,
    runtime: record.runtime,
    original_language: record.language,
    origin_country: record.countries,
    credits: record.credits,
  });
}

function toAttachmentResponse({
  attachment_id,
  image_url,
  created_at,
}: (typeof mockAttachments)[number]) {
  return { attachment_id, image_url, created_at };
}

function hasRecord(id: string): boolean {
  return mockRecords.some((r) => r.record_id === id);
}

function listAttachments(id: string): Response {
  if (!hasRecord(id)) return error(404, "RECORD_NOT_FOUND");
  return json({
    attachments: mockAttachments
      .filter((attachment) => attachment.record_id === id)
      .map(toAttachmentResponse),
  });
}

type FormPart = { fieldName?: string; uri?: unknown; type?: unknown };

function readUploadedFile(init: RequestInit) {
  const body = init.body as { getParts?: () => FormPart[] } | null;
  const part = body?.getParts?.().find((p) => p.fieldName === "file");
  return typeof part?.uri === "string" && typeof part.type === "string"
    ? { uri: part.uri, type: part.type }
    : undefined;
}

function addAttachment(id: string, init: RequestInit): Response {
  if (!hasRecord(id)) return error(404, "RECORD_NOT_FOUND");
  const file = readUploadedFile(init);
  if (!file || !posterContentTypes.includes(file.type)) {
    return error(400, "INVALID_INPUT");
  }
  if (
    mockAttachments.filter((a) => a.record_id === id).length >= maxAttachments
  ) {
    return error(400, "INVALID_INPUT");
  }
  const lastId = Math.max(
    0,
    ...mockAttachments.map((a) => Number(a.attachment_id)),
  );
  const attachment = {
    attachment_id: String(lastId + 1),
    record_id: id,
    image_url: file.uri,
    created_at: new Date().toISOString(),
  };
  mockAttachments.push(attachment);
  return json(toAttachmentResponse(attachment), 201);
}

function deleteAttachment(id: string, attachmentId: string): Response {
  if (!hasRecord(id)) return error(404, "RECORD_NOT_FOUND");
  const index = mockAttachments.findIndex(
    (a) => a.record_id === id && a.attachment_id === attachmentId,
  );
  if (index === -1) return error(404, "ATTACHMENT_NOT_FOUND");
  mockAttachments.splice(index, 1);
  return new Response(null, { status: 204 });
}

function uploadMedia(): Response {
  return json({ url: `https://mock.invalid/posters/${randomId()}` }, 201);
}

export async function mockFetch(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const url = new URL(path, "http://mock");
  const method = init.method ?? "GET";
  const [resource, id, sub, subId] = url.pathname.split("/").filter(Boolean);

  if (method === "POST" && resource === "auth") {
    if (id === "login") return login(init);
    if (id === "refresh") return refresh(init);
    if (id === "logout") return new Response(null, { status: 204 });
  }
  if (method === "POST" && resource === "users" && id === "register") {
    return register(init);
  }

  const account = authenticate(init);
  if (account instanceof Response) return account;

  if (resource === "users" && id === undefined) {
    if (method === "GET") return json(toUserResponse(account));

    if (method === "DELETE") return deleteUser(account);
  }
  if (method === "PUT" && resource === "users") {
    if (id === "username") return updateUsername(account, init);
    if (id === "email") return updateEmail(account, init);
    if (id === "password") return updatePassword(account, init);
  }
  if (resource === "records" && id === undefined) {
    if (method === "GET") return listRecords(url.searchParams);
    if (method === "POST") return createRecord(init);
  }
  if (resource === "records" && id !== undefined && sub === "attachments") {
    if (method === "GET" && subId === undefined) return listAttachments(id);
    if (method === "POST" && subId === undefined) {
      return addAttachment(id, init);
    }
    if (method === "DELETE" && subId !== undefined) {
      return deleteAttachment(id, subId);
    }
  }
  if (resource === "records" && id !== undefined && sub === undefined) {
    if (method === "GET") return getRecord(id);
    if (method === "PUT") return updateRecord(id, init);
    if (method === "DELETE") return deleteRecord(id);
  }
  if (method === "POST" && resource === "media" && id === undefined) {
    return uploadMedia();
  }
  if (method === "GET" && resource === "movies" && id !== undefined) {
    return id === "search" ? searchMovies(url.searchParams) : getMovie(id);
  }
  return error(404, "NOT_FOUND");
}
