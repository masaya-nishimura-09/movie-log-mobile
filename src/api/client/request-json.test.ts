import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const fetchMock = vi.fn();
const schema = z.object({ id: z.number() });

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("EXPO_PUBLIC_USE_MOCK", "");
  vi.stubEnv("EXPO_PUBLIC_API_BASE_URL", "http://api.test");
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function load() {
  return import("@/api/client/request-json");
}

describe("requestJson", () => {
  it("requests the API and returns the parsed body", async () => {
    const { requestJson } = await load();
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await expect(requestJson("/records/1", schema)).resolves.toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith("http://api.test/records/1", {});
  });

  it("keeps the method, body and headers of the request", async () => {
    const { jsonBody, requestJson } = await load();
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await requestJson("/records", schema, jsonBody({ a: 1 }));
    expect(fetchMock).toHaveBeenCalledWith("http://api.test/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"a":1}',
    });
  });

  it("throws when the base URL is not set", async () => {
    const { requestJson } = await load();
    vi.stubEnv("EXPO_PUBLIC_API_BASE_URL", "");
    await expect(requestJson("/records", schema)).rejects.toThrow(
      "EXPO_PUBLIC_API_BASE_URL is not set",
    );
  });

  it("throws an ApiError with the code of an error response", async () => {
    const { requestJson } = await load();
    fetchMock.mockResolvedValue(
      Response.json(
        { code: "RECORD_NOT_FOUND", message: "x" },
        { status: 404 },
      ),
    );
    const { ApiError } = await import("@/api/client/api-error");
    const error = await requestJson("/records/1", schema).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: "RECORD_NOT_FOUND" });
  });

  it("uses INTERNAL_SERVER_ERROR when the error body is not readable", async () => {
    const { requestJson } = await load();
    fetchMock.mockResolvedValue(new Response("oops", { status: 502 }));
    const error = await requestJson("/records/1", schema).catch((e) => e);
    expect(error).toMatchObject({ status: 502, code: "INTERNAL_SERVER_ERROR" });
  });

  it("throws when the response does not match the schema", async () => {
    const { requestJson } = await load();
    fetchMock.mockResolvedValue(Response.json({ id: "x" }));
    await expect(requestJson("/records/1", schema)).rejects.toThrow();
  });

  it("uses the mock instead of the network when the mock is on", async () => {
    vi.stubEnv("EXPO_PUBLIC_USE_MOCK", "true");
    const { requestJson } = await load();
    await expect(requestJson("/records/unknown", schema)).rejects.toMatchObject(
      { code: "UNAUTHENTICATED" },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("jsonBody", () => {
  it("builds a JSON request", async () => {
    const { jsonBody } = await load();
    expect(jsonBody({ a: 1 }, "PUT")).toEqual({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: '{"a":1}',
    });
  });
});
