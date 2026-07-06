# Prompt Template System

**Status: [implemented — mock data, no persistence layer]**

## Storage format
`src/lib/prompts.ts` exports a local `PromptTheme[]` array (6 mock themes:
saas-dashboard, landing-hero, pricing-table, auth-form, portfolio-grid,
changelog-feed). Each item has `slug`, `title`, `description`, `tags`,
`preview` (gradient + label used for the visual placeholder), a
`defaultPrimaryColor`, and a `promptTemplate` string.

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

## Related
- [copy-mechanism.md](copy-mechanism.md)
- [detail-page.md](detail-page.md)
- [gallery-page.md](gallery-page.md)
