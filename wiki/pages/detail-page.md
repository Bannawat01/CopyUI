# Detail Page

**Status: [implemented]**

## Location
`src/app/prompts/[slug]/page.tsx` (server component, `generateStaticParams`
pre-renders all **18** mock slugs) + `src/components/prompt-detail.tsx`
(client component holding the selected color state) +
`src/components/detail-header.tsx` (small client component wrapping the
title/description/tags block in an entrance animation — extracted out of
the server page because Framer Motion's `motion.*` components cannot be
referenced directly inside a Server Component file; see
[styling.md](styling.md) for the client-boundary rule this ran into).

## Behavior
- Visual preview (`PromptPreview`) reacts live to the selected color and is
  now the dominant element of the page: a 16:9 (`aspect-video`) screenshot-
  style mockup taking 3 of 5 grid columns on desktop (`md:grid-cols-5`,
  preview at `md:col-span-3`), bordered like a real template showcase frame
  rather than a small fixed-height box. The mockup is theme-specific
  (`preview.kind`) and matches the gallery card's preview exactly, so the
  two views read as the same product — see [gallery-page.md](gallery-page.md)
  and [prompt-system.md](prompt-system.md).
- Entrance motion: the header (eyebrow/title/description/tags, in a small
  client component `DetailHeader`), the preview, the color-picker panel,
  and the Copy Prompt panel each fade + rise in on mount with a slight
  stagger (header first, then preview at +0.05s, color panel at +0.15s,
  copy panel at +0.22s) so the page reads as one composed reveal rather
  than four independent blocks.
- Primary-color response: when the selected color changes, the preview's
  inner mockup remounts with a `key={color}` on a wrapping `motion.div`
  and does a quick opacity dip-and-recover (0.55 → 1 over 0.3s) — since a
  gradient/color swap can't be smoothly interpolated by CSS transitions
  across arbitrary hex values, this gives a tasteful "refresh" pulse
  instead of an instant, jarring recolor.
- Page container widened to `max-w-6xl` and switched to the same near-black
  background as the gallery (`bg-[#050505]`) for visual consistency across
  the two pages.
- An "UI Prompt Theme" eyebrow label above the title, plus a "Copy Prompt"
  section heading above the CTA card (which has a slightly stronger ring than
  the color-picker card), establish visual hierarchy between
  browse/customize/copy sections.
- `ColorControl` offers 7 preset swatches plus a native `<input type="color">`
  for a fully custom value. Swatches are grouped under `role="group"` +
  `aria-labelledby`, and the selected swatch exposes `aria-pressed`.
- `CopyPromptButton` is prominent, tinted with the selected primary color, and
  cycles through loading → success/error states (Framer Motion
  `AnimatePresence`) — see [copy-mechanism.md](copy-mechanism.md) for the
  full feedback design. The success state now has a distinct bouncier
  spring transition (`stiffness: 500, damping: 15`) versus the plain fade
  used for loading/error/idle, plus the button itself does a one-shot
  `scale: [1, 1.04, 1]` pulse on success — a small, deliberate
  "confirmation" motion distinguishing success from the other states,
  without looping or repeating.
- **Tool Mode**: a compact `ToolModeSelector` (`role="radiogroup"`, 3
  `role="radio"` buttons, `aria-checked`) sits above the Copy Prompt
  button, letting the user pick `v0.dev`, `Cursor`, or `GenVibe`
  (`src/lib/tool-modes.ts`, default `"v0"`). The selected mode is passed
  into `CopyPromptButton`, which sends it to the build API alongside
  `primaryColor`; the loading/success status text now says "Building a
  {tool} prompt…" / "Copied — tailored for {tool}" so the feedback
  reflects which tool the copied text was optimized for. See
  [copy-mechanism.md](copy-mechanism.md) for how tool mode changes the
  built prompt.
- Unknown slugs render Next's `notFound()` → 404.

## Variable customization
`primaryColor` and, as of this pass, **tool mode** are the two
customizable inputs (per CLAUDE.md's MVP scope — tool mode extends "Primary
Color" as an example of a selectable variable, not a departure from it).
Additional variables would extend `promptTemplate` placeholders in
[prompt-system.md](prompt-system.md) and the `ColorControl`-equivalent input.

## Inspiration backlog
Cult UI's "open in v0" one-click link (vs. copy-to-clipboard only) is a
source-backed idea for extending Tool Mode — see
[feature-ideas.md](feature-ideas.md) item #1 and
[competitor-inspiration.md](competitor-inspiration.md). Not yet
implemented.

## Related
- [overview.md](overview.md)
- [gallery-page.md](gallery-page.md)
- [copy-mechanism.md](copy-mechanism.md)
- [prompt-system.md](prompt-system.md)
- [feature-ideas.md](feature-ideas.md)
