# Production Readiness

**Status: [implemented — first pass, 2026-07-09]**

## What changed and why
CopyUI was deployed and functional but lacked the polish public users and
search engines expect. This pass added:

- **SEO metadata** (`src/app/layout.tsx` + `src/lib/site.ts`): site-wide
  title template ("%s — CopyUI"), default title/description using the
  positioning line "CopyUI — Production-ready UI prompts for v0, Cursor,
  and GenVibe.", Open Graph (type/site name/locale) and Twitter card
  tags, and `metadataBase` + canonical URLs driven by
  **`NEXT_PUBLIC_SITE_URL`** (env var, falls back to `localhost:3000`
  locally — must be set in the deployment environment).
- **Per-detail-page metadata** (`src/app/prompts/[slug]/page.tsx`):
  `generateMetadata` builds "{Title} UI Prompt" titles, descriptions,
  canonical paths, and OG/Twitter tags from public (template-free) data.
- **`src/app/robots.ts`**: allows all, disallows `/api/` (the prompt
  build endpoint returns prompt text and is not a page), points at the
  sitemap.
- **`src/app/sitemap.ts`**: homepage + all 18 detail routes from the
  local prompt data — static, no backend.
- **Homepage clarity** (`src/app/page.tsx`): hero retitled to the
  positioning line, plus a 3-step "How it works" strip — see
  [gallery-page.md](gallery-page.md).
- **Prompt Quality Checklist** (`src/components/quality-checklist.tsx`):
  static trust panel on the detail page — see
  [detail-page.md](detail-page.md).
- **README.md**: rewritten for GitHub (overview, features, stack, dev
  commands, hidden-prompt security note, limitations, roadmap,
  deployment) — replaced the default create-next-app boilerplate.

## Important files
`src/lib/site.ts` (canonical URL/name/tagline constants),
`src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`,
`src/app/prompts/[slug]/page.tsx`, `src/components/quality-checklist.tsx`,
`README.md`.

## Verified
- Lint + build clean (24 routes: 22 pages + robots.txt + sitemap.xml).
- Prod server (`next start`) + `curl`: no "Product context:" or "Target
  tool:" in gallery/detail HTML; titles, canonical, OG tags, sitemap
  XML, and robots.txt all render correctly; checklist and How-it-works
  sections present in HTML.

## Social preview image (added 2026-07-09, same-day follow-up)
`src/app/opengraph-image.tsx` — a dynamic 1200×630 PNG generated at
build time via Next's `ImageResponse` (App Router file convention, no
static asset to maintain): near-black background with subtle
indigo/sky radial glows, CopyUI wordmark + logo mark, the tagline, a
"Pick a theme · Set your color · Copy the prompt" pill, and a 2×2
template-card grid motif echoing the gallery previews.
`src/app/twitter-image.tsx` re-exports the same image for Twitter/X.
Both render statically at build (`/opengraph-image`, `/twitter-image`)
and were visually verified from the served PNG.

## Branded icons (added 2026-07-09, same-day follow-up)
`src/app/icon.tsx` (32×32) and `src/app/apple-icon.tsx` (180×180) —
generated with `ImageResponse` like the OG image, so all brand art
lives in-repo as code. The mark is a "copy" motif: two offset rounded
cards (sky `#0ea5e9` behind, indigo `#6366f1` in front) on the same
near-black `#0c0c0e` surface as the OG image; only two shapes so it
stays legible at 16px. The stock create-next-app `src/app/favicon.ico`
was **deleted** — `favicon.ico` outranks `icon.tsx` in Next's icon
resolution, so the branded mark would never have applied while it
existed. Verified: `/icon` and `/apple-icon` return PNGs, the
`<link rel="icon">` / `<link rel="apple-touch-icon">` tags are injected,
and `/favicon.ico` now 404s.

## Remaining production gaps
- **`NEXT_PUBLIC_SITE_URL` must be set** in the deployment env or all
  canonical/sitemap URLs say localhost.
- No analytics, no error monitoring, no automated tests.
- No structured data (JSON-LD) — optional, low priority at this scale.

## Related
- [overview.md](overview.md)
- [next-actions.md](next-actions.md)
