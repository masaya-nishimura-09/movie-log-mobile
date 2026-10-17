import { describe, expect, it } from "vitest";
import { splitLayout } from "@/lib/style/split-layout";

describe("splitLayout", () => {
  it("moves layout classes to the outer view and the rest to the inner view", () => {
    expect(splitLayout("mt-2 w-full flex-1 px-3 rounded-lg -mx-1")).toEqual({
      outer: "mt-2 w-full flex-1 -mx-1",
      inner: "px-3 rounded-lg",
    });
  });

  it("returns empty strings without classes", () => {
    expect(splitLayout(undefined)).toEqual({ outer: "", inner: "" });
    expect(splitLayout("  ")).toEqual({ outer: "", inner: "" });
  });
});
