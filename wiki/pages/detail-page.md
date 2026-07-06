# Detail Page

**Status: [implemented]**

## Location
`src/app/prompts/[slug]/page.tsx` (server component, `generateStaticParams`
pre-renders all 6 mock slugs) + `src/components/prompt-detail.tsx` (client
component holding the selected color state).

## Behavior
- Visual preview (`PromptPreview`) reacts live to the selected color; height
  scales down on mobile (`h-56` → `sm:h-72` → `md:h-full`).
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
  full feedback design.
- Unknown slugs render Next's `notFound()` → 404.

## Variable customization
Currently only `primaryColor` is customizable (per CLAUDE.md's MVP scope).
Additional variables would extend `promptTemplate` placeholders in
[prompt-system.md](prompt-system.md) and the `ColorControl`-equivalent input.

## Related
- [overview.md](overview.md)
- [gallery-page.md](gallery-page.md)
- [copy-mechanism.md](copy-mechanism.md)
- [prompt-system.md](prompt-system.md)
