# Next Actions

**Status: [MVP done + UX/QA polish done + prompt content/preview pass done +
prompt output-quality refinement done + premium marketplace visual
redesign done + 18-theme dataset expansion done]**

The MVP described in CLAUDE.md is implemented, polished, has
production-ready prompt content, a premium dark template-marketplace
visual identity, and now a much larger dataset: **18 themes across 12
categories** (up from 6), each with its own screenshot-like preview
mockup, and category-pill filtering on the Gallery page working alongside
search. Passes `npm run build` / `npm run lint`. Suggested next steps, in
rough order:

1. Consider replacing the hand-built CSS/div screenshot mockups with real
   thumbnail images, rendered screenshots, or live-rendered component
   previews for even higher visual fidelity — the current mockups (now 18
   of them) are a lightweight, no-new-dependency, no-external-image
   improvement, not a final-art solution. **[uncertain]** actual visual
   quality has not been confirmed with a real screenshot/browser check at
   any point across these passes, only via build output and HTML/markup
   review — worth a manual look in a browser, especially now that there
   are 18 distinct mockups to sanity-check visually.
2. Consider a real content source (CMS or file-based) instead of the now
   much larger hardcoded array in `src/lib/prompts.ts` (18 entries, each
   with a long `promptTemplate`) if the theme count keeps growing —
   the file is still readable today but is approaching the point where a
   per-theme file or a data directory would help.
3. **[uncertain]** The category assignments (one category per theme,
   drawn from a 12-value list) and the 8-pill filter subset were both
   judgment calls made without user input — worth confirming the
   category taxonomy and pill selection match how a real user would
   expect to browse, before treating it as final.
4. Add more customizable variables beyond `primaryColor` (e.g. font, border
   radius, layout density) — extends [prompt-system.md](prompt-system.md)
   and the Detail page controls.
5. Add automated tests (none exist yet) for `buildPrompt()`, the
   `/api/prompts/[slug]/build` route, and the search/category-filter/
   empty-state and copy-feedback UI.
6. **[uncertain]** Verify real-browser/keyboard behavior for the polish-pass
   and category-pill changes (stretched-link cards, focus-visible rings,
   aria-live copy status, aria-pressed pills) — checked via build/lint/curl
   only so far, not a live browser or screen reader session.
7. **[uncertain]** The prompt templates (refined twice, plus 12 new ones
   written to the same bar) have still not been tried against an actual AI
   tool (v0.dev/Cursor/GenVibe) — this remains the most important
   unverified assumption in the project. All refinement so far has been
   judged by reading the prompt text, not by generating and inspecting
   real UI output.
8. Explicitly out of scope per CLAUDE.md / this task: backend persistence,
   auth, payments, database, admin features. Revisit only when asked.

This list should be revised as decisions are made — do not treat it as fixed.
