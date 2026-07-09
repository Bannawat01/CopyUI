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
  dark: `Theme mode: DARK (fixed). Use the dark styling exactly as described in the brief below, as a single permanent theme. Do NOT add a light variant, do NOT use prefers-color-scheme, and do NOT follow the browser or OS theme — the UI must render dark for every user.

Contrast (dark): highlighted words in headings and the primary CTA's label must meet 4.5:1 against their own background — lighten the accent tint if it fails at small sizes rather than lowering opacity, and never render a filled CTA whose label blends into its fill.`,
  light: `Theme mode: LIGHT (fixed). Render a single permanent light theme: near-white base background, subtle gray surfaces one step darker for cards, dark text — keeping the brief's visual hierarchy, elevation logic (surface shifts + 1px borders, not heavy shadows), accent-color placement rules, and WCAG contrast ratios, re-derived for light surfaces rather than naively inverted. Use the primary/secondary/accent colors for the CTA fill, highlighted words, borders, and badges. This is NOT adaptive: do NOT use prefers-color-scheme, do NOT follow the browser or OS theme, and do NOT include a dark variant — the UI must render light for every user regardless of their system setting.

Contrast (light): the primary CTA's label must remain clearly legible against its filled background (4.5:1) — never a dark button with dark text, and never a filled button whose label inherits the page's dark text color. Highlighted words in headings must meet 4.5:1 against the light background; if the accent color is too pale on white, darken the tint rather than lowering opacity. Never use low-opacity dark text for important words (headline highlights, CTA labels, prices).`,
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
    "a mobile app screen — a visible phone/app-screen frame or narrow mobile viewport container (main app surface capped at roughly 390–430px wide), an app-like vertical structure, a fixed bottom tab/navigation bar, large touch targets (44px minimum), and the primary action placed in the thumb-reachable lower area",
};

/**
 * Real v0 output followed the mobile-app preset only weakly — it still
 * produced a desktop centered hero. These requirements are appended for
 * that preset in build mode, on top of the generic layout directive.
 */
const MOBILE_APP_REQUIREMENTS = `Mobile App Layout — hard requirements (do not soften these):
- Render a visible phone/app-screen frame, or a narrow mobile viewport container; the main app surface must be capped at roughly 390–430px wide and horizontally centered.
- Structure the content as an app screen stacked vertically (status/top bar → screen content → bottom bar), not as page sections across a wide canvas.
- Include a fixed bottom tab/navigation bar whenever the content plausibly supports one.
- The bottom navigation bar is for top-level DESTINATIONS only — items a person navigates to, such as Home, Search, Projects, Activity, or Settings. It must NEVER contain actions such as Submit, Save, Buy now, or Start free trial. Those are actions, not destinations.
- Do NOT place the primary call to action inside the bottom navigation bar. The primary CTA stays a distinct, visually dominant element on the screen; the bottom bar only moves the user between sections and must never outrank or absorb it.
- Bottom navigation labels and icons must remain clearly legible — real labels (single words where possible) with simple icons, at full contrast. Never render navigation labels faint, low-contrast, or icon-only-by-omission.
- Do NOT fake app navigation with a horizontal logo strip, a row of partner/brand marks, or a desktop-style top nav dressed up as a tab bar. A bottom navigation bar is a labeled set of destinations, nothing else.
- Partner, customer, and press logos are proof marks, not controls. Render them as quiet wordmarks: low-contrast or grayscale text/marks with no container. They must NOT look like tappable buttons — no filled background, no pill, no border, no card, no shadow, no rounded button chrome, and no hover or pressed styling. Inside a phone-like layout keep them visually subordinate and non-interactive, well below the primary CTA in visual weight, and never use them as app navigation.
- Place the primary action in the thumb-reachable lower area of the screen, with a touch target of at least 44px.
- Do NOT produce a wide desktop hero composition: no full-bleed edge-to-edge hero, no multi-column desktop layout, no wide centered marketing hero that merely happens to be responsive.
- This must visually read as a mobile app screen at first glance, not as a responsive desktop landing page.`;

/**
 * v0 claimed the headline highlight passed contrast while the rendered
 * result was visibly hard to read — opacity-based tints were the culprit.
 */
const HIGHLIGHT_CONTRAST_RULES = `Highlighted text (non-negotiable): the highlighted phrase in the headline must use a bright, fully-opaque, readable accent tint — pick a lighter or darker shade of the accent color so it clearly separates from the background. Never render the highlighted phrase, the CTA label, or any other important headline text with reduced opacity or a faded tint: do not use text-black/20, text-white/20, opacity-20, opacity-30, or any similar low-opacity utility on this text. If a color fails contrast, change the color value — never dim the text.`;

/** Appended in build mode so the model verifies its own output. */
function selfCheck(
  themeMode: ThemeMode | undefined,
  layoutPreset: LayoutPreset | undefined,
): string | null {
  const checks: string[] = [];
  if (layoutPreset && layoutPreset !== "auto") {
    const label = LAYOUT_PRESETS.find((p) => p.value === layoutPreset)?.label;
    checks.push(`- Does this visually read as ${label}?`);
  }
  checks.push("- Is the highlighted phrase clearly readable?");
  checks.push("- Is CTA text clearly readable?");
  if (themeMode) {
    checks.push(`- Is the theme fixed ${themeMode}?`);
  }
  if (checks.length === 0) return null;
  return `Final self-check before you finish — answer each, and fix the output if any answer is no:\n${checks.join("\n")}`;
}

function layoutDirective(
  preset: LayoutPreset,
  promptIntent: PromptIntent | undefined,
): string | null {
  if (preset === "auto") return null;
  const description = LAYOUT_DESCRIPTIONS[preset];

  if (promptIntent === "retheme") {
    return `Layout preference (ADVISORY ONLY): the user's preferred arrangement is ${description}. Because this is a retheme, do NOT restructure the existing page to match it — the preservation rules above take precedence. Treat this only as a hint for how visual styling (spacing rhythm, alignment, density, emphasis) should lean within the structure that already exists. Only change the actual layout if the user explicitly asks for layout changes.`;
  }

  return `Layout preset: build the interface as ${description}. This is the required structural arrangement — where the brief below describes a different layout, follow this preset for structure and use the brief for everything else (components, states, hierarchy, styling, accessibility). If the preset is an unusual fit for the brief's page type, adapt the brief's content into the preset rather than ignoring the preset — e.g. a marketing hero under Mobile App Layout becomes a phone-style landing screen with the same headline, subtext, and call to action, not a desktop centered hero.`;
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

/**
 * The base templates are written dark-first ("near-black", "text-white/70",
 * "Dark surface system"). Real v0 output showed those phrases overriding a
 * selected Light theme, because they arrive *after* the theme directive and
 * read as active requirements. When light mode is selected we rewrite them
 * in place so no dark-only instruction survives as a requirement.
 *
 * Best-effort text substitution over known phrasing — the final theme
 * override below is what actually guarantees the result.
 */
const LIGHT_SUBSTITUTIONS: [RegExp, string][] = [
  [/\bDark, high-contrast background\b/gi, "Light, high-contrast background"],
  [/\bDark surface system\b/gi, "Light surface system"],
  [/\bCalm, high-trust dark\b/gi, "Calm, high-trust light"],
  [/\bDark, low-glare\b/gi, "Light, low-glare"],
  [/\bDark, vibrant\b/gi, "Light, vibrant"],
  [/\bDark, editorial\b/gi, "Light, editorial"],
  [/\bVery dark\b/gi, "Very light"],
  [/\bpremium-dark\b/gi, "premium-light"],
  [/\bnear-black\b/gi, "near-white"],
  [/\bdark background\b/gi, "light background"],
  [/\bdark mode\b/gi, "light mode"],
  [/\bwhite text\b/gi, "dark text"],
  [/\btext-white\/\d+\b/g, "text-black/70"],
  [/\bone step lighter than the (page|background)\b/gi, "one step darker than the $1"],
  [/\bsurface one step lighter\b/gi, "surface one step darker"],
];

function neutralizeDarkLanguage(prompt: string): string {
  return LIGHT_SUBSTITUTIONS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    prompt,
  );
}

const THEME_OVERRIDES: Record<ThemeMode, string> = {
  light: `Final theme override: render this as a fixed light theme only. Ignore any dark-mode wording from the base brief.`,
  dark: `Final theme override: render this as a fixed dark theme only. Do not add a light variant or follow the browser theme.`,
  system: `Final theme override: render both themes, switching on prefers-color-scheme. Neither variant is the sole permanent theme.`,
  mono: `Final theme override: render this in a fixed monochrome neutral scale only. Ignore any accent-color hue wording from the base brief except for functional states.`,
};

const LAYOUT_OVERRIDE = `Final layout override: use the selected layout preset as the required structure. If the base brief describes a different layout, preserve the content requirements but adapt them into this layout.`;

/**
 * Trailing section, appended AFTER the base prompt so the user's explicit
 * choices are the last thing the model reads — the base template's own
 * theme/layout language can no longer win by being last.
 */
function finalOverrides(options: PromptOptions): string[] {
  const overrides: string[] = [];
  if (options.themeMode) overrides.push(THEME_OVERRIDES[options.themeMode]);

  // Retheme never gets layout mandates, highlight rewrites, or a self-check —
  // its preservation rules stay the last word.
  if (options.promptIntent !== "build") return overrides;

  const hasPreset = Boolean(
    options.layoutPreset && options.layoutPreset !== "auto",
  );
  if (hasPreset) {
    overrides.push(LAYOUT_OVERRIDE);
    if (options.layoutPreset === "mobile-app") {
      overrides.push(MOBILE_APP_REQUIREMENTS);
    }
  }

  if (hasPreset || options.themeMode) {
    overrides.push(HIGHLIGHT_CONTRAST_RULES);
    const check = selfCheck(options.themeMode, options.layoutPreset);
    if (check) overrides.push(check);
  }

  return overrides;
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
 * Composes intent rules, palette, theme, and layout directives around the
 * already-built base prompt, then repeats the user's theme/layout choices
 * as non-negotiable overrides *after* it. Runs server-side only.
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

  // Light mode: strip dark-only wording out of the base brief itself, so it
  // can't read as an active requirement that contradicts the chosen theme.
  sections.push(
    options.themeMode === "light"
      ? neutralizeDarkLanguage(basePrompt)
      : basePrompt,
  );

  sections.push(...finalOverrides(options));

  return sections.join("\n\n");
}
