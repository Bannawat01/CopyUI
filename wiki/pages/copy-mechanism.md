# Copy Prompt Mechanism

**Status: [implemented]**

## Flow
1. User selects a primary color via `ColorControl` on the
   [Detail Page](detail-page.md).
2. Clicking "Copy Prompt" (`CopyPromptButton`, client component) immediately
   flips to a `loading` state (spinner icon, button `disabled` +
   `aria-busy="true"` to prevent double submits) and POSTs
   `{ primaryColor }` to `POST /api/prompts/[slug]/build`.
3. The route handler (`src/app/api/prompts/[slug]/build/route.ts`) looks up
   the prompt server-side, validates `primaryColor` against a hex-color
   regex (falls back to the theme's default if invalid/missing), calls
   `buildPrompt()`, and returns `{ text }` as JSON.
4. The client calls `navigator.clipboard.writeText(text)`.
5. Button label animates to Copied!/Copy failed (Framer Motion
   `AnimatePresence`), and a color-coded status line below the button
   (green for success, red for failure) is wired to `role="status"
   aria-live="polite"` so screen reader users get the same feedback as the
   visual state. Reverts to idle after ~2.2s.

## Visual redesign impact
The gallery/detail visual redesign (bigger preview, template-tile cards,
premium dark styling) is presentation-only — it did not touch this flow.
`CopyPromptButton` still POSTs to `/api/prompts/[slug]/build` and the
button/status-line markup is unchanged; only the surrounding page layout
and the visual preview above it changed.

## Content quality
Templates were rewritten (see [prompt-system.md](prompt-system.md)) to be
longer, structured, production-ready briefs rather than one-liners. This is
a content-only change — the flow above (POST → substitute → clipboard) is
unchanged, and the built text is still only ever generated server-side.

## Why an API route instead of building client-side
Building the prompt in the client component would require passing
`promptTemplate` down as a prop, which Next.js would embed in the page's
HTML/RSC flight payload — visible via "view source" even though never
rendered. Keeping template substitution server-side (in the API route) is
what actually keeps the prompt hidden. See
[prompt-system.md](prompt-system.md).

## Related
- [detail-page.md](detail-page.md)
- [prompt-system.md](prompt-system.md)
