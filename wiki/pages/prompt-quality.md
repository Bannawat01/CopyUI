# Prompt Quality Inspiration

**Status: [synthesized — source gap CLOSED 2026-07-09]**

The Superdesign source this page previously recorded as missing has been
clipped, along with two Vercel v0 guides, the W3C contrast criterion, and
Apple's tab-bar guidance. Five clips processed; concise rules below,
ordered by what CopyUI's prompt composition actually needs.

## v0 prompting best practices
*Sources: `How to prompt v0.md` (Vercel), `Maximizing outputs with v0…`
(Vercel), `UI Design Prompts…` (Superdesign)*

- **Three inputs make a good v0 prompt** (Vercel's framework): **product
  surface** (the actual components, data, and actions — not "a
  dashboard"), **context of use** (who uses it, in what moment, to make
  what decision), and **constraints & taste** (platform/device, visual
  tone, layout assumptions). Vercel reports specific prompts generate
  30–40% faster with less unnecessary code.
- **Constraints tell v0 what *not* to invent.** Omit them and it guesses;
  it "optimizes for assumed usage."
- **A label produces the average of that label.** Superdesign's diagnosis
  of generic AI UI: "Build a clean, modern dashboard" is a label, so you
  get the purple gradient, the centered hero, and three icon cards. Name
  one aesthetic and a real reference instead — and **never say "clean and
  modern."**
- **Superdesign's four-part context block**: TARGET (what good looks
  like), CONVENTIONS (stack and tokens), CONSTRAINTS (the rules), SCOPE
  (this task only, do not redesign anything else). Its constraint list is
  strikingly close to CopyUI's own: 8px grid, one accent used sparingly,
  AA contrast on all text, hover/focus-visible/disabled on every
  interactive element, and shipping empty/loading/error states rather
  than the happy path only.
- **Prompts are tool-dialects.** Superdesign: "a prompt that sings in one
  tool is mediocre in another" (v0, Lovable, Figma Make, Cursor each want
  a different shape). Independent validation of CopyUI's Tool Mode
  framing-prefix approach — see [prompt-system.md](prompt-system.md).
- **Scope discipline**: "Build only [the one screen]. Do not redesign
  anything else." Directly parallels CopyUI's retheme preservation rules.

**Where CopyUI already complies**: the 7-section `promptTemplate` covers
product context, layout, hierarchy, components & states, design language,
responsive behavior, and accessibility — Vercel's three inputs are a
subset. **Gap worth noting**: CopyUI's templates are strong on product
surface and constraints but comparatively thin on *context of use* (who
uses this, in what moment, to make what decision). Some templates open
with it; not all do.

## Highlight and CTA contrast rules
*Source: `Understanding Success Criterion 1.4.3…` (W3C WAI). The WebAIM
clip is a live checker tool, not guidance — left unprocessed.*

- **4.5:1** for normal text; **3:1** for large-scale text, defined as
  **≥18pt, or ≥14pt bold** (roughly 1.5em / 1.2em bold).
- **Thresholds are not rounded**: 4.499:1 fails 4.5:1. A tool reporting
  "passes" on a rounded number is reporting wrongly.
- **Logos/logotypes are exempt** — but *not* when they act as interactive
  controls (a link, a button). Then contrast applies.
- Rationale: 4.5:1 compensates for ~20/40 acuity, typical of an 80-year-
  old. This is a legibility floor, not a style preference.

**Why this matters to CopyUI**: real v0 output produced a headline
highlight that "passed contrast" per the model yet was visibly unreadable
— because the tint was applied via *opacity*, not a color value. The
lesson now encoded in `prompt-options.ts`: **if a color fails contrast,
change the color value — never dim the text.** A headline highlight is
usually large-scale text (3:1 floor), but the CTA *label* is normal text
and must clear 4.5:1 against its own fill.

## Bottom navigation / tab bar requirements
*Source: `Tab bars.md` (Apple Human Interface Guidelines)*

- **Navigation, not actions.** A tab bar switches between top-level
  sections; controls acting on the current view belong in a toolbar.
- **Keep it visible** across sections — hiding it makes people lose their
  place. Only a modal may cover it.
- **Few tabs, always enabled.** Avoid overflow/"More" tabs. Never disable
  or hide a tab button when its content is empty — explain the emptiness
  inside the section instead. An unstable tab bar reads as a broken app.
- **Always label tabs** (single words where possible); icon above label in
  compact width, beside it in regular.
- **Badges only for critical information**, or they lose meaning.
- **Don't let tab labels blend into the content behind them** — prefer a
  monochromatic bar, or an accent with real visual separation.

## Phone-like viewport composition
*Sources: `Tab bars.md` (Apple HIG), `Material Design 3 - Navigation
Bar.md` (hand-written note citing m3.material.io)*

- M3 frames a navigation bar as a component for switching UI views on
  **smaller/handheld devices** — its presence is itself a phone signal.
- Required cues for a screen to read as an app rather than a responsive
  desktop section: a narrow app surface / phone-like viewport, mobile-
  first vertical composition, 44px minimum touch targets, thumb-reachable
  primary actions, a bottom tab bar where it fits, compact app-style
  content regions, and **no wide desktop hero composition**.
- Prompt wording that works: *"This must visually read as a mobile app
  screen at first glance, not as a responsive desktop landing page."*
  and *"Build within a narrow phone-like app surface … centered in the
  viewport when shown on desktop."*

**[caveat]** The 390–430px figure now in `prompt-options.ts` also appears
in this note, but the note is **hand-written by us**, not clipped from
M3 — the number still traces back to common device widths, not to a
primary source. Treat it as a reasonable convention, not a citation. The
two auto-clipped M3 navigation-bar files remain near-empty.

## Bottom navigation vs primary actions
*Source: `Material Design 3 - Navigation Bar.md`*
- **Bottom navigation is for destinations, not actions.** Home, Search,
  Projects, Activity, Settings are destinations. Submit, Save, Buy now,
  Start free trial are actions and must never be tabs. (Agrees with
  Apple's "tab bar supports navigation, not actions.")
- **The nav bar must not absorb or outrank the CTA.** If a screen has a
  primary CTA it stays visually dominant; the bar only moves people
  between sections.
- **Navigation labels stay readable** — clear labels, simple icons, never
  faint or low-contrast. Same failure mode as the headline-highlight bug:
  legibility lost to dimming.

## What to avoid when a tool turns Mobile App Layout into a desktop hero
*Source: `Material Design 3 - Navigation Bar.md`* — the observed v0
failure, enumerated:
- A desktop centered hero when Mobile App Layout is selected.
- Wide max-width desktop sections.
- Bottom navigation repurposed as CTA buttons.
- Hidden or low-contrast navigation labels.
- Horizontal desktop-style logo strips masquerading as app navigation.
- Silently replacing the selected preset with the base template's layout.

## Related
- [prompt-system.md](prompt-system.md)
- [feature-ideas.md](feature-ideas.md)
- [shadcn-patterns.md](shadcn-patterns.md)
- [next-actions.md](next-actions.md)
