import { type ActionResult, invalidInput } from "@/actions/action-result";
import { login } from "@/api/auth/login";
import { ApiError } from "@/api/client/api-error";
import { saveTokens } from "@/lib/auth/token-storage";
import { type LoginInput, loginInputSchema } from "@/schemas/auth/login";

export async function loginAction(
  values: LoginInput,
): Promise<ActionResult<null>> {
  const input = loginInputSchema.safeParse(values);
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await saveTokens(await login(input.data));
  } catch (error) {
    if (error instanceof ApiError && error.code === "INVALID_CREDENTIALS") {
      return { success: false, messageKey: "invalidCredentials" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    return { success: false, messageKey: "unexpectedError" };
  }
  return { success: true, data: null };
}
