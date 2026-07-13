# Next Actions

**Status: [LAUNCH-READY — no known user-facing defects (2026-07-10)]**

CopyUI is an AI UI prompt marketplace: **18 themes across 12 categories**,
each with a hidden `promptTemplate` built server-side on copy. Shipped
since the last header rewrite:

- **Six tool modes** — v0.dev, Cursor, VS Code / Copilot, Claude Code,
  Windsurf, GenVibe (not three; all launch copy now *derives* from
  `TOOL_MODES` so it cannot drift again).
- **Prompt options** — Theme Mode (dark/light/system/mono), Prompt Intent
  (build/retheme), Action Style (apply/instruct), and 9 Layout Presets
  with per-theme recommendations, composed conflict-safely (final
  overrides appended *after* the base brief).
- **Context-of-use templates** — all 18 state who uses the UI, what moment
  they are in, what decision it must support, and what success looks like.
- **Trust FAQ + Retheme safety note** — honest, hedged copy; a test fails
  the build if it ever claims guaranteed or deterministic output.
- **UI localization** — en / th / zh-CN. Copied prompts stay **English**
  (token efficiency + AI-tool reliability), enforced by tests.
- **First prompt-option validation pass CLOSED** — all 3 priority cases
  passed against real tools (see item 4).
- **`NEXT_PUBLIC_SITE_URL` set in Vercel and verified** — production
  sitemap/robots/canonical/OG carry the real domain, no localhost.
- **CTA contrast fixed (2026-07-10)** — the Copy button now derives a
  readable foreground from the user's `primaryColor`. This was the last
  known user-facing defect.

Passes `npm test` (**150 tests, 9 files**), `npm run lint`, `npm run
build` (27 routes). Remaining items below are enhancements and accepted
trade-offs, not blockers — in rough order:

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
4. Customizable variables beyond `primaryColor`: **partially done
   (2026-07-09)** — secondary/accent colors, theme mode
   (dark/light/system/mono), prompt intent (build/retheme), and — after
   live-site retheme testing — action style (apply/instruct) plus three
   new tool modes (VS Code / Copilot, Claude Code, Windsurf) shipped
   from real user feedback. Light/dark are now explicitly fixed themes;
   only System follows prefers-color-scheme. Still open: font, border
   radius, layout density. **Layout presets shipped (2026-07-09)** — 9
   options, structural in Build mode and advisory-only in Retheme mode,
   now with **per-theme recommendations** (grouped `<optgroup>`s driven
   by `preview.kind`; nothing blocked, odd pairings merely
   de-emphasized). The deliberate middle step before any Figma-style
   drag-and-drop editor, which **remains deferred**. See
   [feature-ideas.md](feature-ideas.md) items #6/#7.
   **Conflict-safe composition (2026-07-09)**: real v0 output showed
   Light theme and Mobile App Layout both being overridden by the base
   template's own dark/hero wording, because options were only
   prepended. Fixed with final theme/layout overrides appended *after*
   the base brief, a light-mode dark-phrase sanitizer, and per-theme
   contrast rules. **VALIDATED on v0 (2026-07-09)**: Startup Landing
   Hero / Build / Dark / Mobile App Layout now produces a phone-like
   app screen with a readable CTA and accent highlight — the
   desktop-hero regression is fixed. First confirmation that appending
   final overrides *after* the base brief beats the template's own
   conflicting wording in a real tool.
   **First prompt-option validation pass CLOSED (2026-07-09)** — all
   three priority cases passed against real tools: Startup Landing Hero
   / Light / Mobile App Layout; Analytics Dashboard / Dark / Sidebar
   Dashboard; and Retheme / Light / Apply Directly in a Cursor or
   Claude Code style workflow. Theme Mode works across the tested cases
   (Light is now a real fixed theme), Mobile App Layout reliably
   produces a phone-like app screen, Sidebar Dashboard works for
   dashboard prompts, and Retheme preserves existing structure while
   applying the intended visual changes. Remaining: partner logos
   render as tappable buttons rather than quiet wordmarks (small
   wording fix). Still untested: the other 6 layout presets and the
   VS Code / Windsurf tool framings.
   **RETHEME VALIDATED ON REAL CODE (2026-07-10)** — an existing page was
   rethemed from SaaS Analytics Dashboard to Analytics Command Center
   style: only the intended page changed, light → dark held, accent
   direction followed, structure/behavior appeared preserved. The first
   run against real existing code; every prior run was Build mode, which
   cannot damage anything. **[uncertain]** Not a diff audit — "appeared
   preserved" is an observation — and the tool used was not recorded.
   **RETHEME + LAYOUT PRESET advisory rule tested (2026-07-10)** — the one
   preservation guarantee with no real-world evidence now has some.
   Rethemed CopyUI's own desktop homepage with **Mobile App Layout**
   selected (deliberately the most structurally hostile preset), prompt
   built through the real API (`retheme / apply / dark / mobile-app /
   claude-code / #ca8a04`, template `restaurant-menu-page`): **7-line
   diff, every line a `className` edit**, no JSX structure change, no
   phone frame / viewport cap / bottom tab bar — zero structural leakage.
   Tests 160/160, lint clean. Logged precisely as **"Claude Code: Retheme
   layout preset advisory behavior held, n=1."**
   **[uncertain]** The tool under test was also the judge — Claude Code ran
   a prompt it knew was a test, and the advisory wording came from the same
   model family. Charitable evidence, not proof. **Do not generalize to
   "Retheme layout presets are safe."** Still unvalidated: **Cursor,
   Windsurf, VS Code / Copilot**; the **Instructions Only** action style
   (every Retheme run so far used Apply Directly); and the **other 8 layout
   presets** under Retheme. Trust copy stays as written — users still
   commit/branch and review the diff.
   **CURSOR RETHEME: PARTIAL PASS (2026-07-10)** — first Retheme run on a
   tool with no stake in the outcome (`retheme / apply / dark / mobile-app
   / #ca8a04`). Visual retheme applied correctly, theme/color followed,
   functionality appeared preserved, no broad rewrite, **and the page
   became usable on mobile where it previously was not**. The layout preset
   again stayed advisory — now confirmed on **two independent tools**.
   **But it shipped a defect**: a metric value overlapped an Alert badge at
   mobile width. That is the single most valuable validation result so far —
   every prior run passed clean, leaving the "AI tools can still make
   mistakes, review the diff" guidance true but unillustrated. It is now
   **demonstrated**, and must not be softened. **Do not claim Cursor Retheme
   is universally safe (n=1).** **[uncertain]** the overlap may mean the
   responsive rules under-specify badge/numeral collision at narrow widths —
   wait for a second occurrence before changing template wording. Still
   unvalidated for Retheme: **Windsurf, VS Code / Copilot**, the
   **Instructions Only** action style, and the other 8 layout presets.
   The follow-up this pass recommended — **context-of-use guidance in
   all 18 hidden templates — is now done (2026-07-09)**; each template
   states who uses the UI, what moment they're in, what decision it must
   support, and what success looks like. See
   [prompt-system.md](prompt-system.md). **Confirmed non-breaking on v0
   (2026-07-10)** — Startup Landing Hero / Build / Dark / Mobile App
   Layout still renders the phone-like app screen, so the added prose
   does not crowd out the final overrides. **[uncertain]** Still open,
   and the more important question: whether the richer context actually
   *improved* the headline/value-proposition copy, or merely failed to
   hurt it. Compare the new output side by side with the pre-context run
   before treating this pass as a win.
5. Automated tests: a **Vitest smoke suite now exists** — `npm test`,
   **98/98 passing** across 6 files — covering prompt data, the
   hidden-template guarantee, `buildPrompt()`/`applyToolMode()`,
   prompt options (intent/theme/action style/layout presets), layout
   recommendations, sitemap/robots, a homepage render, and the
   `/api/prompts/[slug]/build` route handler. See
   [production-readiness.md](production-readiness.md). Remaining gaps:
   browser clipboard behavior, component interactions (color picker,
   tool-mode selector, copy-button states), detail-page render tests,
   and runtime checks of the OG/icon image routes.
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
    caption (now covers all 3 tool modes, not just v0). The client-side
    Most Copied/Newest/A-Z sort (21st.dev pattern) and per-category-pill
    count badges (Shadcnblocks pattern) also **shipped** — see
    [gallery-page.md](gallery-page.md). Nothing open here.
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
    `ImageResponse`). `NEXT_PUBLIC_SITE_URL` is **verified fixed
    externally**: production `/sitemap.xml` and `/robots.txt` no longer
    contain localhost. Remaining launch items: **Copy button contrast**,
    **README update**, and **final QA rerun**.

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

15. **Agent workflow / token budget (2026-07-10)**: the Caveman
    token-compression skill was processed as a **reference only — not
    installed, not run, not adopted**. See [log.md](../log.md) for the
    principles extracted and the risks. Two safe gaps to close in
    CLAUDE.md when someone picks this up: (a) the required
    final-response format omits **result**, and (b) there is **no rule
    protecting exact technical content** (code, commands, file paths,
    error messages, test output, commit messages) from being paraphrased
    or compressed — worth adding on its own merits, independent of
    Caveman. **[uncertain]** Whether to ever install it is unresolved;
    four risks are recorded and *none has been tested*: Windows install,
    UTF-8/Thai safety, over-compression, and exact-command corruption.
    Do not run any compression tool over CLAUDE.md, wiki pages, or
    source files without a Git backup and a diff review first.

16. **Trust copy shipped (2026-07-10)** — early users asked whether the
    same prompt reproduces the same page, and whether Retheme Mode is
    safe on an existing codebase. Both are now answered in-product: a
    collapsed FAQ on the homepage and a Retheme-only safety note in the
    detail panel, all sourced from `src/lib/trust-copy.ts`. The wording
    is deliberately non-committal (AI output is not deterministic;
    Retheme is "designed to preserve", not "safe"), and
    `tests/trust-copy.test.ts` fails if overpromising language ever
    creeps in. **Website appearance toggle SHIPPED (2026-07-10)** — Dark
    / Light / System, in the header next to the language selector,
    persisted in `localStorage`, separate from the prompt builder's
    Theme Mode (stated explicitly in the selector's tooltip). Uncovered
    the actual root cause along the way: `globals.css` already had a
    full shadcn light/dark token system that most components simply
    weren't using — 19 components mechanically converted from hardcoded
    raw colors onto tokens (scripted, not hand-redesigned), plus one
    existing shadcn default (light-mode `--muted-foreground`) tuned for
    AA contrast before it shipped, not after. Full breakdown in
    [log.md](../log.md) under `appearance-toggle` — this is a UI/styling
    change with nothing prompt-related, so prompt-system.md was left
    untouched.
    **Homepage manual QA done (2026-07-10)** — checked in production,
    Dark and Light: header, appearance selector, language selector,
    search, sort, category pills, and the prompt grid all render
    correctly in both, no blocking issues. Light mode's verdict: it
    genuinely improves accessibility and stops the site reading as
    single-theme. Prompt preview thumbnails stay dark/stylized in both
    modes — **confirmed intentional**, not a bug (they're illustrative
    mockups, not guaranteed output, matching the deliberate exception
    recorded at ship time). **Detail page manual QA done (2026-07-10)**
    — checked in production across Dark, Light, and System: copy panel,
    the Copy button (readable in all three — confirms the earlier
    contrast fix held under the new appearance system, not just under
    the dark theme it was originally patched against), all 5
    prompt-option selectors, Generated Examples, and the full copy flow.
    The Retheme safety note — the one component that needed a manual
    `dark:` variant instead of a plain token swap — confirmed appearing
    only in Retheme Mode and readable in both Light and Dark. **No
    blocking visual issues found anywhere. Item 16 CLOSED** — both
    homepage and detail-page manual QA are complete with no open gaps.

17. **Tool-mode copy drift FIXED before launch (2026-07-10)** — the site
    advertised 3 tools while supporting 6. All launch-facing copy
    (homepage headline, "How it works", SEO description, footer,
    detail-page metadata, prefilled GitHub issue bodies) is now
    **derived from `TOOL_MODES`** via `toolModeList()` /
    `toolModeShortList()`, and tests fail if any list is hardcoded
    again. **Follow-up sweep (2026-07-10)** caught one survivor the first
    pass missed: `src/app/opengraph-image.tsx` (and `twitter-image.tsx`,
    which re-exports it) still hardcoded "v0, Cursor, and GenVibe" in
    both the `alt` text and the card art — the first thing any shared
    link renders, and the only launch-facing surface with **no test**.
    Now derived and covered. Localized copy needed no change: all three
    locales interpolate `{tools}`. Nothing left open here — but the root
    cause was six independent hardcoded lists, so apply the same
    derive-don't-repeat rule to any new tool-facing copy, and remember
    that `next/og` routes are only exercised by `npm run build`, never
    by `npm test`.

18. **UI localization shipped (2026-07-10)** — early users requested Thai
    and Simplified Chinese. CopyUI now treats **website UI language as
    separate from copied prompt language**: the site translates (en / th /
    zh-CN, plain dictionary in `src/lib/i18n.ts`, locale in
    `localStorage`), while **copied prompts stay English** for token
    efficiency and AI-tool reliability. Tests assert the built prompt is
    byte-identical across locales. **`<html lang>` a11y bug FIXED
    (2026-07-10)** — it stayed `"en"` for returning visitors whose locale
    came from localStorage, so Thai/Chinese text was announced with an
    English screen-reader voice; the attribute now keys off the resolved
    locale, not the click event. **Still open**: (a) **SEO metadata is
    English-only** — the locale is client-side, so server-rendered HTML and
    OG/title/description never localize; fixing that needs URL-based
    routing (`/th`, `/zh-CN`), a real architecture change. (b) Translations
    were written by the agent and have had **no native-speaker review** —
    worth a pass before promoting the feature. (c) The **site appearance /
    theme toggle** remains a later task (see item 16), untouched by this
    work.

19. **README updated for launch accuracy (2026-07-10)** — it was the last
    stale surface in the repo and the most public one. It had advertised
    only 3 of 6 tool modes, claimed "No automated tests yet" (there are
    137), claimed only one template had been validated (the first
    validation pass closed with 3 cases), and documented none of Theme
    Mode, Retheme Mode, Action Style, Layout Presets, context-of-use
    templates, the trust FAQ, or localization. Now accurate, and it
    carries the same honest hedges as the in-product trust copy.
    **Remaining before launch**: (a) **final production QA rerun**
    (test + lint + build, plus a re-audit of the surfaces changed since
    the last audit); (b) **set `NEXT_PUBLIC_SITE_URL` in Vercel** — the
    only true blocker, and a settings change, not code; (c) the **CTA
    contrast bug** (white text on a user-chosen `primaryColor` fails
    WCAG on light colors) is the last defect with real user impact.

20. **Generated Examples v1 shipped (2026-07-10)** — static public
    metadata (`src/lib/generated-examples.ts`) describing what each of the
    18 prompts is designed to produce: outcome summary, schematic layout,
    key elements, best-for, suggested tool modes, visual notes. Shown as a
    4-card showcase on the homepage and a full section on each detail page,
    below the copy panel. Rendered as **schematic blocks, never fake
    screenshots**, and an honesty guard fails the build if the copy ever
    promises guaranteed or identical output. No `promptTemplate` exposure —
    verified by tests and by `curl` against a live detail page.
    **Known v1 gaps**: (a) per-prompt example *content* is English-only —
    only the section chrome is localized (en/th/zh-CN); translating 18 × 6
    fields is a follow-up. (b) **First real-output validation done
    (2026-07-10)**: Pricing Table / Light / Pricing Grid, AI Chat Interface
    / Dark / Mobile App Layout, and E-commerce Product Page / Light / Card
    Grid all matched their stated direction on v0 — **no metadata changes
    needed**. So **3 of 18 examples are now evidence; the other 15 remain
    written from template intent rather than observed output**. Keep
    validating opportunistically as users test prompts, and keep the copy
    direction-setting either way — a validated example is still not a
    guaranteed one. **Future option, not built**: real screenshots from
    validated runs, or user-submitted examples — both need
    storage/moderation and were out of scope.

21. **UX/UI polish pass (2026-07-10)** — pre-public-testing pass, 3 fixes,
    no redesign. **(a)** Site-wide contrast fix: `text-white/40` (3.71:1)
    and `/45` (4.49:1) failed WCAG AA for small text across 12+ places;
    raised to passing tiers. **(b)** Trust FAQ got its own subhead — it
    had been reusing the language note under a consistency/safety heading.
    **(c)** Homepage example schematics now carry an explicit
    "Schematic — not a screenshot" label (user feedback), all 3 locales.
    160/160 tests, lint + build clean, hidden-prompt guarantee re-verified
    by `curl`. **Deferred, still:** the **website appearance / theme
    toggle** (item 16) — the "site feels like one theme" feedback is real
    but a toggle is a genuine change (`dark` hardcoded on `<html>`), not a
    polish-pass item. Also still open from validation: the Cursor mobile
    overlap needs a **second occurrence** before any responsive template
    wording changes (item 4).

This list should be revised as decisions are made — do not treat it as fixed.
