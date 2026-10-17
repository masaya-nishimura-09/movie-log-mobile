import { describe, expect, it } from "vitest";
import { formatList } from "@/lib/text/format-list";

describe("formatList", () => {
  it("joins Japanese items with 、", () => {
    expect(formatList("ja", ["日本", "フランス", "米国"])).toBe(
      "日本、フランス、米国",
    );
  });

  it("joins English items with commas and a final and", () => {
    expect(formatList("en", [])).toBe("");
    expect(formatList("en", ["Japan"])).toBe("Japan");
    expect(formatList("en", ["Japan", "France"])).toBe("Japan and France");
    expect(formatList("en", ["Japan", "France", "US"])).toBe(
      "Japan, France, and US",
    );
  });
});
