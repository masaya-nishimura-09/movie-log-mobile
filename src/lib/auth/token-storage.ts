import * as SecureStore from "expo-secure-store";
import type { TokenPair } from "@/schemas/auth/token";

const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";

export async function loadTokens(): Promise<TokenPair | undefined> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(accessTokenKey),
    SecureStore.getItemAsync(refreshTokenKey),
  ]);
  return accessToken && refreshToken
    ? { accessToken, refreshToken }
    : undefined;
}

export async function saveTokens(tokens: TokenPair): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(accessTokenKey, tokens.accessToken),
    SecureStore.setItemAsync(refreshTokenKey, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(accessTokenKey),
    SecureStore.deleteItemAsync(refreshTokenKey),
  ]);
}
