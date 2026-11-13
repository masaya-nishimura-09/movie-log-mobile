import { File } from "expo-file-system";
import type { PosterFile } from "@/api/media/upload-poster";

export function toFormFile(file: PosterFile): Blob {
  const part = {
    uri: file.uri,
    name: file.name,
    type: file.type,
    bytes: () => new File(file.uri).bytes(),
  };
  return part as unknown as Blob;
}
