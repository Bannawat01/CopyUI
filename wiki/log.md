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

## [2026-07-06] motion-pass | Premium motion and interaction pass
- Goal: the site was visually redesigned and content-rich but felt static;
  added tasteful Framer Motion micro-interactions across gallery, cards,
  category filtering, detail page, and the Copy button.
- Global reduced-motion: added `src/components/motion-provider.tsx` (a
  client wrapper around Framer Motion's `<MotionConfig reducedMotion="user">`)
  rendered once from `src/app/layout.tsx`. This makes every animation in
  the app respect the OS `prefers-reduced-motion` setting automatically,
  instead of adding a `useReducedMotion()` check per component.
- `src/components/prompt-grid.tsx` (now `"use client"`): gallery cards
  reveal with a staggered fade/rise on load (`delay: min(index*0.035s,
  0.28s)`, kept fast for an 18-card grid); wrapped in
  `AnimatePresence mode="popLayout"` so filtering by search/category
  animates cards out/in and reflows remaining cards via `layout` instead
  of an instant re-render; the empty state now fades/rises in instead of
  appearing abruptly, and its "Clear filters" button shows for any active
  filter (search or category), not just search text.
- `src/components/gallery-search.tsx`: the active category pill's white
  background is now a `motion.span` with a shared `layoutId`, so switching
  categories slides/morphs the highlight between buttons.
- `src/components/prompt-card.tsx`: replaced the mouse-only `whileHover`
  lift with a small `active` boolean state (set by `onMouseEnter`/
  `onMouseLeave` on the card and `onFocus`/`onBlur` on the stretched
  `Link`) driving a Framer Motion `variants` animation — so keyboard focus
  now triggers the exact same lift as mouse hover. Added matching
  `group-focus-within:` classes alongside every existing `group-hover:`
  class (glow, preview scale, gradient overlay, Copy icon, metadata row)
  so none of the hover polish is hover-only, and added a metadata-row
  color brighten (`text-white/40` → `text-white/60`) on hover/focus.
- `src/components/prompt-preview.tsx` (now `"use client"`): the mock
  content is wrapped in a `motion.div` keyed on the current color, doing a
  quick opacity dip-and-recover (0.55 → 1, 0.3s) whenever `primaryColor`
  changes — a deliberate "refresh" pulse, since CSS can't smoothly
  interpolate between arbitrary gradient/hex colors.
- Detail page entrance: extracted the title/description/tags header into
  a new client component `src/components/detail-header.tsx` so it could
  animate (fade + rise) without making the whole route a client
  component; `src/components/prompt-detail.tsx` staggers the preview,
  color panel, and Copy Prompt panel in at +0.05s/+0.15s/+0.22s.
- `src/components/copy-prompt-button.tsx`: the success state now uses a
  bouncier spring transition (`stiffness: 500, damping: 15`) distinct from
  the plain fade used for loading/error, plus a one-shot
  `scale: [1, 1.04, 1]` pulse on the button itself when it reaches
  success — `aria-live` status text and the loading/error states are
  unchanged.
- **Build issue found and fixed**: initially wrote `motion.div` directly
  inside the Server Component `src/app/prompts/[slug]/page.tsx` and inside
  `src/app/layout.tsx` — both failed the build with "Attempted to call
  createMotionComponent() from the server," since a file must have
  `"use client"` itself to reference `motion.*`/`MotionConfig` JSX, even
  if it's otherwise fine to be a Server Component. Fixed by extracting
  that JSX into small dedicated client components
  (`detail-header.tsx`, `motion-provider.tsx`) and by adding `"use client"`
  to `prompt-preview.tsx` once it started using `motion.div` too. See
  [styling.md](styling.md) for the rule.
- No architecture changes, no backend/auth/payments/database/admin
  added, no new dependencies (Framer Motion was already installed); no
  loops or autoplaying animations — everything is mount/interaction
  triggered and settles to a resting state.
- Hidden-template guarantee re-verified after the motion pass: `curl`
  against the gallery page and a sample of detail routes (including two
  of the 12 newer themes) confirms none contain "Product context:"; a
  direct `POST /api/prompts/saas-dashboard/build` call confirms
  `{{primaryColor}}` substitution still works.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 22
  pages, including all 18 detail routes, built successfully after the
  client-boundary fix).
- Not done this pass: no verification in a real browser with OS-level
  `prefers-reduced-motion` actually toggled on — the `MotionConfig`
  wiring is correct per Framer Motion's documented behavior, but hasn't
  been visually confirmed to suppress motion end-to-end.

## [2026-07-06] tool-mode | Add Tool Mode (v0.dev / Cursor / GenVibe)
- Goal: differentiate CopyUI from a generic template gallery by letting
  the copied prompt be tailored to the AI tool the user is pasting it
  into, without exposing the hidden template or duplicating templates
  per tool.
- `src/lib/tool-modes.ts` (new): `ToolMode` type (`"v0" | "cursor" |
  "genvibe"`), `TOOL_MODES` (value+label pairs for the UI), `isToolMode()`
  validator, `getToolModeLabel()`, and `applyToolMode(basePrompt,
  toolMode?)` — prepends one tool-specific framing paragraph to the
  theme's already-built prompt text. Chose a single shared framing prefix
  per tool (applied to any theme) over authoring 18 × 3 = 54 separate
  templates, keeping the per-theme `promptTemplate` as the sole source of
  truth for the actual UI spec.
  - `v0`: layout/component-selection (shadcn/ui)/Tailwind/visual-output
    framing.
  - `cursor`: file-structure/React-Next.js/TypeScript/code-quality framing.
  - `genvibe`: creative-direction/interaction-feel/visual-polish framing.
- `src/app/api/prompts/[slug]/build/route.ts`: now reads `toolMode` from
  the request body (validated via `isToolMode`, falls back to no framing
  if missing/invalid — backward compatible with the pre-tool-mode
  request shape), calls `applyToolMode(buildPrompt(...), toolMode)`, and
  returns `{ text, toolMode }`.
- `src/components/tool-mode-selector.tsx` (new): compact `role="radiogroup"`
  segmented control (3 `role="radio"` buttons, `aria-checked`), styled to
  match the existing `ColorControl` conventions.
- `src/components/prompt-detail.tsx`: added `toolMode` state (default
  `"v0"`), renders `ToolModeSelector` above the Copy button, passes
  `toolMode` through to `CopyPromptButton`, and updated the hidden-prompt
  explainer copy to mention tool mode.
- `src/components/copy-prompt-button.tsx`: now requires a `toolMode` prop,
  sends it in the POST body, and the loading/success status text now
  reads "Building a {tool} prompt…" / "Copied — tailored for {tool}"
  instead of static strings — `aria-live` wiring is unchanged.
- Mid-task note: this task was briefly interrupted by a switch into plan
  mode partway through implementation (after the API route and
  tool-modes.ts were written but before the UI wiring was finished); a
  plan file was written summarizing the in-progress state and remaining
  steps, then work resumed from that plan once plan mode exited. One
  small bug from the in-flight edit (a stale `STATUS_TEXT` reference in
  `copy-prompt-button.tsx` left over from renaming to a local
  `statusText`) was caught and fixed before running quality checks.
- No architecture changes, no backend/auth/payments/database/admin
  added, no new dependencies, no changes to the prompt data model itself
  (`PromptTheme`/`getPublicPrompts()` untouched — tool mode is purely an
  API + UI concern layered on top of the existing hidden-template flow).
- Hidden-template guarantee re-verified: `curl` against the gallery page
  and 3 detail routes (including 2 of the newer themes) confirms neither
  "Product context:" (base template) nor "Target tool:" (tool-mode
  framing) appears anywhere in rendered HTML — `applyToolMode()` only
  ever runs inside the API route handler. Directly `POST`ing the build
  API with each of `v0`/`cursor`/`genvibe` confirms distinct, correctly
  prefixed output per mode, and omitting `toolMode` still returns the
  plain base prompt.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 22
  pages built).
- Not done this pass (new, on top of prior gaps): the 3 tool-mode framing
  prefixes have not been validated against real output from v0.dev,
  Cursor, or GenVibe — they were written based on general understanding
  of each tool, not tested end-to-end. See next-actions.md.

## [2026-07-06] clip-synthesis | Processed Obsidian raw clips into wiki research
- Task: turn raw clips in `wiki/raw/clips` (12 files total) into short,
  source-backed synthesis notes — no app code touched, no packages
  installed, no full-repo scan (only `wiki/raw/clips` and existing wiki
  pages read).
- Inspected all 12 clip files. 2 were unrelated to CopyUI design research
  (Obsidian Web Clipper templates, MarkItDown — personal tooling clips,
  not part of the requested source list) and were left untouched. The
  other 10 were processed and each given `status: processed` in its
  frontmatter: `Components.md`, `Introduction.md`, `Examples.md` (all
  ui.shadcn.com docs), `birobirobiro...awesome-shadcn-ui...md`,
  `Shadcn Components - Extra components for Shadcn UI.md`
  (shadcnblocks.com, despite the generic filename), `Shadcn UI
  Components, Blocks & Templates.md` (cult-ui.com — filename doesn't
  match its actual source), `21st.dev - Crafted React components...md`,
  `serafimcloud21st...md` (21st.dev's GitHub repo),
  `nolly-studiocult-ui...md` (Cult UI's GitHub repo), and
  `shadcnoriginui...md` (Origin UI — a bonus source present in the clips
  but not on the user's named list).
- **Source gap found**: the user's list also named Magic UI, Aceternity
  UI, Motion-Primitives, and Superdesign UI Design Prompts. Only
  Aceternity UI appears anywhere in the clips, as a single table-row
  description inside the awesome-shadcn-ui list — not enough to
  synthesize from. The other three were not found at all. This was
  called out explicitly (not silently skipped) in both
  `motion-inspiration.md` and `prompt-quality.md`, and as a next action.
- Created 5 new wiki pages: `competitor-inspiration.md` (21st.dev, Cult
  UI, Shadcnblocks, Origin UI, awesome-shadcn-ui — what each is, why it
  matters, ideas, what to avoid, next actions), `shadcn-patterns.md`
  (shadcn/ui docs + registry schema + token conventions),
  `motion-inspiration.md` (source-gap page — captured the thin real
  signal without inventing missing content), `prompt-quality.md`
  (source-gap page — used the shadcn registry schema as the closest
  adjacent, weaker signal), and `feature-ideas.md` (5 concrete,
  source-backed ideas plus an explicit "not recommended" list).
- Updated existing pages with short cross-references only (no content
  duplication): `gallery-page.md`, `detail-page.md`, `styling.md`,
  `prompt-system.md`, and `next-actions.md` (added 2 new numbered next
  actions: evaluate the 3 feature ideas, and re-clip the 4 missing
  sources if that research is still wanted). Updated `index.md` with a
  new "Research" section listing the 5 new pages.
- No raw clip content was copied wholesale into the wiki — every new
  page is a short synthesis with inline source attribution back to the
  specific clip file.

## [2026-07-06] copy-for-v0 | "Copy for v0" secondary action prototyped
- Goal: add a lightweight v0-oriented action (per
  [feature-ideas.md](pages/feature-ideas.md) item #1) so CopyUI feels
  more useful than a generic template gallery, without faking a deep
  link that might not actually work.
- **Checked the actual source before building anything**: re-read
  `wiki/raw/clips/Components.md` (the shadcn docs clip) for v0's
  documented "open in" mechanism. It's
  `https://v0.dev/chat/api/open?url=<url>`, where `<url>` must point to
  a shadcn **registry-item JSON** (`registry:style`, `dependencies`,
  `cssVars`), not raw prompt text — there is no documented parameter for
  opening a new v0 chat pre-filled with arbitrary text. This corrects an
  earlier, incorrect claim in `feature-ideas.md` that v0.dev had a
  `?q=`-style text param; that claim has been struck through and
  replaced with the corrected finding.
- Because a reliable arbitrary-prompt deep-link format isn't confirmed,
  **no fake "Open in v0" link was built**. Instead: `src/components/
  copy-for-v0-button.tsx` (new) — a secondary, v0-branded button shown
  only when Tool Mode is `v0`, next to the existing Copy Prompt button.
  It reuses the exact same server-side build flow (`POST
  /api/prompts/[slug]/build` with `toolMode: "v0"` hard-coded,
  `navigator.clipboard.writeText`), with its own label ("Copy for v0"),
  its own success/error feedback ("Copied for v0.dev" / "Copy failed"),
  and an always-visible caption explaining the prompt is optimized for
  v0.dev and should be pasted into a new v0 chat. A code-level TODO
  comment documents the deep-link gap and what would need to change to
  support it later.
- `src/components/prompt-detail.tsx`: imports and conditionally renders
  `CopyForV0Button` when `toolMode === "v0"`, right after the main
  `CopyPromptButton`.
- Tool Mode itself was already fully implemented from a prior session
  (`src/lib/tool-modes.ts`, the build API's `toolMode` handling,
  `ToolModeSelector`) — reused as-is, no changes needed there.
- No backend/auth/payments/database/admin added, no architecture
  changes, no new dependencies. The API route (`/api/prompts/[slug]/build`)
  was not modified — it already accepted `toolMode` from the prior Tool
  Mode work.
- Hidden-template guarantee re-verified: `curl` against the gallery page
  and the saas-dashboard detail page shows no "Product context:" match;
  confirmed the new "Copy for v0" button and its caption render in the
  initial HTML (default Tool Mode is `v0`); directly `POST`ing the build
  API with `toolMode: "v0"` returns the correctly framed, real prompt
  text.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 22
  pages built).
- Wiki updated: `feature-ideas.md` (corrected the v0 URL-param claim,
  marked item #1 as prototyped/deferred with the real finding),
  `prompt-system.md`, `copy-mechanism.md`, `detail-page.md` (documented
  the new action and why the deep link was deferred, not faked),
  `next-actions.md` (marked the copy action done, added a dedicated
  next-action for the still-open deep-link question).
- Remaining issue: the "Copy for v0" and main "Copy Prompt" buttons now
  do functionally the same thing when Tool Mode is v0 (same request,
  same clipboard write) — this is intentional (a branded shortcut
  action, not a functional differentiation), but worth reconsidering if
  it reads as redundant once seen in a real browser rather than via
  markup review.

## [2026-07-06] copy-ux-refine | Removed redundant "Copy for v0" button, made main button adaptive
- Goal: address the redundancy flagged in the prior entry — the
  secondary "Copy for v0" button and the main "Copy Prompt" button did
  the exact same thing whenever Tool Mode was v0.
- `src/lib/tool-modes.ts`: added `getToolModeCaption(mode)` returning a
  short per-tool instruction ("Paste this into a new v0 chat." /
  "Paste this into Cursor Chat or an implementation prompt." / "Paste
  this into GenVibe for visual direction.").
- `src/components/copy-prompt-button.tsx`: the idle label now reads
  "Copy for {tool}" (driven by `getToolModeLabel(toolMode)`) instead of
  a static "Copy Prompt", and a new always-visible caption
  (`getToolModeCaption(toolMode)`) was added below the existing
  `aria-live` status line. Added a code-level TODO comment at the top of
  the file documenting the v0 deep-link gap (moved here from the now-
  deleted `copy-for-v0-button.tsx`). Loading/success/error states,
  `aria-busy`, and the `role="status" aria-live="polite"` wiring are
  otherwise unchanged.
- `src/components/prompt-detail.tsx`: removed the `CopyForV0Button`
  import and its conditional render block; `ToolModeSelector` and the
  single `CopyPromptButton` remain, unchanged in position.
- Deleted `src/components/copy-for-v0-button.tsx` (no longer used).
- No changes to the server-side flow: `POST /api/prompts/[slug]/build`,
  `buildPrompt()`, and `applyToolMode()` are untouched — this pass is
  presentation-only, on top of the existing hidden-template-safe flow.
- No backend/auth/payments/database/admin added, no architecture
  changes, no new dependencies. No fake "Open in v0" link was added —
  the TODO from the prior pass carried forward unchanged.
- Note: hit a repeated `Edit` tool failure on `copy-prompt-button.tsx`
  (old_string not found despite matching a fresh `Read`, on both a
  multi-line and later a single-line attempt) — worked around by
  rewriting the whole file with `Write` instead of chasing it further.
- Hidden-template guarantee re-verified: `curl` against the gallery page
  and the saas-dashboard detail page shows no "Product context:" match;
  confirmed the adaptive label renders correctly (React SSR splits
  `Copy for ` and the interpolated `v0.dev` across a comment-marker
  boundary in raw HTML — cosmetic in the markup, renders as one string
  in the browser); confirmed the old redundant button/label no longer
  appears; directly `POST`ing the build API with `toolMode: "cursor"`
  confirms the build flow is unaffected.
- Quality: `rtk npm run lint` clean, `rtk npm run build` clean (all 22
  pages built).
- Wiki updated: `copy-mechanism.md` (replaced the "Copy for v0" section
  with a "one adaptive button, not two" explanation + the deep-link
  rationale kept separate), `detail-page.md` and `prompt-system.md`
  (documented the adaptive button, noted the removal), `next-actions.md`
  (marked the redundancy resolved).
- Remaining issues: same open items as before this pass (no real-browser
  check of the new caption/label wording, no AI-tool validation of the
  Tool Mode framings, true "Open in v0" still blocked on v0.dev
  publishing a reliable format) — nothing new introduced.

## [2026-07-07] v0-validation | First real v0.dev output check
- Tested the copied AI Chat Interface prompt (v0.dev tool mode) in an
  actual v0.dev session — the first time any prompt template has been
  validated against real AI-tool output rather than judged by reading
  the template text.
- Result: worked successfully; v0.dev produced usable output without
  needing immediate prompt changes.
- Decision: keep the current prompt structure and content as-is for now
  — no speculative rewriting based on this result.
- Going forward, further prompt-template work should be driven by real
  failed outputs or specific observed quality gaps from testing, not
  speculative refinement.

## [2026-07-09] production-readiness | SEO, robots/sitemap, homepage clarity, checklist, README
- SEO: `src/lib/site.ts` (new — SITE_URL from `NEXT_PUBLIC_SITE_URL`,
  name/tagline/description constants); `layout.tsx` gained metadataBase,
  title template, canonical, OG + Twitter tags; detail pages gained
  `generateMetadata` (per-theme title/description/canonical/OG from
  public data only).
- `src/app/robots.ts` (new): allow all, disallow `/api/`, sitemap link.
  `src/app/sitemap.ts` (new): homepage + all 18 detail routes from local
  prompt data.
- Homepage: hero retitled to "Production-ready UI prompts for v0,
  Cursor, and GenVibe" + clearer subtext; added a 3-step "How it works"
  strip (pick → customize → copy) between hero and gallery toolbar.
- Detail page: added `QualityChecklist` (new component) below the Copy
  button — static list of the six template section names; reads no
  prompt data.
- README.md: rewritten for GitHub (overview, features, stack, dev
  commands, hidden-prompt security note, limitations, roadmap,
  deployment); removed create-next-app boilerplate.
- Verified via `next start` + `curl`: no "Product context:"/"Target
  tool:" in gallery or detail HTML; titles/canonical/OG/sitemap/robots
  all render. Lint + build clean (24 routes incl. robots.txt +
  sitemap.xml).
- Wiki: updated overview, gallery-page, detail-page, prompt-system,
  copy-mechanism, next-actions, index; created production-readiness.md.
  styling.md untouched — no styling-convention changes this pass.
- Remaining gaps: no OG image, `NEXT_PUBLIC_SITE_URL` must be set when
  deploying, default favicon, no analytics/monitoring/tests.

## [2026-07-09] og-image | Social preview image via ImageResponse
- `src/app/opengraph-image.tsx` (new): dynamic 1200×630 PNG via Next's
  `ImageResponse` — dark premium background with radial glows, CopyUI
  wordmark + mark, tagline, a pick/customize/copy pill, and a 2×2
  template-card grid motif. `src/app/twitter-image.tsx` (new) re-exports
  the same image. Chose dynamic generation over a static PNG so the art
  stays in-repo as code (no design-tool asset pipeline needed).
- Both routes prerender statically at build; verified via `next start` +
  `curl` (200, image/png, ~53KB) and a visual check of the rendered PNG.
- Lint + build clean (26 routes, now incl. /opengraph-image and
  /twitter-image). No app-feature, data, or prompt-flow changes.
- Wiki: production-readiness.md updated (OG-image gap closed, section
  added); this log entry.
- Remaining gaps: `NEXT_PUBLIC_SITE_URL` in deploy env, default favicon,
  no analytics/monitoring/tests.

## [2026-07-09] branded-icons | Favicon + app icon via ImageResponse
- `src/app/icon.tsx` (32×32) and `src/app/apple-icon.tsx` (180×180),
  both new: CopyUI "copy" mark — two offset rounded cards (sky behind,
  indigo in front) on the OG image's near-black surface. Generated with
  `ImageResponse` for consistency with `opengraph-image.tsx`; kept to
  two shapes so it survives 16px rendering.
- **Deleted `src/app/favicon.ico`** (the 25931-byte create-next-app
  default, added in the initial scaffold commit). Necessary, not
  incidental: `favicon.ico` takes precedence over `icon.tsx` in Next's
  icon resolution, so the branded mark would have been ignored.
- Verified via `next start` + `curl`: `/icon` and `/apple-icon` return
  200 image/png; `<link rel="icon">` and `<link rel="apple-touch-icon">`
  are injected into page HTML; `/favicon.ico` returns 404; both PNGs
  visually checked.
- Lint + build clean (27 routes, now incl. /icon and /apple-icon). No
  app-feature, data, or prompt-flow changes.
- Wiki: production-readiness.md (branded-icons section, favicon gap
  closed); this log entry.
- Remaining gaps: `NEXT_PUBLIC_SITE_URL` in deploy env, no
  analytics/monitoring/tests, no JSON-LD.

## [2026-07-09] feedback-links | GitHub Issues feedback footer
- `src/lib/feedback.ts` (new): `REPO_URL` + an `issueUrl()` helper that
  prefills title/body/labels via GitHub's `/issues/new` query params.
  Three links: Request a prompt (enhancement), Report bad output (bug),
  Suggest improvement (enhancement). The bad-output body asks for
  theme, tool mode, what went wrong, and what looked good — matching the
  feedback shape that produced the useful AI Chat Interface fixes.
- `src/components/site-footer.tsx` (new): 3-up card row of those links
  plus a "View source on GitHub" line. Mounted once inside
  `MotionProvider` in `layout.tsx`, so gallery and detail pages both get
  it without per-page wiring. Server component, static, no state.
- No backend, database, forms, or architecture change — three `<a>` tags
  and a URL builder.
- Verified via `next start` + `curl`: footer renders on both `/` and
  `/prompts/saas-dashboard`; all three issue URLs are well-formed with
  encoded title/body/labels; no "Product context:" leak on either page.
- Lint + build clean (27 routes, unchanged — footer adds no route).
- Wiki: production-readiness.md (feedback-links section),
  next-actions.md (items 13/14 updated), this log entry.
- Caveat noted in wiki: GitHub silently drops `labels` values that don't
  exist in the repo; `enhancement`/`bug` are defaults so they should
  apply unless deleted.
- Remaining gaps: `NEXT_PUBLIC_SITE_URL` in deploy env (now the single
  most important one), no analytics/monitoring/tests, no JSON-LD.

## [2026-07-09] analytics | Vercel Analytics + Speed Insights
- Installed `@vercel/analytics` (^2.0.1) and `@vercel/speed-insights`
  (^2.0.0). Mounted `<Analytics />` and `<SpeedInsights />` once in
  `src/app/layout.tsx`, as siblings of `MotionProvider` inside `<body>`
  (deliberately outside the motion tree). Zero config.
- No app-feature, data, prompt-flow, or component changes; two imports
  and two self-closing tags.
- Verification note: neither script appears in server-rendered HTML —
  both are client components that inject their script after hydration,
  so `curl` correctly shows nothing. Confirmed instead that both are
  present in the built client chunk. Also re-checked: no "Product
  context:" leak, footer still renders.
- Lint + build clean (27 routes, unchanged).
- Wiki: production-readiness.md (analytics section + gap list updated),
  next-actions.md (item 13), this log entry.
- Remaining gaps: `NEXT_PUBLIC_SITE_URL` in deploy env; Analytics/Speed
  Insights must still be **enabled in Vercel project settings** to
  collect data; no error monitoring; no tests; no JSON-LD.

## [2026-07-09] deploy-status | Speed Insights enabled (docs only)
- No app code changed. Recording deployment state:
- **Speed Insights: enabled** in the Vercel project. Performance data
  requires real visits before it appears — an empty dashboard right
  after enabling is expected, not a misconfiguration.
- **Analytics: still to be enabled/confirmed** in Vercel project
  settings; the component ships but collects nothing until toggled on.
- **`NEXT_PUBLIC_SITE_URL`: verify in production** — confirm the deployed
  `/sitemap.xml`, `/robots.txt`, and canonical/OG tags resolve to the
  real domain rather than `localhost:3000`.
- Wiki: production-readiness.md (new "Deployment status" section, gap
  list rewritten), next-actions.md (item 13), this entry.

## [2026-07-09] smoke-tests | Vitest smoke suite (first tests in the project)
- Framework: **Vitest** (`vitest` devDependency only, no other test deps).
  Picked as the lightest option that covers the asked-for surface:
  `react-dom/server` was already a dependency, so the homepage renders
  via `renderToStaticMarkup` — **no jsdom, no testing-library, no
  Playwright**. `vitest.config.ts` (node env, `@/*` alias mirroring
  tsconfig). Added `"test": "vitest run"` to package.json scripts.
- 3 files, 20 tests, ~1.4s:
  - `tests/prompts.test.ts` — 18 unique/resolvable slugs; unknown slug →
    undefined; **`getPublicPrompts()` strips `promptTemplate`** and its
    serialized output has no "Product context:", "Target tool:", or
    `{{primaryColor}}`; `buildPrompt()` injects at every placeholder and
    leaves none; `applyToolMode()` gives 3 distinct correctly-named
    framings, passes base prompt through for missing/invalid mode.
  - `tests/metadata.test.ts` — sitemap has homepage + all 18 detail
    routes, no duplicates; robots disallows `/api/`, allows `/`, links
    the sitemap.
  - `tests/homepage.test.tsx` — homepage renders the positioning
    headline, the 3 How-it-works steps, real prompt titles; re-asserts
    the no-leak guarantee at the HTML level.
- OG image / icon routes deliberately not unit-tested — `ImageResponse`
  needs the Next runtime, and `npm run build` already proves they compile
  and prerender.
- No app code touched; no architecture change; one devDependency added.
- `rtk npm test` 20/20 pass; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: production-readiness.md (smoke-tests section + test-gap list),
  next-actions.md (item 5 rewritten — it claimed no tests existed), this
  entry.
- Remaining test gaps: build API route not tested end-to-end; no
  component interaction tests (color picker, tool-mode selector, copy
  states); no browser coverage of the real clipboard write; detail pages
  not render-tested.

## [2026-07-09] api-tests | Smoke tests for the prompt build API route
- `tests/api-build.test.ts` (new, 8 tests): imports the route's `POST`
  handler directly and calls it with a real `NextRequest` plus a
  `Promise`-wrapped `params`. Works in Vitest's **node** environment — no
  dev server, no Playwright/jsdom/testing-library, no new dependency.
- Covers: valid slug returns built text; `primaryColor` injected with no
  placeholder left; invalid color falls back to the theme default;
  v0/cursor/genvibe give three distinct correctly-named framings and echo
  `toolMode`; missing/invalid mode → `toolMode: null` and no framing (and
  both produce identical text); unknown slug → 404 `{ error: "Prompt not
  found" }` with no `text`; malformed JSON body degrades to defaults
  rather than throwing; response keys are exactly `text` + `toolMode`, so
  no raw `promptTemplate` rides along as metadata.
- No app code touched. Suite is now **4 files / 28 tests, ~1.1s**.
- `rtk npm test` 28/28 pass; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: production-readiness.md (api-build entry + test-gap list
  corrected — it still claimed the route was untested), this entry.
- Remaining test gaps: no component interaction tests (color picker,
  tool-mode selector, copy-button states); no browser coverage of the
  real clipboard write; detail pages not render-tested; OG/icon routes
  covered only by `npm run build`.

## [2026-07-09] test-status | Test suite summary (docs only)
- No app code changed. Consolidating where testing stands:
- CopyUI now has a **Vitest smoke suite: 28/28 passing**, 4 files,
  covering prompt data, metadata (sitemap/robots), the homepage render,
  and the `/api/prompts/[slug]/build` route handler. Run with `npm test`.
- Remaining test gaps: browser clipboard behavior, component
  interactions, detail-page render tests, and runtime checks of the
  OG/icon image routes.
- **Next priority is production verification**, not more local work:
  confirm sitemap/robots/canonical/OG URLs on the deployed Vercel site
  resolve to the real domain, then Analytics and Speed Insights.
- Wiki: production-readiness.md (test status line, gaps section now leads
  with the production-verification priority), next-actions.md (item 5 —
  it still said 20 tests and listed the API route as untested), this
  entry.

## [2026-07-09] retheme-mode | Prompt Intent, Theme Mode, multi-color palette
- **Driven by real user feedback**: users wanted (a) light/dark/
  black-white theme switching; (b) to apply CopyUI styles to an existing
  frontend — where AI tools were removing functions, breaking behavior,
  or generating a disconnected new page; (c) two or three colors on one
  page. (Figma-style drag-to-arrange was also requested but deliberately
  deferred — different product surface vs. this pass, which reuses the
  existing server-side prompt-composition architecture. Middle-step
  idea recorded: layout presets — feature-ideas.md #7.)
- `src/lib/prompt-options.ts` (new): `PromptIntent` (build/retheme, with
  the user-facing descriptions), `ThemeMode` (dark/light/system/mono),
  validators, strict RETHEME preservation rules (preserve routes/
  functions/state/API calls/handlers/behavior/structure/navigation;
  visual styling only; no standalone replacement page), theme
  directives (light = re-derive not invert; system = both themes via
  prefers-color-scheme; mono = neutral scale), optional palette section
  for secondary/accent with distinct roles + "primary stays dominant".
  `applyPromptOptions()` composes retheme → palette → theme → base.
- Build API: accepts and independently validates `primaryColor`,
  `secondaryColor`, `accentColor`, `themeMode`, `promptIntent`,
  `toolMode`; invalid values are dropped (colors/theme) or defaulted
  (intent → build); response now `{ text, toolMode, themeMode,
  promptIntent }`. Backward compatible with old request bodies.
- UI: `ColorControl` generalized (label/id props + optional "None"
  clear); detail page now has Primary/Secondary/Accent color rows +
  ThemeModeSelector in the color panel, and a PromptIntentSelector
  (with description line) above ToolModeSelector in the copy panel.
  `CopyPromptButton` POSTs all six values. `PromptPreview` tints its
  two ambient corner glows with secondary/accent when set (mocks
  themselves still primary-only — pragmatic, not per-mock rewiring).
- Tests: new `tests/prompt-options.test.ts` (validators, retheme rules
  present/absent, 2- and 3-color palettes, distinct theme directives,
  exact UI copy) + `tests/api-build.test.ts` extended (new response
  shape, palette fields, invalid-field safety, retheme echo/default,
  theme mode echo/fallback, full-stack composition order). Suite now
  **5 files / 43 tests**, all passing (~1s).
- Security: `promptTemplate` flow untouched; `curl` re-verified no
  "Product context:" or "RETHEME ONLY" text in gallery/detail HTML; live
  API POST with retheme+light+secondary returns all sections correctly.
- `rtk npm test` 43/43; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: prompt-system.md, copy-mechanism.md, detail-page.md,
  feature-ideas.md (#6 shipped + #7 layout presets), next-actions.md
  (item 4), this entry.

## [2026-07-09] retheme-refine | Fixes from first live retheme validation
- **Real feedback** (tested on the deployed saas-dashboard page): 3-color
  selection works and is useful; retheme direction is useful; advice
  output acceptable when guidance is the goal. Four problems: (1) Light
  mode still followed the browser/system theme; (2) tool modes too
  narrow — users want VS Code/Copilot, Claude Code, Windsurf; (3) Cursor
  gave advice instead of applying the retheme; (4) the detail page
  required scrolling between color controls and the Copy button.
- **Theme mode fix** (`prompt-options.ts`): light and dark directives
  rewritten as explicitly FIXED themes — "do NOT use
  prefers-color-scheme, do NOT follow the browser or OS theme,
  regardless of their system setting"; `system` is now labeled the ONLY
  adaptive mode; mono also states it doesn't follow the OS theme.
- **Action Style** (new, `prompt-options.ts` + `action-style-selector.tsx`):
  `"apply"` (default in UI) — for retheme: inspect files first, ask
  "Do you want me to apply this retheme now?" if broad/risky, then apply
  only visual/theme changes preserving routes/functions/state/API
  calls/handlers/behavior, no disconnected page; for build: create/edit
  real files with a brief plan. `"instruct"` — no file edits, precise
  file-level guidance. Omitted actionStyle adds nothing (backward
  compatible). Cursor framing updated to obey the stated execution mode.
- **Tool modes** (`tool-modes.ts`): added `vscode` (VS Code / GitHub
  Copilot), `claude-code`, `windsurf` — framing + captions only, no
  integrations. Selector now wraps (6 options).
- **Detail page UX** (`prompt-detail.tsx`): merged the color and copy
  cards into one "Customize & Copy" panel, sticky on desktop
  (`md:sticky md:top-6`, internal scroll if taller than viewport);
  Secondary/Accent/Theme Mode collapsed into a native `<details>`
  "Advanced theme options" disclosure; tightened control gaps. Common
  path (primary color → intent → tool → copy) now fits one view.
- **API**: accepts + validates `actionStyle`; response adds
  `actionStyle` (null when omitted).
- Tests: theme-mode distinction pinned (fixed modes must not carry the
  positive adaptive instructions — first attempt asserted the raw
  substring "prefers-color-scheme" and failed because fixed modes
  legitimately *negate* it; reworked to assert intent), action styles
  (retheme-apply confirm flow, instruct no-edit, build-apply without
  retheme wording), new tool modes distinct via API, light-via-API
  fixed. Suite now **5 files / 55 tests**, all passing.
- Security: leak check clean (no "Product context:"/"RETHEME
  ONLY"/"Execution mode:" in detail HTML); live API POST
  (claude-code + retheme + apply + light) returns all sections.
- `rtk npm test` 55/55; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Figma-style drag layout **still deferred** — this round again fit the
  existing prompt-composition architecture; layout presets
  (feature-ideas #7) remain the recorded middle step.
- Remaining: re-test retheme+apply against real Cursor/Claude
  Code/Windsurf; sticky-panel behavior not checked in a real browser.

## [2026-07-09] layout-presets | Layout Presets (middle step, not a canvas editor)
- Users asked for Figma-style drag-to-arrange; too large for the MVP.
  Shipped **Layout Presets** instead — the middle step recorded in
  feature-ideas #7. Drag-and-drop / canvas editing **remains deferred**
  (new product surface; presets reuse existing prompt composition).
- `prompt-options.ts`: `LayoutPreset` = `auto` (default, adds nothing) +
  centered-hero, split-hero, bento-grid, sidebar-dashboard, pricing-grid,
  card-grid, docs-layout, mobile-app. One structural description per
  preset, wrapped by an intent-dependent directive.
- **Build vs Retheme** (the load-bearing distinction): Build → "required
  structural arrangement", overriding the brief's layout. Retheme →
  "Layout preference (ADVISORY ONLY) … do NOT restructure the existing
  page … preservation rules above take precedence … only change layout
  if the user explicitly asks". Composed after the theme directive so it
  sits below the retheme rules it defers to. Without this split a preset
  would have re-created the exact "AI replaced my page" failure retheme
  mode exists to prevent.
- API: validates `layoutPreset` via `isLayoutPreset()`, invalid/missing
  → `"auto"`; response adds `layoutPreset`.
- UI: `layout-preset-selector.tsx` (new) — a native `<select>` (9 options
  is too many for a segmented control), placed inside the disclosure,
  now "Advanced theme **& layout** options", so panel height/scroll are
  unchanged. In Retheme mode a caption states the preset is advisory.
- Tests: validator/9 presets, auto adds nothing, 8 distinct build
  directives, build strong vs retheme advisory (incl. ordering: RETHEME
  rules precede the advisory note), omitted = no-op; API accepts preset,
  defaults bad values to auto, retheme stays advisory. Suite **5 files /
  64 tests**, all passing.
- Security: no "Product context:", "Layout preset:", or "ADVISORY ONLY"
  in gallery/detail HTML; live API confirmed build vs retheme wording.
- `rtk npm test` 64/64; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: prompt-system.md, copy-mechanism.md, detail-page.md,
  feature-ideas.md (#7 shipped), next-actions.md (item 4), this entry.
- Remaining: presets are one global list, not per-theme (e.g. "Pricing
  Grid" on the docs theme is user-allowed but odd); no real-tool test of
  preset compliance; select not checked in a real browser.

## [2026-07-09] preset-recommendations | Per-theme recommended layout presets
- Closes the "Pricing Grid on the docs theme" oddity flagged in the
  previous entry — without blocking anything.
- `src/lib/layout-recommendations.ts` (new): maps each theme's
  `preview.kind` (one per theme → no new `PromptTheme` field, nothing
  extra shipped to the client) to its suitable presets.
  `getRecommendedLayoutPresets()`, `isRecommendedLayoutPreset()`, and
  `getGroupedLayoutPresets()` → `{ auto, recommended, other }`.
- `layout-preset-selector.tsx`: options now grouped with native
  `<optgroup>` — "Auto / Best fit" first, then "Recommended for this
  theme", then "Other layouts". Chose optgroup over badges/reordering
  because it marks *and* ranks recommendations at **zero added height**,
  honoring the compact-panel constraint. `prompt-detail.tsx` passes
  `prompt.preview.kind`.
- **Nothing is blocked**: every preset stays selectable; a test asserts
  auto + recommended + other equals the full preset list for all 18
  themes. Purely presentational — the built prompt text is unchanged, so
  no API or prompt-composition change.
- Tests: new `tests/layout-recommendations.test.ts` (8) — all 18 kinds
  covered, recommendations are real non-auto presets with no duplicates,
  sensible picks per representative theme (and docs does *not* recommend
  pricing-grid), curated order preserved, auto never inside a group,
  completeness. Suite **6 files / 72 tests**, all passing.
- Verified via `next start` + `curl`: dashboard theme leads with Sidebar
  Dashboard and demotes Docs Layout to "Other"; docs theme leads with
  Docs Layout; no "Product context:" leak.
- `rtk npm test` 72/72; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: prompt-system.md, detail-page.md, next-actions.md, this entry.
- Remaining: recommendations are hand-curated judgment calls, unvalidated
  against real user preference; optgroup styling not checked in a real
  browser (native selects style inconsistently across OSes).

## [2026-07-09] conflict-safe-prompts | Fix option conflicts found in real v0 output
- **Real v0 test**: Startup Landing Hero + Light + Mobile App Layout +
  Build. v0 produced a usable hero but ignored both options — near-black
  background, near-invisible highlighted word, CTA that read as a blank
  dark button, and a desktop centered hero instead of a phone layout.
- **Root cause**: composition order, not wording. Options were only
  *prepended*; the base template's own "Dark, high-contrast background",
  "near-black", `text-white/70`, and centered-hero language arrived last
  and read as the active requirement.
- Fixes in `src/lib/prompt-options.ts` (no architecture change — same
  server-side composition, new ordering):
  1. **Final overrides appended after the base prompt**, so the user's
     choices are read last. Light: "Final theme override: render this as
     a fixed light theme only. Ignore any dark-mode wording from the base
     brief." Dark/system/mono get their own. Build + non-auto preset:
     "Final layout override: use the selected layout preset as the
     required structure…". Retheme adds **no** layout override — the
     preset stays advisory, as before.
  2. **`neutralizeDarkLanguage()`**, applied only in light mode: rewrites
     known dark-only phrases in the base brief in place (near-black →
     near-white, `text-white/70` → `text-black/70`, "Dark surface system"
     → "Light surface system", "one step lighter than the page" →
     "…darker…"). Best-effort substitution over enumerated phrasing —
     `rtk rg` found 13 such phrases across the 18 templates. The final
     override, not the sanitizer, is what guarantees the outcome.
  3. **Contrast rules per theme**: CTA labels legible against their fill
     (4.5:1, never dark-on-dark), heading highlights ≥4.5:1, no
     low-opacity text for important words. Unusual preset pairings now
     say to *adapt* rather than drop the preset ("a marketing hero under
     Mobile App Layout becomes a phone-style landing screen").
- Tests: 11 new (`prompt-options` + `api-build`), incl. an API test that
  reproduces the exact failing v0 combination and asserts the dark
  phrases are gone and both overrides land after "Product context:".
  Suite **6 files / 83 tests**, all passing.
- Security: no "Product context:" or "Final theme override" in
  gallery/detail HTML; live API POST of the failing case confirms zero
  `near-black` / `text-white` occurrences and both overrides present.
- `rtk npm test` 83/83; `rtk npm run lint` clean; `rtk npm run build`
  clean (27 routes).
- Wiki: prompt-system.md, feature-ideas.md, next-actions.md, this entry.
- **Lesson recorded**: prompt options must be conflict-safe *against the
  base template*, not merely present. Adding an option ≠ making it win.
- Remaining: not yet re-tested on real v0 — verified by tests and by
  reading the built text, not by regenerating UI. The sanitizer is
  phrase-matching, so a future template using different dark wording
  could slip through (the final override still covers it).

## [2026-07-09] clip-synthesis-2 | Processed 5 clips (v0 prompting, contrast, tab bars)
- No app code touched. Processed 5 of the 9 newly-clipped raw notes and
  marked them `status: processed`: `How to prompt v0.md` and
  `Maximizing outputs with v0…` (Vercel), `UI Design Prompts…`
  (Superdesign), `Understanding Success Criterion 1.4.3…` (W3C WAI),
  and `Tab bars.md` (Apple HIG).
- **The Superdesign source gap is CLOSED.** `prompt-quality.md` had
  recorded it as "not found in wiki/raw/clips" since the first synthesis
  pass; it is now clipped and processed. That page is rewritten from a
  gap note into real synthesis.
- Rules extracted into [prompt-quality.md](pages/prompt-quality.md):
  v0's three inputs (product surface / context of use / constraints &
  taste); "a label returns the average of that label"; prompts are
  tool-dialects; WCAG 4.5:1 normal / 3:1 large (≥18pt or ≥14pt bold),
  thresholds unrounded, logos exempt unless interactive; Apple's tab-bar
  rules (navigation not actions, always visible, never disable a tab,
  always label, badges only for critical info).
- **Two findings that validate recent work**: (1) Superdesign states a
  prompt "that sings in one tool is mediocre in another" — the first
  external source supporting CopyUI's Tool Mode framing-prefix design,
  which until now rested on judgment. (2) The WCAG clip confirms the
  contrast-vs-opacity lesson from real v0 output: a highlight can
  "pass" a rounded ratio and still be unreadable; fix the color value,
  never dim the text.
- **One gap found in our own templates**: they are strong on product
  surface and constraints but uneven on *context of use* (who uses this,
  in what moment, for what decision) — Vercel says omitting it makes v0
  guess. Recorded as [feature-ideas.md](pages/feature-ideas.md) #8, with
  #9 for Superdesign's four-part context block (its CONVENTIONS slot is
  a plausible new prompt option).
- **Unprocessed and why**: `WebAIM Contrast Checker` (a live calculator,
  not guidance); `Mobbin` (marketing copy); `Human Interface Guidelines`
  (broad index page, `topic: needs-review`); `Navigation bar – Material
  Design 3` — **clipped empty, frontmatter only, 0-byte body**. That
  last one was the intended source for phone-viewport dimensions, so the
  390–430px figure in `prompt-options.ts` remains judgment-based rather
  than source-backed. Re-clip it.
- No large raw content pasted; every rule is a short synthesis with its
  source named inline.

## [2026-07-09] clip-synthesis-3 | Material Design 3 navigation-bar note processed
- Processed `wiki/raw/clips/Material Design 3 - Navigation Bar.md`
  (hand-written, citing m3.material.io) → `status: processed`. It fills
  the phone-viewport gap the previous entry flagged after the two
  auto-clipped M3 files came back near-empty.
- Rules added to [prompt-quality.md](pages/prompt-quality.md): required
  cues for a screen to read as an app (narrow surface, mobile-first
  vertical composition, 44px targets, thumb-reachable actions, bottom bar
  where it fits, no wide desktop hero); a **bottom navigation vs primary
  actions** section; and an enumerated **what-to-avoid** list for the
  observed v0 failure (desktop centered hero, wide max-width sections,
  nav-as-CTA, faint nav labels, logo strips posing as app nav, silently
  reverting to the base template's layout).
- **New rule not yet in the code**: bottom navigation carries
  *destinations* (Home, Search, Settings), never *actions* (Submit, Buy
  now, Start free trial), and the primary CTA must stay dominant rather
  than be absorbed into the bar. `MOBILE_APP_REQUIREMENTS` mandates a
  bottom bar but says nothing about what may go in it — recorded as
  [feature-ideas.md](pages/feature-ideas.md) #10 (trivial: prompt wording
  + tests, one file).
- **Honesty note**: the 390–430px width appears in this note too, but the
  note is ours, not clipped from M3 — the figure still traces to common
  device widths, not a primary source. Recorded as a caveat rather than
  letting it read as a citation.
- Housekeeping: two near-empty duplicate clips remain
  (`Navigation bar – Material Design 3.md`, 564B, and
  `… 3 1.md`, 340B) — both frontmatter/stub only, still `unprocessed`.
  Superseded by this note; safe to delete.

## [2026-07-09] v0-validation-2 | Mobile App Layout PASSES on v0 (docs only)
- No app code changed. Recording the third real v0 test.
- **Startup Landing Hero / v0.dev / Build / Dark / Mobile App Layout →
  PASSED.** Dark theme held; the output now visually reads as a phone/app
  screen at first glance: visible phone-like frame, narrow mobile
  viewport, mobile-first vertical composition, clear CTA, readable accent
  highlight. Major improvement over the earlier desktop-centered hero.
- **What this proves**: appending final theme/layout overrides *after*
  the base brief actually beats the template's own conflicting wording in
  a real tool — previously verified only by tests and by reading the
  built text. The conflict-safe composition lesson holds.
- No bottom tab bar appeared. Judged **acceptable, arguably correct**: a
  single-section landing hero has no genuine top-level destinations, and
  the prompt now explicitly forbids inventing fake ones (bottom nav
  carries destinations, not actions; no logo strips as fake navigation).
  The destination rules did their job by *suppressing* a bad bar, not by
  forcing an empty one.
- Remaining refinement: partner logos render as tappable buttons rather
  than quiet wordmarks — small template/preset wording fix, not a
  composition bug.
- Wiki: prompt-system.md (validation section), next-actions.md (item 4 —
  its "not yet re-tested on v0" caveat was stale), this entry.
- Still untested on v0: Light mode end-to-end, the other 7 layout
  presets, and the VS Code / Claude Code / Windsurf tool framings.
## [2026-07-09] v0-validation-3 | First prompt-option validation pass CLOSED (docs only)
- No app code changed. Recording the latest real validation run.
- **All 3 priority cases PASSED:**
  1. Startup Landing Hero + Light + Mobile App Layout
  2. Analytics Dashboard + Dark + Sidebar Dashboard
  3. Retheme existing UI + Light + Apply Directly (Cursor / Claude Code
     style workflow)
- **Theme Mode now works across the tested cases.** Light is honored as a
  fixed theme — the original failure (Light behaving like System) is
  closed. The light-mode dark-phrase sanitizer plus the final theme
  override are now confirmed in real output, not only in tests.
- **Mobile App Layout produces a phone-like app screen** instead of a
  desktop hero, now confirmed under Light as well as Dark.
- **Sidebar Dashboard works** for dashboard-style prompts — layout
  presets generalize beyond `mobile-app`.
- **Retheme Mode preserves existing structure better** and applies the
  visual changes as intended; Action Style `apply` produced edits rather
  than advice.
- **This closes the first major prompt-option validation pass.** The
  conflict-safe composition order is validated end-to-end.
- Wiki: prompt-system.md (validation section), next-actions.md (item 4),
  this entry.
- Remaining: partner-logo wording fix; the other 6 layout presets and the
  VS Code / Windsurf tool framings are still untested.

## [2026-07-09] context-of-use | Every template now states who/when/decision/success
- Follows the closed validation pass (see v0-validation-3 above), which named
  this as the next task.
- `src/lib/prompts.ts`: added one `Context of use:` paragraph to each of the
  18 hidden `promptTemplate`s, directly after `Product context:`. Each names
  four things: **who** uses the UI, **what moment/task** they're in, **what
  decision or action** the UI must support, and **what success looks like**
  as an observable outcome.
- Why: `Product context:` said what the screen *is*. It never said who is
  looking at it or what they're trying to decide, so the AI had no basis for
  the tradeoffs the rest of the brief asks it to make.
- Deliberately theme-neutral wording — no light/dark or color language — so
  the light-mode sanitizer and the final theme/layout overrides keep working
  untouched. No option behavior changed.
- Hidden-template guarantee holds: the new text lives inside `promptTemplate`,
  which `getPublicPrompts()` still strips; the "no raw template content leaks"
  test greps serialized public data for `Product context:` and passes.
- Validation: `rtk npm test` 98/98 across 6 files, `rtk npm run lint` clean.
  No build run — data-only change, no route or type behavior touched.
- Wiki: prompt-system.md (template anatomy), this entry.

## [2026-07-10] v0-validation-4 | Context-of-use guidance is non-breaking (docs only)
- No app code changed. First real v0 run since the 18 templates gained their
  `Context of use:` paragraph.
- Tested: Startup Landing Hero / v0.dev / Build / Dark / Mobile App Layout —
  the same combination as `v0-validation-2`, chosen so the two are comparable.
- **Result: non-breaking.** The added context did not derail the prompt, and
  the output still renders the phone-like Mobile App Layout. The longer
  opening did not crowd out the final theme/layout overrides — the main risk
  of adding text ahead of the base brief.
- **[uncertain] Not yet judged**: whether the value proposition and headline
  copy *improved*, stayed similar, or regressed versus the pre-context run.
  Non-breaking is not the same as beneficial, and the whole justification for
  the context-of-use pass rests on this question. Compare side by side against
  the `v0-validation-2` output before treating the pass as a win.
- **[uncertain] Not yet re-checked**: whether partner logos still render as
  tappable buttons rather than quiet wordmarks. The wording fix was never
  made, so the defect is presumed present until observed otherwise.
- Wiki: prompt-system.md (validation section), next-actions.md (item 4),
  this entry.

## [2026-07-10] caveman | Token-compression skill processed as reference (docs only)
- Source: [Caveman - Token Compression Skill](raw/clips/Caveman%20-%20Token%20Compression%20Skill.md)
  (github.com/juliusbrussee/caveman). Read as a reference. **Not installed, not
  run, not adopted.**
- Scope note: this is an *agent-workflow* reference, not a prompt-system one. It
  governs how Claude writes responses back to the user, not the hidden templates
  CopyUI sends to v0/Cursor. prompt-system.md was deliberately left untouched.

### Safe principles extracted
- **Cut filler, not substance.** No motivational framing, repeated summaries,
  pasted logs, or narration. Short is the goal; vague is not.
- **Never compress exact technical content.** Code, CLI commands, error
  messages, file paths, API names, package names, test output, and commit
  messages are reproduced verbatim — always. Compression applies to prose only.
- **Keep the CopyUI final-response format**: files changed / commands run /
  result / wiki updated or not / next smallest useful task.
- **Never auto-compress Thai or non-ASCII notes.** The wiki contains Thai-language
  material; a lossy pass over it is unrecoverable.
- **Never run a memory-compression tool without a Git backup and a diff review
  first.** Not on CLAUDE.md, not on wiki pages, not on source files.

### Risks recorded (why it stays a reference)
- **Windows**: install path unverified on this machine; the project runs on
  Windows 11 with PowerShell + Git Bash. Untested.
- **UTF-8 / Thai text**: unknown whether compression is encoding-safe. The wiki
  has non-ASCII content, so a bad pass corrupts source material silently.
- **Over-compression**: a terser agent that drops the *why* behind a change is a
  net loss, not a saving. Token cost is not the only cost.
- **Exact-content corruption**: the highest-severity risk. A compressor that
  rewrites a command, path, or error message produces confidently wrong output
  that reads as correct.
- Every one of these is a *check to run before installing*, not a resolved
  question. None has been tested.

### CLAUDE.md
Not modified in this pass (the task scoped it out). Two real gaps against the
extracted rules, for a later task:
1. The required final-response format omits **result** — it lists files changed,
   commands run, wiki updated, next task.
2. There is **no rule protecting exact technical content** from paraphrase.
   Worth adding regardless of whether Caveman is ever installed; it is a good
   rule on its own.
- Wiki: next-actions.md (new item), this entry. Clip marked `processed`.

## [2026-07-10] trust-copy | In-product answers to the two questions users actually ask
- Early users asked two things repeatedly: **(1)** will the same prompt produce
  the same page every run? **(2)** will Retheme Mode delete good existing code?
  Both were answered nowhere in the product. Now they are.
- New `src/lib/trust-copy.ts` holds all trust copy as data — one source for the
  homepage FAQ, the detail-page retheme note, and the tests. Splitting the
  wording across components would have let the honest phrasing drift.
- `src/components/trust-faq.tsx`: collapsed-by-default accordion at the foot of
  the homepage, 4 questions. `src/components/retheme-safety-note.tsx`: amber
  callout in the detail panel, rendered **only** when Retheme Mode is selected
  (so the Build path is not crowded by a warning that does not apply to it).
- **Honesty was the design constraint, not a caveat on it.** The copy states
  plainly that AI UI tools are not deterministic and that pixels will vary; what
  the prompts hold steady is *direction* (layout intent, hierarchy, component
  choices, constraints, style guidance). Retheme is described as "designed to
  preserve" routes/logic/state/API calls/handlers/behavior — never "safe" or
  "will not delete code" — and it tells users to commit or branch first and
  review the diff, because that is their real safety net, not our wording.
- `tests/trust-copy.test.ts` enforces this: it fails the build if the words
  "guaranteed", "always identical", "never delete", "100% deterministic", or
  "pixel-identical" ever appear in the copy, and asserts the honest hedges
  ("designed to", "usually", "can still make mistakes") are present. A
  reassuring lie here would cost more trust than it buys, so the guard is
  automated rather than left to review.
- Validation: `rtk npm test` 113/113 across 7 files (was 101/6), `rtk npm run
  lint` clean, `rtk npm run build` clean (27 routes). Build run because this
  adds components to two routes.
- Hidden template untouched: the new copy is static strings, reads no prompt
  data, and the homepage HTML test still greps for `Product context:` and finds
  nothing.
- **Not done, deliberately**: a site-wide appearance/theme toggle. Users noted
  CopyUI itself is dark-only. Logged as a later UX task, not bundled here.
- Wiki: next-actions.md (new item 16), this entry.
