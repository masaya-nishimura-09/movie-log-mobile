import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { fakeJwt } from "@/test/fake-jwt";

const requestJson = vi.fn();
const refreshTokens = vi.fn();
const storage = {
  tokens: undefined as
    | { accessToken: string; refreshToken: string }
    | undefined,
};

vi.mock("@/api/client/request-json", () => ({ requestJson }));
vi.mock("@/api/auth/refresh-tokens", () => ({ refreshTokens }));
vi.mock("@/lib/auth/token-storage", () => ({
  loadTokens: async () => storage.tokens,
  saveTokens: async (tokens: typeof storage.tokens) => {
    storage.tokens = tokens;
  },
  clearTokens: async () => {
    storage.tokens = undefined;
  },
}));

const { apiFetch } = await import("@/api/client/api-fetch");
const schema = z.unknown();

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600;
const valid = () => fakeJwt({ exp: inOneHour() });
const expired = () => fakeJwt({ exp: 1 });

function bearer(callIndex: number): string | null {
  const init = requestJson.mock.calls[callIndex]?.[2] as RequestInit;
  return new Headers(init.headers).get("Authorization");
}

beforeEach(() => {
  storage.tokens = undefined;
  requestJson.mockReset();
  refreshTokens.mockReset();
});

describe("apiFetch", () => {
  it("sends the access token as a bearer token", async () => {
    const accessToken = valid();
    storage.tokens = { accessToken, refreshToken: "refresh" };
    requestJson.mockResolvedValue({ ok: true });
    await expect(apiFetch("/records", schema)).resolves.toEqual({ ok: true });
    expect(bearer(0)).toBe(`Bearer ${accessToken}`);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("throws UNAUTHENTICATED without tokens", async () => {
    await expect(apiFetch("/records", schema)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHENTICATED",
    });
    expect(requestJson).not.toHaveBeenCalled();
  });

  it("refreshes an expired access token before the request", async () => {
    storage.tokens = { accessToken: expired(), refreshToken: "refresh" };
    const next = { accessToken: valid(), refreshToken: "refresh-2" };
    refreshTokens.mockResolvedValue(next);
    requestJson.mockResolvedValue({ ok: true });
    await apiFetch("/records", schema);
    expect(refreshTokens).toHaveBeenCalledWith("refresh");
    expect(storage.tokens).toEqual(next);
    expect(bearer(0)).toBe(`Bearer ${next.accessToken}`);
  });

  it("refreshes once and retries on INVALID_ACCESS_TOKEN", async () => {
    storage.tokens = { accessToken: valid(), refreshToken: "refresh" };
    const next = { accessToken: valid(), refreshToken: "refresh-2" };
    refreshTokens.mockResolvedValue(next);
    requestJson
      .mockRejectedValueOnce(new ApiError(401, "INVALID_ACCESS_TOKEN"))
      .mockResolvedValueOnce({ ok: true });
    await expect(apiFetch("/records", schema)).resolves.toEqual({ ok: true });
    expect(requestJson).toHaveBeenCalledTimes(2);
    expect(bearer(1)).toBe(`Bearer ${next.accessToken}`);
  });

  it("shares one refresh between simultaneous requests", async () => {
    storage.tokens = { accessToken: expired(), refreshToken: "refresh" };
    refreshTokens.mockResolvedValue({
      accessToken: valid(),
      refreshToken: "refresh-2",
    });
    requestJson.mockResolvedValue({ ok: true });
    await Promise.all([apiFetch("/a", schema), apiFetch("/b", schema)]);
    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it("clears the tokens when the refresh is rejected", async () => {
    storage.tokens = { accessToken: expired(), refreshToken: "refresh" };
    refreshTokens.mockRejectedValue(new ApiError(401, "INVALID_REFRESH_TOKEN"));
    await expect(apiFetch("/records", schema)).rejects.toMatchObject({
      code: "INVALID_REFRESH_TOKEN",
    });
    expect(storage.tokens).toBeUndefined();
  });

  it("keeps the tokens when the refresh fails for another reason", async () => {
    storage.tokens = { accessToken: expired(), refreshToken: "refresh" };
    refreshTokens.mockRejectedValue(new Error("network"));
    await expect(apiFetch("/records", schema)).rejects.toThrow("network");
    expect(storage.tokens).toBeDefined();
  });

  it("rethrows other errors", async () => {
    storage.tokens = { accessToken: valid(), refreshToken: "refresh" };
    requestJson.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(apiFetch("/records", schema)).rejects.toMatchObject({
      status: 500,
    });
    expect(refreshTokens).not.toHaveBeenCalled();
  });
});
