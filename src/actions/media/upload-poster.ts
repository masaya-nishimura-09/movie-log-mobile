import type { ActionResult } from "@/actions/action-result";
import { ApiError } from "@/api/client/api-error";
import { type PosterFile, uploadPoster } from "@/api/media/upload-poster";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";

export async function uploadPosterAction(
  file: PosterFile & { size?: number },
): Promise<ActionResult<string>> {
  if (
    file.size === 0 ||
    (file.size !== undefined && file.size > posterMaxBytes) ||
    !posterContentTypes.includes(file.type)
  ) {
    return { success: false, messageKey: "posterUploadError" };
  }

  try {
    return {
      success: true,
      data: await uploadPoster({
        uri: file.uri,
        name: file.name,
        type: file.type,
      }),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, messageKey: "posterUploadError" };
    }
    throw error;
  }
}
