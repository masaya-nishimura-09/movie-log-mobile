import { resolveMockPoster } from "@/api/mock/mock-posters";
import { demoRecordsEn } from "@/api/mock/mock-records-demo-en";
import { demoRecordsJa } from "@/api/mock/mock-records-demo-ja";
import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import { getDeviceLocale } from "@/i18n/locales";
import type { RecordResponse } from "@/schemas/record/record";

const english = getDeviceLocale() === "en";
const demo = process.env.EXPO_PUBLIC_MOCK_DATASET === "demo";

const initialRecords: RecordResponse[] = demo
  ? english
    ? demoRecordsEn
    : demoRecordsJa
  : english
    ? initialRecordsEn
    : initialRecordsJa;

export const mockRecords: RecordResponse[] = initialRecords.map((record) => ({
  ...record,
  poster_url: resolveMockPoster(record.poster_url),
}));
