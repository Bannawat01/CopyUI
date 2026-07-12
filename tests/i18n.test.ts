import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/prompts/[slug]/build/route";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  isLocale,
  t,
  tCategory,
  type Locale,
} from "@/lib/i18n";
import { getTrustFaq, getRethemeSafetyPoints } from "@/lib/trust-copy";

describe("locales", () => {
  it("supports en, th, and zh-CN with English as the default", () => {
    expect([...LOCALES]).toEqual(["en", "th", "zh-CN"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("names each language in its own script", () => {
    expect(LOCALE_LABELS.en).toBe("English");
    expect(LOCALE_LABELS.th).toBe("ไทย");
    expect(LOCALE_LABELS["zh-CN"]).toBe("中文");
  });

  it("validates locale values", () => {
    expect(isLocale("th")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe("t()", () => {
  it("translates UI copy per locale", () => {
    expect(t("en", "gallery.heading")).toBe("Browse Templates");
    expect(t("th", "gallery.heading")).toBe("เลือกดูเทมเพลต");
    expect(t("zh-CN", "gallery.heading")).toBe("浏览模板");
  });

  it("interpolates variables", () => {
    expect(t("en", "gallery.count", { shown: 3, total: 18 })).toBe("3 of 18");
    expect(t("en", "copy.idle", { tool: "Cursor" })).toBe("Copy for Cursor");
  });

  it("falls back to English rather than rendering a raw key", () => {
    // Every locale resolves every key to real prose, never "some.key".
    for (const locale of LOCALES) {
      const value = t(locale, "footer.source");
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain(".");
    }
  });

  it("falls back to the raw category name when untranslated", () => {
    expect(tCategory("en", "Dashboard")).toBe("Dashboard");
    expect(tCategory("th", "Dashboard")).toBe("แดชบอร์ด");
    expect(tCategory("th", "Fintech")).toBe("Fintech");
  });
});

describe("translations are complete enough to use", () => {
  it("every locale translates the language note", () => {
    for (const locale of LOCALES) {
      expect(t(locale, "lang.note").length).toBeGreaterThan(10);
    }
    // Non-English locales must actually differ from the English source.
    expect(t("th", "lang.note")).not.toBe(t("en", "lang.note"));
    expect(t("zh-CN", "lang.note")).not.toBe(t("en", "lang.note"));
  });

  it("every locale has the full trust FAQ and retheme safety points", () => {
    const enFaq = getTrustFaq("en");
    for (const locale of LOCALES) {
      expect(getTrustFaq(locale)).toHaveLength(enFaq.length);
      expect(getRethemeSafetyPoints(locale)).toHaveLength(
        getRethemeSafetyPoints("en").length,
      );
      for (const item of getTrustFaq(locale)) {
        expect(item.question.length).toBeGreaterThan(0);
        expect(item.answer.length).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * The whole point of the feature: the SITE is localized, the PROMPT is not.
 * English prompts are more token-efficient and more reliable in AI tools.
 */
describe("prompt output is never localized", () => {
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

  it("builds byte-identical English prompt text regardless of locale", async () => {
    const texts = await Promise.all(
      LOCALES.map(async (locale: Locale) => {
        // A locale field is not even part of the build contract — sending
        // one must not change the output.
        const res = await post({ primaryColor: "#6366f1", locale });
        const { text } = await res.json();
        return text as string;
      }),
    );

    expect(new Set(texts).size).toBe(1);
    expect(texts[0]).toContain("Product context:");
  });

  it("carries no Thai or Chinese characters into the built prompt", async () => {
    const res = await post({ primaryColor: "#6366f1", locale: "th" });
    const { text } = await res.json();
    expect(text).not.toMatch(/[฀-๿]/); // Thai
    expect(text).not.toMatch(/[一-鿿]/); // CJK
  });

  it("still never exposes the hidden template", async () => {
    const res = await post({ locale: "zh-CN" });
    const json = await res.json();
    expect(json).not.toHaveProperty("promptTemplate");
    expect(json.text).not.toContain("{{");
  });
});
