import { apiFetch } from "@/api/client/api-fetch";
import type { PosterFile } from "@/api/media/upload-poster";
import {
  type Attachment,
  attachmentResponseSchema,
} from "@/schemas/record/attachment";

export async function addRecordAttachment(
  recordId: string,
  file: PosterFile,
): Promise<Attachment> {
  const body = new FormData();
  body.append("file", file as unknown as Blob);
  return apiFetch(
    `/records/${encodeURIComponent(recordId)}/attachments`,
    attachmentResponseSchema,
    { method: "POST", body },
  );
}
