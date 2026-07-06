# Prompt Quality Inspiration

**Status: [new — synthesized from wiki/raw/clips; source gap noted below]**

## Source gap
**Superdesign UI Design Prompts** — the source named for prompt-quality
inspiration — was **not found** in `wiki/raw/clips`. No clip matching
that name or a plausible source URL exists among the 12 files present.
No synthesis was written in its place; re-clip it directly if this
research is still wanted.

## What the processed clips do offer (adjacent, not a direct match)
*Source: `Examples.md`, `Introduction.md` (ui.shadcn.com/docs/registry)*
- **What it is**: shadcn's `registry-item.json` schema describes a themed
  UI package as structured data: a `type` (`registry:style`,
  `registry:component`, etc.), `dependencies`, `registryDependencies`
  (including remote URLs), and a `cssVars` block for light/dark theme
  tokens.
- **Why it matters for CopyUI**: This is the closest thing in the
  processed clips to "a structured spec for describing a UI to generate,"
  which is conceptually adjacent to what a *prompt quality* source like
  Superdesign would likely cover (structured, tool-friendly UI briefs).
  CopyUI's own `promptTemplate` format (see
  [prompt-system.md](prompt-system.md): product context, layout, visual
  hierarchy, components & states, design language, responsive behavior,
  accessibility) is already a more elaborate, natural-language version of
  the same idea — structured sections instead of a fixed JSON schema.
- **Useful ideas**: The registry schema's explicit `cssVars.theme` block
  (naming exact tokens like `--primary`, `font-sans`) is a reminder that
  CopyUI's `{{primaryColor}}` placeholder could, in principle, be extended
  to a small set of named tokens (font, radius) the same way — already
  tracked as an open idea in [next-actions.md](next-actions.md) ("Add more
  customizable variables beyond `primaryColor`"), now with one piece of
  external prior art backing the idea.
- **What to avoid**: Don't over-index on this one adjacent source as if it
  were the requested prompt-quality research — it describes a *code*
  distribution schema, not prompt-writing guidance. Treat it as a weak,
  secondary signal only.

## Possible next actions
- **[uncertain]** Re-clip Superdesign UI Design Prompts specifically if
  prompt-writing-quality research is still a priority — this page
  currently has no direct source for it.
- If/when `promptTemplate` gains more customizable variables (font,
  radius — see next-actions.md), consider naming them consistently with
  shadcn's own CSS variable names (`--radius`, `font-sans`) so the
  eventual output prompts feel native to the shadcn ecosystem CopyUI
  targets.

## Related
- [prompt-system.md](prompt-system.md)
- [shadcn-patterns.md](shadcn-patterns.md)
- [next-actions.md](next-actions.md)
