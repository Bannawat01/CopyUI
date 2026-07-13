# Prompt Template System

**Status: [implemented — mock data, no persistence layer]**

## Storage format
`src/lib/prompts.ts` exports a local `PromptTheme[]` array, expanded from
6 to **18 mock themes**: the original 6 (saas-dashboard, landing-hero,
pricing-table, auth-form, portfolio-grid, changelog-feed) plus 12 new ones
(agency-landing, ai-chat-interface, analytics-command-center,
ecommerce-product-page, finance-dashboard, kanban-project-board,
docs-knowledge-base, mobile-app-landing, real-estate-listing,
restaurant-menu-page, event-conference-page, creator-link-in-bio).

Each item has `slug`, `title`, `description`, `tags`, a `category` (one of
12: Landing, Dashboard, SaaS, Ecommerce, AI, Portfolio, Docs, Form,
Mobile, Finance, Real Estate, Content — see [gallery-page.md](gallery-page.md)
for how this drives the pill filter), `preview` (gradient + label + a
`kind` discriminant, now 18 distinct kinds, one per theme, used to pick a
screenshot-like mock layout — see [styling.md](styling.md)), a `meta`
object (`creator`, `copies` — mock marketplace metadata, local display
data only, no accounts/backend), a `defaultPrimaryColor`, and a
`promptTemplate` string.

## Template content quality
Each `promptTemplate` is a structured instruction with 7 labeled sections:
product context, layout, **visual hierarchy**, components & states, design
language, responsive behavior, and accessibility. `{{primaryColor}}` is
injected at specific visual-accent points (buttons, active states,
highlights, focus rings) rather than mentioned once generically.

Refined again for real-world output quality, replacing vague adjectives
("clean," "modern," "bold" used alone) with concrete, actionable
specifics an AI code tool can act on directly:
- **Layout**: exact breakpoints, spacing scale (8px grid), max-widths,
  sidebar/card dimensions instead of "responsive grid."
- **Visual hierarchy**: an explicit new section per theme stating which
  element is dominant vs. secondary vs. tertiary (e.g. "price is the
  largest element in the pricing card; plan name is smaller and above it").
- **Components & states**: default/hover/active/disabled/loading/empty
  states called out per component, not just the component list.
- **Design language**: concrete elevation systems (surface-lighter-than-
  background instead of drop shadows), typography rules (one display
  weight, one body weight), and precise rules for *where* `{{primaryColor}}`
  is and isn't used, so it reads as a deliberate accent, not decoration.
- **Accessibility**: specific WCAG contrast ratios (4.5:1 text / 3:1 UI),
  concrete ARIA attributes and semantic elements (`<ol>`, `<table>`,
  `aria-pressed`, `aria-live`) rather than "keyboard accessible."

Intent: pasting the built output directly into v0.dev, Cursor, or GenVibe
should produce a result close to a real design brief, not a rough sketch.

The 12 new themes added during the dataset-expansion pass follow the same
7-section format and the same level of concreteness as the refined
original 6 (exact spacing/breakpoints, explicit dominant/secondary/
tertiary hierarchy, per-component states, precise `{{primaryColor}}`
placement rules, specific ARIA/contrast requirements) — they were
authored to the same bar, not as lighter-weight filler entries.

## Tool Mode
`src/lib/tool-modes.ts` adds a `ToolMode` type (`"v0" | "cursor" |
"genvibe"`) and `applyToolMode(basePrompt, toolMode?)`, which prepends a
tool-specific framing paragraph to a theme's already-built prompt text:
- `v0`: frames the brief for a visual UI generation model — layout
  composition, component selection (shadcn/ui primitives), Tailwind
  utility classes, responsive breakpoints; favors a single polished
  visual output over file-splitting or code-quality guidance.
- `cursor`: frames the brief for an AI coding agent — concrete
  file/component structure, App Router paths, TypeScript types, idiomatic
  React/Next.js patterns, brief code-quality notes.
- `genvibe`: frames the brief around creative direction — interaction
  texture (motion, easing, hover/press feedback), visual polish (depth,
  light, material), and emotional tone.

## Prompt Intent, Theme Mode, and multi-color palette (2026-07-09)
Driven by real user feedback: users wanted light/dark/black-white theme
switching, wanted to apply CopyUI styles to an **existing** frontend
(where AI tools were removing functions, breaking behavior, or generating
a disconnected new page), and wanted two- or three-color pages.

`src/lib/prompt-options.ts` (new, server-composed like tool modes):
- **`PromptIntent`** (`"build"` | `"retheme"`, default build). Retheme
  prepends a strict preservation block ("Task type: RETHEME ONLY"):
  preserve routes, functions (no remove/rename/rewrite), state logic,
  API calls, event handlers, component behavior, page structure, and
  navigation; change only visual styling/theme tokens/typography/
  spacing/colors; never generate a standalone replacement page. Build
  intent adds nothing — current behavior unchanged.
- **`ThemeMode`** (`dark` | `light` | `system` | `mono`): dark affirms
  the brief's styling; light instructs re-derivation for light surfaces
  (not naive inversion); system demands both themes via
  `prefers-color-scheme` with token-based colors; mono restricts to a
  neutral scale with weight/size for emphasis.
- **Palette**: optional `secondaryColor`/`accentColor` append a "Color
  palette:" section with distinct roles (secondary = supporting
  surfaces/secondary emphasis; accent = sparse high-attention moments)
  and a "primary stays dominant" rule. Omitted entirely when neither is
  set, so single-color prompts are unchanged.

`applyPromptOptions()` composes: retheme rules → action style →
palette → theme directive → base prompt; the API then wraps with the
tool-mode framing (so "Target tool:" is always the first line). The
base `promptTemplate` and `{{primaryColor}}` substitution are untouched.

### Refinements from real retheme testing (2026-07-09, live site)
Validation on the deployed saas-dashboard page surfaced two prompt bugs:
- **Light mode behaved like System**: the generated result still
  followed the browser theme. Directives rewritten — light and dark are
  now explicitly **fixed** themes ("do NOT use prefers-color-scheme, do
  NOT follow the browser or OS theme, regardless of their system
  setting"); only `system` carries adaptive instructions. Tests pin the
  distinction (fixed modes must not contain the positive "driven by
  prefers-color-scheme"/"implement BOTH" instructions).
- **Cursor gave advice instead of applying the retheme**. Added
  **`ActionStyle`** (`"apply"` | `"instruct"`, optional — omitted means
  no directive, backward compatible). `apply` + retheme instructs:
  inspect existing files first → ask "Do you want me to apply this
  retheme now?" if broad/risky → on confirmation apply only
  visual/theme changes while preserving routes/functions/state/API
  calls/handlers/behavior. `apply` + build says create/edit real files
  with a brief plan first. `instruct` forbids file edits and demands
  precise file-level guidance (advice-style output stays available for
  users who want it — feedback said it's acceptable when guidance is
  the goal). Cursor's framing also now tells it to follow the stated
  execution mode.

### Layout Presets (2026-07-09)
**`LayoutPreset`** in `prompt-options.ts`: `auto` (default, adds
nothing) plus 8 named arrangements — centered-hero, split-hero,
bento-grid, sidebar-dashboard, pricing-grid, card-grid, docs-layout,
mobile-app. Each has one structural description reused by both intents;
the *directive around it* differs:
- **Build new UI** → "Layout preset: build the interface as {description}.
  This is the **required structural arrangement** — where the brief
  describes a different layout, follow this preset for structure and use
  the brief for everything else."
- **Retheme existing UI** → "Layout preference (**ADVISORY ONLY**) … do
  NOT restructure the existing page to match it — the preservation rules
  above take precedence. Treat this only as a hint for how visual
  styling should lean within the structure that already exists. Only
  change the actual layout if the user explicitly asks."

Composed after the theme directive (so it sits below the retheme rules
it defers to). Invalid/missing values fall back to `auto`. This is the
deliberate **middle step before any Figma-style drag-and-drop editor**
— a select-a-value → server-composed-directive option, reusing the
existing architecture, no visual editor. Drag-to-arrange stays deferred.

#### Per-theme recommendations
`src/lib/layout-recommendations.ts` maps each theme's `preview.kind`
(one per theme, so no new `PromptTheme` field and nothing extra shipped
to the client) to its suitable presets — e.g. dashboard →
sidebar-dashboard/bento-grid/card-grid, pricing → pricing-grid/card-grid,
docs → docs-layout, linkbio → mobile-app/centered-hero.
`getGroupedLayoutPresets(kind)` returns `{ auto, recommended, other }`
for the selector. **Recommendations are a hint, not a restriction**:
every preset stays selectable (tests assert recommended + other + auto
equals the full list), so advanced users keep the odd pairings the
mapping merely de-emphasizes. Purely presentational — the built prompt
text is unchanged by this mapping.

### Conflict-safe composition (2026-07-09, from real v0 output)
Testing Startup Landing Hero on v0 with **Light + Mobile App Layout +
Build** exposed a composition bug: options were only *prepended*, so the
base template's own wording — "Dark, high-contrast background",
"near-black", `text-white/70`, "a centered marketing hero" — arrived
last and read as the active requirement. v0 produced a dark hero with an
invisible highlighted word and a blank-looking CTA, ignoring both the
Light theme and the preset.

Three fixes in `prompt-options.ts`:
1. **Final overrides appended after the base prompt**, so the user's
   choices are the last thing the model reads. Light emits exactly:
   *"Final theme override: render this as a fixed light theme only.
   Ignore any dark-mode wording from the base brief."* (dark/system/mono
   have their own.) Build + non-auto preset emits: *"Final layout
   override: use the selected layout preset as the required structure.
   If the base brief describes a different layout, preserve the content
   requirements but adapt them into this layout."* Retheme adds **no**
   layout override — the preset stays advisory.
2. **Light-mode sanitizer** (`neutralizeDarkLanguage()`): rewrites known
   dark-only phrases in the base brief in place (near-black → near-white,
   `text-white/70` → `text-black/70`, "Dark surface system" → "Light
   surface system", "one step lighter than the page" → "…darker…"). Only
   runs for light mode; dark and system keep their wording. Best-effort
   substitution over known phrasing — the final override is what
   guarantees the outcome.
3. **Contrast rules per theme** (both light and dark): CTA labels must
   stay legible against their fill (4.5:1, never dark-on-dark), heading
   highlights must meet 4.5:1, and important words must never use
   low-opacity text. Unusual preset/theme pairings now say to *adapt*
   rather than drop the preset (a marketing hero under Mobile App Layout
   becomes a phone-style landing screen).

### Tool modes expanded (same pass)
Users asked for more coding tools. Added `vscode` (VS Code / GitHub
Copilot), `claude-code`, and `windsurf` framings + captions in
`src/lib/tool-modes.ts` — prompt framing only, no integrations. All
three reference the execution mode so ActionStyle carries through.

### Tool-mode-adaptive copy button
`CopyPromptButton` reads `toolMode` to drive three things: its idle
label ("Copy for {tool}"), its loading/success `aria-live` status text,
and a small caption (`getToolModeCaption()` in `src/lib/tool-modes.ts`)
telling the user what to do with the copied text per tool. This
replaced an earlier separate `CopyForV0Button` secondary action (shown
only when Tool Mode was `v0`) that was removed after review — it ran the
exact same server-side build + clipboard flow as the main button, so two
buttons doing the same thing read as redundant rather than useful. See
[copy-mechanism.md](copy-mechanism.md) for the full flow and for why a
true "Open in v0" deep link was investigated and deferred rather than
faked.

Deliberately implemented as **one framing prefix per tool**, applied
server-side to the existing per-theme `promptTemplate`, rather than
authoring 18 × 3 = 54 separate templates. This keeps the per-theme
template as the single source of truth for the actual UI spec, while
still producing genuinely different final text per tool (verified via the
API — see below). `isToolMode()` validates the value; an invalid/missing
`toolMode` in the API request falls back to the untouched base prompt
(backward compatible with pre-tool-mode clients).

## Placeholder syntax
Templates use `{{variableName}}`, e.g. `{{primaryColor}}`. `buildPrompt()`
does a simple global regex replace (`\{\{(\w+)\}\}`) against a
`Record<string, string>` of variables.

## Keeping the template hidden
`promptTemplate` must never reach the client bundle or a server-rendered
page's HTML/RSC payload — that would defeat "hidden prompt" as a product
requirement:
- `getPublicPrompts()` returns a `PublicPromptTheme` (the full type minus
  `promptTemplate`) for the Gallery page and cards.
- The Detail page passes only `{ slug, preview, defaultPrimaryColor }` to the
  client `PromptDetail` component — never the raw prompt object.
- The actual template substitution happens server-side only, in the
  `/api/prompts/[slug]/build` route. See [copy-mechanism.md](copy-mechanism.md).
- Re-verified during the MVP polish pass (no data-model or route changes made
  that pass): confirmed via `curl` that raw template text still doesn't
  appear in either page's HTML.
- Re-verified again after the prompt-content rewrite: `promptTemplate` grew
  significantly longer/more structured, but the hidden-template guarantee is
  unaffected since it never touched `getPublicPrompts()` or what's passed to
  client components. Confirmed via `curl` (checking for the string "Product
  context:", which only appears inside `promptTemplate`) that none of the 6
  detail pages or the gallery page leak it.
- Re-verified once more after this output-quality refinement pass (same
  scope: text content only, no data-flow changes) — all 6 detail routes and
  the gallery page still return 200 with no "Product context:" match, and a
  direct `POST /api/prompts/[slug]/build` call confirms the refined template
  still substitutes `{{primaryColor}}` correctly.
- Re-verified again after the visual marketplace redesign: the new `meta`
  field (`creator`, `copies`) was added to `getPublicPrompts()`'s output
  deliberately — it's mock display data, not the hidden template, so it's
  safe to ship to the client and does appear in gallery card HTML by
  design. `promptTemplate` itself was untouched by this pass; `curl` across
  the gallery page and all 6 detail routes still shows no "Product
  context:" match.
- Re-verified after expanding the dataset from 6 to 18 themes: the new
  `category` field was likewise added to `getPublicPrompts()` deliberately
  (it drives the gallery pill filter and is safe public data). `curl`
  across the gallery page and all **18** detail routes (`/prompts/<slug>`
  for every slug, including all 12 new ones) confirms none of them contain
  "Product context:" — the hidden-template guarantee held through the
  3x-larger dataset without any changes to `getPublicPrompts()`'s
  omission logic or the Detail page's prop-passing.
- Re-verified after adding Tool Mode: neither the base `promptTemplate`
  text ("Product context:") nor the tool-specific framing text ("Target
  tool:") appears anywhere in gallery/detail HTML — `applyToolMode()` only
  runs inside the `/api/prompts/[slug]/build` route handler, never in a
  component. Directly `POST`ing the build API with `toolMode: "v0"` /
  `"cursor"` / `"genvibe"` confirms each produces distinct, correctly
  prefixed output, and omitting `toolMode` still returns the plain base
  prompt (backward compatible).
- Re-verified after adding the "Copy for v0" action: `curl` against the
  gallery page and the detail page confirms no "Product context:" match;
  the new button's own `POST` (with `toolMode: "v0"` hard-coded) returns
  the same server-built, correctly framed text as the main Copy Prompt
  button — no separate code path that could accidentally expose the
  template differently.
- Re-verified after removing that secondary button and folding its
  behavior into the main `CopyPromptButton`'s adaptive label/caption:
  `curl` against the gallery page and the detail page still shows no
  "Product context:" match, and a direct `POST` with `toolMode: "cursor"`
  confirms the build API is unchanged and still returns correctly framed
  text. The label/caption changes are presentation-only — no new prop
  or data ever carries `promptTemplate` client-side.

## Generated Examples (public metadata, 2026-07-10)
`src/lib/generated-examples.ts` describes, per prompt, the *direction* the
prompt is designed to produce: outcome summary, schematic layout, key
elements, best-for cases, suggested tool modes, visual notes, and an optional
note on where a run tends to drift.

**It is public, hand-written copy — not derived from `promptTemplate`.** That
distinction is the whole safety story: it ships to the browser, so it must
never be a summary of the hidden template. Tests assert it contains no
template markers and never reproduces any template's opening line, and the
`curl` check on a live detail page confirms `Product context:` and
`Context of use:` still return zero matches.

It is rendered as labelled schematic blocks, never a fake screenshot, and an
honesty guard fails the build if the copy ever claims guaranteed or identical
output. Per-prompt content is English-only in v1; the section chrome is
localized.

### Generated Examples: real-output validation (2026-07-10)
First validation pass against v0.dev. **3 of 18 examples are now backed by
observed output rather than predicted direction**, and **none needed
correcting**:

| Prompt / options | Result |
| --- | --- |
| Pricing Table / Light / Pricing Grid | Matched the pricing-grid direction; visually strong |
| AI Chat Interface / Dark / Mobile App Layout | Theme held; followed the mobile-app direction |
| E-commerce Product Page / Light / Card Grid | Matched very well — better than expected |

The examples were written from the templates' *intent*, so this pass is the
first evidence the intent and the output actually agree. The remaining **15 are
still direction-only** — honest, but unobserved. Validate opportunistically as
users test prompts; keep the wording direction-setting regardless of how many
get confirmed, because a validated example is still not a guaranteed one.

Side effect worth recording: **Light now has two independent passing runs** and
**Mobile App Layout has held on a second, unrelated prompt**. Both were the
original failure cases that motivated conflict-safe composition.

### Retheme + Layout Preset: advisory rule tested (2026-07-10)
**Claude Code: Retheme layout preset advisory behavior held, n=1.**

The advisory-only treatment of layout presets in Retheme mode was, until now,
the preservation guarantee with *zero* real-world evidence. Tested by rethemeing
CopyUI's own homepage — a wide desktop marketplace grid — with **Mobile App
Layout** selected, deliberately the most structurally hostile preset available.
Prompt generated through the real build API (`retheme / apply / dark /
mobile-app / claude-code / #ca8a04`, template `restaurant-menu-page`).

Result: **7-line diff, every line a `className` edit.** No JSX structure
changes; no routes, handlers, state, API calls, i18n keys, or components
touched. No phone frame, no 390–430px cap, no bottom tab bar — no structural
leakage at all. Tests 160/160, lint clean. The built prompt also carried only
the advisory hint, never the `Mobile App Layout — hard requirements` block,
confirming the build-mode gate in `finalOverrides()` holds on the real API path.

**This is charitable evidence, not proof.** The tool under test was also the
judge: Claude Code executed a prompt it knew was a test, and the advisory
wording was written by the same model family. It says nothing about Cursor,
Windsurf, or VS Code / Copilot. n=1. Do not generalize this to "Retheme layout
presets are safe" — the trust copy stays exactly as written.

## Quality checklist (detail page)
The detail page's `QualityChecklist` panel (production pass, 2026-07-09)
advertises the six template section names as a trust signal. It's a
hardcoded static list in `src/components/quality-checklist.tsx` — it does
not read `promptTemplate` or any prompt data, so it can't leak anything.

## Real-world validation
**2026-07-09 — Startup Landing Hero / v0.dev / Build / Dark / Mobile App
Layout: PASSED.** The conflict-safe composition works. Dark theme held,
and the output now visually reads as a phone/app screen at first glance
— visible phone-like frame, narrow mobile viewport, mobile-first vertical
composition, clear CTA, readable accent highlight. A major improvement
over the earlier desktop-centered hero.

No bottom tab bar appeared, which is **acceptable and arguably correct**
here: a single-section landing hero has no real top-level app
destinations, and the prompt now forbids inventing fake ones (nav bars
carry destinations, not actions — see the Mobile App Layout hard
requirements). Minor refinement outstanding: partner logos render as
tappable buttons rather than quiet wordmarks.

This is the first validation confirming that **final overrides appended
after the base brief** actually beat the template's own conflicting
language in a real tool, not just in tests.

**2026-07-09 — all three priority cases PASSED. This closes the first
major prompt-option validation pass.**

| Case | Result |
| --- | --- |
| Startup Landing Hero / Light / Mobile App Layout | PASSED |
| Analytics Dashboard / Dark / Sidebar Dashboard | PASSED |
| Retheme existing UI / Light / Apply Directly (Cursor / Claude Code style workflow) | PASSED |

What this establishes:
- **Theme Mode now works across the tested cases** — Light is honored as
  a fixed theme, closing the original failure where it behaved like
  System. The light-mode dark-phrase sanitizer and the final theme
  override are confirmed in real output, not only in tests.
- **Mobile App Layout produces a phone-like app screen** rather than a
  desktop hero — now confirmed under Light as well as Dark.
- **Sidebar Dashboard** yields the correct structure for dashboard-style
  prompts, so layout presets generalize beyond `mobile-app`.
- **Retheme Mode preserves existing structure** while applying the
  intended visual changes.

The conflict-safe composition order (retheme rules → action style →
palette → theme → layout → sanitized base brief → final overrides) is
now validated end-to-end rather than assumed.

## Context of use (2026-07-09)
Every one of the 18 hidden templates opens with `Product context:` and
then a `Context of use:` paragraph naming four things: **who** uses the
UI, **what moment or task** they're in, **what decision or action** the
UI must support, and **what success looks like** as an observable
outcome (e.g. "an unusual KPI trend is noticed within roughly 10 seconds
of the page painting").

`Product context:` describes what the screen *is*. `Context of use:`
describes who is looking at it and what they're trying to decide — the
missing basis for the tradeoffs the rest of the brief demands. The
wording is deliberately theme-neutral (no light/dark or color language)
so the light-mode sanitizer and the final overrides are unaffected.

**2026-07-10 — first post-context-of-use v0 run: non-breaking.** Startup
Landing Hero / v0.dev / Build / Dark / Mobile App Layout (deliberately the
same combination as the earlier validation, so the two are comparable) still
produces the phone-like Mobile App Layout. The extra opening text did not
crowd out the final theme/layout overrides — the main risk of adding prose
ahead of the base brief.

Two things remain unjudged, and both matter more than "non-breaking":
- **[uncertain]** Whether headline and value-proposition copy *improved*,
  stayed similar, or regressed versus the pre-context output. The entire
  justification for the context-of-use pass rests on this, and it has not
  been compared side by side.
- **[uncertain]** Whether partner logos still render as tappable buttons.
  The wording fix was never made, so assume the defect persists.
The AI Chat Interface template (v0.dev tool mode) was tested against
actual v0.dev output for the first time on 2026-07-07 — prior passes had
only been judged by reading the template text. Result: it worked
successfully without needing immediate changes, so the current prompt
structure/content is being kept as-is for now. Further template
refinement should be driven by real failed outputs or specific observed
quality gaps, not speculative rewriting. See [log.md](../log.md).

## Inspiration backlog
shadcn's registry-item schema (`cssVars`, `dependencies`) is a structured
precedent for describing a themed UI as data — a weak but real signal
that CopyUI's `{{primaryColor}}`-only customization could extend to more
named tokens later. Superdesign UI Design Prompts (the source requested
for direct prompt-quality research) was not found among the processed
clips — see [prompt-quality.md](prompt-quality.md) for the gap and what
was captured instead.

## Related
- [copy-mechanism.md](copy-mechanism.md)
- [detail-page.md](detail-page.md)
- [gallery-page.md](gallery-page.md)
- [prompt-quality.md](prompt-quality.md)
- [shadcn-patterns.md](shadcn-patterns.md)
