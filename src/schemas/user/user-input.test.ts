import { describe, expect, it } from "vitest";
import {
  emailChangeInputSchema,
  passwordChangeInputSchema,
  toPasswordChangeRequest,
  toUsernameRequest,
  toUserRequest,
  userInputSchema,
  usernameInputSchema,
} from "@/schemas/user/user-input";

const firstValue = "a".repeat(10);
const secondValue = "b".repeat(10);

const validInput = {
  username: "tester",
  email: "user@example.com",
  password: firstValue,
};

describe("userInputSchema", () => {
  it("accepts a valid input", () => {
    expect(userInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a password of 8 to 72 characters", () => {
    const parse = (password: string) =>
      userInputSchema.safeParse({ ...validInput, password }).success;
    expect(parse("a".repeat(8))).toBe(true);
    expect(parse("a".repeat(72))).toBe(true);
    expect(parse("a".repeat(7))).toBe(false);
    expect(parse("a".repeat(73))).toBe(false);
  });

  it("rejects a password with spaces or full-width characters", () => {
    const parse = (password: string) =>
      userInputSchema.safeParse({ ...validInput, password }).success;
    expect(parse("pass word1")).toBe(false);
    expect(parse("ｐａｓｓｗｏｒｄ１")).toBe(false);
  });
});

describe("toUserRequest", () => {
  it("sends the username as name", () => {
    expect(toUserRequest(validInput)).toEqual({
      name: "tester",
      email: "user@example.com",
      password: firstValue,
    });
  });
});

describe("usernameInputSchema", () => {
  it("accepts 1 to 100 characters", () => {
    const parse = (username: string) =>
      usernameInputSchema.safeParse({ username }).success;
    expect(parse("a")).toBe(true);
    expect(parse("a".repeat(100))).toBe(true);
    expect(parse("")).toBe(false);
    expect(parse("a".repeat(101))).toBe(false);
  });
});

describe("toUsernameRequest", () => {
  it("sends the username as name", () => {
    expect(toUsernameRequest({ username: "tester" })).toEqual({
      name: "tester",
    });
  });
});

describe("emailChangeInputSchema", () => {
  it("requires a valid email and a valid current password", () => {
    const parse = (email: string, password: string) =>
      emailChangeInputSchema.safeParse({ email, password }).success;
    expect(parse("user@example.com", firstValue)).toBe(true);
    expect(parse("user", firstValue)).toBe(false);
    expect(parse("user@example.com", "short")).toBe(false);
  });
});

describe("passwordChangeInputSchema", () => {
  it("requires both passwords to be 8 to 72 half-width characters", () => {
    const parse = (oldPassword: string, newPassword: string) =>
      passwordChangeInputSchema.safeParse({ oldPassword, newPassword }).success;
    expect(parse(firstValue, secondValue)).toBe(true);
    expect(parse("short", secondValue)).toBe(false);
    expect(parse(firstValue, "has a space")).toBe(false);
    expect(parse(firstValue, "a".repeat(73))).toBe(false);
  });
});

describe("toPasswordChangeRequest", () => {
  it("sends snake case keys", () => {
    expect(
      toPasswordChangeRequest({
        oldPassword: firstValue,
        newPassword: secondValue,
      }),
    ).toEqual({ old_password: firstValue, new_password: secondValue });
  });
});
