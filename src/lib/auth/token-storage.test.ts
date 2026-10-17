import { describe, expect, it } from "vitest";
import { clearTokens, loadTokens, saveTokens } from "@/lib/auth/token-storage";

describe("token storage", () => {
  it("saves, loads and clears the tokens", async () => {
    await clearTokens();
    await expect(loadTokens()).resolves.toBeUndefined();
    await saveTokens({ accessToken: "a", refreshToken: "r" });
    await expect(loadTokens()).resolves.toEqual({
      accessToken: "a",
      refreshToken: "r",
    });
    await clearTokens();
    await expect(loadTokens()).resolves.toBeUndefined();
  });
});
