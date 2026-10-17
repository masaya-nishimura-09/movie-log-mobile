import { describe, expect, it } from "vitest";
import {
  encodeBase64Url,
  isTokenExpired,
  readJwtPayload,
} from "@/lib/auth/jwt";
import { fakeJwt } from "@/test/fake-jwt";

describe("encodeBase64Url", () => {
  it("matches the base64url encoding of btoa", () => {
    for (const text of ["a", "ab", "abc", '{"a":1}', "???>>>"]) {
      const expected = btoa(text)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
      expect(encodeBase64Url(text)).toBe(expected);
    }
  });
});

describe("readJwtPayload", () => {
  it("reads the payload", () => {
    expect(readJwtPayload(fakeJwt({ sub: "1", exp: 10 }))).toEqual({
      sub: "1",
      exp: 10,
    });
  });

  it("returns null for a token that is not a JWT", () => {
    expect(readJwtPayload("not-a-jwt")).toBeNull();
    expect(readJwtPayload("a.!!!.c")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  const now = new Date("2026-10-11T00:00:00Z");
  const at = (offsetSeconds: number) =>
    fakeJwt({ exp: now.getTime() / 1000 + offsetSeconds });

  it("is false while the token has more than 30 seconds left", () => {
    expect(isTokenExpired(at(31), now)).toBe(false);
  });

  it("is true within 30 seconds of the expiry", () => {
    expect(isTokenExpired(at(30), now)).toBe(true);
    expect(isTokenExpired(at(-1), now)).toBe(true);
  });

  it("is true without an expiry", () => {
    expect(isTokenExpired(fakeJwt({}), now)).toBe(true);
  });
});
