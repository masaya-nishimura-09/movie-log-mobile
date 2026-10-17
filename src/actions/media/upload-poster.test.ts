import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";

const uploadPoster = vi.fn();

vi.mock("@/api/media/upload-poster", () => ({ uploadPoster }));

const { uploadPosterAction } = await import("@/actions/media/upload-poster");

const maxBytes = 5 * 1024 * 1024;

function file(type: string, size?: number) {
  return { uri: "file:///a", name: "a", type, size };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadPosterAction", () => {
  it("uploads JPEG, PNG and WebP images", async () => {
    uploadPoster.mockResolvedValue("https://example.com/a");
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      await expect(uploadPosterAction(file(type, 1))).resolves.toEqual({
        success: true,
        data: "https://example.com/a",
      });
    }
    expect(uploadPoster).toHaveBeenCalledTimes(3);
    expect(uploadPoster).toHaveBeenCalledWith({
      uri: "file:///a",
      name: "a",
      type: "image/webp",
    });
  });

  it("rejects an empty, too large or non-image file without uploading", async () => {
    for (const target of [
      file("image/png", 0),
      file("image/png", maxBytes + 1),
      file("image/gif", 1),
    ]) {
      await expect(uploadPosterAction(target)).resolves.toEqual({
        success: false,
        messageKey: "posterUploadError",
      });
    }
    expect(uploadPoster).not.toHaveBeenCalled();
  });

  it("accepts a file of exactly 5MB and a file of unknown size", async () => {
    uploadPoster.mockResolvedValue("https://example.com/a");
    for (const size of [maxBytes, undefined]) {
      await expect(
        uploadPosterAction(file("image/png", size)),
      ).resolves.toMatchObject({ success: true });
    }
  });

  it("returns posterUploadError on an API error and rethrows others", async () => {
    uploadPoster.mockRejectedValue(new ApiError(400, "INVALID_INPUT"));
    await expect(uploadPosterAction(file("image/png", 1))).resolves.toEqual({
      success: false,
      messageKey: "posterUploadError",
    });
    uploadPoster.mockRejectedValue(new Error("network"));
    await expect(uploadPosterAction(file("image/png", 1))).rejects.toThrow(
      "network",
    );
  });
});
