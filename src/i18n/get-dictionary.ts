import en from "@/i18n/dictionaries/en.json";
import ja from "@/i18n/dictionaries/ja.json";
import type { Locale } from "@/i18n/locales";

export type Dictionary = typeof ja;

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
