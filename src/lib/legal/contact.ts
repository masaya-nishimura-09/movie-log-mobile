import * as WebBrowser from "expo-web-browser";
import type { Locale } from "@/i18n/locales";

export function contactFormUrl(locale: Locale): string {
  const webUrl = process.env.EXPO_PUBLIC_WEB_URL;
  if (!webUrl) return "";
  return `${webUrl.replace(/\/$/, "")}/${locale}/contact`;
}

export async function openContactForm(locale: Locale): Promise<void> {
  const url = contactFormUrl(locale);
  if (url === "") return;
  await WebBrowser.openBrowserAsync(url);
}
