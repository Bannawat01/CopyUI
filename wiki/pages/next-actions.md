# Next Actions

**Status: [MVP done + UX/QA polish pass done — see below for what's next]**

The MVP described in CLAUDE.md is implemented and polished, and passes
`npm run build` / `npm run lint`. Suggested next steps, in rough order:

1. Replace mock `PromptPreview` gradient placeholders with real
   thumbnail/screenshot images or live-rendered component previews.
2. Add more prompt themes beyond the current 6, and/or a real content source
   (CMS or file-based) instead of the hardcoded array in
   `src/lib/prompts.ts`.
3. Add more customizable variables beyond `primaryColor` (e.g. font, border
   radius, layout density) — extends [prompt-system.md](prompt-system.md)
   and the Detail page controls.
4. Add automated tests (none exist yet) for `buildPrompt()`, the
   `/api/prompts/[slug]/build` route, and the search/empty-state and
   copy-feedback UI added in the polish pass.
5. **[uncertain]** Verify real-browser/keyboard behavior for the polish-pass
   changes (stretched-link cards, focus-visible rings, aria-live copy
   status) — this pass was checked via build/lint/curl only, not a live
   browser or screen reader session.
6. Explicitly out of scope per CLAUDE.md / this task: backend persistence,
   auth, payments, database, admin features. Revisit only when asked.

This list should be revised as decisions are made — do not treat it as fixed.
