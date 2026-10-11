import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { login } from "@/api/auth/login";
import { ApiError } from "@/api/client/api-error";
import { registerUser } from "@/api/user/register-user";
import { saveTokens } from "@/lib/auth/token-storage";
import { type UserInput, userInputSchema } from "@/schemas/user/user-input";

export type RegisterValues = {
  username: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
};

export async function registerAction(
  values: RegisterValues,
): Promise<ActionResult<{ loggedIn: boolean }>> {
  const input = userInputSchema.safeParse({
    username: values.username,
    email: values.email,
    password: values.password,
  } satisfies UserInput);
  if (!input.success) {
    return {
      success: false,
      messageKey: "invalidInput",
      errors: z.flattenError(input.error).fieldErrors,
    };
  }

  if (!values.agreedToTerms) {
    return { success: false, messageKey: "termsNotAgreed" };
  }

  try {
    await registerUser(input.data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "USER_ALREADY_EXISTS") {
      return { success: false, messageKey: "userAlreadyExists" };
    }
    if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
      return { success: false, messageKey: "tooManyRequests" };
    }
    return { success: false, messageKey: "unexpectedError" };
  }

  try {
    await saveTokens(
      await login({ email: input.data.email, password: input.data.password }),
    );
  } catch {
    return { success: true, data: { loggedIn: false } };
  }
  return { success: true, data: { loggedIn: true } };
}
