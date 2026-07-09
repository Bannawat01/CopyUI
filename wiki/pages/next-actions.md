# Next Actions

**Status: [MVP done + UX/QA polish done + prompt content/preview pass done +
prompt output-quality refinement done + premium marketplace visual
redesign done + 18-theme dataset expansion done + motion/interaction pass
done + Tool Mode feature done + marketplace controls (sort/counts) done +
production-readiness pass done (2026-07-09)]**

The MVP described in CLAUDE.md is implemented, polished, has
production-ready prompt content, a premium dark template-marketplace
visual identity, a large dataset (**18 themes across 12 categories**), a
full motion/interaction pass, and now a **Tool Mode** selector (v0.dev /
Cursor / GenVibe) that tailors the hidden, server-built prompt to the
target AI tool via a tool-specific framing prefix. Passes `npm run build` /
`npm run lint`. Suggested next steps, in rough order:

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
6. **[uncertain]** Verify real-browser/keyboard behavior for the polish-pass,
   category-pill, and now motion-pass changes (stretched-link cards,
   focus-visible rings, aria-live copy status, aria-pressed pills, the new
   hover/focus-unified card animation, staggered entrances, and — most
   importantly — actual `prefers-reduced-motion` behavior in a real OS
   setting) — checked via build/lint/curl only so far, never in a live
   browser or with an OS-level reduced-motion toggle actually flipped on.
7. **[uncertain]** The prompt templates (refined twice, plus 12 new ones
   written to the same bar) — and now the 3 Tool Mode framings on top of
   them — have still not been tried against an actual AI tool
   (v0.dev/Cursor/GenVibe) — this remains the most important unverified
   assumption in the project. All refinement so far has been judged by
   reading the prompt text, not by generating and inspecting real UI
   output. This is doubly true for Tool Mode: the framing prefixes were
   written based on how each tool is generally understood to work, not
   validated against real output from any of the three.
8. **[uncertain]** Tool Mode uses one shared framing prefix per tool
   across all 18 themes, rather than per-theme-per-tool tuning — worth
   revisiting if a specific theme+tool combination turns out to need more
   than a generic prefix (e.g. the Kanban board under Cursor mode might
   want more specific state-management guidance than the generic
   "propose a file structure" framing gives it).
9. Explicitly out of scope per CLAUDE.md / this task: backend persistence,
   auth, payments, database, admin features. Revisit only when asked.
10. From clip research (see [feature-ideas.md](feature-ideas.md)): the
    v0-oriented copy action shipped, then **refined** — the separate
    "Copy for v0" secondary button was removed as redundant and its
    behavior folded into the main Copy Prompt button's adaptive label/
    caption (now covers all 3 tool modes, not just v0). Still open: a
    client-side Most Copied/Newest sort using the existing mock `copies`
    stat (21st.dev pattern), and a count badge per category pill
    (Shadcnblocks pattern) — both small, backend-free, evaluated but not
    yet built.
11. **[uncertain]** Re-clip Magic UI, Aceternity UI, Motion-Primitives,
    and Superdesign UI Design Prompts directly if their intended research
    (motion technique detail, prompt-writing quality guidance) is still
    wanted — none were found among the processed `wiki/raw/clips` files,
    so [motion-inspiration.md](motion-inspiration.md) and
    [prompt-quality.md](prompt-quality.md) currently have thin or
    substitute-only source material.
12. **[uncertain]** A true "Open in v0.dev" deep link remains blocked on
    v0.dev publishing (or CopyUI discovering) a documented way to open a
    new v0 chat pre-filled with arbitrary prompt text — the only
    confirmed mechanism (`/chat/api/open?url=...`) expects a shadcn
    registry-item JSON URL, not raw text. Revisit if v0 documents
    something else, or if hosting the built prompt as a
    registry-item-shaped public JSON endpoint is ever judged worth the
    added architecture (out of this task's scope).

13. From the production-readiness pass (see
    [production-readiness.md](production-readiness.md)): the OG image and
    branded favicon/app icons are now **done** (generated via
    `ImageResponse`). Still open: **set `NEXT_PUBLIC_SITE_URL` in the
    deployment environment** — until then canonical, sitemap, and OG
    image URLs all resolve against localhost. Vercel Analytics + Speed
    Insights are now installed and mounted, but must be **enabled in the
    Vercel project settings** before they collect anything. Error
    monitoring (Sentry or similar) remains unaddressed.
14. Feedback links (Request a prompt / Report bad output / Suggest
    improvement) now ship in the site footer as prefilled GitHub Issues
    links. This closes the loop on item #7's gap — real user reports of
    bad AI output can now arrive without any backend. **Next**: actually
    triage what comes in, and confirm the `enhancement`/`bug` labels
    still exist in the repo (GitHub drops unknown labels silently). If
    volume ever justifies it, replace the raw `/issues/new` links with
    real GitHub issue *templates* (`.github/ISSUE_TEMPLATE/*.yml`),
    which give required fields and dropdowns instead of a plain
    prefilled body.

This list should be revised as decisions are made — do not treat it as fixed.
