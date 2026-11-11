import { Asset } from "expo-asset";

const images: Record<string, number> = {
  "/mock-attachments/flyer.webp": require("../../../assets/mock-attachments/flyer.webp"),
  "/mock-attachments/pamphlet-1.webp": require("../../../assets/mock-attachments/pamphlet-1.webp"),
  "/mock-attachments/pamphlet-2.webp": require("../../../assets/mock-attachments/pamphlet-2.webp"),
  "/mock-attachments/sketch.webp": require("../../../assets/mock-attachments/sketch.webp"),
};

export function resolveMockAttachment(url: string): string {
  const source = images[url];
  if (source === undefined) return url;
  return Asset.fromModule(source).uri;
}
