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

## [2026-07-10] tool-mode-copy | Launch copy now tracks TOOL_MODES (drift fixed)
- Found in the pre-launch QA audit: CopyUI has supported **6** tool modes
  (v0.dev, Cursor, VS Code / Copilot, Claude Code, Windsurf, GenVibe) since the
  retheme pass, but every user-facing string still advertised **3**. A Claude
  Code or Windsurf user reading the homepage — or a Google result — had no way
  to know they were supported.
- Root cause was not the strings, it was the pattern: the homepage headline, the
  SEO description, the footer, the detail-page metadata, and the prefilled GitHub
  issue bodies each carried their **own hardcoded list**. Adding a 7th tool would
  have re-broken all five.
- Fix: copy is now **derived** from `TOOL_MODES`. New helpers in
  `src/lib/tool-modes.ts` — `TOOL_MODE_LABELS`, `toolModeList()` (all tools, for
  SEO and footer), `toolModeShortList(n)` (headline-safe: leads with the
  best-known tools, "and more" carries the rest, since naming six in an h1 reads
  as a keyword dump). All five call sites consume them.
- Discoverability preserved: the headline stays readable while the full list
  appears in the meta description, the "How it works" step, the footer, and the
  tool-mode selector itself.
- Guards added so this cannot regress: `tests/homepage.test.tsx` asserts every
  `TOOL_MODE_LABELS` entry appears in the rendered HTML; `tests/metadata.test.ts`
  asserts the same for `SITE_DESCRIPTION`. Both fail if anyone hardcodes a list
  again. The old 3-tool strings are explicitly asserted absent.
- Validation: `rtk npm test` 118/118 across 7 files (was 113), `rtk npm run lint`
  clean, `rtk npm run build` clean (27 routes). Build run because SEO metadata
  and two rendered routes changed.
- Prompt behavior untouched: no tool added, no framing prefix changed, no
  template edited. Copy only.
- **Still deferred**: the site appearance / theme toggle (CopyUI itself is
  dark-only). Unrelated to this pass; see next-actions item 16.
- Wiki: next-actions.md (item 16), this entry.

## [2026-07-10] i18n | UI localization (en / th / zh-CN) — prompts stay English
- Early users asked for Thai and Simplified Chinese support for the CopyUI
  website. Shipped as **UI-only localization**.
- **The load-bearing distinction: site language ≠ prompt language.** The copied
  prompt stays English in every locale, because English prompts are more
  token-efficient and more reliable in AI UI/code tools. This is a product
  decision, not an oversight, so it is stated in the UI (a note on the language
  selector and a dedicated FAQ entry) and enforced in tests.
- Approach: plain dictionary in `src/lib/i18n.ts`, no i18n framework. `LOCALES`,
  `t(locale, key, vars)` with `{name}` interpolation, `tCategory()`, and
  English fallback for any missing key. `LocaleProvider` exposes it via context;
  locale persists in `localStorage` under `copyui:locale`.
- **`useSyncExternalStore`, not an effect.** The first cut read localStorage in a
  `useEffect` and called `setState` — lint (`react-hooks/set-state-in-effect`)
  correctly rejected it. localStorage is an external store: the server snapshot
  is always the default locale, so SSR and hydration agree and React swaps in
  the stored locale without a mismatch.
- **Known trade-off**: because the locale is client-side only, server-rendered
  HTML and all SEO metadata (title, description, OG) remain English. Google will
  only ever index the English site. Localizing SEO needs URL-based routing
  (`/th`, `/zh-CN`), which is a real architecture change and was out of scope.
- Translated: homepage hero + How it works, gallery search/sort/category/empty
  state, detail panel labels, all five selectors, copy-button states, trust FAQ,
  retheme safety note, footer. New minimal sticky header holds the language
  selector (labels: English / ไทย / 中文).
- NOT translated, deliberately: `promptTemplate`, built prompt text, API
  response content, tool-mode names (proper nouns).
- Guard: `tests/i18n.test.ts` posts to the build API under every locale and
  asserts the returned text is **byte-identical** and contains no Thai or CJK
  characters. If anyone ever wires locale into the prompt builder, it fails.
- Validation: `rtk npm test` 131/131 across 8 files (was 118/7), `rtk npm run
  lint` clean, `rtk npm run build` clean (27 routes).
- Wiki: next-actions.md (item 18), this entry.

## [2026-07-10] og-card-drift | The last hardcoded 3-tool list, in the social card
- Follow-up sweep on the tool-mode copy drift fixed in `tool-mode-copy` above.
  The homepage, SEO description, footer, detail metadata, and GitHub issue
  bodies were already derived from `TOOL_MODES`. A grep for stale lists found
  **one survivor**: `src/app/opengraph-image.tsx`, which hardcoded
  "v0, Cursor, and GenVibe" in both its `alt` text and the rendered card art —
  and `twitter-image.tsx` re-exports it, so both social cards were wrong.
- This was the worst place for it to hide: the OG card is the *first* thing
  anyone sees from a shared link, and it had **no test at all**, which is
  precisely why it outlived the sweep that fixed everything else.
- Fix: `alt` is now `SITE_TAGLINE` (already derived), and the card art uses
  `toolModeShortList(3)`. Both now track `TOOL_MODES`.
- **Localized copy needed no change** — `en`/`th`/`zh-CN` all interpolate
  `{tools}`, so they inherit the derived list. Verified by grep, not assumed.
- Tests: two new in `tests/metadata.test.ts` — the OG `alt` must equal
  `SITE_TAGLINE` and must not contain the old 3-tool string; the Twitter alt
  must equal the OG alt. The social card now has coverage for the first time.
- **The build caught a bug the tests could not.** Interpolating as
  `text {expr}` gave the tagline `<div>` two children, and Satori (next/og)
  requires an explicit `display` on any multi-child div — `npm test` passed
  while `/twitter-image` failed to prerender. Collapsed to a single template
  string. A reminder that OG routes are only exercised at build time.
- Validation: `rtk npm test` 133/133 across 8 files, `rtk npm run lint` clean,
  `rtk npm run build` clean (27 routes, both image routes prerender).
- Prompt behavior untouched; no tools added.
- **Still deferred**: site appearance / theme toggle (next-actions item 16).
- Wiki: next-actions.md (item 17), this entry.

## [2026-07-10] html-lang | Fixed <html lang> lying to screen readers (a11y)
- **Bug I introduced with the i18n pass.** `document.documentElement.lang` was
  only written inside `setLocale`, so a *returning* visitor — whose locale is
  restored from localStorage, and who therefore never clicks the selector —
  got Thai or Chinese text served under `<html lang="en">`. Screen readers
  pronounce that with an English voice. Real accessibility defect, aimed
  squarely at the users the localization was added for.
- Fix: the lang write moved out of `setLocale` and into a `useEffect` keyed on
  the **resolved** locale from `useSyncExternalStore`. One mechanism now covers
  both paths (restore-on-load and explicit switch) instead of only the second.
  The effect writes a DOM attribute, not React state, so the
  `react-hooks/set-state-in-effect` rule that shaped the original design still
  holds. `layout.tsx` keeps `lang="en"` as the server default — no hydration
  mismatch.
- Extracted `readStoredLocale(storage)` and `syncDocumentLang(locale, target)`
  as pure helpers over narrow shapes (`Pick<Storage,"getItem">`,
  `{documentElement:{lang}}`) so the returning-visitor path is testable in the
  node environment. The suite still has no jsdom/testing-library dependency.
- 4 new tests: stored `th` → `lang="th"`, stored `zh-CN` → `lang="zh-CN"`,
  unrecognized/absent → `en`, and relabelling on *every* change, not just the
  first. Prompt output is still asserted byte-identical across locales with no
  Thai/CJK characters.
- **Root-cause note for the next feature**: the original code was correct for
  the path it was written against (user clicks selector) and wrong for the path
  nobody tested (user returns). Client state restored from storage has two
  entry paths; a DOM side effect must key off the resolved value, never the
  event.
- Validation: `rtk npm test` 137/137 across 8 files (was 133), `rtk npm run
  lint` clean, `rtk npm run build` clean (27 routes).
- Prompt builder untouched; no locale reaches the API.
- Wiki: next-actions.md (item 18), this entry.

## [2026-07-12] launch-blockers | SITE_URL verified, html lang a11y fixed
- External production check complete: `NEXT_PUBLIC_SITE_URL` is fixed in deploy
  env; production `/sitemap.xml` and `/robots.txt` no longer contain localhost.
- `<html lang>` accessibility bug fixed: the client now syncs the DOM attribute
  from the resolved locale after hydration and on locale changes.
- Remaining launch items: Copy button contrast, README update, final QA rerun.

## [2026-07-10] readme | README rewritten for launch accuracy (docs only)
- No app code changed. The README was the **last stale surface** in the repo,
  and the most public one — it is what a GitHub visitor reads first.
- It was badly out of date, in ways that undersold and misrepresented the
  product:
  - Headline and Tool Mode section advertised only **v0 / Cursor / GenVibe**
    (3 of the 6 supported tools).
  - Claimed **"No automated tests yet"** — there are **137**.
  - Claimed **"Only one prompt template has been validated"** — the first
    validation pass closed with 3 priority cases passing.
  - Documented **none** of Theme Mode, Retheme Mode, Action Style, Layout
    Presets, context-of-use templates, the trust FAQ, or localization.
- Rewritten: all 6 tool modes named; every current feature listed; a new
  **"What to expect from AI output"** section carrying the same honest hedges
  as the in-product trust copy (not deterministic, direction is what holds
  steady, commit/branch and review the diff before accepting a Retheme, use
  Instructions Only on risky codebases); a new **"Copied prompts stay in
  English"** section explaining the token-efficiency/reliability rationale.
- No overpromising: no "guaranteed", no "always identical", no "never deletes
  code". The README now matches the honesty bar the UI copy is held to.
- Limitations section now states the real open gaps: English-only SEO metadata
  and unreviewed Thai/Chinese translations.
- Kept concise — no architecture dump, no prompt templates pasted.
- Wiki: next-actions.md, this entry.
- **Next: final production QA rerun** before launch.

## [2026-07-10] cta-contrast | Copy button foreground now derived from primaryColor
- **The last known user-facing defect.** The Copy button painted the
  user-chosen `primaryColor` as its background with a hardcoded `text-white`
  label. Flagged in three successive audits and carried forward each time.
- New `src/lib/color-contrast.ts`: `parseHex()` (3- and 6-digit, with or
  without `#`, null on garbage), `relativeLuminance()` (WCAG sRGB
  linearization), `contrastRatio()`, and `readableForeground()` which returns
  whichever of near-black (`#0c0c0e`) or white contrasts better. Invalid colors
  fall back to white — the previous behavior — rather than rendering something
  unexpected. `copy-prompt-button.tsx` now sets `color` from it and drops
  `text-white`.
- **The tests found a second bug I was not looking for.** I asserted `#8b5cf6`
  (the Startup Landing Hero default) should keep white text. It failed. White
  on that violet is only **4.23:1 — below the 4.5:1 WCAG AA floor for normal
  text**; near-black reaches 4.61:1 and passes. So the hardcoded white was
  quietly non-compliant on the *default* theme too, not only on the yellow one
  that exposed the issue. The maximize-contrast rule is simply more correct
  than the convention. Expectation corrected, and the surprise recorded in the
  test so nobody "fixes" it back.
- Added a dataset-wide guard: **all 18 shipped `defaultPrimaryColor` values**
  now clear 3:1 against their derived foreground. A future theme with a bad
  brand color fails the suite instead of shipping.
- 13 new tests (150 total, 9 files). Prompt output, i18n, tool/theme modes, and
  the hidden-template guarantee are untouched and still green.
- Also corrected the **stale `next-actions.md` status header** — it was dated
  2026-07-09, still described Tool Mode as "v0.dev / Cursor / GenVibe", and
  stopped at layout presets. It now reflects six tool modes, context-of-use
  templates, the trust FAQ, localization, the closed validation pass, verified
  `NEXT_PUBLIC_SITE_URL`, and this fix.
- Validation: `rtk npm test` 150/150, `rtk npm run lint` clean, `rtk npm run
  build` clean (27 routes).

## [2026-07-10] generated-examples-v1 | Static "what this creates" preview metadata
- **Goal**: let users see the expected outcome *before* copying, to improve trust
  and conversion. Post-launch feature, deliberately bounded.
- **What it is NOT**: no database, no uploads, no auth, no external API, no real
  AI generation, no screenshots. `src/lib/generated-examples.ts` is hand-written
  public metadata — one entry per prompt, 18 total.
- Shape per example: `exampleTitle`, `outcomeSummary`, `layoutPreview` (schematic
  rows), `keyElements` (4–6), `bestFor` (2–4), `suggestedToolModes` (real
  `ToolMode` ids), `visualNotes` (2–4), optional `expectationNote` naming where a
  run is most likely to drift (e.g. "chart libraries vary by tool").
- **Rendered as labelled schematic blocks, never a fake screenshot.** Showing
  something that *looks* like real generated output when it is not would be the
  exact overpromise the rest of the product spent weeks avoiding. The structure
  is honest about being a structure.
- Homepage: `ExampleShowcase` — 4 featured examples spread across categories,
  below the gallery, above the trust FAQ. Detail page: `ExampleOutcome` — full
  breakdown *below* the copy panel, so it informs the decision without
  interrupting the copy flow.
- **Safety, verified two ways.** This data ships to the browser, so it is
  hand-written, never derived from `promptTemplate`. Tests assert it contains no
  template markers (`Product context:`, `Context of use:`, `Target tool:`,
  `{{primaryColor}}`, `RETHEME ONLY`, …) and never reproduces any template's
  opening 60 characters. Then `next start` + `curl` on a real detail page:
  **0 matches** for `Product context:` / `Context of use:`, with the examples
  section rendering correctly.
- Honesty guard: a test fails the build if the example copy ever says
  "guaranteed", "always identical", "same result every time", "pixel-perfect",
  or "100% deterministic" — and asserts the direction-setting language
  ("designed to", "expect", "may differ") is present. Same bar as the trust copy.
- **Localization**: section chrome (headings, labels, the vary-note) is fully
  localized en/th/zh-CN. Per-prompt example *content* stays concise English in
  v1 — translating 18 × 6 fields was out of budget, and the localized note
  states plainly that examples describe intended direction and the copied prompt
  remains English. Recorded as a known v1 gap, not an oversight.
- Prompt builder, prompt output, tool/theme modes, and i18n behavior: untouched.
- Validation: `rtk npm test` **160/160 across 10 files** (was 150/9),
  `rtk npm run lint` clean, `rtk npm run build` clean (27 routes).
- **Future option, not built**: real screenshots from validated runs, or
  user-submitted examples. Both need storage/moderation — out of scope for v1.
- Wiki: next-actions.md (item 20), prompt-system.md, this entry.

## [2026-07-10] examples-validation-1 | Generated Examples v1: first 3 validated on real output
- No app code changed. **No example metadata needed correcting** — the three
  tested entries matched what v0 actually produced.
- Validated on v0.dev:
  1. **Pricing Table + Light + Pricing Grid** — visually strong; matched the
     intended pricing-grid direction.
  2. **AI Chat Interface + Dark + Mobile App Layout** — theme held, polished,
     followed the mobile-app direction.
  3. **E-commerce Product Page + Light + Card Grid** — matched expectations
     very well, better than expected; followed the card-grid direction.
- **Why this matters more than the individual results.** When Generated
  Examples v1 shipped, its weakest point was recorded plainly: the examples
  were written from the *templates' intent*, not from observed output, so every
  `outcomeSummary` and `expectationNote` was an informed guess. Three of them
  are now evidence rather than prediction, and none of the three needed
  changing — which is the first sign the guesses were calibrated, not merely
  confident.
- All three ran on **v0**, which each entry already listed in
  `suggestedToolModes` — so the tool suggestions are confirmed for these three,
  but the Cursor / Claude Code suggestions on the same entries remain untested.
- **15 of 18 examples remain direction-only** (unvalidated against real output).
  They are honest — the copy never claims otherwise, and the honesty guard
  still fails the build on "guaranteed" / "pixel-perfect" / "always identical" —
  but they are still expectations, not observations. Keep validating as users
  test prompts; keep the wording direction-setting either way.
- Two accumulating signals worth noting across the whole project: **Light theme
  now has two independent passing runs** (Pricing Table, E-commerce), and
  **Mobile App Layout has held on a second, very different prompt** (AI Chat,
  after the Startup Landing Hero run). Both were once the biggest known
  failures. The conflict-safe composition continues to hold.
- Wiki: next-actions.md (item 20), prompt-system.md (validation section), this
  entry.

## [2026-07-10] retheme-validation-1 | First Retheme run against a real existing frontend
- No app code changed. **The first time Retheme Mode was tested on real existing
  code**, rather than reasoned about. Every prior validation run was Build mode,
  which cannot damage anything.
- Case: retheme an existing page from **SaaS Analytics Dashboard** style to
  **Analytics Command Center** style.
- Result: **PASSED.** Only the intended page changed — no broad rewrite, no
  unrelated page damage. Theme moved light/white → dark as requested. Accent
  direction followed. Result polished and usable. Existing structure and
  behavior appeared preserved.
- **Why this run mattered.** Retheme is the only mode where a bad prompt can
  destroy a user's work rather than merely disappoint them. The preservation
  block (routes, logic, state, API calls, event handlers, behavior) had until
  now only been verified by reading the built prompt and by tests asserting the
  wording was *present*. Presence of wording is not obedience to wording.
- **What it does NOT establish:** "appeared preserved" is an observation, **not
  a line-by-line diff audit**; **the tool used was not recorded** (Retheme
  framing differs per tool, so this validates one path, not the mode); n=1.
- Trust copy unchanged: Retheme is *designed to* preserve. Users still
  commit/branch and review the diff.
- **NOTE (restored 2026-07-10)**: this entry was written, then lost when a
  temporary validation branch was discarded before it had been committed.
  Recovered and re-logged. Lesson: commit wiki entries before creating
  throwaway branches, or they die with them.

## [2026-07-10] retheme-validation-2 | Claude Code: Retheme layout preset advisory behavior held, n=1
- No app code changed — run on a throwaway branch; working tree is back on
  `main` and clean. Docs only.
- **Tool used: Claude Code (model claude-fable-5)** — recorded by name, closing
  the "tool not recorded" gap opened by `retheme-validation-1`.
- Prompt generated through the **real build API**, not hand-written. Echoed
  options: `retheme / apply / dark / mobile-app / claude-code / #ca8a04`,
  template `restaurant-menu-page`.
- **Test design**: retheme CopyUI's own homepage (a wide desktop marketplace
  grid) with **Mobile App Layout** selected — deliberately the preset that
  conflicts most violently with the target's structure. If the advisory rule
  leaks, a phone frame appears and it is unmissable.
- **Result: advisory behavior HELD.**
  - Diff: **7 lines, every one a `className` edit.** No JSX structure changes.
  - Visual only: warm near-black surface (`#050505` → `#0d0a04`), serif
    editorial headings, gold-tinted eyebrow/step icons, amber active category
    pill.
  - No routes, handlers, state, API calls, i18n keys, or components touched.
  - **No phone frame, no 390–430px viewport cap, no bottom tab bar, no
    thumb-zone CTA relocation** — zero structural leakage from the preset.
  - `rtk npm test` **160/160**, `rtk npm run lint` clean.
- Bonus confirmation: the built prompt carried only the *advisory* hint, not the
  `Mobile App Layout — hard requirements` block. The build-mode gate in
  `finalOverrides()` works on the real API path, not just in unit tests.
- **Caveats, and they matter more than the result:**
  - **n=1, Claude Code only.** This says nothing about whether Cursor,
    Windsurf, or VS Code / Copilot will obey the same advisory wording.
  - **The tool under test was also the judge.** Claude Code executed a prompt
    it knew was a test, and the advisory wording was authored by the same
    model family. Useful evidence, but **charitable** evidence — a genuinely
    adversarial case is a tool with no stake in the outcome.
  - Log line, verbatim: *"Claude Code: Retheme layout preset advisory behavior
    held, n=1."* **Do NOT generalize to "Retheme layout presets are safe."**
- Trust copy unchanged. Users still commit/branch and review the diff.
- Wiki: next-actions.md (item 4), prompt-system.md, this entry.

## [2026-07-10] retheme-validation-3 | Cursor: mostly successful, n=1 — first real defect found
- No app code changed — throwaway validation branch. Docs only.
- **Tool used: Cursor.** Options: `retheme / apply / dark / mobile-app /
  #ca8a04`. This is the first Retheme validation on a tool with **no stake in
  making CopyUI's prompt look good** — the adversarial case that
  `retheme-validation-2` (Claude Code judging itself) explicitly could not
  provide.
- **Result: PARTIAL PASS. Mostly successful, not clean.**
  - Cursor applied the visual retheme to the existing page successfully.
  - Theme and color direction applied as requested.
  - **The page became usable on mobile where it had not been before** — a real
    functional improvement, not just a restyle.
  - Existing functionality appeared preserved. No broad rewrite, no unrelated
    page damage.
  - Layout preset did **not** appear to cause unsafe restructuring — consistent
    with the Claude Code run, now on an independent tool.
  - **Defect found**: one minor mobile responsive regression — a metric value
    **overlapped an Alert badge** inside a card.
- **The defect is the most valuable thing in this run.** Every prior validation
  passed clean, which made the "AI tools can still make mistakes — commit,
  branch, review the diff" guidance true but *unillustrated*. Now there is a
  concrete instance: a real tool, following the prompt faithfully, produced a
  visual regression a human reviewer would catch in seconds and an automated
  check would not. The safety copy is no longer theoretical, and it should not
  be softened.
- **Signal on the preset rule**: two independent tools (Claude Code, Cursor) have
  now honored the advisory-only treatment of layout presets in Retheme mode.
  That is a real strengthening — the previous n=1 was self-judged.
- **Caveats:**
  - **n=1 for Cursor.** Do **not** claim Cursor Retheme is universally safe.
  - The overlap suggests the prompt's responsive/hierarchy rules may under-
    specify collision behavior when a badge and a large numeral share a card at
    narrow widths. **[uncertain]** — one instance is not a pattern. Do not
    rewrite prompt wording on the strength of a single overlap; wait for a
    second occurrence before treating it as a template bug rather than a
    tool artifact.
  - Windsurf and VS Code / Copilot remain entirely unvalidated for Retheme.
- Trust copy unchanged, and now demonstrably earned.
- Wiki: next-actions.md (item 4), prompt-system.md, this entry.

## [2026-07-10] ux-polish-1 | Contrast pass + trust/examples clarity fixes
- Focused UX/UI polish pass before wider public testing. No redesign, no new
  systems, no appearance toggle (deferred — see below). 3 fixes.

### Audit — top findings
1. **[a11y, site-wide] Low-contrast body text fails WCAG AA.** `text-white/40`
   = 3.71:1 and `text-white/45` = 4.49:1 on the `#050505` surface — both below
   the 4.5:1 floor for small text, across 12+ places (home intro, gallery,
   cards, footer, trust FAQ, examples, quality checklist, detail panel). This
   is the highest-impact issue: measurable, everywhere, and it undercuts the
   product's own contrast-quality pitch.
2. **[clarity] Trust FAQ subhead was the wrong text.** It reused `lang.note`
   ("Prompt output stays in English…"), which is about *language*, under a
   heading about output *consistency and safety*. Mismatched.
3. **[trust] Example schematics could read as screenshots.** Direct user
   feedback. The blocks are schematic, but nothing said so in words.
- Lower-priority / not done this pass: homepage section rhythm is already
  correct (gallery heading text-xl is visibly primary; examples/FAQ text-sm are
  subordinate); tool/action pills already `flex-wrap`; empty/search states
  already exist. No change needed — noted so the next pass doesn't re-audit them.

### Fixes implemented
- **Contrast**: raised failing text tiers site-wide — `/40`→`/55` (6.22:1),
  `/45`→`/55`, footer `/35`→`/50`. Text colors only; decorative
  borders/backgrounds/aria-hidden icons untouched. All body text now clears AA.
- **Trust FAQ** now has its own `faq.subhead` ("Straight answers about
  consistency and safety — including what these prompts can't promise") instead
  of the language note. New key, all 3 locales.
- **Example schematics** carry an explicit `examples.schematic`
  ("Schematic — not a screenshot") micro-label on the homepage cards. New key,
  all 3 locales. The detail view already labels the block "Typical structure"
  plus a vary-note, so no redundant label added there.
- Caught myself reintroducing the bug: the new schematic label first shipped at
  `text-white/35`. Bumped to `/50` — a contrast pass that adds failing text
  would be self-defeating.
- Localization: 2 new keys × 3 locales; Thai/Chinese kept short. `lang.note`
  retained (still the language-selector tooltip), so i18n tests that pin it are
  untouched.
- Tests: homepage assertions updated (FAQ subhead + schematic label); the stale
  assertion that `lang.note` renders on the homepage was wrong and is replaced —
  the language note lives on the selector, not the FAQ. **160/160.**
- Safety: hidden-prompt guarantee re-verified on a live server — `curl` of home
  and detail shows **0** matches for `Product context:` / `Context of use:`.
  Prompt builder, prompt output, and trust wording all untouched. No overpromise
  language added; the honesty guards still pass.
- Validation: `rtk npm test` 160/160, `rtk npm run lint` clean, `rtk npm run
  build` clean (27 routes).

### Deferred (intentional)
- **Website appearance / theme toggle NOT built** — the "site feels like one
  theme" feedback. Still a genuine change (`dark` hardcoded on `<html>`), out of
  scope for a polish pass; remains next-actions item 16.
- Real screenshots / user-submitted examples — needs storage/moderation.
- Wiki: next-actions.md (item 21), this entry.

## [2026-07-10] appearance-toggle | Website Appearance (Dark/Light/System) shipped
- Direct fix for the "site feels like one visual theme" feedback (deferred
  twice before, item 16). Separate concept from the prompt builder's Theme
  Mode — that distinction is the whole safety story and is stated in the UI.

### Architecture
- `src/components/appearance-provider.tsx`: same pattern as `locale-provider.tsx`
  — `useSyncExternalStore` over `localStorage` (`copyui:appearance`), a DOM
  write in a `useEffect` keyed on the *resolved* value (not `setState` in an
  effect — the lint rule that shaped the locale provider holds here too), and
  a `matchMedia("(prefers-color-scheme: dark)")` listener so System live-
  updates if the OS theme changes mid-session. Default is **dark** — the
  existing brand identity; the toggle adds an option, it doesn't flip the
  default. Server snapshot is always `dark`, matching `layout.tsx`'s static
  `dark` class, so there is no hydration mismatch.
- `src/components/appearance-selector.tsx`: compact `<select>` next to the
  language selector in a new header row, Moon/Sun/Monitor icon reflecting the
  current choice, `title` tooltip stating explicitly that this changes the
  website only — not a copied prompt's Theme Mode. Localized en/th/zh-CN.
- Applies `.dark` on `<html>` via `classList.toggle`, which the existing
  `@custom-variant dark (&:is(.dark *))` in `globals.css` already keys off of.

### Styling — token conversion, not a redesign
`globals.css` already had a full shadcn light/dark token system
(`:root`/`.dark`, `--background`, `--foreground`, `--muted-foreground`,
`--border`, `--card`, …) that most custom components simply weren't using —
they hardcoded raw values (`bg-[#050505]`, `text-white/NN`, `border-white/NN`)
instead. That's the actual root cause of "only one theme": the token
infrastructure existed and was half-ignored.
- Added 3 new tokens for fill tiers with no existing equivalent —
  `--fill-subtle`, `--fill-hover`, `--fill-sunken` — defined per-theme in both
  `:root` and `.dark`, wired through `@theme inline`.
- **Mechanically converted 19 components** via a single ordered find-and-replace
  script (longest/most-specific token first, to avoid a short pattern eating
  part of a longer one) mapping the fixed raw-color vocabulary — `text-white/*`,
  `border-white/*`, `bg-white/*`, `bg-black/30`, `bg-[#050505]`, `bg-[#0c0c0e]`
  — onto `text-foreground`/`text-muted-foreground`, `border-border`/
  `border-foreground/NN`, `bg-fill-*`, `bg-background`, `bg-card`. Scripted and
  bounded, not hand-redesigned: same visual rhythm, same hierarchy, different
  source of truth. Covers homepage, prompt detail, cards, examples, FAQ,
  footer, all 5 prompt-option selectors, and the language/appearance selectors.
- 2 components needed manual `dark:` variants instead of pure tokens, since
  they carry a fixed accent hue rather than a neutral surface:
  `retheme-safety-note.tsx` (amber tones — the dark values were unreadable as
  a pale-on-pale wash against a light page) and `prompt-card.tsx`'s hover
  shadow (a hardcoded white-ring glow tuned for dark backgrounds; light mode
  gets a plain soft drop shadow instead).
- **Tuned one existing shadcn default**: light-mode `--muted-foreground` was
  `oklch(0.556)`, which measures ~3.8:1 on white — below the 4.5:1 floor for
  small text, the same class of bug fixed in dark mode two passes ago.
  Darkened to `oklch(0.44)` before it shipped, not after a user found it.
- **Deliberately left untouched**: `prompt-preview.tsx` (the 18 per-theme
  mockup renderers). These simulate a dark app screenshot regardless of site
  chrome — the same way a code editor's syntax theme doesn't have to match the
  IDE's UI theme. Converting them would be a redesign of the mockups
  themselves, not an appearance toggle.

### Safety verification
- `promptTemplate`, the build API, and `Theme Mode` inside the prompt builder
  are untouched — appearance is a CSS/DOM-only concern, never sent to the
  server. New test: POST the build API with `appearance: "light"` in the body
  and assert the response is byte-identical to a request without it, and that
  `appearance` never appears as a response key; also asserts `themeMode` output
  is unaffected across all 3 appearance values.
- Re-verified on a live server: `curl` of home and detail shows **0** matches
  for `Product context:`; the build API response for any request has exactly
  the same 6 keys as before, `appearance` is not among them.
- Existing i18n byte-identical-across-locales tests untouched and still pass.

### Deferred / limitations
- The 5 prompt-option selectors and detail panel are visually consistent in
  both themes but have had **no dedicated manual QA pass in a real browser** —
  verified only via the token conversion's correctness and the render tests,
  same caveat as every prior visual change in this project.
- No dark-only copy assumptions found in visible strings during this pass, but
  this was not an exhaustive per-string audit.
- Tests: `rtk npm test` **173/173 across 12 files** (was 160/10; 2 new test
  files, `appearance.test.ts` and `site-header.test.tsx`). `rtk npm run lint`
  clean. `rtk npm run build` clean (27 routes).
- Wiki: next-actions.md (item 16, now done), this entry.

## [2026-07-10] appearance-qa-1 | Manual browser QA: homepage checked, detail page still open
- No app code changed. Docs only.
- **Homepage: checked in production, both Dark and Light.** Header,
  appearance selector, language selector, search, sort, category pills, and
  the prompt grid all render correctly in both modes. **No blocking visual
  issues found.**
- Light mode's actual verdict: it **improves accessibility and makes the site
  read as more than one theme** — the thing users originally asked for.
- **Prompt preview thumbnails stay dark/stylized in both modes — confirmed
  intentional, not a bug.** They're illustrative mockups, not guaranteed
  generated output, so they aren't expected to follow site appearance. This
  matches the deliberate exception recorded when the toggle shipped
  (`prompt-preview.tsx` was left untouched on purpose).
- **Detail page: NOT yet checked.** The QA report handed to this entry
  contained a template placeholder rather than a completed result for the
  detail page ("still needs or has completed a quick check depending on the
  latest manual QA result") — no explicit confirmation that the check
  happened. Recording it as open rather than assuming a pass, since the
  detail page carries the highest-stakes surfaces of the toggle: the copy
  panel, all 5 prompt-option selectors, Generated Examples, and the Trust /
  Retheme safety UI (the amber tones that needed a manual `dark:` split
  specifically because the token conversion couldn't cover them).
- Wiki: next-actions.md (item 16), this entry.

## [2026-07-10] appearance-qa-2 | Manual browser QA: detail page checked, item 16 closed
- No app code changed. Docs only. Closes the gap left open by
  `appearance-qa-1`, which explicitly deferred the detail page.
- **Detail page: checked in production across all three appearance
  modes — Dark, Light, and System.** No blocking visual issues found.
- Confirmed individually: copy panel; the Copy button itself, readable in
  all three modes (this is the button whose contrast was a real bug fixed
  two passes ago — worth confirming it stayed fixed under the new appearance
  system, not just under the dark theme it was originally patched against);
  Prompt Intent, Tool Mode, Theme Mode, Action Style, and Layout Preset
  selectors; Generated Examples renders cleanly; the full copy flow still
  works end to end.
- **Retheme safety note**: confirmed it appears only when Retheme Mode is
  selected, and confirmed **readable in both Light and Dark** — this was the
  one component in the whole conversion that couldn't use a plain token swap
  (its amber accent needed a manual `dark:` variant split, since the dark-mode
  amber values would have gone pale-on-pale unreadable against a light page).
  This is the first real-browser confirmation that fix actually works, not
  just that the classes compile.
- **With this, both halves of the toggle's manual QA are complete**: homepage
  (`appearance-qa-1`) and detail page (this entry). No open visual gaps
  remain for the Website Appearance Toggle.
- Wiki: next-actions.md (item 16, closed), this entry.

## [2026-07-10] growth-section | "Help improve CopyUI" + share block shipped
- Product-growth polish, not a validation task. Goal: give early testers with
  no existing community an easy way to give feedback, request prompts, report
  confusing output, and share the site.
- **New**: `src/components/growth-section.tsx` — compact homepage section
  after the Trust FAQ, before the footer: short headline + explanation, the 3
  feedback actions as an inline pill row, and a share-text block with a copy
  button.
- **Feedback links centralized, not duplicated.** `src/lib/feedback.ts`
  already existed (used by the footer) — extended rather than forked. Each
  link now has a stable `id` (`giveFeedback` / `requestPrompt` /
  `reportOutput`); display text moved out of `feedback.ts` and into
  `i18n.ts`'s `feedback.<id>.*` keys, so the footer and the new homepage
  section render the same localized copy from one source instead of two
  hardcoded English strings drifting apart. `feedback.ts` itself now only
  builds URLs — GitHub issue bodies stay English on purpose, since they're
  read by maintainers, not visitors.
- **External feedback form: config shape added, no fake URL.** New
  `EXTERNAL_FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL || null` and
  `getFeedbackHref(id)`. When unset (today), every action falls back to
  GitHub Issues. If set later, only `giveFeedback` — the general, unstructured
  action — redirects to it; `requestPrompt` and `reportOutput` always keep
  their structured GitHub issue templates, since a generic external form
  wouldn't carry the same prefilled fields. No Google Form/Tally/Typeform
  placeholder was hardcoded — a fake link is worse than none.
- **Share text is derived, not hardcoded**: `"CopyUI is a prompt marketplace
  for generating and retheming UI with {tools}."` with `{tools}` filled by
  `toolModeList()`, so it can't go stale the way the old 3-tool copy did.
  Copy button uses plain `navigator.clipboard.writeText`; on failure the text
  stays fully selectable in the block, so nothing is lost — no new dependency.
- **Design**: deliberately lighter than the footer's existing feedback card
  grid (pill row here vs. cards there) so the two don't read as duplicate UI
  on the same page. Footer's fuller treatment is kept as-is and untouched in
  substance — still the only feedback surface on prompt detail pages, which
  don't render the homepage's growth section.
- Localization: all new UI copy (headings, feedback labels/descriptions,
  share text, button states) localized en/th/zh-CN. Technical terms
  (prompt, Retheme, tool names) kept unlocalized per convention.
- Trust: no new overpromising language; homepage test suite now guards the
  growth section specifically for "guaranteed" / "pixel-perfect" / etc., same
  bar as the trust FAQ and generated examples.
- Hidden-prompt safety: unaffected — this is homepage UI copy with no
  connection to `promptTemplate` or the build API. Verified on a live server:
  0 matches for `Product context:`.
- Explicitly NOT added: auth, database, admin, comments, user accounts,
  analytics dashboard, URL-based locale routing, any new external API call.
- Tests: 2 new files (`tests/feedback.test.ts`, plus additions to
  `tests/homepage.test.tsx`). `rtk npm test` **183/183 across 13 files**
  (was 173/12). `rtk npm run lint` clean. `rtk npm run build` clean
  (27 routes).
- Wiki: next-actions.md (new item), this entry.
