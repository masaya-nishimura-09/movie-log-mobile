import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export async function shareFile(
  name: string,
  content: string | Uint8Array,
  mimeType: string,
): Promise<void> {
  const file = new File(Paths.cache, name);
  await file.write(content);
  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: name });
}
