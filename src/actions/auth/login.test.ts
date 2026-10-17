import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const login = vi.fn();
const saveTokens = vi.fn();

vi.mock("@/api/auth/login", () => ({ login }));
vi.mock("@/lib/auth/token-storage", () => ({ saveTokens }));

const { loginAction } = await import("@/actions/auth/login");

const values = { email: "user@example.com", password: "password" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginAction", () => {
  it("logs in and saves the tokens", async () => {
    const tokens = { accessToken: "a", refreshToken: "r" };
    login.mockResolvedValue(tokens);
    await expect(loginAction(values)).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(login).toHaveBeenCalledWith(values);
    expect(saveTokens).toHaveBeenCalledWith(tokens);
  });

  it("returns field errors for invalid input without calling the API", async () => {
    await expect(
      loginAction({ email: "user", password: "short" }),
    ).resolves.toEqual({
      success: false,
      messageKey: "invalidInput",
      errors: { email: ["invalidEmail"], password: ["invalidPassword"] },
    });
    expect(login).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(401, "INVALID_CREDENTIALS"), "invalidCredentials"],
    [new ApiError(429, "TOO_MANY_REQUESTS"), "tooManyRequests"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
    [new Error("network"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.message}`, async () => {
      login.mockRejectedValue(error);
      await expect(loginAction(values)).resolves.toEqual({
        success: false,
        messageKey,
      });
      expect(saveTokens).not.toHaveBeenCalled();
    });
  }
});
