import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const updateUsername = vi.fn();
const updateEmail = vi.fn();
const updatePassword = vi.fn();
const getCurrentUser = vi.fn();
const login = vi.fn();
const saveTokens = vi.fn();
const clearTokens = vi.fn();

vi.mock("@/api/user/update-username", () => ({ updateUsername }));
vi.mock("@/api/user/update-email", () => ({ updateEmail }));
vi.mock("@/api/user/update-password", () => ({ updatePassword }));
vi.mock("@/api/user/get-current-user", () => ({ getCurrentUser }));
vi.mock("@/api/auth/login", () => ({ login }));
vi.mock("@/lib/auth/token-storage", () => ({ saveTokens, clearTokens }));

const { updateUsernameAction } = await import("@/actions/user/update-username");
const { updateEmailAction } = await import("@/actions/user/update-email");
const { updatePasswordAction } = await import("@/actions/user/update-password");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateUsernameAction", () => {
  it("updates the name, and rejects an empty one without asking the API", async () => {
    await expect(updateUsernameAction({ username: "new" })).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(updateUsername).toHaveBeenCalledWith({ username: "new" });
    const result = await updateUsernameAction({ username: "" });
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(updateUsername).toHaveBeenCalledTimes(1);
  });
});

describe("updateEmailAction", () => {
  const values = { email: "new@example.com", password: "password" };

  it("updates the email", async () => {
    await expect(updateEmailAction(values)).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(updateEmail).toHaveBeenCalledWith(values);
  });

  it("maps the API errors to messages", async () => {
    const cases = [
      ["USER_ALREADY_EXISTS", "userAlreadyExists"],
      ["INVALID_CURRENT_PASSWORD", "invalidCurrentPassword"],
      ["TOO_MANY_REQUESTS", "tooManyRequests"],
      ["INTERNAL_SERVER_ERROR", "unexpectedError"],
    ] as const;
    for (const [code, messageKey] of cases) {
      updateEmail.mockRejectedValueOnce(new ApiError(400, code));
      await expect(updateEmailAction(values)).resolves.toEqual({
        success: false,
        messageKey,
      });
    }
  });
});

describe("updatePasswordAction", () => {
  const values = { oldPassword: "password", newPassword: "password2" };

  beforeEach(() => {
    getCurrentUser.mockResolvedValue({ email: "user@example.com" });
  });

  it("changes the password and logs in again with the new one", async () => {
    const tokens = { accessToken: "a", refreshToken: "r" };
    login.mockResolvedValue(tokens);
    await expect(updatePasswordAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: true },
    });
    expect(updatePassword).toHaveBeenCalledWith(values);
    expect(login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password2",
    });
    expect(saveTokens).toHaveBeenCalledWith(tokens);
  });

  it("clears the tokens when logging in again fails", async () => {
    login.mockRejectedValue(new Error("network"));
    await expect(updatePasswordAction(values)).resolves.toEqual({
      success: true,
      data: { loggedIn: false },
    });
    expect(clearTokens).toHaveBeenCalled();
  });

  it("returns a message for a wrong current password", async () => {
    updatePassword.mockRejectedValue(
      new ApiError(400, "INVALID_CURRENT_PASSWORD"),
    );
    await expect(updatePasswordAction(values)).resolves.toEqual({
      success: false,
      messageKey: "invalidCurrentPassword",
    });
  });
});
