import { type ActionResult, invalidInput } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { updateUsername } from "@/api/user/update-username";
import { usernameInputSchema } from "@/schemas/user/user-input";

export async function updateUsernameAction(values: {
  username: string;
}): Promise<ActionResult<null>> {
  const input = usernameInputSchema.safeParse(values);
  if (!input.success) {
    return invalidInput(input.error);
  }

  try {
    await updateUsername(input.data);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
  return { success: true, data: null };
}
