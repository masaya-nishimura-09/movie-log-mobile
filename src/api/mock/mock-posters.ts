import { Asset } from "expo-asset";

const posters: Record<string, number> = {
  "/mock-posters/01-en.webp": require("../../../assets/mock-posters/01-en.webp"),
  "/mock-posters/01-ja.webp": require("../../../assets/mock-posters/01-ja.webp"),
  "/mock-posters/02-en.webp": require("../../../assets/mock-posters/02-en.webp"),
  "/mock-posters/02-ja.webp": require("../../../assets/mock-posters/02-ja.webp"),
  "/mock-posters/03-en.webp": require("../../../assets/mock-posters/03-en.webp"),
  "/mock-posters/03-ja.webp": require("../../../assets/mock-posters/03-ja.webp"),
  "/mock-posters/04-en.webp": require("../../../assets/mock-posters/04-en.webp"),
  "/mock-posters/04-ja.webp": require("../../../assets/mock-posters/04-ja.webp"),
  "/mock-posters/05-en.webp": require("../../../assets/mock-posters/05-en.webp"),
  "/mock-posters/05-ja.webp": require("../../../assets/mock-posters/05-ja.webp"),
  "/mock-posters/06-en.webp": require("../../../assets/mock-posters/06-en.webp"),
  "/mock-posters/06-ja.webp": require("../../../assets/mock-posters/06-ja.webp"),
  "/mock-posters/07-en.webp": require("../../../assets/mock-posters/07-en.webp"),
  "/mock-posters/07-ja.webp": require("../../../assets/mock-posters/07-ja.webp"),
  "/mock-posters/08-en.webp": require("../../../assets/mock-posters/08-en.webp"),
  "/mock-posters/08-ja.webp": require("../../../assets/mock-posters/08-ja.webp"),
  "/mock-posters/09-en.webp": require("../../../assets/mock-posters/09-en.webp"),
  "/mock-posters/09-ja.webp": require("../../../assets/mock-posters/09-ja.webp"),
  "/mock-posters/10-en.webp": require("../../../assets/mock-posters/10-en.webp"),
  "/mock-posters/10-ja.webp": require("../../../assets/mock-posters/10-ja.webp"),
};

export function resolveMockPoster(url: string): string {
  const source = posters[url];
  if (source === undefined) return url;
  return Asset.fromModule(source).uri;
}
