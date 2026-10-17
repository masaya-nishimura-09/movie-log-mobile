import { describe, expect, it } from "vitest";
import en from "@/i18n/dictionaries/en.json";
import ja from "@/i18n/dictionaries/ja.json";
import { getDictionary } from "@/i18n/get-dictionary";

describe("getDictionary", () => {
  it("returns the dictionary of the locale", () => {
    expect(getDictionary("ja")).toBe(ja);
    expect(getDictionary("en")).toBe(en);
  });

  it("has the same keys in both languages", () => {
    const keys = (value: unknown, prefix = ""): string[] =>
      typeof value === "object" && value !== null
        ? Object.entries(value).flatMap(([key, child]) =>
            keys(child, `${prefix}.${key}`),
          )
        : [prefix];
    expect(keys(ja)).toEqual(keys(en));
  });
});
