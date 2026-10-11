const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function encodeBase64Url(input: string): string {
  let output = "";
  let value = 0;
  let bits = 0;
  for (const char of input) {
    value = (value << 8) | (char.charCodeAt(0) & 0xff);
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      output += alphabet.charAt((value >> bits) & 63);
    }
    value &= (1 << bits) - 1;
  }
  if (bits > 0) output += alphabet.charAt((value << (6 - bits)) & 63);
  return output;
}

export function decodeBase64Url(input: string): string {
  let output = "";
  let value = 0;
  let bits = 0;
  for (const char of input) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((value >> bits) & 0xff);
      value &= (1 << bits) - 1;
    }
  }
  return output;
}

export function readJwtPayload(token: string): Record<string, unknown> | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const parsed: unknown = JSON.parse(decodeBase64Url(payload));
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function readJwtExpiry(token: string): Date | undefined {
  const exp = readJwtPayload(token)?.exp;
  return typeof exp === "number" ? new Date(exp * 1000) : undefined;
}

export function isTokenExpired(token: string, now = new Date()): boolean {
  const expiry = readJwtExpiry(token);
  return !expiry || expiry.getTime() - 30_000 <= now.getTime();
}
