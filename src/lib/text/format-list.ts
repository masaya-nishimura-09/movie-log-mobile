import type { Locale } from "@/i18n/locales";

export function formatList(locale: Locale, items: string[]): string {
  if (locale === "ja") return items.join("、");
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
