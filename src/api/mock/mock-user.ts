import type { UserResponse } from "@/schemas/user/user";

type MockAccount = UserResponse & { user_id: string; password: string };

export const mockAccounts: MockAccount[] = [
  {
    user_id: "1",
    username: "Demo User",
    email: "demo@example.com",
    password: "password",
  },
];

export function toUserResponse({ password: _, ...user }: MockAccount) {
  return user;
}
