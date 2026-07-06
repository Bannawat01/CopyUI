# Gallery Page

**Status: [implemented]**

## Location
`src/app/page.tsx` (server component) + `src/components/gallery-search.tsx`
(client component holding search state).

## Behavior
- Redesigned as a premium dark template marketplace rather than a generic
  product grid: page background is near-black (`bg-[#050505]`), content
  width increased to `max-w-7xl`, and the hero is now a compact left-aligned
  header (small eyebrow, title, subtext) with a bottom border, so it reads
  as a page header rather than the main event — the template grid is now
  the visual focus.
- `GallerySearch` is a client component that filters prompts client-side by
  title, description, and tags. The search bar moved inline next to a
  "Browse Templates" heading (marketplace-style toolbar row) instead of
  living in the hero; still `type="search"` with the same
  `aria-label="Search prompts by title, tag, or keyword"`.
- Responsive grid (`PromptGrid` → `PromptCard`, 1/2/3 columns, wider gaps —
  `gap-5` to `lg:gap-8`) of template tiles. Each tile leads with a large
  16:9 (`aspect-video`) screenshot-like preview, with title, tags, and
  creator/copies metadata below — see below and [detail-page.md](detail-page.md).
- Empty state now animates in (`PromptGrid`, fade + slight rise, 0.25s)
  instead of appearing abruptly, and shows whenever search + category
  combine to zero results, not just on an empty search.
- Motion pass: `PromptGrid` wraps its cards in Framer Motion's
  `AnimatePresence` (`mode="popLayout"`) so the initial gallery load reveals
  cards with a staggered fade/rise (each card delayed
  `min(index * 0.035s, 0.28s)` so a full 18-card grid still finishes well
  under half a second — subtle and fast, not a slow curtain-reveal).
  Filtering by search or category re-runs the same list through
  `AnimatePresence`: cards that drop out of the filtered set animate out
  (fade + scale down) rather than vanishing instantly, and cards that
  remain reflow smoothly into their new grid position via the `layout`
  prop — no re-entrance replay for cards that were already visible.
  Category pills also animate: the active pill's white background is a
  single `motion.span` with a shared `layoutId`, so selecting a different
  pill slides/morphs the highlight between buttons instead of an instant
  color swap.
- Card hover is now a fuller "premium tile" interaction: a Framer Motion
  lift (state-driven `animate`, spring transition), a soft
  `{{defaultPrimaryColor}}`-tinted glow at the top of the card, a
  brightened border, the preview image scaling up slightly (`scale-[1.04]`)
  inside its clipped frame, and the creator/copies metadata row brightening
  from `text-white/40` to `text-white/60`. The entire card (image +
  metadata) is one stretched `Link` (`absolute inset-0` positioned as the
  card's last child) so it's a single click/keyboard target, with a visible
  focus ring via `has-[a:focus-visible]`. Keyboard focus on that link now
  triggers the *same* lift/glow/scale/metadata treatment as mouse hover
  (via a shared `active` boolean state set by both `onMouseEnter`/
  `onMouseLeave` and the link's `onFocus`/`onBlur`, plus parallel
  `group-focus-within:` Tailwind classes alongside every `group-hover:`
  one) — none of the premium interaction is hover-only.
- Preview visuals: `PromptPreview` was rewritten from small abstract glyphs
  to richer, screenshot-like mockups per `preview.kind` — see
  [prompt-system.md](prompt-system.md) and [styling.md](styling.md) for
  what changed and why.
- Card metadata: each tile now shows a mock creator (initial-avatar +
  name) and a "N copies" stat, sourced from a new `meta` field on
  `PromptTheme` — local/mock only, no accounts or backend.
- Category pills: a `role="group"` row of pill buttons
  (`GALLERY_CATEGORIES` from `src/lib/prompts.ts` — All, Landing,
  Dashboard, SaaS, Ecommerce, AI, Portfolio, Docs) sits above the grid.
  Selecting a pill (`aria-pressed` on the active one) filters
  `PublicPromptTheme.category` client-side, combined with the existing
  text search in the same `useMemo` — a prompt must match both the active
  category (or "All") and the search query to show. Clearing filters
  (search empty + category back to "All") is handled by one
  `onClearQuery` callback shared with the empty state's "Clear filters"
  button.

## Data source
`getPublicPrompts()` in `src/lib/prompts.ts` — a version of the mock prompt
dataset with `promptTemplate` stripped out, so the hidden prompt text is never
shipped to the client bundle. See [prompt-system.md](prompt-system.md).

## Inspiration backlog
Ideas synthesized from clipped competitor/adjacent-product research
(21st.dev's facets, Shadcnblocks' per-category counts) that could inform
future gallery changes — not yet implemented. See
[feature-ideas.md](feature-ideas.md) items #2–#4 and
[competitor-inspiration.md](competitor-inspiration.md).

## Related
- [overview.md](overview.md)
- [styling.md](styling.md)
- [prompt-system.md](prompt-system.md)
- [feature-ideas.md](feature-ideas.md)
