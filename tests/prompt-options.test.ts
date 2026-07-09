import { describe, expect, it } from "vitest";
import {
  applyPromptOptions,
  isPromptIntent,
  isThemeMode,
  PROMPT_INTENTS,
  THEME_MODES,
} from "@/lib/prompt-options";
import { buildPrompt } from "@/lib/prompts";

const BASE = "BASE PROMPT";

describe("validators", () => {
  it("accepts only known intents and theme modes", () => {
    expect(isPromptIntent("build")).toBe(true);
    expect(isPromptIntent("retheme")).toBe(true);
    expect(isPromptIntent("rebuild")).toBe(false);
    expect(isPromptIntent(undefined)).toBe(false);
    expect(isThemeMode("dark")).toBe(true);
    expect(isThemeMode("mono")).toBe(true);
    expect(isThemeMode("sepia")).toBe(false);
  });
});

describe("retheme intent", () => {
  const rethemed = applyPromptOptions(BASE, { promptIntent: "retheme" });

  it("prepends the strict preservation rules", () => {
    expect(rethemed).toContain("RETHEME ONLY");
    expect(rethemed).toContain("Preserve every existing route");
    expect(rethemed).toContain(
      "do not remove, rename, or rewrite any function",
    );
    expect(rethemed).toContain("Preserve all state logic");
    expect(rethemed).toContain("Preserve all API calls");
    expect(rethemed).toContain("Preserve all event handlers");
    expect(rethemed).toContain("Do NOT generate a new standalone page");
    expect(rethemed).toContain("Do NOT break existing navigation");
    expect(rethemed).toContain(BASE);
  });

  it("build intent carries no retheme warnings", () => {
    const built = applyPromptOptions(BASE, { promptIntent: "build" });
    expect(built).not.toContain("RETHEME");
    expect(built).not.toContain("Preserve");
    expect(built).toBe(BASE);
  });
});

describe("multi-color palette", () => {
  it("buildPrompt + options handles primary, secondary, and accent", () => {
    const base = buildPrompt("use {{primaryColor}} here", {
      primaryColor: "#111111",
    });
    const out = applyPromptOptions(base, {
      secondaryColor: "#222222",
      accentColor: "#333333",
    });
    expect(out).toContain("#111111");
    expect(out).toContain("Secondary color #222222");
    expect(out).toContain("Accent color #333333");
    expect(out).toContain("Keep the primary color dominant");
  });

  it("supports a two-color palette (secondary only)", () => {
    const out = applyPromptOptions(BASE, { secondaryColor: "#222222" });
    expect(out).toContain("Secondary color #222222");
    expect(out).not.toContain("Accent color");
  });

  it("adds no palette section when no extra colors are set", () => {
    expect(applyPromptOptions(BASE, {})).toBe(BASE);
  });
});

describe("theme modes", () => {
  it("produces a distinct directive per mode, all keeping the base", () => {
    const outputs = THEME_MODES.map((m) =>
      applyPromptOptions(BASE, { themeMode: m.value }),
    );
    expect(new Set(outputs).size).toBe(THEME_MODES.length);
    for (const out of outputs) {
      expect(out).toContain("Theme mode:");
      expect(out).toContain(BASE);
    }
  });

  it("light mode overrides dark styling; mono restricts to neutrals", () => {
    expect(applyPromptOptions(BASE, { themeMode: "light" })).toContain(
      "Override the dark-mode styling",
    );
    expect(applyPromptOptions(BASE, { themeMode: "system" })).toContain(
      "prefers-color-scheme",
    );
    expect(applyPromptOptions(BASE, { themeMode: "mono" })).toContain(
      "black/white/gray",
    );
  });
});

describe("UI copy", () => {
  it("intent descriptions match the agreed user-facing wording", () => {
    const byValue = Object.fromEntries(
      PROMPT_INTENTS.map((i) => [i.value, i.description]),
    );
    expect(byValue.build).toBe(
      "Generate a fresh interface from this prompt.",
    );
    expect(byValue.retheme).toBe(
      "Apply this style to an existing frontend while preserving logic and behavior.",
    );
  });
});
