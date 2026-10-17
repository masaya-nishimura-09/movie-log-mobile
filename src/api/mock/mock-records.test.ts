import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoRecordsEn } from "@/api/mock/mock-records-demo-en";
import { demoRecordsJa } from "@/api/mock/mock-records-demo-ja";
import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import { recordResponseSchema } from "@/schemas/record/record";

const device = vi.hoisted(() => ({ language: "ja" }));

vi.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: device.language }],
}));

async function load(dataset: string, language: string) {
  vi.resetModules();
  vi.stubEnv("EXPO_PUBLIC_MOCK_DATASET", dataset);
  device.language = language;
  return import("@/api/mock/mock-records");
}

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe("mockRecords", () => {
  it("chooses the dataset and the language from the environment", async () => {
    expect((await load("", "ja")).mockRecords).toEqual(initialRecordsJa);
    expect((await load("", "en")).mockRecords).toEqual(initialRecordsEn);
    expect((await load("demo", "ja")).mockRecords).toEqual(demoRecordsJa);
    expect((await load("demo", "en")).mockRecords).toEqual(demoRecordsEn);
  });

  it("has only records that match the API schema, with unique IDs", () => {
    for (const records of [
      initialRecordsJa,
      initialRecordsEn,
      demoRecordsJa,
      demoRecordsEn,
    ]) {
      for (const record of records) {
        expect(recordResponseSchema.safeParse(record).success).toBe(true);
      }
      const ids = records.map((record) => record.record_id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
