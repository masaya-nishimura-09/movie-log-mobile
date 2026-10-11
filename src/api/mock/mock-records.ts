import { initialRecordsEn } from "@/api/mock/mock-records-en";
import { initialRecordsJa } from "@/api/mock/mock-records-ja";
import { getDeviceLocale } from "@/i18n/locales";
import type { RecordResponse } from "@/schemas/record/record";

export const mockRecords: RecordResponse[] =
  getDeviceLocale() === "en" ? initialRecordsEn : initialRecordsJa;
