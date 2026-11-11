import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const addRecordAttachment = vi.fn();
const deleteRecordAttachment = vi.fn();

vi.mock("@/api/record/add-record-attachment", () => ({ addRecordAttachment }));
vi.mock("@/api/record/delete-record-attachment", () => ({
  deleteRecordAttachment,
}));

const { addAttachmentAction, deleteAttachmentAction, isAttachable } =
  await import("@/actions/record/attachment");

const maxBytes = 5 * 1024 * 1024;

function file(type: string, size?: number) {
  return { uri: "file:///a", name: "a", type, size };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isAttachable", () => {
  it("accepts JPEG, PNG and WebP up to 5 MB, and files of unknown size", () => {
    expect(isAttachable(file("image/jpeg", 1))).toBe(true);
    expect(isAttachable(file("image/webp", maxBytes))).toBe(true);
    expect(isAttachable(file("image/png"))).toBe(true);
    expect(isAttachable(file("image/png", 0))).toBe(false);
    expect(isAttachable(file("image/png", maxBytes + 1))).toBe(false);
    expect(isAttachable(file("image/gif", 1))).toBe(false);
  });
});

describe("addAttachmentAction", () => {
  it("uploads the file without its size", async () => {
    addRecordAttachment.mockResolvedValue({});
    await expect(
      addAttachmentAction("1", file("image/png", 1)),
    ).resolves.toEqual({ success: true, data: null });
    expect(addRecordAttachment).toHaveBeenCalledWith("1", {
      uri: "file:///a",
      name: "a",
      type: "image/png",
    });
  });

  it("rejects a file it cannot attach without uploading", async () => {
    await expect(
      addAttachmentAction("1", file("image/gif", 1)),
    ).resolves.toEqual({
      success: false,
      messageKey: "attachmentsUploadError",
    });
    expect(addRecordAttachment).not.toHaveBeenCalled();
  });

  it("returns an upload error when the API refuses", async () => {
    addRecordAttachment.mockRejectedValue(new ApiError(400, "INVALID_INPUT"));
    await expect(
      addAttachmentAction("1", file("image/png", 1)),
    ).resolves.toEqual({
      success: false,
      messageKey: "attachmentsUploadError",
    });
  });
});

describe("deleteAttachmentAction", () => {
  it("deletes the attachment, and treats an attachment already gone as deleted", async () => {
    deleteRecordAttachment.mockResolvedValueOnce(undefined);
    await expect(deleteAttachmentAction("1", "4")).resolves.toEqual({
      success: true,
      data: null,
    });
    deleteRecordAttachment.mockRejectedValueOnce(
      new ApiError(404, "ATTACHMENT_NOT_FOUND"),
    );
    await expect(deleteAttachmentAction("1", "4")).resolves.toEqual({
      success: true,
      data: null,
    });
  });

  it("returns an unexpected error for other API errors", async () => {
    deleteRecordAttachment.mockRejectedValue(
      new ApiError(500, "INTERNAL_SERVER_ERROR"),
    );
    await expect(deleteAttachmentAction("1", "4")).resolves.toEqual({
      success: false,
      messageKey: "unexpectedError",
    });
  });
});
