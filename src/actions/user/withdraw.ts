import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { deleteUser } from "@/api/user/delete-user";
import { clearTokens } from "@/lib/auth/token-storage";

export async function withdrawAction(): Promise<ActionResult<null>> {
  try {
    await deleteUser();
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "withdrawFailed" };
    }
    throw error;
  }
  await clearTokens();
  return { success: true, data: null };
}
