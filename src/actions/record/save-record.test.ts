import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const createRecord = vi.fn();
const updateRecord = vi.fn();

vi.mock("@/api/record/create-record", () => ({ createRecord }));
vi.mock("@/api/record/update-record", () => ({ updateRecord }));

const { saveRecordAction } = await import("@/actions/record/save-record");

function values(fields: Record<string, unknown> = {}) {
  return {
    title: "Arrival",
    watchedAt: "2026-10-01T12:00:00Z",
    score: 5,
    platform: "netflix",
    releaseYear: 2016,
    runtime: 116,
    genres: ["drama"],
    countries: [],
    language: "en",
    credits: [{ personName: "Amy Adams", creditRole: "cast" }],
    posterUrl: "",
    moodTags: [],
    memo: "",
    ...fields,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-11T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("saveRecordAction without an ID", () => {
  it("creates the record and returns its ID", async () => {
    createRecord.mockResolvedValue({ recordId: "42" });
    await expect(saveRecordAction(undefined, values())).resolves.toEqual({
      success: true,
      data: "42",
    });
    expect(createRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Arrival",
        score: 5,
        releaseYear: 2016,
        credits: [{ personName: "Amy Adams", creditRole: "cast" }],
      }),
    );
    expect(updateRecord).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const result = await saveRecordAction(
      undefined,
      values({ title: "", watchedAt: "2026-10-12T00:00:00Z", score: 6 }),
    );
    expect(result).toMatchObject({
      success: false,
      messageKey: "invalidInput",
    });
    expect(
      Object.keys(result.success ? {} : (result.errors ?? {})).sort(),
    ).toEqual(["score", "title", "watchedAt"]);
    expect(createRecord).not.toHaveBeenCalled();
  });

  const cases = [
    [new ApiError(404, "RECORD_NOT_FOUND"), "notFound"],
    [new ApiError(400, "INVALID_INPUT"), "invalidInput"],
    [new ApiError(500, "INTERNAL_SERVER_ERROR"), "unexpectedError"],
  ] as const;
  for (const [error, messageKey] of cases) {
    it(`returns ${messageKey} for ${error.code}`, async () => {
      createRecord.mockRejectedValue(error);
      await expect(saveRecordAction(undefined, values())).resolves.toEqual({
        success: false,
        messageKey,
      });
    });
  }

  it("rethrows errors that are not API errors", async () => {
    createRecord.mockRejectedValue(new Error("network"));
    await expect(saveRecordAction(undefined, values())).rejects.toThrow(
      "network",
    );
  });
});

describe("saveRecordAction with an ID", () => {
  it("updates the record and returns its ID", async () => {
    updateRecord.mockResolvedValue({ recordId: "7" });
    await expect(saveRecordAction("7", values())).resolves.toEqual({
      success: true,
      data: "7",
    });
    expect(updateRecord).toHaveBeenCalledWith(
      "7",
      expect.objectContaining({ title: "Arrival" }),
    );
    expect(createRecord).not.toHaveBeenCalled();
  });

  it("returns notFound when the record was deleted", async () => {
    updateRecord.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(saveRecordAction("7", values())).resolves.toEqual({
      success: false,
      messageKey: "notFound",
    });
  });
});
