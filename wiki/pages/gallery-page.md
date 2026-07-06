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
- Empty state unchanged in behavior (icon, unmatched query, hint, "Clear
  search" button), still wired to `GallerySearch`'s `setQuery("")`.
- Card hover is now a fuller "premium tile" interaction: a Framer Motion
  lift (`whileHover={{ y: -6 }}`), a soft `{{defaultPrimaryColor}}`-tinted
  glow at the top of the card, a brightened border, and the preview image
  scaling up slightly (`scale-[1.04]`) inside its clipped frame — all on a
  smooth `duration-300`/`duration-500` transition. The entire card (image +
  metadata) is one stretched `Link` (`absolute inset-0` positioned as the
  card's last child) so it's a single click/keyboard target, with a visible
  focus ring via `has-[a:focus-visible]`.
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

## Related
- [overview.md](overview.md)
- [styling.md](styling.md)
- [prompt-system.md](prompt-system.md)
