export function useCssVariable(name: `--${string}`): string {
  return `var(${name})`;
}
