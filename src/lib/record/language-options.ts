import type { Locale } from "@/i18n/locales";
import type { SelectOption } from "@/schemas/record/record-form";

const unknownLanguage = "und";

const languageNames: Record<string, Record<Locale, string>> = {
  ja: { ja: "日本語", en: "Japanese" },
  en: { ja: "英語", en: "English" },
  fr: { ja: "フランス語", en: "French" },
  de: { ja: "ドイツ語", en: "German" },
  it: { ja: "イタリア語", en: "Italian" },
  es: { ja: "スペイン語", en: "Spanish" },
  pt: { ja: "ポルトガル語", en: "Portuguese" },
  ru: { ja: "ロシア語", en: "Russian" },
  ko: { ja: "韓国語", en: "Korean" },
  zh: { ja: "中国語", en: "Chinese" },
  hi: { ja: "ヒンディー語", en: "Hindi" },
  th: { ja: "タイ語", en: "Thai" },
  fa: { ja: "ペルシア語", en: "Persian" },
  sv: { ja: "スウェーデン語", en: "Swedish" },
  da: { ja: "デンマーク語", en: "Danish" },
};

const languageCodes = [...Object.keys(languageNames), unknownLanguage];

export function languageName(
  locale: Locale,
  code: string,
  unknownLabel: string,
): string {
  if (code === unknownLanguage) return unknownLabel;
  return languageNames[code]?.[locale] ?? code;
}

export function buildLanguageOptions(
  locale: Locale,
  current: string,
  unknownLabel: string,
): SelectOption[] {
  const codes = languageCodes.includes(current)
    ? languageCodes
    : [current, ...languageCodes];
  return codes.map((code) => ({
    value: code,
    label: `${languageName(locale, code, unknownLabel)} ${code}`,
  }));
}
