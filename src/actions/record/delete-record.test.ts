import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const deleteRecord = vi.fn();

vi.mock("@/api/record/delete-record", () => ({ deleteRecord }));

const { deleteRecordAction } = await import("@/actions/record/delete-record");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteRecordAction", () => {
  it("deletes the record", async () => {
    deleteRecord.mockResolvedValue(undefined);
    await expect(deleteRecordAction("1")).resolves.toEqual({
      success: true,
      data: null,
    });
    expect(deleteRecord).toHaveBeenCalledWith("1");
  });

  it("succeeds when the record is already gone", async () => {
    deleteRecord.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(deleteRecordAction("1")).resolves.toEqual({
      success: true,
      data: null,
    });
  });

  it("returns unexpectedError on other API errors", async () => {
    deleteRecord.mockRejectedValue(new ApiError(500, "INTERNAL_SERVER_ERROR"));
    await expect(deleteRecordAction("1")).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });

  it("rethrows errors that are not API errors", async () => {
    deleteRecord.mockRejectedValue(new Error("network"));
    await expect(deleteRecordAction("1")).rejects.toThrow("network");
  });
});
