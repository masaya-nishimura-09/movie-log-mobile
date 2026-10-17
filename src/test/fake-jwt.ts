import { encodeBase64Url } from "@/lib/auth/jwt";

export function fakeJwt(payload: object, signature = "signature"): string {
  const encode = (value: object) => encodeBase64Url(JSON.stringify(value));
  return `${encode({ alg: "HS256" })}.${encode(payload)}.${signature}`;
}
