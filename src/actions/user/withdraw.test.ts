import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const deleteUser = vi.fn();
const clearTokens = vi.fn();

vi.mock("@/api/user/delete-user", () => ({ deleteUser }));
vi.mock("@/lib/auth/token-storage", () => ({ clearTokens }));

const { withdrawAction } = await import("@/actions/user/withdraw");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("withdrawAction", () => {
  it("deletes the user and clears the tokens", async () => {
    deleteUser.mockResolvedValue(undefined);
    await expect(withdrawAction()).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(clearTokens).toHaveBeenCalled();
  });

  it("returns withdrawFailed and keeps the tokens on an API error", async () => {
    deleteUser.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(withdrawAction()).resolves.toEqual({
      success: false,
      messageKey: "withdrawFailed",
    });
    expect(clearTokens).not.toHaveBeenCalled();
  });

  it("rethrows errors that are not API errors", async () => {
    deleteUser.mockRejectedValue(new Error("network"));
    await expect(withdrawAction()).rejects.toThrow("network");
  });
});
