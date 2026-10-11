import { useMemo } from "react";

import { type Dictionary, getDictionary } from "@/i18n/get-dictionary";
import { getDeviceLocale, type Locale } from "@/i18n/locales";

export function useI18n(): { locale: Locale; dict: Dictionary } {
  return useMemo(() => {
    const locale = getDeviceLocale();
    return { locale, dict: getDictionary(locale) };
  }, []);
}
