import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updateUser = vi.fn();
const login = vi.fn();
const saveTokens = vi.fn();
const clearTokens = vi.fn();

vi.mock("@/api/user/update-user", () => ({ updateUser }));
vi.mock("@/api/auth/login", () => ({ login }));
vi.mock("@/lib/auth/token-storage", () => ({ saveTokens, clearTokens }));

const { updateAccountAction } = await import("@/actions/user/update-account");

const values = {
  username: "tester",
  email: "user@example.com",
  password: "password",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateAccountAction", () => {
  it("updates the user and logs in again with the new credentials", async () => {
    const tokens = { accessToken: "a", refreshToken: "r" };
    updateUser.mockResolvedValue(undefined);
    login.mockResolvedValue(tokens);
    await expect(updateAccountAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: true },
    });
    expect(updateUser).toHaveBeenCalledWith(values);
    expect(saveTokens).toHaveBeenCalledWith(tokens);
  });

  it("clears the tokens when logging in again fails", async () => {
    updateUser.mockResolvedValue(undefined);
    login.mockRejectedValue(new Error("network"));
    await expect(updateAccountAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: false },
    });
    expect(clearTokens).toHaveBeenCalled();
  });

  it("returns field errors for invalid input without calling the API", async () => {
    const result = await updateAccountAction({ ...values, email: "user" });
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
      errors: { email: expect.any(Array) },
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(409, "USER_ALREADY_EXISTS"), "userAlreadyExists"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
    [new Error("network"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.message}`, async () => {
      updateUser.mockRejectedValue(error);
      await expect(updateAccountAction(values)).resolves.toEqual({
        success: false,
        messageKey,
      });
      expect(login).not.toHaveBeenCalled();
    });
  }
});
