import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const stub = (name: string) =>
  fileURLToPath(new URL(`./src/test/${name}.ts`, import.meta.url));

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "expo-asset": stub("expo-asset"),
      "expo-localization": stub("expo-localization"),
      "expo-secure-store": stub("expo-secure-store"),
      "@/api/mock/mock-posters": stub("mock-posters"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    env: { TZ: "Asia/Tokyo" },
  },
});
