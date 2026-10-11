import { apiFetch } from "@/api/client/api-fetch";
import { type User, userResponseSchema } from "@/schemas/user/user";

export async function getCurrentUser(): Promise<User> {
  return apiFetch("/users/", userResponseSchema);
}
