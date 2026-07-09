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

/**
 * Light and dark are FIXED themes — only "system" may follow the
 * browser/OS preference. Written after real-output feedback where a
 * Light selection still produced a system-following theme.
 */
const THEME_DIRECTIVES: Record<ThemeMode, string> = {
  dark: `Theme mode: DARK (fixed). Use the dark styling exactly as described in the brief below, as a single permanent theme. Do NOT add a light variant, do NOT use prefers-color-scheme, and do NOT follow the browser or OS theme — the UI must render dark for every user.`,
  light: `Theme mode: LIGHT (fixed). Render a single permanent light theme: near-white base background, subtle gray surfaces one step darker for cards, dark text — keeping the brief's visual hierarchy, elevation logic (surface shifts + 1px borders, not heavy shadows), accent-color placement rules, and WCAG contrast ratios, re-derived for light surfaces rather than naively inverted. This is NOT adaptive: do NOT use prefers-color-scheme, do NOT follow the browser or OS theme, and do NOT include a dark variant — the UI must render light for every user regardless of their system setting.`,
  system: `Theme mode: system/adaptive. This is the ONLY mode that follows the user's OS/browser preference: implement BOTH a dark and a light theme driven by prefers-color-scheme, with the dark variant following the brief below and the light variant re-derived for light surfaces (not naive inversion). Define colors as theme tokens/CSS variables so both modes share one structure, and keep contrast ratios valid in both.`,
  mono: `Theme mode: monochrome (fixed). Render the design in a strict black/white/gray palette: use shades of a single neutral scale for all surfaces, text, and borders. Where the brief assigns an accent color to an element, use the strongest neutral contrast (pure white or near-black) plus weight/size instead of hue to create emphasis. Color may only be used for functional states (errors, success) if omitting it would harm usability. Do not follow the browser or OS theme.`,
};

/**
 * Layout Presets — the deliberate middle step before any Figma-style
 * drag-and-drop editor: a named structural arrangement, composed
 * server-side like every other prompt option. "auto" adds nothing.
 */
export type LayoutPreset =
  | "auto"
  | "centered-hero"
  | "split-hero"
  | "bento-grid"
  | "sidebar-dashboard"
  | "pricing-grid"
  | "card-grid"
  | "docs-layout"
  | "mobile-app";

export const LAYOUT_PRESETS: { value: LayoutPreset; label: string }[] = [
  { value: "auto", label: "Auto / Best fit" },
  { value: "centered-hero", label: "Centered Hero" },
  { value: "split-hero", label: "Split Hero" },
  { value: "bento-grid", label: "Bento Grid" },
  { value: "sidebar-dashboard", label: "Sidebar Dashboard" },
  { value: "pricing-grid", label: "Pricing Grid" },
  { value: "card-grid", label: "Card Grid" },
  { value: "docs-layout", label: "Docs Layout" },
  { value: "mobile-app", label: "Mobile App Layout" },
];

export function isLayoutPreset(value: unknown): value is LayoutPreset {
  return LAYOUT_PRESETS.some((p) => p.value === value);
}

/** Structural description per preset, shared by build and retheme modes. */
const LAYOUT_DESCRIPTIONS: Record<
  Exclude<LayoutPreset, "auto">,
  string
> = {
  "centered-hero":
    "a centered single-column hero — content stacked and horizontally centered within a constrained max-width (around 720px), with generous vertical rhythm and the primary action directly beneath the headline",
  "split-hero":
    "a split two-column hero — copy and the primary call to action on one side, a visual (product shot, mockup, or illustration) on the other, balanced on a shared vertical center, collapsing to a single stacked column on mobile with the visual first",
  "bento-grid":
    "a bento-box grid — tiles of deliberately varied sizes (some spanning two columns or two rows) packed into a dense, asymmetric but aligned grid, each tile a self-contained unit with its own heading and content",
  "sidebar-dashboard":
    "an application shell — a persistent left sidebar for navigation plus a top bar, with the main content on a multi-column grid; the sidebar collapses to an icon rail on medium screens and a drawer on mobile",
  "pricing-grid":
    "a tier comparison grid — equal-width plan cards aligned to a shared baseline in a single row, with the recommended tier visually elevated, and a billing-period toggle above them",
  "card-grid":
    "a uniform responsive card grid — equally sized cards flowing across 3 columns on desktop, 2 on tablet, and 1 on mobile, with consistent gutters and no masonry offsets",
  "docs-layout":
    "a three-column documentation layout — a navigation tree on the left, article content in a readable centered column (around 720px), and an 'on this page' table of contents on the right that collapses on smaller screens",
  "mobile-app":
    "a mobile-first app layout — a narrow centered column sized for a phone viewport, a fixed bottom navigation bar or tab bar, large touch targets (44px minimum), and thumb-reachable primary actions",
};

function layoutDirective(
  preset: LayoutPreset,
  promptIntent: PromptIntent | undefined,
): string | null {
  if (preset === "auto") return null;
  const description = LAYOUT_DESCRIPTIONS[preset];

  if (promptIntent === "retheme") {
    return `Layout preference (ADVISORY ONLY): the user's preferred arrangement is ${description}. Because this is a retheme, do NOT restructure the existing page to match it — the preservation rules above take precedence. Treat this only as a hint for how visual styling (spacing rhythm, alignment, density, emphasis) should lean within the structure that already exists. Only change the actual layout if the user explicitly asks for layout changes.`;
  }

  return `Layout preset: build the interface as ${description}. This is the required structural arrangement — where the brief below describes a different layout, follow this preset for structure and use the brief for everything else (components, states, hierarchy, styling, accessibility).`;
}

export type ActionStyle = "instruct" | "apply";

export const ACTION_STYLES: {
  value: ActionStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "apply",
    label: "Apply changes directly",
    description:
      "The tool should inspect the code, confirm, then make the edits itself.",
  },
  {
    value: "instruct",
    label: "Instructions only",
    description: "The tool should explain the changes without editing files.",
  },
];

export function isActionStyle(value: unknown): value is ActionStyle {
  return value === "instruct" || value === "apply";
}

/**
 * Written after Cursor testing: a retheme prompt produced advice instead
 * of edits. "apply" makes direct application explicit (inspect first,
 * confirm if risky, then edit); "instruct" makes advice-only explicit.
 */
function actionStyleDirective(
  actionStyle: ActionStyle,
  promptIntent: PromptIntent | undefined,
): string {
  if (actionStyle === "instruct") {
    return `Execution mode: INSTRUCTIONS ONLY. Do not edit any files. Explain the exact changes as precise, file-level guidance (which files, which tokens/classes/values to change and to what) so a developer can apply them manually.`;
  }
  if (promptIntent === "retheme") {
    return `Execution mode: APPLY THE CHANGES DIRECTLY. Do not stop at advice — make the edits yourself, in this order:
1. First inspect the existing files and components involved, so changes are grounded in the real code.
2. If the change set is broad or risky, ask for confirmation first: "Do you want me to apply this retheme now?"
3. Once confirmed (or if the changes are small and safe), apply ONLY the visual/theme changes — while preserving all routes, functions, state logic, API calls, event handlers, and component behavior, and without replacing the app with a disconnected new page.`;
  }
  return `Execution mode: APPLY THE CHANGES DIRECTLY. Do not stop at advice — create and edit the actual files in the workspace. If the change set is large, state a brief file-level plan first, then implement it.`;
}

export type PromptOptions = {
  secondaryColor?: string;
  accentColor?: string;
  themeMode?: ThemeMode;
  promptIntent?: PromptIntent;
  actionStyle?: ActionStyle;
  layoutPreset?: LayoutPreset;
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

  if (options.actionStyle) {
    sections.push(
      actionStyleDirective(options.actionStyle, options.promptIntent),
    );
  }

  const palette = paletteDirective(options.secondaryColor, options.accentColor);
  if (palette) sections.push(palette);

  if (options.themeMode) {
    sections.push(THEME_DIRECTIVES[options.themeMode]);
  }

  if (options.layoutPreset) {
    const layout = layoutDirective(options.layoutPreset, options.promptIntent);
    if (layout) sections.push(layout);
  }

  sections.push(basePrompt);
  return sections.join("\n\n");
}
