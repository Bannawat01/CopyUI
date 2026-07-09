import { describe, expect, it } from "vitest";
import {
  ACTION_STYLES,
  applyPromptOptions,
  isActionStyle,
  isLayoutPreset,
  isPromptIntent,
  isThemeMode,
  LAYOUT_PRESETS,
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

  it("light is a FIXED theme that explicitly forbids adaptive behavior", () => {
    const light = applyPromptOptions(BASE, { themeMode: "light" });
    expect(light).toContain("LIGHT (fixed)");
    expect(light).toContain("regardless of their system setting");
    expect(light).toContain("This is NOT adaptive");
    expect(light).toContain("do NOT use prefers-color-scheme");
    expect(light).toContain("do NOT follow the browser or OS theme");
    // Must never carry the system mode's positive adaptive instructions.
    expect(light).not.toContain("driven by prefers-color-scheme");
    expect(light).not.toContain("implement BOTH");
  });

  it("dark is a FIXED theme that explicitly forbids adaptive behavior", () => {
    const dark = applyPromptOptions(BASE, { themeMode: "dark" });
    expect(dark).toContain("DARK (fixed)");
    expect(dark).toContain("do NOT use prefers-color-scheme");
    expect(dark).not.toContain("driven by prefers-color-scheme");
    expect(dark).not.toContain("implement BOTH");
  });

  it("system is the only mode that follows prefers-color-scheme", () => {
    const system = applyPromptOptions(BASE, { themeMode: "system" });
    expect(system).toContain("system/adaptive");
    expect(system).toContain("driven by prefers-color-scheme");
    expect(system).toContain("ONLY mode that follows");
    expect(system).toContain("implement BOTH");
  });

  it("mono restricts to neutrals and does not follow the OS theme", () => {
    const mono = applyPromptOptions(BASE, { themeMode: "mono" });
    expect(mono).toContain("black/white/gray");
    expect(mono).toContain("Do not follow the browser or OS theme");
  });
});

describe("action style", () => {
  it("validator accepts only known styles", () => {
    expect(isActionStyle("apply")).toBe(true);
    expect(isActionStyle("instruct")).toBe(true);
    expect(isActionStyle("advise")).toBe(false);
    expect(isActionStyle(undefined)).toBe(false);
  });

  it("retheme + apply demands direct edits with inspect-confirm-preserve", () => {
    const out = applyPromptOptions(BASE, {
      promptIntent: "retheme",
      actionStyle: "apply",
    });
    expect(out).toContain("APPLY THE CHANGES DIRECTLY");
    expect(out).toContain("First inspect the existing files");
    expect(out).toContain("Do you want me to apply this retheme now?");
    expect(out).toContain(
      "preserving all routes, functions, state logic, API calls, event handlers, and component behavior",
    );
    expect(out).toContain("without replacing the app");
    // Both the retheme rules and the execution mode are present.
    expect(out).toContain("RETHEME ONLY");
  });

  it("instruct forbids file edits", () => {
    const out = applyPromptOptions(BASE, { actionStyle: "instruct" });
    expect(out).toContain("INSTRUCTIONS ONLY");
    expect(out).toContain("Do not edit any files");
  });

  it("build + apply is direct but without retheme confirmation wording", () => {
    const out = applyPromptOptions(BASE, {
      promptIntent: "build",
      actionStyle: "apply",
    });
    expect(out).toContain("APPLY THE CHANGES DIRECTLY");
    expect(out).not.toContain("retheme now?");
  });

  it("no directive when actionStyle is omitted (backward compatible)", () => {
    expect(applyPromptOptions(BASE, {})).toBe(BASE);
  });

  it("UI copy exposes both styles", () => {
    const labels = ACTION_STYLES.map((s) => s.label);
    expect(labels).toContain("Apply changes directly");
    expect(labels).toContain("Instructions only");
  });
});

describe("layout presets", () => {
  it("validator accepts all nine presets and rejects unknown values", () => {
    expect(LAYOUT_PRESETS).toHaveLength(9);
    for (const p of LAYOUT_PRESETS) expect(isLayoutPreset(p.value)).toBe(true);
    expect(isLayoutPreset("figma-canvas")).toBe(false);
    expect(isLayoutPreset(undefined)).toBe(false);
  });

  it("auto adds no layout directive", () => {
    expect(applyPromptOptions(BASE, { layoutPreset: "auto" })).toBe(BASE);
  });

  it("each non-auto preset adds a distinct directive in build mode", () => {
    const presets = LAYOUT_PRESETS.filter((p) => p.value !== "auto");
    const outputs = presets.map((p) =>
      applyPromptOptions(BASE, {
        layoutPreset: p.value,
        promptIntent: "build",
      }),
    );
    expect(new Set(outputs).size).toBe(presets.length);
    for (const out of outputs) {
      expect(out).toContain("Layout preset: build the interface as");
      expect(out).toContain("required structural arrangement");
      expect(out).toContain(BASE);
    }
  });

  it("build mode guides structure strongly", () => {
    const out = applyPromptOptions(BASE, {
      layoutPreset: "sidebar-dashboard",
      promptIntent: "build",
    });
    expect(out).toContain("persistent left sidebar");
    expect(out).toContain("required structural arrangement");
    expect(out).not.toContain("ADVISORY ONLY");
  });

  it("retheme mode keeps the preset advisory and preserves structure", () => {
    const out = applyPromptOptions(BASE, {
      layoutPreset: "bento-grid",
      promptIntent: "retheme",
    });
    expect(out).toContain("Layout preference (ADVISORY ONLY)");
    expect(out).toContain("bento-box grid");
    expect(out).toContain("do NOT restructure the existing page");
    expect(out).toContain("preservation rules above take precedence");
    expect(out).toContain(
      "Only change the actual layout if the user explicitly asks",
    );
    // Must not read as a structural mandate.
    expect(out).not.toContain("required structural arrangement");
    // The retheme rules themselves still lead.
    expect(out).toContain("RETHEME ONLY");
    expect(out.indexOf("RETHEME ONLY")).toBeLessThan(
      out.indexOf("ADVISORY ONLY"),
    );
  });

  it("omitted layoutPreset adds nothing (backward compatible)", () => {
    expect(applyPromptOptions(BASE, { promptIntent: "build" })).toBe(BASE);
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
