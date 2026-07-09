# Feature Ideas (from clip research)

**Status: [new — synthesized from wiki/raw/clips]**

Concrete, source-backed feature ideas for CopyUI, drawn from
[competitor-inspiration.md](competitor-inspiration.md) and
[shadcn-patterns.md](shadcn-patterns.md). These are ideas to evaluate, not
a committed roadmap — cross-check against CLAUDE.md's no-backend/
no-over-engineering rules before building any of them.

## 1. "Open in [tool]" deep link, not just copy-to-clipboard — PROTOTYPED (deferred)
*Source: Cult UI (cult-ui.com) — "Install with shadcn, download as
Nextjs app, or open in v0."*
Cult UI offers three destinations for a component, one of which is a
direct "open in v0" link. CopyUI already has Tool Mode (v0/Cursor/
GenVibe — see [detail-page.md](detail-page.md)).

**Update after checking the actual source**: the shadcn docs clip
(`wiki/raw/clips/Components.md`) shows v0's only documented "open in"
mechanism is `https://v0.dev/chat/api/open?url=<url>`, where `<url>`
must point to a **shadcn registry-item JSON** (a `registry:style`
payload with `dependencies`/`cssVars`/etc.), not raw prompt text. There
is no documented `?q=`-style parameter for opening v0 chat with an
arbitrary text prompt — the earlier note above claiming that was
incorrect and has been corrected here after re-checking the source.
Since a reliable arbitrary-prompt deep-link format isn't confirmed, a
true "Open in v0" link was **not implemented** (would mean faking a URL
format we can't verify works).

**What was built instead**: a small "Copy for v0" secondary action
(`src/components/copy-for-v0-button.tsx`), shown only when Tool Mode is
v0, that runs the same server-side build + clipboard-copy flow with a
v0-specific label, success message ("Copied for v0.dev"), and a caption
explaining the prompt is optimized for v0 and should be pasted into a
new v0 chat. A code-level TODO documents the deep-link gap and what
would need to change (either v0 documenting a text-prompt URL param, or
CopyUI hosting its built prompt as a registry-item-shaped JSON at a
public URL — the latter would be a bigger architecture change than
this task's scope allows). **Effort**: small (done) for the copy
action; moderate-to-unclear for a true deep link, blocked on v0
publishing a reliable format.

## 2. Trending / most-copied sort
*Source: 21st.dev ("Latest components" by week, per-item view counts)*
CopyUI already tracks a mock `copies` stat per theme
(`PromptTheme.meta.copies`). 21st.dev additionally surfaces a
"this week" freshness signal. A simple, backend-free version: add a
client-side sort control (Most Copied / Newest) over the existing mock
`copies` numbers — no new data needed, just a sort affordance next to the
existing search/category row. **Effort**: small.

## 3. Category depth indicator
*Source: Shadcnblocks (per-group component counts, e.g. "Button — 126
components")*
Show a small count on each category pill (e.g. "Dashboard (2)") so users
know how much is behind a filter before clicking it — cheap, already have
the data (`prompts.filter(p => p.category === c).length`). **Effort**:
small.

## 4. Broaden the category taxonomy with a "visual pattern" facet
*Source: 21st.dev (Themes / Templates / Heroes / Backgrounds / Features /
Shaders as parallel facets to product-type categories)*
CopyUI's current `Category` type (Landing, Dashboard, SaaS, etc.) is
product-domain-based. 21st.dev's facets are pattern-based (Hero,
Background, Feature section) — a different, complementary axis. Not
urgent, but worth considering if the theme count keeps growing past 18
and product-domain categories stop being distinctive enough. **Effort**:
moderate (touches the data model) — flagged as **[uncertain]** whether
it's worth the complexity yet.

## 5. Lean into "not generic" positioning in copy
*Source: 21st.dev's tagline, "not AI slop"*
A cheap, code-free idea: CopyUI's hero copy could more explicitly claim
"real, structured briefs — not a one-line prompt" as a differentiator,
echoing 21st.dev's positioning against generic AI output. Directly
supports the existing prompt-quality work (7-section structured
templates) that's otherwise invisible to a visitor since the template
itself stays hidden. **Effort**: trivial (copy change only).

## 6. Retheme Mode + multi-color + theme modes — SHIPPED (2026-07-09)
*Source: direct user feedback, not clip research.* Users reported: (a)
wanting light/dark/black-white theme switching; (b) wanting to use
CopyUI prompts on an **existing** frontend just to change its theme —
and when they tried, AI tools sometimes removed functions, broke
behavior, or generated a disconnected new page; (c) wanting two or
three colors on one page. Shipped as Prompt Intent (build/retheme with
strict preservation rules), Theme Mode (dark/light/system/mono), and
optional secondary/accent colors — see
[prompt-system.md](prompt-system.md).

**Why this over drag-and-drop layout editing**: users also asked for
Figma-style drag-to-arrange, but that's a fundamentally different
product surface (a visual editor with its own state model, likely
persistence) versus this, which reuses the existing server-side
prompt-composition architecture end-to-end. Retheme mode fixes an
active failure users are hitting today; layout editing is an unbuilt
wish. Deliberately deferred.

### #6 refinement round (2026-07-09, tested on the live site)
First real retheme validation (deployed saas-dashboard page) confirmed
the direction (three-color selection works and is useful; retheme
direction is useful; advice-style output acceptable when the user only
wants guidance) and surfaced four issues, all now addressed:
1. **Light mode behaved like System** (result followed the browser
   theme) → light/dark are now explicitly fixed themes; only System is
   adaptive.
2. **Tool coverage too narrow** → added VS Code / Copilot, Claude Code,
   and Windsurf tool modes (framing only, no integrations).
3. **Cursor gave advice instead of applying the retheme** → new Action
   Style option ("Apply changes directly" / "Instructions only"), with
   inspect-first + confirm-if-risky + preserve-behavior rules for
   direct application.
4. **Detail page required scrolling between colors and Copy** → one
   compact sticky Customize & Copy panel with collapsed advanced
   options.
Figma-style drag-to-arrange remains deferred (see #7 below) — the fixes
above again reused the existing prompt-composition architecture, while
a layout editor would still be a new product surface.

## 7. Layout presets (future, before any Figma-style editor)
A middle step worth evaluating before ever considering a drag-and-drop
editor: offer 2-3 named layout *presets* per theme (e.g. "sidebar left /
sidebar right / top-nav" for the dashboard) as another prompt option —
same select-a-value → server-composed-directive pattern as theme mode,
no visual editor needed. **Effort**: moderate (needs per-theme preset
copy). Unblocks most of the "arrange it differently" demand without a
new architecture.

## Explicitly not recommended
- Paid/premium tiers (Shadcnblocks pattern) — blocked by CLAUDE.md's
  no-payments rule.
- Pivoting toward AI-agent-pattern content (seen in both the 21st.dev and
  Cult UI clips) — out of CopyUI's actual scope (UI prompts, not agent
  templates).
- A self-hosted "registry"/CLI distribution system (shadcn registry
  pattern) — CopyUI distributes prompts via copy-paste, not code via a
  registry; building a registry would be a backend, which CLAUDE.md rules
  out.

## Related
- [competitor-inspiration.md](competitor-inspiration.md)
- [shadcn-patterns.md](shadcn-patterns.md)
- [next-actions.md](next-actions.md)
