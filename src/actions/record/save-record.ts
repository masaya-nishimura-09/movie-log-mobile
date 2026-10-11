import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { createRecord } from "@/api/record/create-record";
import { updateRecord } from "@/api/record/update-record";
import { recordInputSchema } from "@/schemas/record/record-input";

export async function saveRecordAction(
  recordId: string | undefined,
  values: unknown,
): Promise<ActionResult<string>> {
  const input = recordInputSchema.safeParse(values);
  if (!input.success) {
    return {
      success: false,
      messageKey: "invalidInput",
      errors: z.flattenError(input.error).fieldErrors,
    };
  }

  try {
    const record = recordId
      ? await updateRecord(recordId, input.data)
      : await createRecord(input.data);
    return { success: true, data: record.recordId };
  } catch (error) {
    if (error instanceof ApiError && error.code === "RECORD_NOT_FOUND") {
      return { success: false, messageKey: "notFound" };
    }
    if (error instanceof ApiError && error.code === "INVALID_INPUT") {
      return { success: false, messageKey: "invalidInput" };
    }
    if (error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    throw error;
  }
}
