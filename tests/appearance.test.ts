import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/prompts/[slug]/build/route";
import {
  APPEARANCES,
  isAppearance,
  readStoredAppearance,
  syncDocumentTheme,
} from "@/components/appearance-provider";
import { t } from "@/lib/i18n";

describe("appearance options", () => {
  it("supports dark, light, and system", () => {
    expect(APPEARANCES).toEqual(["dark", "light", "system"]);
  });

  it("validates appearance values", () => {
    expect(isAppearance("light")).toBe(true);
    expect(isAppearance("solarized")).toBe(false);
    expect(isAppearance(null)).toBe(false);
  });

  it("defaults to dark for empty or unrecognized stored values", () => {
    expect(readStoredAppearance({ getItem: () => null })).toBe("dark");
    expect(readStoredAppearance({ getItem: () => "sepia" })).toBe("dark");
  });

  it("restores a valid stored appearance", () => {
    expect(readStoredAppearance({ getItem: () => "light" })).toBe("light");
    expect(readStoredAppearance({ getItem: () => "system" })).toBe("system");
  });
});

describe("<html> theme class tracks the resolved appearance", () => {
  const fakeDoc = () => {
    const classes = new Set(["dark"]);
    return {
      classes,
      documentElement: {
        classList: {
          toggle: (c: string, on: boolean) => {
            if (on) classes.add(c);
            else classes.delete(c);
          },
        },
      },
    };
  };

  it("adds the dark class when resolved to dark", () => {
    const doc = fakeDoc();
    syncDocumentTheme("dark", doc);
    expect(doc.classes.has("dark")).toBe(true);
  });

  it("removes the dark class when resolved to light", () => {
    const doc = fakeDoc();
    syncDocumentTheme("light", doc);
    expect(doc.classes.has("dark")).toBe(false);
  });
});

describe("appearance labels are localized", () => {
  it("every locale has all three labels", () => {
    for (const locale of ["en", "th", "zh-CN"] as const) {
      expect(t(locale, "appearance.dark").length).toBeGreaterThan(0);
      expect(t(locale, "appearance.light").length).toBeGreaterThan(0);
      expect(t(locale, "appearance.system").length).toBeGreaterThan(0);
    }
  });

  it("clarifies it is separate from the prompt builder's Theme Mode", () => {
    expect(t("en", "appearance.note").toLowerCase()).toContain("prompt");
  });
});

/**
 * The core safety requirement: website appearance is a CSS/DOM concern only.
 * It must never reach the server-built prompt.
 */
describe("website appearance never affects prompt output", () => {
  function post(body: unknown) {
    const request = new NextRequest(
      "http://localhost/api/prompts/saas-dashboard/build",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    return POST(request, {
      params: Promise.resolve({ slug: "saas-dashboard" }),
    });
  }

  it("build API has no appearance field, and sending one changes nothing", async () => {
    const withAppearance = await post({
      primaryColor: "#6366f1",
      appearance: "light",
    });
    const without = await post({ primaryColor: "#6366f1" });
    const a = await withAppearance.json();
    const b = await without.json();
    expect(a.text).toBe(b.text);
    expect(a).not.toHaveProperty("appearance");
  });

  it("themeMode (prompt builder) is unaffected by any appearance value", async () => {
    const results = await Promise.all(
      ["dark", "light", "system"].map(async (appearance) => {
        const res = await post({ themeMode: "light", appearance });
        return (await res.json()).text as string;
      }),
    );
    expect(new Set(results).size).toBe(1);
    expect(results[0]).toContain("LIGHT (fixed)");
  });
});
