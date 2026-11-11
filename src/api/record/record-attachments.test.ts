import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const apiFetch = vi.fn();

vi.mock("@/api/client/api-fetch", () => ({ apiFetch }));

beforeEach(() => {
  apiFetch.mockReset();
});

const { getRecordAttachments } = await import(
  "@/api/record/get-record-attachments"
);
const { addRecordAttachment } = await import(
  "@/api/record/add-record-attachment"
);
const { deleteRecordAttachment } = await import(
  "@/api/record/delete-record-attachment"
);

describe("getRecordAttachments", () => {
  it("gets /records/{id}/attachments", async () => {
    const attachments = [{ attachmentId: "1" }];
    apiFetch.mockResolvedValue(attachments);
    await expect(getRecordAttachments("1")).resolves.toEqual(attachments);
    expect(apiFetch.mock.calls[0]?.[0]).toBe("/records/1/attachments");
  });

  it("returns nothing when the record does not exist", async () => {
    apiFetch.mockRejectedValue(new ApiError(404, "RECORD_NOT_FOUND"));
    await expect(getRecordAttachments("2")).resolves.toEqual([]);
  });

  it("rethrows other errors", async () => {
    const error = new ApiError(500, "INTERNAL_SERVER_ERROR");
    apiFetch.mockRejectedValue(error);
    await expect(getRecordAttachments("3")).rejects.toBe(error);
  });
});

describe("addRecordAttachment", () => {
  it("posts the file to /records/{id}/attachments as form data", async () => {
    apiFetch.mockResolvedValue({ attachmentId: "9" });
    const append = vi.spyOn(FormData.prototype, "append");
    const file = { uri: "file:///a.png", name: "a.png", type: "image/png" };
    await expect(addRecordAttachment("1", file)).resolves.toEqual({
      attachmentId: "9",
    });
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/1/attachments");
    expect(init.method).toBe("POST");
    expect(append).toHaveBeenCalledWith("file", file);
    append.mockRestore();
  });
});

describe("deleteRecordAttachment", () => {
  it("deletes /records/{id}/attachments/{attachmentId}", async () => {
    apiFetch.mockResolvedValue(undefined);
    await deleteRecordAttachment("1", "4");
    const [path, , init] = apiFetch.mock.calls[0] ?? [];
    expect(path).toBe("/records/1/attachments/4");
    expect(init.method).toBe("DELETE");
  });
});
