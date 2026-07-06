# Competitor / Adjacent-Product Inspiration

**Status: [new — synthesized from wiki/raw/clips]**

Synthesis of UI-component marketplaces/registries clipped into
`wiki/raw/clips`. These aren't direct competitors (they distribute code,
CopyUI distributes prompts) but are the closest adjacent-product category
and a useful mirror for marketplace UX patterns.

## 21st.dev
*Source: `21st.dev - Crafted React components...md`,
`serafimcloud21st npm for design engineers...md`*
- **What it is**: A community registry/marketplace of shadcn/ui-based React
  components, installable via the `shadcn` CLI. Positions itself as "not
  AI slop" — hand-crafted, real components vs. generic AI output.
- **Why it matters for CopyUI**: Same target audience (developers wanting
  fast, good-looking UI) and a similar "browse → preview → copy/install"
  loop to CopyUI's "browse → preview → copy prompt" loop.
- **Useful ideas**: Faceted browsing by content *type* (Themes, Templates,
  Heroes, Backgrounds, Features, Shaders) rather than only by product
  category — CopyUI's `Category` taxonomy could add a "visual pattern"
  facet alongside SaaS/Ecommerce/etc. Each listing shows a live view count
  (e.g. "1.4k", "622") next to the preview, close to CopyUI's mock
  `copies` stat but framed as popularity, not just usage count.
- **What to avoid**: The GitHub repo clip mixes in unrelated AI-agent
  marketplace content (`aisdkagents.com`) — a scope-creep trap. CopyUI
  should resist pivoting toward "AI agent patterns" just because an
  inspiration source did.
- **Possible next actions**: See [feature-ideas.md](feature-ideas.md) —
  trending/most-copied sort, richer visual-pattern tags.

## Cult UI
*Source: `Shadcn UI Components, Blocks & Templates.md` (cult-ui.com),
`nolly-studiocult-ui...md` (GitHub)*
- **What it is**: 78+ "animated components and effects," free/open-source,
  drop into any shadcn/ui project. Offers install via shadcn CLI,
  download as a Next.js app, or "open in v0."
- **Why it matters for CopyUI**: The three-way output choice (CLI install
  / full app download / open in v0) is conceptually the same shape as
  CopyUI's Tool Mode (v0.dev / Cursor / GenVibe) — pick your destination,
  get output tuned for it.
- **Useful ideas**: The "Open in v0" one-click link (not just copy-to-
  clipboard) is a concrete pattern CopyUI could adopt for its own Tool
  Mode — see [feature-ideas.md](feature-ideas.md).
- **What to avoid**: Like the 21st.dev clip, this source's content is
  dominated by an unrelated "AI SDK Agents" pivot (competitor-research
  agents, data-analysis agents) — noise relative to CopyUI's actual scope
  (UI prompts, not agent templates). Don't let it steer feature ideas.
- **Possible next actions**: Evaluate a direct "Open in v0.dev" deep link
  button next to Copy Prompt when Tool Mode = v0.

## Shadcnblocks
*Source: `Shadcn Components - Extra components for Shadcn UI.md`*
- **What it is**: A large paid+free catalog (1,684+ components) organized
  into groups (Button: 126, Chart: 68, Avatar: 34, Combobox: 42, etc.),
  each group with a representative screenshot thumbnail.
- **Why it matters for CopyUI**: Demonstrates that even within one
  component "kind," volume and grouping by count is a legible way to
  signal depth/quality of a catalog.
- **Useful ideas**: Group-level thumbnail + count pattern (e.g. "Button —
  126 components") could translate to a CopyUI gallery affordance like
  showing "X templates in this category" on category pills.
- **What to avoid**: Shadcnblocks is a paid product with a "Premium"
  upsell baked into browsing — CLAUDE.md rules out payments/backend for
  CopyUI, so this pattern is explicitly off-limits, not just low-priority.
- **Possible next actions**: None directly actionable without a backend;
  noted for future reference only.

## Origin UI
*Source: `shadcnoriginui...md` (bonus find, not explicitly requested but
present in the clips)*
- **What it is**: A large copy-paste component collection following
  shadcn conventions, distributed as raw `.tsx` files + a `utils.ts` +
  copyable CSS variable block.
- **Why it matters for CopyUI**: Confirms shadcn's CSS-variable theming
  convention (oklch-based `--background`, `--primary`, etc.) is the
  de facto standard across this whole ecosystem — validates CopyUI's
  existing token choices in `globals.css` rather than suggesting anything
  new. See [shadcn-patterns.md](shadcn-patterns.md).
- **Useful ideas**: None beyond the token confirmation above.
- **What to avoid**: N/A — this clip is purely reference material, not a
  UX pattern to borrow.
- **Possible next actions**: None.

## awesome-shadcn-ui
*Source: `birobirobiroawesome-shadcn-ui...md`*
- **What it is**: A curated link list of shadcn/ui-ecosystem libraries and
  tools (21st.dev, aceternity-ui, agents-ui, big-calendar, etc.) — a
  directory of directories.
- **Why it matters for CopyUI**: Useful as a map of *what exists*, but is
  itself just a table of links/descriptions — no UI patterns to extract
  directly.
- **Note on requested-but-missing sources**: The user's source list also
  named **Magic UI**, **Aceternity UI**, **Motion-Primitives**, and
  **Superdesign UI Design Prompts** as clipped sources. Only
  **Aceternity UI** appears anywhere in the actual clips — as a single
  table row inside this awesome-shadcn-ui list ("Copy paste the most
  trending react components without having to worry about styling and
  animations"), not as its own dedicated clip. Magic UI, Motion-Primitives,
  and Superdesign UI Design Prompts were **not found** in
  `wiki/raw/clips` at all. No synthesis was written for them since there
  is no source content to back it — see
  [motion-inspiration.md](motion-inspiration.md) and
  [prompt-quality.md](prompt-quality.md) for where this gap matters most,
  and re-clip those sources if you want them covered.

## Related
- [shadcn-patterns.md](shadcn-patterns.md)
- [feature-ideas.md](feature-ideas.md)
- [gallery-page.md](gallery-page.md)
