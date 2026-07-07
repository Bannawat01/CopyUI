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