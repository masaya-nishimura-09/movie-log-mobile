import { type ActionResult, invalidInput } from "@/actions/action-result";
import { login } from "@/api/auth/login";
import { ApiError } from "@/api/client/api-error";
import { getCurrentUser } from "@/api/user/get-current-user";
import { updatePassword } from "@/api/user/update-password";
import { clearTokens, saveTokens } from "@/lib/auth/token-storage";
import { passwordChangeInputSchema } from "@/schemas/user/user-input";

export async function updatePasswordAction(values: {
  oldPassword: string;
  newPassword: string;
}): Promise<ActionResult<{ loggedIn: boolean }>> {
  const input = passwordChangeInputSchema.safeParse(values);
  if (!input.success) {
    return invalidInput(input.error);
  }

  let email: string;
  try {
    ({ email } = await getCurrentUser());
    await updatePassword(input.data);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.code === "INVALID_CURRENT_PASSWORD"
    ) {
      return { success: false, messageKey: "invalidCurrentPassword" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }

  try {
    await saveTokens(await login({ email, password: input.data.newPassword }));
  } catch {
    await clearTokens();
    return { success: true, data: { loggedIn: false } };
  }
  return { success: true, data: { loggedIn: true } };
}
