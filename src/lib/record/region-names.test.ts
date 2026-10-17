import { describe, expect, it } from "vitest";
import { regionName } from "@/lib/record/region-names";

describe("regionName", () => {
  it("returns the country name in the display locale", () => {
    expect(regionName("ja", "FR")).toBe("フランス");
    expect(regionName("en", "FR")).toBe("France");
  });

  it("returns the code for an unknown country", () => {
    expect(regionName("en", "ZZ")).toBe("ZZ");
  });
});
