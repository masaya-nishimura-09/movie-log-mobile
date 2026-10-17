import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const registerUser = vi.fn();
const login = vi.fn();
const saveTokens = vi.fn();

vi.mock("@/api/user/register-user", () => ({ registerUser }));
vi.mock("@/api/auth/login", () => ({ login }));
vi.mock("@/lib/auth/token-storage", () => ({ saveTokens }));

const { registerAction } = await import("@/actions/user/register");

const values = {
  username: "tester",
  email: "user@example.com",
  password: "password",
  agreedToTerms: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerAction", () => {
  it("registers the user, logs in and saves the tokens", async () => {
    const tokens = { accessToken: "a", refreshToken: "r" };
    registerUser.mockResolvedValue(undefined);
    login.mockResolvedValue(tokens);
    await expect(registerAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: true },
    });
    expect(registerUser).toHaveBeenCalledWith({
      username: "tester",
      email: "user@example.com",
      password: "password",
    });
    expect(login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
    expect(saveTokens).toHaveBeenCalledWith(tokens);
  });

  it("succeeds without logging in when the login fails", async () => {
    registerUser.mockResolvedValue(undefined);
    login.mockRejectedValue(new Error("network"));
    await expect(registerAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: false },
    });
    expect(saveTokens).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input without calling the API", async () => {
    const result = await registerAction({
      ...values,
      email: "user",
      password: "short",
    });
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(
      Object.keys(result.success ? {} : (result.errors ?? {})).sort(),
    ).toEqual(["email", "password"]);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("requires agreeing to the terms", async () => {
    await expect(
      registerAction({ ...values, agreedToTerms: false }),
    ).resolves.toEqual({ success: false, messageKey: "termsNotAgreed" });
    expect(registerUser).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(409, "USER_ALREADY_EXISTS"), "userAlreadyExists"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
    [new Error("network"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.message}`, async () => {
      registerUser.mockRejectedValue(error);
      await expect(registerAction(values)).resolves.toEqual({
        success: false,
        messageKey,
      });
      expect(login).not.toHaveBeenCalled();
    });
  }
});
