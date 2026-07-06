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
Copy Prompt mechanism is functional, and a UX/QA pass added better empty
states, clearer copy feedback, mobile spacing, and basic accessibility
(focus-visible states, aria-labels, aria-live status). The 6 mock prompt
templates were rewritten with structured, production-ready instructions
(product context, layout, components, visual style, responsive behavior,
accessibility notes, `{{primaryColor}}` injection) and each preview card/
detail visual now has a distinct mini layout illustration instead of a
generic icon+gradient. `npm run lint` and `npm run build` both pass clean.

## Not yet built
No backend, auth, payments, database, or admin features — out of scope per
CLAUDE.md and this task. See [next-actions.md](next-actions.md).
