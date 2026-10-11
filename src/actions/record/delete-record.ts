import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { deleteRecord } from "@/api/record/delete-record";

export async function deleteRecordAction(
  recordId: string,
): Promise<ActionResult<null>> {
  try {
    await deleteRecord(recordId);
  } catch (error) {
    const gone = error instanceof ApiError && error.code === "RECORD_NOT_FOUND";
    if (!gone && error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    if (!gone) throw error;
  }
  return { success: true, data: null };
}
