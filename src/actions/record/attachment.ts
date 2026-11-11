import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import type { PosterFile } from "@/api/media/upload-poster";
import { addRecordAttachment } from "@/api/record/add-record-attachment";
import { deleteRecordAttachment } from "@/api/record/delete-record-attachment";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";

export type AttachmentFile = PosterFile & { size?: number };

export function isAttachable(file: AttachmentFile): boolean {
  return (
    file.size !== 0 &&
    (file.size === undefined || file.size <= posterMaxBytes) &&
    posterContentTypes.includes(file.type)
  );
}

export async function addAttachmentAction(
  recordId: string,
  file: AttachmentFile,
): Promise<ActionResult<null>> {
  if (!isAttachable(file)) {
    return { success: false, messageKey: "attachmentsUploadError" };
  }

  try {
    await addRecordAttachment(recordId, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "attachmentsUploadError" };
    }
    throw error;
  }
  return { success: true, data: null };
}

export async function deleteAttachmentAction(
  recordId: string,
  attachmentId: string,
): Promise<ActionResult<null>> {
  try {
    await deleteRecordAttachment(recordId, attachmentId);
  } catch (error) {
    const gone =
      error instanceof ApiError && error.code === "ATTACHMENT_NOT_FOUND";
    if (!gone && error instanceof ApiError) {
      return { success: false, messageKey: "unexpectedError" };
    }
    if (!gone) throw error;
  }
  return { success: true, data: null };
}
