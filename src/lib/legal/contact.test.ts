import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const openBrowserAsync = vi.fn();

vi.mock("expo-web-browser", () => ({ openBrowserAsync }));

const { contactFormUrl, openContactForm } = await import("@/lib/legal/contact");

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("contactFormUrl", () => {
  it("builds the contact page URL for the locale", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://web.test");
    expect(contactFormUrl("ja")).toBe("https://web.test/ja/contact");
  });

  it("drops a trailing slash from the web URL", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://web.test/");
    expect(contactFormUrl("en")).toBe("https://web.test/en/contact");
  });

  it("returns an empty string when the web URL is not set", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "");
    expect(contactFormUrl("ja")).toBe("");
  });
});

describe("openContactForm", () => {
  it("opens the contact page in the browser", async () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://web.test");
    await openContactForm("ja");
    expect(openBrowserAsync).toHaveBeenCalledWith(
      "https://web.test/ja/contact",
    );
  });

  it("does nothing when the web URL is not set", async () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "");
    await openContactForm("ja");
    expect(openBrowserAsync).not.toHaveBeenCalled();
  });
});
