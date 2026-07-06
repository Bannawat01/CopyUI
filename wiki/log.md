# CopyUI Wiki Log

## [2026-07-06] init | Wiki created
- Files checked: CLAUDE.md
- Wiki pages updated: index.md, overview.md, gallery-page.md, detail-page.md, prompt-system.md, copy-mechanism.md, styling.md, known-issues.md, next-actions.md
- Notes: Project has no app code yet (CLAUDE.md only). All feature pages created as planned-scope stubs based on CLAUDE.md's MVP description, not observed code.

## [2026-07-06] mvp-build | First working Next.js MVP implemented
- Scaffolded Next.js 16 (App Router, TypeScript, Tailwind v4) into a temp
  folder (`create-next-app`) and merged it into this repo, preserving
  CLAUDE.md and wiki/. Ran `shadcn init` + added button/card/badge/input/
  separator; installed framer-motion and lucide-react.
- Built: Gallery page (`/`) with hero + client-side search/filter over 6 mock
  prompt themes; Detail page (`/prompts/[slug]`) with color customization,
  live preview, and a Copy Prompt button with animated success/error
  feedback. Forced dark mode via `<html class="dark">`.
- Data model: `src/lib/prompts.ts` — 6 mock `PromptTheme` entries with
  `{{primaryColor}}`-style placeholder templates.
- Fixed a real leak found during manual verification: passing the full
  prompt object (including `promptTemplate`) into a client component embeds
  it in the page's HTML/RSC payload, defeating "hidden prompt" — moved
  template substitution server-side into `POST /api/prompts/[slug]/build`,
  and gallery/detail pages now only ever receive template-free prompt data.
  Verified via `curl` that neither page's HTML contains template text.
- Quality: `rtk npm run lint` clean (0 errors/warnings after excluding
  `wiki/**`, an Obsidian vault, from eslint's scan), `rtk npm run build`
  clean (all 6 prompt detail routes statically prerendered).
- RTK: used `rtk npm run lint` (saved ~45% tokens per run) and
  `rtk npm run build`; `rtk gain` showed 21 tracked commands this session,
  ~120 tokens saved overall (build/test output is already fairly small for
  this project size).
- Not built (explicitly out of scope): backend, auth, payments, database,
  admin features.

## [2026-07-06] mvp-polish | Focused UX/QA polish pass
- Search empty state: `PromptGrid` now shows an icon, the unmatched query,
  a hint, and a "Clear search" button (wired to `GallerySearch`'s
  `setQuery("")`) instead of a single line of text.
- Copy feedback: `CopyPromptButton` gained an explicit `loading` state
  (spinner, `disabled` + `aria-busy` to block double-submits while the
  `/api/prompts/[slug]/build` request is in flight) and a color-coded
  `role="status" aria-live="polite"` text line under the button, so success/
  failure reaches screen reader users, not just the icon/label swap.
- Mobile spacing: gallery hero, detail header, and the detail preview/CTA
  grid now use mobile-first padding/gap scales (e.g. `px-4 py-10 sm:px-6
  sm:py-16`) instead of one fixed desktop-sized value.
- Card hover/focus: `PromptCard` is now a full stretched-link (the "View
  Prompt" link's `after:absolute after:inset-0` covers the whole card), and
  keyboard focus on that link puts a visible ring on the card via
  `has-[a:focus-visible]:ring-2` — previously only the small text link was
  focusable/clickable.
- Detail page hierarchy: added an "UI Prompt Theme" eyebrow above the title
  and a "Copy Prompt" section heading above the CTA card, which now carries
  a slightly stronger ring than the color-picker card to read as the
  primary action.
- Accessibility: search input got `type="search"` + `aria-label`; color
  swatches are grouped (`role="group"` + `aria-labelledby`) with
  `aria-pressed` on the selected one; the native color `<input>` has an
  associated (visually hidden) `<label>`; explicit `focus-visible` ring
  styles added to card links, swatches, and the color input to match
  shadcn/ui's existing Button/Input focus convention.
- No architecture changes: no new pages, routes, or dependencies added.
  `promptTemplate` still never reaches the client — verified again via
  `curl` that neither `/` nor `/prompts/[slug]` HTML contains the raw
  template text after these changes.
- Quality: `rtk npm run lint` clean (0 errors/warnings), `rtk npm run build`
  clean (all 6 prompt detail routes statically prerendered).
- Known non-issue: Next dev server occasionally throws a transient
  `EPERM`/`fs rename` error on the first request after a fresh `.next`
  (Windows filesystem/antivirus lock on Turbopack's manifest write); the
  next request to the same route succeeds. Not related to this change, not
  present in production builds.

## [2026-07-06] wiki-sync | Documentation sync after polish pass
- No app code changed. Reviewed `gallery-page.md`, `detail-page.md`,
  `copy-mechanism.md`, `styling.md` — already current from the mvp-polish
  entry above. Updated `overview.md` (current-state summary),
  `prompt-system.md` (re-verification note), and `next-actions.md`
  (marked polish pass done, added a follow-up to verify polish-pass UI in a
  real browser/screen reader — **[uncertain]**, not yet checked beyond
  build/lint/curl).
- Remaining known issues: none new. Same as prior entry (dev-server
  transient EPERM quirk, no automated tests yet, mock preview/content data).

## [2026-07-06] content-and-preview | Prompt content + preview visual pass
- Rewrote all 6 `promptTemplate` strings in `src/lib/prompts.ts` as
  structured, production-ready briefs: product context, layout direction,
  component requirements, visual style, responsive behavior, and
  accessibility notes, each with `{{primaryColor}}` injected at concrete
  visual-accent points instead of a single generic mention.
- Added a `preview.kind` discriminant (`dashboard` | `hero` | `pricing` |
  `auth` | `portfolio` | `changelog`) to `PromptTheme["preview"]` and
  rewrote `src/components/prompt-preview.tsx` to render a small theme-
  specific layout glyph (e.g. sidebar+KPI grid, 3-column pricing with a
  highlighted middle, form card, masonry blocks, timeline dots) plus a
  matching lucide icon per kind, so gallery cards and the detail preview
  are visually distinct instead of differing only by gradient color.
- No new dependencies, no new routes/pages — `PromptGrid`, `PromptCard`,
  and `PromptDetail` needed no changes since they already pass `preview`
  through generically.
- Hidden-template guarantee unaffected: `getPublicPrompts()` and the
  Detail page's props to `PromptDetail` still omit `promptTemplate`
  entirely; only `/api/prompts/[slug]/build` reads it. Re-verified via
  `curl` across the gallery page and all 6 detail routes (grepped for
  "Product context:", a string that only exists inside `promptTemplate`) —
  not present anywhere in rendered HTML.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 6
  detail routes statically prerendered).
- Not done this pass: no manual test of the built prompt text against an
  actual AI tool (v0.dev/Cursor/GenVibe) — see next-actions.md.