import { useUnstableNativeVariable } from "nativewind";

export function useCssVariable(name: `--${string}`): string {
  return String(useUnstableNativeVariable(name) ?? "transparent");
}
