import countries from "i18n-iso-countries/index";
import en from "i18n-iso-countries/langs/en.json";
import ja from "i18n-iso-countries/langs/ja.json";
import type { Locale } from "@/i18n/locales";

countries.registerLocale(en);
countries.registerLocale(ja);

export function regionName(locale: Locale, code: string): string {
  return countries.getName(code, locale) ?? code;
}
