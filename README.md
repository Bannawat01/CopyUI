# CopyUI

**Production-ready UI prompts for v0, Cursor, and GenVibe.**

CopyUI is a prompt marketplace: browse a gallery of UI themes (dashboards,
landing pages, pricing tables, chat interfaces, and more), customize the
brand color and target AI tool, and copy a tailored, production-ready
prompt straight to your clipboard — no prompt writing required.

## Key features

- **Gallery of 18 UI prompt themes** across 12 categories, with
  client-side search, category filters with counts, and sorting
  (Most Copied / Newest / A-Z).
- **Live visual previews** — each theme renders a miniature
  screenshot-style mockup built entirely from Tailwind-styled markup
  (no image assets).
- **Color customization** — pick a brand color (swatches or a custom
  picker) and see the preview update live.
- **Tool Mode** — one selector tailors the copied prompt for
  v0.dev (visual generation), Cursor (codebase implementation), or
  GenVibe (creative direction).
- **Hidden prompt templates** — the full prompt text is never shown in
  the UI or shipped to the browser; it's built server-side on copy.
- **Premium dark UI** — near-black theme, Framer Motion
  micro-interactions, `prefers-reduced-motion` respected globally.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components
- [Framer Motion](https://motion.dev) animations
- [lucide-react](https://lucide.dev) icons

## Local development

```bash
npm install
npm run dev     # start dev server at http://localhost:3000
npm run lint    # eslint
npm run build   # production build
```

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment (e.g.
`https://your-domain.com`, no trailing slash) so canonical URLs, Open
Graph metadata, `robots.txt`, and `sitemap.xml` point at the right host.

## How prompts stay hidden

The prompt templates are a paid-style product asset, so they never reach
the client:

- The gallery and detail pages only receive template-free prompt data
  (`getPublicPrompts()` omits `promptTemplate`).
- Clicking **Copy** POSTs the selected color and tool mode to
  `/api/prompts/[slug]/build`, which substitutes variables and applies
  tool-specific framing **server-side**, then returns the finished text
  for the clipboard.
- The template text never appears in page HTML, RSC payloads, or the
  client bundle.

## Current limitations

- Prompt themes are hardcoded local data (`src/lib/prompts.ts`) — no
  CMS or database.
- Marketplace metadata (creators, copy counts) is mock display data.
- No accounts, favorites, or payments.
- Only one prompt template has been validated against real AI tool
  output (AI Chat Interface via v0.dev) so far.
- No automated tests yet.

## Roadmap

- Validate more templates against real v0.dev / Cursor / GenVibe output.
- More customization variables (font, border radius, layout density).
- A true "Open in v0" deep link — currently blocked: v0.dev's documented
  open mechanism accepts a shadcn registry-item JSON URL, not raw prompt
  text.
- Automated tests for the prompt build flow and gallery filtering.
- A real content source if the theme count keeps growing.

## Deployment

A standard Next.js app — deploys as-is to Vercel or any Node host.
All prompt detail routes are statically prerendered; the only dynamic
route is the server-side prompt build API. Remember to set
`NEXT_PUBLIC_SITE_URL`.
