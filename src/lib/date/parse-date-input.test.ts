import { describe, expect, it, vi } from "vitest";
import { parseDateInput } from "@/lib/date/parse-date-input";

describe("parseDateInput", () => {
  it("parses a date as local midnight", () => {
    const date = parseDateInput("2026-10-11");
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026, 9, 11,
    ]);
    expect(date.getHours()).toBe(0);
  });

  it("returns now for a value that is not a date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-11T03:00:00Z"));
    expect(parseDateInput("").getTime()).toBe(Date.now());
    expect(parseDateInput("10/11/2026").getTime()).toBe(Date.now());
    vi.useRealTimers();
  });
});
