import { logout } from "@/api/auth/logout";
import { clearTokens, loadTokens } from "@/lib/auth/token-storage";

export async function logoutAction(): Promise<void> {
  const tokens = await loadTokens();
  if (tokens) {
    await logout(tokens.refreshToken).catch(() => undefined);
  }
  await clearTokens();
}
