# Gallery Page

**Status: [implemented]**

## Location
`src/app/page.tsx` (server component) + `src/components/gallery-search.tsx`
(client component holding search state).

## Behavior
- Hero section with heading/subtext, rendered server-side. Text scales down
  on small screens (`text-3xl` → `md:text-5xl`) and container padding tightens
  on mobile (`px-4 py-10` → `sm:px-6 sm:py-16`).
- `GallerySearch` is a client component that filters prompts client-side by
  title, description, and tags as the user types in the search `Input`
  (`type="search"`, `aria-label="Search prompts by title, tag, or keyword"`).
- Responsive grid (`PromptGrid` → `PromptCard`, 1/2/3 columns) of UI theme
  cards. Each card shows a gradient preview, title, description, tags, and a
  "View Prompt" link to the [Detail Page](detail-page.md).
- Empty state: when the search yields no matches, `PromptGrid` shows an icon,
  the exact query that matched nothing, a hint, and a "Clear search" button
  (wired back to `GallerySearch`'s `setQuery("")`) instead of a plain line of
  text.
- Card hover uses a Framer Motion lift (`whileHover={{ y: -4 }}`). The whole
  card is a click target via a stretched-link pattern (`after:absolute
  after:inset-0` on the "View Prompt" `Link`), and keyboard focus on that link
  shows a ring on the card itself (`has-[a:focus-visible]:ring-2`).
- Preview visuals: each card's `PromptPreview` now renders a small
  hand-built layout glyph specific to its `preview.kind` (e.g. sidebar +
  KPI grid for dashboard, three columns with a highlighted middle for
  pricing, a timeline with dots for changelog) plus a matching lucide icon,
  so cards are visually distinct at a glance instead of only differing by
  gradient color and a generic sparkle icon.

## Data source
`getPublicPrompts()` in `src/lib/prompts.ts` — a version of the mock prompt
dataset with `promptTemplate` stripped out, so the hidden prompt text is never
shipped to the client bundle. See [prompt-system.md](prompt-system.md).

## Related
- [overview.md](overview.md)
- [styling.md](styling.md)
- [prompt-system.md](prompt-system.md)
