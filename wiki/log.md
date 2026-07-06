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

## [2026-07-06] prompt-output-refinement | Prompt template output-quality pass
- Rewrote all 6 `promptTemplate` strings again in `src/lib/prompts.ts`,
  this time targeting real generated-output quality rather than just
  structural completeness. Kept the same 6 themes/slugs, same section-based
  format, but added a dedicated "Visual hierarchy" section per theme and
  replaced vague adjectives ("clean," "modern," "bold" alone) with concrete,
  actionable specifics: exact breakpoints and spacing scales, explicit
  dominant/secondary/tertiary element callouts, default/hover/active/
  disabled/loading/empty states per component, concrete dark-mode elevation
  rules (surface-lighter-than-background instead of drop shadows), and
  specific WCAG contrast ratios / ARIA attributes / semantic elements in
  place of generic "keyboard accessible" notes.
- `{{primaryColor}}` placement rules were tightened per theme — each
  template now states explicitly where the color should and shouldn't be
  used (e.g. pricing: Pro card border/glow/badge/CTAs only, not every
  tier's CTA; changelog: newest entry's dot/badge only, not every row) so
  the accent reads as deliberate rather than decorative repetition.
- No architecture, routing, or data-shape changes — `PromptTheme`,
  `getPublicPrompts()`, `buildPrompt()`, and the API route are untouched;
  this is a content-only change to the `promptTemplate` string values.
- Hidden-template guarantee re-verified: `curl` across the gallery page and
  all 6 detail routes confirms "Product context:" (a string unique to
  `promptTemplate`) does not appear in any rendered HTML; a direct
  `POST /api/prompts/saas-dashboard/build` call confirms `{{primaryColor}}`
  substitution still works against the refined template.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 6
  detail routes statically prerendered).
- Remaining gap (unchanged from prior entry): the refined templates have
  still not been run through an actual AI tool (v0.dev/Cursor/GenVibe) to
  confirm they produce better real output — this pass improved the prompt
  text based on judgment/best practice, not on observed generation results.

## [2026-07-06] marketplace-redesign | Premium visual redesign
- Goal: make CopyUI feel like a premium dark template marketplace instead
  of a generic product grid — cards previously used small abstract
  glyphs/icons on a mid-gray dark background, which read as placeholder-y.
- `src/lib/prompts.ts`: added a `meta: { creator, copies }` field to
  `PromptTheme` (mock/local marketplace metadata, no accounts/backend) and
  populated it for all 6 themes; included in `getPublicPrompts()`'s output
  since it's safe display data, unlike `promptTemplate`.
- `src/components/prompt-preview.tsx`: fully rewritten. Replaced the small
  centered icon+gradient with 6 dedicated mock components
  (`DashboardMock`, `HeroMock`, `PricingMock`, `AuthMock`, `PortfolioMock`,
  `ChangelogMock`), each built from Tailwind-styled `div`s only — no image
  files or new dependencies — approximating a miniature real screenshot
  (sidebar+KPI+chart+table for dashboard, nav+headline+CTA for hero, three
  pricing columns with an elevated middle plan, a centered auth card,
  masonry portfolio blocks, a changelog timeline). `primaryColor` still
  drives the same accent points as before.
- `src/components/prompt-card.tsx`: redesigned as a template-marketplace
  tile — large `aspect-video` (16:9) preview dominates the top, title/tags/
  creator+copies metadata below. Hover now lifts the card
  (`whileHover={{ y: -6 }}`), brightens the border, shows a
  `defaultPrimaryColor`-tinted glow, and scales the preview image slightly
  inside its clipped frame. The whole tile (image + metadata) is one
  stretched `Link` positioned as the card's last child, so it stays a
  single keyboard-accessible click target.
- `src/components/prompt-grid.tsx`: wider gaps (`gap-5` → `lg:gap-8`) to
  match the more spacious marketplace feel.
- `src/app/page.tsx` + `src/components/gallery-search.tsx`: gallery
  widened to `max-w-7xl`, page background set to `bg-[#050505]`, hero
  compacted into a left-aligned page header (no longer the visual focus),
  and search moved into a "Browse Templates" toolbar row above the grid so
  the template tiles are now the main event.
- `src/components/prompt-detail.tsx` + detail `page.tsx`: preview enlarged
  to a bordered `aspect-video` frame taking 3 of 5 grid columns on
  desktop; detail page widened to `max-w-6xl` and given the same
  `bg-[#050505]` background as the gallery for visual consistency.
- `src/app/globals.css`: `.dark` theme tokens tuned darker —
  `--background` `oklch(0.145 0 0)` → `oklch(0.08 0 0)`, `--card` `0.205`
  → `0.16` — so the base UI reads as near-black with cards still one
  elevation step lighter.
- No backend/auth/payments/database/admin added; no new routes; no new
  dependencies (mockups are plain `div`s, no images).
- Hidden-template guarantee re-verified after all of the above: `curl`
  across the gallery page and all 6 detail routes shows no "Product
  context:" match (the string unique to `promptTemplate`); confirmed the
  new `meta.creator`/`meta.copies` fields do appear in gallery HTML, which
  is intentional (mock display data, not the hidden template).
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 6
  detail routes statically prerendered).
- Not done this pass: no actual browser/visual screenshot check — this
  redesign was verified via build output, HTML/markup inspection, and code
  review only, not by looking at rendered pixels in a browser. Flagged in
  next-actions.md as the top follow-up.

## [2026-07-06] dataset-expansion | 6 → 18 prompt themes + category filtering
- Goal: the marketplace felt too small at 6 themes; expanded the dataset
  to feel like a real template marketplace with variety across use cases.
- `src/lib/prompts.ts`: added 12 new themes (agency-landing,
  ai-chat-interface, analytics-command-center, ecommerce-product-page,
  finance-dashboard, kanban-project-board, docs-knowledge-base,
  mobile-app-landing, real-estate-listing, restaurant-menu-page,
  event-conference-page, creator-link-in-bio) alongside the original 6,
  bringing the total to 18. Each new theme has the full `PromptTheme`
  shape: slug, title, description, tags, `category`, `preview` (gradient +
  label + a unique `kind`), `meta` (mock creator/copies), a
  `defaultPrimaryColor`, and a `promptTemplate` written to the same
  7-section structured format as the refined original 6 (product context,
  layout, visual hierarchy, components & states, design language,
  responsive behavior, accessibility, `{{primaryColor}}` injection).
- Added a `category: Category` field (12-value union: Landing, Dashboard,
  SaaS, Ecommerce, AI, Portfolio, Docs, Form, Mobile, Finance,
  Real Estate, Content) to every theme, and a `GALLERY_CATEGORIES` export
  (`All`, `Landing`, `Dashboard`, `SaaS`, `Ecommerce`, `AI`, `Portfolio`,
  `Docs` — the 8-pill subset requested) for the gallery filter UI.
  `getPublicPrompts()` includes `category` since it's safe public data.
- `src/components/prompt-preview.tsx`: added 12 new mock components
  (`AgencyMock`, `ChatMock`, `AnalyticsMock`, `EcommerceMock`,
  `FinanceMock`, `KanbanMock`, `DocsMock`, `MobileMock`, `RealEstateMock`,
  `MenuMock`, `EventMock`, `LinkBioMock`), all Tailwind `div`-only (no
  images, no new dependencies), each approximating a miniature real
  screenshot for its theme (e.g. chat sidebar + message bubbles, phone-
  frame mockup for the mobile app landing, stacked link buttons for
  link-in-bio). `MOCKS` record extended to map all 18 `PreviewKind` values.
- `src/components/gallery-search.tsx`: added category-pill state
  (`role="group"`, `aria-pressed` per pill) alongside the existing search
  `useMemo`, combined with AND logic (a prompt must match both the active
  category and the search query). `src/components/prompt-grid.tsx`'s
  empty-state button was generalized from "Clear search" to "Clear
  filters" and now shows whenever either filter is active, not just when
  search text is present, so a category-only empty result is still
  recoverable.
- No architecture changes: no new routes (the existing `/prompts/[slug]`
  dynamic route + `generateStaticParams` picked up all 18 slugs
  automatically), no backend/auth/payments/database/admin, no new
  dependencies, filtering stays entirely client-side.
- Hidden-template guarantee re-verified across the larger dataset: `curl`
  against the gallery page and all **18** `/prompts/<slug>` detail routes
  confirms none contain "Product context:" (unique to `promptTemplate`);
  a direct `POST /api/prompts/ai-chat-interface/build` call confirms
  `{{primaryColor}}` substitution works correctly for one of the new
  themes.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 18
  detail routes + gallery + API route = 22 total pages built).
- Also fixed while updating docs: a duplicated "## Responsive spacing"
  heading in `wiki/pages/styling.md` left over from an earlier edit pass.
- Not done this pass (same gap as prior entries): no real browser/visual
  check of the new mockups, and none of the prompt templates (new or
  refined) have been tried against an actual AI tool yet.