import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeviceLocale, hasLocale } from "@/i18n/locales";

const device = vi.hoisted(() => ({ codes: [] as (string | null)[] }));

vi.mock("expo-localization", () => ({
  getLocales: () => device.codes.map((languageCode) => ({ languageCode })),
}));

beforeEach(() => {
  device.codes = [];
});

describe("hasLocale", () => {
  it("accepts only supported locales", () => {
    expect(hasLocale("ja")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("fr")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });
});

describe("getDeviceLocale", () => {
  it("picks the first supported language of the device", () => {
    device.codes = ["fr", "ja", "en"];
    expect(getDeviceLocale()).toBe("ja");
  });

  it("falls back to English", () => {
    device.codes = ["fr", null];
    expect(getDeviceLocale()).toBe("en");
    device.codes = [];
    expect(getDeviceLocale()).toBe("en");
  });
});
