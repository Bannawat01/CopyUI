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

## Feedback links (added 2026-07-09, same-day follow-up)
`src/lib/feedback.ts` builds three GitHub Issues links against
`https://github.com/Bannawat01/CopyUI`, prefilling title, a structured
body, and labels via `/issues/new?title=&body=&labels=`:
**Request a prompt** (enhancement), **Report bad output** (bug — asks
which theme, which tool mode, what went wrong, what looked good), and
**Suggest improvement** (enhancement). `src/components/site-footer.tsx`
renders them as a 3-up card row, plus a "View source on GitHub" line,
and is mounted once in `layout.tsx` so both gallery and detail pages
get it. Fully static — no backend, no form, no database.

The "Report bad output" body mirrors the good/bad/needs-improvement
structure that produced the useful AI Chat Interface feedback, so real
reports arrive in the shape [prompt-system.md](prompt-system.md)'s
validation policy asks for. Caveat: GitHub silently drops `labels`
values that don't already exist in the repo — `enhancement` and `bug`
are GitHub defaults, so they apply as long as they haven't been deleted.

## Analytics + Speed Insights (added 2026-07-09, same-day follow-up)
`@vercel/analytics` and `@vercel/speed-insights` installed; `<Analytics />`
and `<SpeedInsights />` mounted once in `src/app/layout.tsx`, as siblings
of `MotionProvider` inside `<body>` (outside it, so they never sit in the
animated tree). Zero config, zero app-feature change — both are client
components that inject their script on mount and only report once
deployed to Vercel.

Note for verification: the scripts do **not** appear in server-rendered
HTML (`curl` shows nothing), because injection happens client-side after
hydration. Confirmed instead by finding both in the built client chunk.
Real data only appears after deploying and enabling Analytics / Speed
Insights in the Vercel project settings — installing the packages alone
is not sufficient.

## Deployment status (2026-07-09)
- **Speed Insights: enabled** in the Vercel project. Performance data
  won't appear until real visits accumulate — an empty dashboard right
  after enabling is expected, not a misconfiguration.
- **Analytics: still to be enabled/confirmed** in the Vercel project
  settings. The `<Analytics />` component ships, but it collects nothing
  until the toggle is on.
- **`NEXT_PUBLIC_SITE_URL`: needs verification in production.** Check the
  deployed `/sitemap.xml`, `/robots.txt`, and the OG `og:url` /
  `<link rel="canonical">` tags actually show the real domain, not
  `localhost:3000`.

## Smoke tests (added 2026-07-09)
**Framework: Vitest** (`vitest` devDependency only). Chosen as the
lightest practical option: `react-dom/server` was already a dependency,
so the homepage renders via `renderToStaticMarkup` with **no jsdom, no
testing-library, no Playwright**. Config: `vitest.config.ts` (node
environment, `@/*` alias mirroring tsconfig). Run with **`npm test`**
(`vitest run`).

**Status: 28/28 passing**, 4 files, all under ~1.5s. Coverage: prompt
data, metadata (sitemap/robots), homepage render, and the prompt build
API route.
- `tests/prompts.test.ts` — 18 unique, resolvable slugs; unknown slug
  returns undefined; **`getPublicPrompts()` strips `promptTemplate`** and
  its serialized output contains no "Product context:", "Target tool:",
  or `{{primaryColor}}`; `buildPrompt()` injects the color at every
  placeholder and leaves none behind; `applyToolMode()` yields three
  distinct, correctly-named framings and passes the base prompt through
  untouched for a missing/invalid mode.
- `tests/metadata.test.ts` — sitemap contains the homepage + all 18
  detail routes with no duplicates; robots disallows `/api/`, allows the
  rest, links the sitemap.
- `tests/homepage.test.tsx` — homepage renders the positioning headline,
  the three "How it works" steps, and real prompt titles; asserts again
  at the **HTML level** that no hidden template text leaks.
- `tests/api-build.test.ts` (added 2026-07-09) — the
  `/api/prompts/[slug]/build` route handler, called directly with a real
  `NextRequest` (works in the node environment; no server, no jsdom):
  valid slug returns built text; `primaryColor` is injected with no
  placeholder left; an invalid color falls back to the theme default;
  v0/cursor/genvibe produce three distinct correctly-named framings and
  echo `toolMode`; a missing/invalid mode returns `toolMode: null` with
  no framing; unknown slug → **404 `{ error: "Prompt not found" }`** and
  no `text`; a malformed JSON body degrades to defaults rather than
  throwing; the response body's keys are exactly `text` + `toolMode`, so
  no raw `promptTemplate` ever rides along as metadata.

The OG image and icon routes aren't unit-tested — `ImageResponse` needs
the Next runtime. `npm run build` already proves they compile and
prerender, which is the check that matters.

## Remaining production gaps
**Next priority is production verification on the deployed Vercel site**,
not more local work:
- Confirm `NEXT_PUBLIC_SITE_URL` took effect — check the live
  `/sitemap.xml`, `/robots.txt`, and the canonical / `og:url` tags show
  the real domain, not `localhost:3000`.
- Enable/confirm Vercel Analytics; let Speed Insights accumulate visits.

Then:
- No error monitoring (Sentry or similar).
- Test gaps: no component interaction tests (color picker, tool-mode
  selector, copy-button loading/success/error states); no browser/E2E
  coverage of the actual clipboard write; detail pages are not
  render-tested the way the homepage is; the OG/icon image routes are
  only covered by `npm run build`.
- No structured data (JSON-LD) — optional, low priority at this scale.

## Related
- [overview.md](overview.md)
- [next-actions.md](next-actions.md)
