import type { z } from "zod";
import { refreshTokens } from "@/api/auth/refresh-tokens";
import { ApiError } from "@/api/client/api-error";
import { requestJson } from "@/api/client/request-json";
import { isTokenExpired } from "@/lib/auth/jwt";
import { clearTokens, loadTokens, saveTokens } from "@/lib/auth/token-storage";

let refreshing: Promise<string> | undefined;

async function refreshAccessToken(): Promise<string> {
  const tokens = await loadTokens();
  if (!tokens) throw new ApiError(401, "UNAUTHENTICATED");

  try {
    const next = await refreshTokens(tokens.refreshToken);
    await saveTokens(next);
    return next.accessToken;
  } catch (error) {
    if (error instanceof ApiError) await clearTokens();
    throw error;
  }
}

function refreshOnce(): Promise<string> {
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = undefined;
  });
  return refreshing;
}

async function validAccessToken(): Promise<string> {
  const tokens = await loadTokens();
  if (tokens && !isTokenExpired(tokens.accessToken)) return tokens.accessToken;
  return refreshOnce();
}

function sendWithToken<T extends z.ZodType>(
  path: string,
  schema: T,
  init: RequestInit,
  token: string,
): Promise<z.output<T>> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return requestJson(path, schema, { ...init, headers });
}

export async function apiFetch<T extends z.ZodType>(
  path: string,
  schema: T,
  init: RequestInit = {},
): Promise<z.output<T>> {
  try {
    return await sendWithToken(path, schema, init, await validAccessToken());
  } catch (error) {
    if (error instanceof ApiError && error.code === "INVALID_ACCESS_TOKEN") {
      return sendWithToken(path, schema, init, await refreshOnce());
    }
    throw error;
  }
}
