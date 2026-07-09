# Copy Prompt Mechanism

**Status: [implemented]**

## Flow
1. User selects a primary color via `ColorControl` and a **tool mode**
   (`v0.dev` / `Cursor` / `GenVibe`) via `ToolModeSelector` on the
   [Detail Page](detail-page.md).
2. Clicking "Copy Prompt" (`CopyPromptButton`, client component) immediately
   flips to a `loading` state (spinner icon, button `disabled` +
   `aria-busy="true"` to prevent double submits) and POSTs
   `{ primaryColor, toolMode }` to `POST /api/prompts/[slug]/build`.
3. The route handler (`src/app/api/prompts/[slug]/build/route.ts`) looks up
   the prompt server-side, validates `primaryColor` against a hex-color
   regex (falls back to the theme's default if invalid/missing) and
   `toolMode` against `isToolMode()` (falls back to no tool framing if
   invalid/missing), calls `buildPrompt()` to substitute `{{primaryColor}}`,
   then `applyToolMode()` to prepend the tool-specific framing paragraph
   (see [prompt-system.md](prompt-system.md)), and returns `{ text,
   toolMode }` as JSON.
4. The client calls `navigator.clipboard.writeText(text)`.
5. Button label animates to Copied!/Copy failed (Framer Motion
   `AnimatePresence`), and a color-coded status line below the button
   (green for success, red for failure) is wired to `role="status"
   aria-live="polite"` so screen reader users get the same feedback as the
   visual state — now reading "Copied — tailored for {tool}" on success so
   the tool mode is reflected in the feedback too. Reverts to idle after
   ~2.2s.
6. Below the status line, a small always-visible caption
   (`getToolModeCaption()`) tells the user what to do with the copied
   text: "Paste this into a new v0 chat." / "Paste this into Cursor Chat
   or an implementation prompt." / "Paste this into GenVibe for visual
   direction." This is static explanatory copy, not part of the
   `aria-live` region — it doesn't change with copy state, only with the
   selected tool mode.

## Quality checklist beside the copy area
The production pass (2026-07-09) added a static `QualityChecklist` panel
(`src/components/quality-checklist.tsx`) below the Copy button listing
the six section names every template covers. It's a trust signal only —
pure presentation, reads no prompt data, changes nothing about the flow
above.

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

## One adaptive copy button, not two (revised)
An earlier pass added a secondary `CopyForV0Button`, shown only when
Tool Mode was `v0`, with its own label/success message/caption — but it
ran the *exact same* flow as steps 2–4 above (`POST
/api/prompts/[slug]/build` with `toolMode: "v0"` →
`navigator.clipboard.writeText`), just with `toolMode` hard-coded
instead of reading the shared selector. Having two buttons that did the
same thing read as redundant, not as a useful shortcut, so that
component was **removed**. Its v0-specific label wording, success
message, and caption were folded into the single `CopyPromptButton`
instead (see step 6 above and the `getToolModeLabel`/
`getToolModeCaption` helpers in `src/lib/tool-modes.ts`) — now the one
button adapts to whichever tool mode is selected, for all three tools,
rather than only v0 getting special treatment.

## Why no "Open in v0" link
A true "Open in v0" deep link (opening v0.dev directly with the prompt
pre-filled) was investigated and **deferred**, not faked: v0.dev's only
documented "open in" mechanism
(`https://v0.dev/chat/api/open?url=<url>`, found in
`wiki/raw/clips/Components.md`) expects `<url>` to point to a shadcn
**registry-item JSON** payload, not raw prompt text. There's no
documented parameter for opening v0 chat with an arbitrary text prompt.
Building a fake link against an unconfirmed format would risk silently
breaking or misleading users, so the safe choice remains a polished
copy action, with a code-level TODO comment (now in
`src/components/copy-prompt-button.tsx`) noting what would need to
change to support a true deep link later.

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
