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
