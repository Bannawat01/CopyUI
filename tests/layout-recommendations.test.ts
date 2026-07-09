import { describe, expect, it } from "vitest";
import {
  getGroupedLayoutPresets,
  getRecommendedLayoutPresets,
  isRecommendedLayoutPreset,
} from "@/lib/layout-recommendations";
import { LAYOUT_PRESETS, isLayoutPreset } from "@/lib/prompt-options";
import { prompts } from "@/lib/prompts";

const KINDS = prompts.map((p) => p.preview.kind);

describe("layout recommendations", () => {
  it("covers every theme's preview kind with at least one recommendation", () => {
    expect(KINDS).toHaveLength(18);
    for (const kind of KINDS) {
      const recommended = getRecommendedLayoutPresets(kind);
      expect(recommended.length).toBeGreaterThan(0);
    }
  });

  it("only recommends real, non-auto presets with no duplicates", () => {
    for (const kind of KINDS) {
      const recommended = getRecommendedLayoutPresets(kind);
      for (const preset of recommended) {
        expect(isLayoutPreset(preset)).toBe(true);
        expect(preset).not.toBe("auto");
      }
      expect(new Set(recommended).size).toBe(recommended.length);
    }
  });

  it("recommends sensible presets for representative themes", () => {
    expect(getRecommendedLayoutPresets("dashboard")).toContain(
      "sidebar-dashboard",
    );
    expect(getRecommendedLayoutPresets("pricing")).toContain("pricing-grid");
    expect(getRecommendedLayoutPresets("docs")).toContain("docs-layout");
    expect(getRecommendedLayoutPresets("linkbio")).toContain("mobile-app");
    // The odd pairing that motivated this change stays un-recommended.
    expect(getRecommendedLayoutPresets("docs")).not.toContain("pricing-grid");
  });

  it("isRecommendedLayoutPreset reflects the mapping", () => {
    expect(isRecommendedLayoutPreset("docs", "docs-layout")).toBe(true);
    expect(isRecommendedLayoutPreset("docs", "pricing-grid")).toBe(false);
  });
});

describe("grouped presets for the selector", () => {
  it("puts auto first and never inside a group", () => {
    const { auto, recommended, other } = getGroupedLayoutPresets("dashboard");
    expect(auto.value).toBe("auto");
    expect(recommended.map((p) => p.value)).not.toContain("auto");
    expect(other.map((p) => p.value)).not.toContain("auto");
  });

  it("keeps every preset selectable — recommended + other = all", () => {
    for (const kind of KINDS) {
      const { auto, recommended, other } = getGroupedLayoutPresets(kind);
      const all = [auto, ...recommended, ...other].map((p) => p.value);
      expect(new Set(all).size).toBe(LAYOUT_PRESETS.length);
      expect(new Set(all)).toEqual(new Set(LAYOUT_PRESETS.map((p) => p.value)));
    }
  });

  it("preserves the curated recommendation order", () => {
    const { recommended } = getGroupedLayoutPresets("dashboard");
    expect(recommended.map((p) => p.value)).toEqual([
      "sidebar-dashboard",
      "bento-grid",
      "card-grid",
    ]);
  });

  it("labels come from the shared LAYOUT_PRESETS list", () => {
    const { recommended } = getGroupedLayoutPresets("docs");
    expect(recommended[0]).toEqual({
      value: "docs-layout",
      label: "Docs Layout",
    });
  });
});
