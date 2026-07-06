# shadcn/ui Patterns

**Status: [new — synthesized from wiki/raw/clips]**

Synthesis of shadcn/ui's own docs (Components, Registry Introduction,
Registry Examples) plus two component collections that follow its
conventions (Origin UI, Shadcnblocks). CopyUI already uses shadcn/ui per
CLAUDE.md — this page captures patterns worth reusing or being aware of,
not a proposal to change the current stack.

## shadcn/ui docs
*Source: `Components.md`, `Introduction.md`, `Examples.md`
(ui.shadcn.com/docs/*)*
- **What it is**: Official docs for the shadcn/ui component library and
  its newer "registry" feature — a distribution system for sharing custom
  components, hooks, pages, config, and rules across projects (not
  limited to React).
- **Why it matters for CopyUI**: CopyUI already consumes shadcn/ui
  components (`button`, `card`, `badge`, `input`, `separator` per
  [styling.md](styling.md)); the registry docs describe the exact
  `registry-item.json` schema (`registry:style`, `dependencies`,
  `registryDependencies`, `cssVars`) used to package a themeable UI spec.
- **Useful ideas**: The registry-item schema is a structured way to
  describe "a themed UI + its dependencies + its CSS variables" as data —
  conceptually similar to how `PromptTheme` in `src/lib/prompts.ts`
  structures a themed prompt as data. Worth knowing this schema exists as
  prior art if CopyUI's prompt data model ever needs to express more
  structured theming (fonts, radius, not just `primaryColor`) — see
  [prompt-quality.md](prompt-quality.md) and
  [next-actions.md](next-actions.md) (customizable variables beyond
  color).
- **What to avoid**: Don't confuse "registry" (a code/component
  distribution system) with CopyUI's own product — CopyUI distributes
  *prompts*, not code, and per CLAUDE.md must not grow a backend/CLI of
  its own. The registry pattern is inspiration for *data shape*, not a
  feature to implement.
- **Possible next actions**: None immediate — reference only.

## Shadcnblocks & Origin UI (styling/token conventions)
*Source: `Shadcn Components - Extra components for Shadcn UI.md`,
`shadcnoriginui...md`*
- **What it is**: Two large component catalogs, both following shadcn's
  CSS-variable theming convention almost verbatim (Origin UI's clip
  includes the exact same oklch `--background`/`--primary`/etc. variable
  names CopyUI's `globals.css` already uses).
- **Why it matters for CopyUI**: Confirms CopyUI's dark-mode token setup
  (tuned darker during the marketplace redesign — see
  [styling.md](styling.md)) is aligned with ecosystem convention, not a
  one-off choice.
- **Useful ideas**: Shadcnblocks groups components by *kind* with a
  count badge (e.g. "Button — 126 components") and a representative
  thumbnail per group — a lightweight pattern for signaling catalog depth
  that doesn't require per-item screenshots.
- **What to avoid**: Shadcnblocks' premium/paid tiers are out of scope
  (no payments per CLAUDE.md).
- **Possible next actions**: None code-level; noted for awareness.

## Related
- [competitor-inspiration.md](competitor-inspiration.md)
- [styling.md](styling.md)
- [prompt-system.md](prompt-system.md)
