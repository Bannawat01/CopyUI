import { describe, expect, it } from "vitest";
import {
  buildPrompt,
  getPromptBySlug,
  getPublicPrompts,
  prompts,
} from "@/lib/prompts";
import { TOOL_MODES, applyToolMode } from "@/lib/tool-modes";

describe("prompt dataset", () => {
  it("has 18 themes with unique, resolvable slugs", () => {
    const slugs = prompts.map((p) => p.slug);
    expect(slugs).toHaveLength(18);
    expect(new Set(slugs).size).toBe(18);
    for (const slug of slugs) {
      expect(getPromptBySlug(slug)?.slug).toBe(slug);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPromptBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("hidden prompt template (security)", () => {
  it("getPublicPrompts() strips promptTemplate from every theme", () => {
    for (const p of getPublicPrompts()) {
      expect(p).not.toHaveProperty("promptTemplate");
    }
  });

  it("no raw template content leaks into serialized public data", () => {
    const serialized = JSON.stringify(getPublicPrompts());
    // Markers unique to promptTemplate / tool-mode framing.
    expect(serialized).not.toContain("Product context:");
    expect(serialized).not.toContain("Target tool:");
    expect(serialized).not.toContain("{{primaryColor}}");
  });

  it("still exposes the public fields the gallery needs", () => {
    const [first] = getPublicPrompts();
    expect(first).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      category: expect.any(String),
    });
    expect(first.meta.copies).toBeTypeOf("number");
  });
});

describe("buildPrompt()", () => {
  it("injects primaryColor at every placeholder", () => {
    const out = buildPrompt("a {{primaryColor}} b {{primaryColor}}", {
      primaryColor: "#ff0000",
    });
    expect(out).toBe("a #ff0000 b #ff0000");
    expect(out).not.toContain("{{");
  });

  it("substitutes into a real template with no placeholders left", () => {
    const template = getPromptBySlug("saas-dashboard")!.promptTemplate;
    const out = buildPrompt(template, { primaryColor: "#6366f1" });
    expect(out).toContain("#6366f1");
    expect(out).not.toContain("{{primaryColor}}");
  });

  it("replaces unknown placeholders with an empty string", () => {
    expect(buildPrompt("x{{nope}}y", {})).toBe("xy");
  });
});

describe("applyToolMode()", () => {
  const base = "BASE PROMPT";

  it("produces distinct framed output per tool mode", () => {
    const outputs = TOOL_MODES.map((m) => applyToolMode(base, m.value));
    expect(new Set(outputs).size).toBe(TOOL_MODES.length);
    for (const out of outputs) {
      expect(out).toContain("Target tool:");
      expect(out).toContain(base);
    }
  });

  it("frames each tool with its own name", () => {
    expect(applyToolMode(base, "v0")).toContain("v0.dev");
    expect(applyToolMode(base, "cursor")).toContain("Cursor");
    expect(applyToolMode(base, "genvibe")).toContain("GenVibe");
  });

  it("returns the base prompt untouched for a missing/invalid mode", () => {
    expect(applyToolMode(base)).toBe(base);
    expect(applyToolMode(base, "bogus")).toBe(base);
  });
});
