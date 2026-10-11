import { apiFetch } from "@/api/client/api-fetch";
import { mediaUploadResponseSchema } from "@/schemas/media/media";

export type PosterFile = { uri: string; name: string; type: string };

export async function uploadPoster(file: PosterFile): Promise<string> {
  const body = new FormData();
  body.append("file", file as unknown as Blob);
  return apiFetch("/media/", mediaUploadResponseSchema, {
    method: "POST",
    body,
  });
}
