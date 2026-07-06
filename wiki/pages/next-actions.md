# Next Actions

**Status: [MVP done + UX/QA polish done + prompt content/preview pass done]**

The MVP described in CLAUDE.md is implemented, polished, and now has
production-ready prompt content and distinct per-theme preview visuals.
Passes `npm run build` / `npm run lint`. Suggested next steps, in rough
order:

1. Consider replacing the hand-built CSS preview glyphs with real
   thumbnail/screenshot images or live-rendered component previews for even
   higher visual fidelity (the glyphs are a lightweight, no-new-dependency
   improvement, not a final-art solution).
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
6. **[uncertain]** The rewritten prompt templates have not been tried
   against an actual AI tool (v0.dev/Cursor/GenVibe) yet — worth a manual
   spot-check that the structured instructions produce good output, not
   just that they read well.
7. Explicitly out of scope per CLAUDE.md / this task: backend persistence,
   auth, payments, database, admin features. Revisit only when asked.

This list should be revised as decisions are made — do not treat it as fixed.
