import { beforeEach, describe, expect, it, vi } from "vitest";

const logout = vi.fn();
const loadTokens = vi.fn();
const clearTokens = vi.fn();

vi.mock("@/api/auth/logout", () => ({ logout }));
vi.mock("@/lib/auth/token-storage", () => ({ loadTokens, clearTokens }));

const { logoutAction } = await import("@/actions/auth/logout");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("logoutAction", () => {
  it("revokes the refresh token and clears the tokens", async () => {
    loadTokens.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
    logout.mockResolvedValue(undefined);
    await logoutAction();
    expect(logout).toHaveBeenCalledWith("r");
    expect(clearTokens).toHaveBeenCalled();
  });

  it("clears the tokens even when the API fails", async () => {
    loadTokens.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
    logout.mockRejectedValue(new Error("network"));
    await expect(logoutAction()).resolves.toBeUndefined();
    expect(clearTokens).toHaveBeenCalled();
  });

  it("only clears the tokens when there are none", async () => {
    loadTokens.mockResolvedValue(undefined);
    await logoutAction();
    expect(logout).not.toHaveBeenCalled();
    expect(clearTokens).toHaveBeenCalled();
  });
});
