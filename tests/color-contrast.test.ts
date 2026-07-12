import { describe, expect, it } from "vitest";
import {
  DARK_FOREGROUND,
  LIGHT_FOREGROUND,
  contrastRatio,
  parseHex,
  readableForeground,
  relativeLuminance,
} from "@/lib/color-contrast";
import { prompts } from "@/lib/prompts";

describe("parseHex()", () => {
  it("parses 6-digit hex, with or without #", () => {
    expect(parseHex("#eab308")).toEqual({ r: 234, g: 179, b: 8 });
    expect(parseHex("eab308")).toEqual({ r: 234, g: 179, b: 8 });
  });

  it("expands 3-digit shorthand", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("#0af")).toEqual({ r: 0, g: 170, b: 255 });
  });

  it("returns null for anything it cannot read", () => {
    for (const bad of ["", "red", "#12", "#12345", "#gggggg", "not-a-color"]) {
      expect(parseHex(bad)).toBeNull();
    }
  });
});

describe("relativeLuminance()", () => {
  it("anchors at the WCAG endpoints", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });

  it("ranks a bright yellow above a mid violet", () => {
    const yellow = relativeLuminance(parseHex("#eab308")!);
    const violet = relativeLuminance(parseHex("#8b5cf6")!);
    expect(yellow).toBeGreaterThan(violet);
  });
});

describe("contrastRatio()", () => {
  it("returns 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("returns 1:1 for a color against itself", () => {
    expect(contrastRatio("#8b5cf6", "#8b5cf6")).toBeCloseTo(1, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#eab308", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#eab308"),
      5,
    );
  });
});

describe("readableForeground()", () => {
  // The bug this fixes: #eab308 ships as a theme default, and white-on-yellow
  // was what a user actually saw on that detail page.
  it("picks dark text on bright yellow (#eab308)", () => {
    expect(readableForeground("#eab308")).toBe(DARK_FOREGROUND);
  });

  // Surprise worth recording: white on #8b5cf6 (the Startup Landing Hero
  // default) is only 4.23:1 — it FAILS WCAG AA for normal text. Near-black
  // reaches 4.61:1 and passes. So the old hardcoded white was quietly
  // non-compliant here too, not just on the yellow theme.
  it("picks the foreground that actually passes AA on mid violet (#8b5cf6)", () => {
    const fg = readableForeground("#8b5cf6");
    expect(fg).toBe(DARK_FOREGROUND);
    expect(contrastRatio("#8b5cf6", fg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#8b5cf6", LIGHT_FOREGROUND)).toBeLessThan(4.5);
  });

  it("always picks the higher-contrast of the two options", () => {
    for (const bg of ["#eab308", "#8b5cf6", "#ffffff", "#000000", "#22c55e"]) {
      const chosen = readableForeground(bg);
      const other =
        chosen === DARK_FOREGROUND ? LIGHT_FOREGROUND : DARK_FOREGROUND;
      expect(contrastRatio(bg, chosen)).toBeGreaterThanOrEqual(
        contrastRatio(bg, other),
      );
    }
  });

  it("falls back to white for an invalid color instead of throwing", () => {
    for (const bad of ["", "red", "#nope", "rgb(1,2,3)"]) {
      expect(readableForeground(bad)).toBe(LIGHT_FOREGROUND);
    }
  });
});

describe("every shipped theme's default color is usable on the CTA", () => {
  // Guards the whole dataset, not just the one color that exposed the bug.
  it("clears WCAG AA for large text (3:1) on all 18 defaults", () => {
    for (const p of prompts) {
      const bg = p.defaultPrimaryColor;
      const ratio = contrastRatio(bg, readableForeground(bg));
      expect(
        ratio,
        `${p.slug} (${bg}) only reaches ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
