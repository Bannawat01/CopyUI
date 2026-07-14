# CopyUI

**Production-ready UI prompts for v0.dev, Cursor, and more.**

CopyUI is an AI UI prompt marketplace: browse a gallery of UI themes
(dashboards, landing pages, pricing tables, chat interfaces, and more),
customize the brand color, theme, layout, and target AI tool, then copy a
tailored, production-ready prompt straight to your clipboard — no prompt
writing required.

## Key features

- **Gallery of 18 UI prompt themes** across 12 categories, with
  client-side search, category filters with counts, and sorting
  (Most Copied / Newest / A-Z).
- **Hidden prompt templates** — the full prompt text is never shown in the
  UI or shipped to the browser; it is built server-side when you copy.
- **Tool Mode** — tailors the copied prompt for **v0.dev**, **Cursor**,
  **VS Code / GitHub Copilot**, **Claude Code**, **Windsurf**, or
  **GenVibe**. Each gets its own framing, because a visual generator and a
  repo-aware coding agent need to be told different things.
- **Theme Mode** — Dark, Light, System, or Monochrome. Light and Dark are
  *fixed* themes; only System follows `prefers-color-scheme`.
- **Prompt Intent** — *Build new UI* generates a fresh interface.
  *Retheme existing UI* restyles a frontend you already have.
- **Action Style** — *Apply Directly* asks the tool to edit files itself;
  *Instructions Only* asks it to explain the changes without touching
  anything.
- **Layout Presets** — 9 structural options (mobile app, sidebar dashboard,
  split hero, docs layout, and more), with per-theme recommendations.
  Structural in Build mode, advisory-only in Retheme mode so your existing
  page structure survives.
- **Context-of-use prompt templates** — every template states who uses the
  UI, what moment they are in, what decision it must support, and what
  success looks like. AI tools produce better layouts when they know who is
  looking at the screen.
- **Color customization** — primary, secondary, and accent colors, with a
  live preview.
- **Trust FAQ and Retheme safety guidance** — honest answers about what AI
  output can and cannot promise (see below).
- **UI localization** — English, ไทย (Thai), and 中文 (Simplified Chinese).

## What to expect from AI output

CopyUI is deliberately honest about this, and the product UI says the same:

- **AI UI tools are not deterministic.** The same prompt can produce
  different spacing, wording, or component details on each run. What these
  prompts are designed to hold steady is the *direction* — layout intent,
  visual hierarchy, component choices, constraints, and style guidance.
  Structure should land in the same place; exact pixels will vary.
- **For more consistency**, keep your options stable and reuse the same
  target tool.
- **Retheme Mode is designed to preserve** your routes, logic, state, API
  calls, event handlers, and behavior, and to change visual styling only.
  But it is still an AI tool, and AI tools can make mistakes. **Commit or
  branch before applying any AI edit, and review the diff before accepting
  it** — that is your real safety net, not our prompt wording. On a large or
  risky codebase, use *Instructions Only*.

## Copied prompts stay in English

Switching the site language changes **the website UI only**. The copied
prompt is always English, because English prompts are more token-efficient
and produce more reliable results in AI UI and code tools. This is enforced
by tests, not merely intended.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components
- [Framer Motion](https://motion.dev) animations
- [Vitest](https://vitest.dev) — 137 tests, no browser dependency

## Local development

```bash
npm install
npm run dev     # start dev server at http://localhost:3000
npm test        # vitest
npm run lint    # eslint
npm run build   # production build
```

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment (e.g.
`https://your-domain.com`, no trailing slash) so canonical URLs, Open Graph
metadata, `robots.txt`, and `sitemap.xml` point at the right host. Without
it they fall back to `localhost`.

## How prompts stay hidden

The prompt templates are the product, so they never reach the client:

- The gallery and detail pages only receive template-free prompt data
  (`getPublicPrompts()` omits `promptTemplate`).
- Clicking **Copy** POSTs your selected options to
  `/api/prompts/[slug]/build`, which substitutes variables and applies the
  tool, theme, layout, and intent framing **server-side**, then returns the
  finished text for the clipboard.
- The template text never appears in page HTML, RSC payloads, or the client
  bundle. Tests assert this on every run.

## Current limitations

- Prompt themes are hardcoded local data (`src/lib/prompts.ts`) — no CMS or
  database.
- Marketplace metadata (creators, copy counts) is mock display data.
- No accounts, favorites, or payments.
- SEO metadata is English-only — the locale lives in `localStorage`, so
  server-rendered HTML does not localize.
- Thai and Chinese translations have not yet had a native-speaker review.

## Roadmap

- Validate the remaining layout presets and tool framings against real AI
  output.
- More customization variables (font, border radius, layout density).
- A site appearance/theme toggle — CopyUI itself is currently dark-only.
- A true "Open in v0" deep link — currently blocked: v0.dev's documented
  open mechanism accepts a shadcn registry-item JSON URL, not raw prompt
  text.
- A real content source if the theme count keeps growing.

## Deployment

A standard Next.js app — deploys as-is to Vercel or any Node host. All
prompt detail routes are statically prerendered; the only dynamic route is
the server-side prompt build API. Remember to set `NEXT_PUBLIC_SITE_URL`.

### Custom domain checklist

Attaching a custom domain is a Vercel/DNS step outside this repo, but four
things need to happen **after** it's attached or CopyUI keeps advertising
the wrong URL to search engines and social previews:

1. **Update `NEXT_PUBLIC_SITE_URL`** in the deployment environment (Vercel →
   Project Settings → Environment Variables) to the exact new domain, e.g.
   `https://copyui.app` — **no trailing slash**. `src/lib/site.ts` reads
   this single value and derives everything else (canonical URLs, Open
   Graph, `robots.txt`, `sitemap.xml`) from it.
2. **Redeploy.** This is a build-time value baked into static pages and the
   sitemap/robots routes — changing the env var alone does nothing until
   the next deploy picks it up.
3. **Verify `/sitemap.xml` and `/robots.txt`** on the live domain reference
   the new domain, not `localhost` and not the old `*.vercel.app` preview
   URL.
4. **Verify canonical and OG tags** on a real page (view source, or a social
   debugger) show the new domain — this also determines what a shared link's
   preview card renders, so it's worth checking directly rather than
   assuming.

### Share CopyUI

Ready-to-paste blurbs for sharing CopyUI with early testers. Replace `<url>`
with the deployed link. Kept honest on purpose — no "guaranteed" or
"pixel-perfect" claims; the site's own Trust FAQ carries the fuller honesty
caveats (AI output direction vs. exact pixels, Retheme preserves code by
design but review the diff), so these short posts don't need to repeat them
line for line.

**X / Twitter**
```
CopyUI — copy production-ready UI prompts for v0.dev, Cursor, Claude Code, Windsurf & more. Pick a theme, set your brand color, copy a tailored prompt. No signup. <url>
```

**LinkedIn**
```
I've been building CopyUI — a small prompt marketplace for teams using AI UI tools like v0.dev, Cursor, Claude Code, and Windsurf. Instead of writing prompts from scratch, pick a UI theme, set your brand color, and copy a production-ready prompt tailored to your tool. Still early, and feedback from real use is what shapes what gets built next. <url>
```

**Discord**
```
Sharing something I've been building: CopyUI — a prompt marketplace for AI UI tools (v0.dev, Cursor, Claude Code, Windsurf, and more). Pick a theme, set a color, copy a ready-to-use prompt. Still early — if something's confusing or a prompt's output looks off, I'd genuinely like to hear about it. <url>
```

**Facebook groups**
```
Built a small tool called CopyUI — browse UI design prompts (dashboards, landing pages, pricing tables, and more) and copy one tailored for v0.dev, Cursor, Claude Code, Windsurf, or other AI tools. No signup needed. Would love feedback if you give it a try. <url>
```

**LINE** (Thai — LINE's core audience skews Thai, so this one is Thai rather than a direct translation)
```
ลองเล่น CopyUI ดูไหม? เว็บรวม prompt สำหรับสร้าง UI ด้วย AI (v0.dev, Cursor, Claude Code, Windsurf ฯลฯ) เลือกธีม ตั้งสี คัดลอก prompt ไปใช้ได้เลย ฟรี ไม่ต้องสมัครสมาชิก <url>
```

**GitHub README** (a one-liner for referencing CopyUI elsewhere, e.g. an
awesome-list)
```
[CopyUI](<url>) — an AI UI prompt marketplace. Browse UI themes, customize brand color/theme/layout, and copy a production-ready prompt tailored for v0.dev, Cursor, Claude Code, Windsurf, and more.
```
