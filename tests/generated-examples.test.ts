import { describe, expect, it } from "vitest";
import {
  FEATURED_EXAMPLE_SLUGS,
  GENERATED_EXAMPLES,
  getExampleBySlug,
  getFeaturedExamples,
} from "@/lib/generated-examples";
import { getPromptBySlug, prompts } from "@/lib/prompts";
import { isToolMode } from "@/lib/tool-modes";

const ALL_TEXT = JSON.stringify(GENERATED_EXAMPLES).toLowerCase();

describe("generated example coverage", () => {
  it("has an example for all 18 prompts, and no orphans", () => {
    expect(GENERATED_EXAMPLES).toHaveLength(prompts.length);
    for (const p of prompts) {
      expect(getExampleBySlug(p.slug), `missing example: ${p.slug}`).toBeDefined();
    }
    // Every example slug must resolve to a real prompt.
    for (const e of GENERATED_EXAMPLES) {
      expect(getPromptBySlug(e.slug), `orphan example: ${e.slug}`).toBeDefined();
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getExampleBySlug("does-not-exist")).toBeUndefined();
  });

  it("uses only real tool modes in suggestions", () => {
    for (const e of GENERATED_EXAMPLES) {
      expect(e.suggestedToolModes.length).toBeGreaterThan(0);
      for (const mode of e.suggestedToolModes) {
        expect(isToolMode(mode), `${e.slug}: bad tool mode ${mode}`).toBe(true);
      }
    }
  });

  it("keeps every example within the promised shape", () => {
    for (const e of GENERATED_EXAMPLES) {
      expect(e.exampleTitle.length).toBeGreaterThan(0);
      expect(e.outcomeSummary.length).toBeGreaterThan(20);
      expect(e.layoutPreview.length).toBeGreaterThanOrEqual(3);
      expect(e.keyElements.length).toBeGreaterThanOrEqual(4);
      expect(e.keyElements.length).toBeLessThanOrEqual(6);
      expect(e.bestFor.length).toBeGreaterThanOrEqual(2);
      expect(e.bestFor.length).toBeLessThanOrEqual(4);
      expect(e.visualNotes.length).toBeGreaterThanOrEqual(2);
      expect(e.visualNotes.length).toBeLessThanOrEqual(4);
    }
  });

  it("featured examples all resolve", () => {
    const featured = getFeaturedExamples();
    expect(featured).toHaveLength(FEATURED_EXAMPLE_SLUGS.length);
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.length).toBeLessThanOrEqual(6);
  });
});

/**
 * This data ships to the browser, so it must carry nothing from the hidden
 * template — it is hand-written public copy, not a summary generated from
 * `promptTemplate`.
 */
describe("generated examples leak nothing", () => {
  it("contains no hidden-template markers", () => {
    for (const marker of [
      "product context:",
      "context of use:",
      "target tool:",
      "layout:",
      "{{primarycolor}}",
      "retheme only",
      "final theme override",
      "hard requirements",
    ]) {
      expect(ALL_TEXT).not.toContain(marker);
    }
  });

  it("never reproduces a real template's opening line", () => {
    for (const p of prompts) {
      const opening = p.promptTemplate.slice(0, 60).toLowerCase();
      expect(ALL_TEXT).not.toContain(opening);
    }
  });
});

/** Examples describe direction. They must never promise a fixed result. */
describe("generated examples never overpromise", () => {
  it("makes no guarantee of identical or deterministic output", () => {
    for (const overpromise of [
      "guaranteed",
      "guarantee",
      "always identical",
      "same result every time",
      "never delete",
      "100% deterministic",
      "pixel-perfect",
      "exactly what you see",
    ]) {
      expect(ALL_TEXT).not.toContain(overpromise);
    }
  });

  it("uses direction-setting language instead", () => {
    expect(ALL_TEXT).toContain("designed to");
    expect(ALL_TEXT).toContain("expect");
    expect(ALL_TEXT).toContain("may differ");
  });
});
