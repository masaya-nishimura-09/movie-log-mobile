import { type ActionResult, invalidInput } from "@/actions/action-result";
import { login } from "@/api/auth/login";
import { ApiError } from "@/api/client/api-error";
import { updateUser } from "@/api/user/update-user";
import { clearTokens, saveTokens } from "@/lib/auth/token-storage";
import { type UserInput, userInputSchema } from "@/schemas/user/user-input";

export async function updateAccountAction(
  values: UserInput,
): Promise<ActionResult<{ loggedIn: boolean }>> {
  const input = userInputSchema.safeParse(values);
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await updateUser(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "userAlreadyExists" };
    }
    return { success: false, messageKey: "unexpectedError" };
  }

  try {
    await saveTokens(
      await login({ email: input.data.email, password: input.data.password }),
    );
  } catch {
    await clearTokens();
    return { success: true, data: { loggedIn: false } };
  }
  return { success: true, data: { loggedIn: true } };
}
