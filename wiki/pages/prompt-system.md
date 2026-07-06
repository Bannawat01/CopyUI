# Prompt Template System

**Status: [implemented — mock data, no persistence layer]**

## Storage format
`src/lib/prompts.ts` exports a local `PromptTheme[]` array (6 mock themes:
saas-dashboard, landing-hero, pricing-table, auth-form, portfolio-grid,
changelog-feed). Each item has `slug`, `title`, `description`, `tags`,
`preview` (gradient + label + a `kind` discriminant used to pick a distinct
mini layout illustration — see [gallery-page.md](gallery-page.md)), a
`defaultPrimaryColor`, and a `promptTemplate` string.

## Template content quality
Each `promptTemplate` was rewritten as a structured instruction covering:
product context, layout direction, component requirements, visual style,
responsive behavior, and accessibility notes, with `{{primaryColor}}`
injected at the relevant visual-accent points (buttons, active states,
highlights) rather than as an afterthought. Intent is that pasting the
built output directly into v0.dev/Cursor/GenVibe gives a usable, specific
brief rather than a one-line description.

## Placeholder syntax
Templates use `{{variableName}}`, e.g. `{{primaryColor}}`. `buildPrompt()`
does a simple global regex replace (`\{\{(\w+)\}\}`) against a
`Record<string, string>` of variables.

## Keeping the template hidden
`promptTemplate` must never reach the client bundle or a server-rendered
page's HTML/RSC payload — that would defeat "hidden prompt" as a product
requirement:
- `getPublicPrompts()` returns a `PublicPromptTheme` (the full type minus
  `promptTemplate`) for the Gallery page and cards.
- The Detail page passes only `{ slug, preview, defaultPrimaryColor }` to the
  client `PromptDetail` component — never the raw prompt object.
- The actual template substitution happens server-side only, in the
  `/api/prompts/[slug]/build` route. See [copy-mechanism.md](copy-mechanism.md).
- Re-verified during the MVP polish pass (no data-model or route changes made
  that pass): confirmed via `curl` that raw template text still doesn't
  appear in either page's HTML.
- Re-verified again after the prompt-content rewrite: `promptTemplate` grew
  significantly longer/more structured, but the hidden-template guarantee is
  unaffected since it never touched `getPublicPrompts()` or what's passed to
  client components. Confirmed via `curl` (checking for the string "Product
  context:", which only appears inside `promptTemplate`) that none of the 6
  detail pages or the gallery page leak it.

## Related
- [copy-mechanism.md](copy-mechanism.md)
- [detail-page.md](detail-page.md)
- [gallery-page.md](gallery-page.md)
