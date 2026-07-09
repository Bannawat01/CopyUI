# CopyUI Overview

**Status: [implemented — MVP working]**

## What it is
CopyUI is a web-based MVP platform where users discover, customize, and copy
production-ready UI prompts for use in AI tools like v0.dev, Cursor, or GenVibe.
The focus is a premium visual experience and a seamless copying mechanism.

## Tech stack (in use)
- Framework: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Styling: Tailwind CSS v4
- Component library: shadcn/ui (button, card, badge, input, separator)
- Animations: Framer Motion
- Icons: lucide-react

## MVP scope
- Gallery Page — see [gallery-page.md](gallery-page.md)
- Detail Page — see [detail-page.md](detail-page.md)
- Copy Mechanism — see [copy-mechanism.md](copy-mechanism.md)

## Design direction (from CLAUDE.md)
- Premium, modern, defaults to Dark Mode (`<html class="dark">` forced in
  `src/app/layout.tsx`)
- Smooth micro-interactions (hover-lift on cards via Framer Motion, animated
  Copy button state)
- TypeScript, functional components, Tailwind-only styling, shadcn/ui
  components used before custom ones

## Current state
MVP is implemented and polished: Gallery + Detail pages work end-to-end,
Copy Prompt mechanism is functional, a UX/QA pass added better empty
states/copy feedback/accessibility, and a visual redesign gave the gallery
a premium dark template-marketplace look (16:9 screenshot-style card
previews, near-black theme). The dataset has grown from 6 to **18 mock
prompt themes** across 12 categories (Landing, Dashboard, SaaS, Ecommerce,
AI, Portfolio, Docs, Form, Mobile, Finance, Real Estate, Content), each
with a structured, production-ready `promptTemplate` (product context,
layout, visual hierarchy, components & states, design language, responsive
behavior, accessibility, `{{primaryColor}}` injection) and its own
screenshot-like preview mockup. The Gallery page now has category-pill
filtering (All/Landing/Dashboard/SaaS/Ecommerce/AI/Portfolio/Docs) working
alongside search, a full motion/interaction pass, and a **Tool Mode**
selector on the Detail page (v0.dev / Cursor / GenVibe) that tailors the
hidden, server-built prompt to the target AI tool. A production-readiness
pass (2026-07-09) added full SEO metadata (OG/Twitter/canonical via
`NEXT_PUBLIC_SITE_URL`), `robots.ts` + `sitemap.ts`, a homepage
"How it works" strip, a Prompt Quality Checklist on the detail page, and
a real GitHub README — see
[production-readiness.md](production-readiness.md). `npm run lint` and
`npm run build` both pass clean.

## Not yet built
No backend, auth, payments, database, or admin features — out of scope per
CLAUDE.md and this task. See [next-actions.md](next-actions.md).
