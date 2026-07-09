/**
 * Prompt Intent, Theme Mode, and multi-color palette handling.
 * Everything here composes the SERVER-built prompt text — none of it
 * ever exposes the hidden promptTemplate to the client.
 */

export type PromptIntent = "build" | "retheme";

export const PROMPT_INTENTS: {
  value: PromptIntent;
  label: string;
  description: string;
}[] = [
  {
    value: "build",
    label: "Build new UI",
    description: "Generate a fresh interface from this prompt.",
  },
  {
    value: "retheme",
    label: "Retheme existing UI",
    description:
      "Apply this style to an existing frontend while preserving logic and behavior.",
  },
];

export function isPromptIntent(value: unknown): value is PromptIntent {
  return value === "build" || value === "retheme";
}

export type ThemeMode = "dark" | "light" | "system" | "mono";

export const THEME_MODES: { value: ThemeMode; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "mono", label: "Monochrome" },
];

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    value === "dark" ||
    value === "light" ||
    value === "system" ||
    value === "mono"
  );
}

/**
 * Strict preservation rules prepended when the user is restyling an
 * existing frontend. Written to counter the observed failure modes:
 * AI tools removing functions, breaking behavior, or generating a
 * disconnected new page instead of restyling the current one.
 */
const RETHEME_RULES = `Task type: RETHEME ONLY — apply the visual style described below to the EXISTING frontend. This is a restyling task, not a rebuild.

Strict preservation rules (non-negotiable):
- Preserve every existing route and URL exactly as it is.
- Preserve all existing functions — do not remove, rename, or rewrite any function.
- Preserve all state logic (stores, hooks, reducers, context) unchanged.
- Preserve all API calls, data fetching, and their error handling unchanged.
- Preserve all event handlers and their wiring unchanged.
- Preserve each component's behavior and props contract.
- Preserve the existing page structure and component hierarchy unless a change is explicitly requested.
- Do NOT generate a new standalone page or replace the app with different markup — restyle what is already there.
- Do NOT break existing navigation or links between connected pages.

What you SHOULD change: visual styling only — theme tokens/CSS variables, color values, typography, spacing, border radii, shadows/elevation, and other presentation-layer details, guided by the design brief below. Treat the brief's structural/layout sections as a description of the visual style to apply, not as instructions to rebuild the layout.`;

const THEME_DIRECTIVES: Record<ThemeMode, string> = {
  dark: `Theme mode: dark. Use the dark styling exactly as described in the brief below.`,
  light: `Theme mode: LIGHT. Override the dark-mode styling described below: render on light backgrounds (near-white base, subtle gray surfaces one step darker for cards) with dark text, while keeping the same visual hierarchy, elevation logic (surface shifts + 1px borders, not heavy shadows), accent-color placement rules, and WCAG contrast ratios. Do not simply invert colors — re-derive them for a light surface system.`,
  system: `Theme mode: system/adaptive. Implement BOTH a dark and a light theme driven by the user's OS preference (prefers-color-scheme), with the dark variant following the brief below and the light variant re-derived for light surfaces (not naive inversion). Define colors as theme tokens/CSS variables so both modes share one structure, and keep contrast ratios valid in both.`,
  mono: `Theme mode: monochrome. Render the design in a strict black/white/gray palette: use shades of a single neutral scale for all surfaces, text, and borders. Where the brief assigns an accent color to an element, use the strongest neutral contrast (pure white or near-black) plus weight/size instead of hue to create emphasis. Color may only be used for functional states (errors, success) if omitting it would harm usability.`,
};

export type PromptOptions = {
  secondaryColor?: string;
  accentColor?: string;
  themeMode?: ThemeMode;
  promptIntent?: PromptIntent;
};

function paletteDirective(
  secondaryColor?: string,
  accentColor?: string,
): string | null {
  if (!secondaryColor && !accentColor) return null;
  const lines = [
    `Color palette: this design uses a multi-color palette. Where the brief below references the primary color, apply the full palette deliberately:`,
  ];
  if (secondaryColor) {
    lines.push(
      `- Secondary color ${secondaryColor}: use for supporting surfaces and secondary emphasis — section backgrounds/tints, secondary buttons, inactive-but-notable states, and chart/data series after the primary. It must support, never compete with, the primary.`,
    );
  }
  if (accentColor) {
    lines.push(
      `- Accent color ${accentColor}: use sparingly for small high-attention moments — badges, notification dots, highlights, one key metric or callout per view. Never use it for large fills or body text.`,
    );
  }
  lines.push(
    `Keep the primary color dominant; secondary and accent are subordinate. All palette colors must still meet the contrast requirements stated in the brief.`,
  );
  return lines.join("\n");
}

/**
 * Composes intent rules, palette, and theme directives around the
 * already-built base prompt. Runs server-side only.
 */
export function applyPromptOptions(
  basePrompt: string,
  options: PromptOptions = {},
): string {
  const sections: string[] = [];

  if (options.promptIntent === "retheme") {
    sections.push(RETHEME_RULES);
  }

  const palette = paletteDirective(options.secondaryColor, options.accentColor);
  if (palette) sections.push(palette);

  if (options.themeMode) {
    sections.push(THEME_DIRECTIVES[options.themeMode]);
  }

  sections.push(basePrompt);
  return sections.join("\n\n");
}
