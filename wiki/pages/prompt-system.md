# Prompt Template System

**Status: [implemented — mock data, no persistence layer]**

## Storage format
`src/lib/prompts.ts` exports a local `PromptTheme[]` array, expanded from
6 to **18 mock themes**: the original 6 (saas-dashboard, landing-hero,
pricing-table, auth-form, portfolio-grid, changelog-feed) plus 12 new ones
(agency-landing, ai-chat-interface, analytics-command-center,
ecommerce-product-page, finance-dashboard, kanban-project-board,
docs-knowledge-base, mobile-app-landing, real-estate-listing,
restaurant-menu-page, event-conference-page, creator-link-in-bio).

Each item has `slug`, `title`, `description`, `tags`, a `category` (one of
12: Landing, Dashboard, SaaS, Ecommerce, AI, Portfolio, Docs, Form,
Mobile, Finance, Real Estate, Content — see [gallery-page.md](gallery-page.md)
for how this drives the pill filter), `preview` (gradient + label + a
`kind` discriminant, now 18 distinct kinds, one per theme, used to pick a
screenshot-like mock layout — see [styling.md](styling.md)), a `meta`
object (`creator`, `copies` — mock marketplace metadata, local display
data only, no accounts/backend), a `defaultPrimaryColor`, and a
`promptTemplate` string.

## Template content quality
Each `promptTemplate` is a structured instruction with 7 labeled sections:
product context, layout, **visual hierarchy**, components & states, design
language, responsive behavior, and accessibility. `{{primaryColor}}` is
injected at specific visual-accent points (buttons, active states,
highlights, focus rings) rather than mentioned once generically.

Refined again for real-world output quality, replacing vague adjectives
("clean," "modern," "bold" used alone) with concrete, actionable
specifics an AI code tool can act on directly:
- **Layout**: exact breakpoints, spacing scale (8px grid), max-widths,
  sidebar/card dimensions instead of "responsive grid."
- **Visual hierarchy**: an explicit new section per theme stating which
  element is dominant vs. secondary vs. tertiary (e.g. "price is the
  largest element in the pricing card; plan name is smaller and above it").
- **Components & states**: default/hover/active/disabled/loading/empty
  states called out per component, not just the component list.
- **Design language**: concrete elevation systems (surface-lighter-than-
  background instead of drop shadows), typography rules (one display
  weight, one body weight), and precise rules for *where* `{{primaryColor}}`
  is and isn't used, so it reads as a deliberate accent, not decoration.
- **Accessibility**: specific WCAG contrast ratios (4.5:1 text / 3:1 UI),
  concrete ARIA attributes and semantic elements (`<ol>`, `<table>`,
  `aria-pressed`, `aria-live`) rather than "keyboard accessible."

Intent: pasting the built output directly into v0.dev, Cursor, or GenVibe
should produce a result close to a real design brief, not a rough sketch.

The 12 new themes added during the dataset-expansion pass follow the same
7-section format and the same level of concreteness as the refined
original 6 (exact spacing/breakpoints, explicit dominant/secondary/
tertiary hierarchy, per-component states, precise `{{primaryColor}}`
placement rules, specific ARIA/contrast requirements) — they were
authored to the same bar, not as lighter-weight filler entries.

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
- Re-verified once more after this output-quality refinement pass (same
  scope: text content only, no data-flow changes) — all 6 detail routes and
  the gallery page still return 200 with no "Product context:" match, and a
  direct `POST /api/prompts/[slug]/build` call confirms the refined template
  still substitutes `{{primaryColor}}` correctly.
- Re-verified again after the visual marketplace redesign: the new `meta`
  field (`creator`, `copies`) was added to `getPublicPrompts()`'s output
  deliberately — it's mock display data, not the hidden template, so it's
  safe to ship to the client and does appear in gallery card HTML by
  design. `promptTemplate` itself was untouched by this pass; `curl` across
  the gallery page and all 6 detail routes still shows no "Product
  context:" match.
- Re-verified after expanding the dataset from 6 to 18 themes: the new
  `category` field was likewise added to `getPublicPrompts()` deliberately
  (it drives the gallery pill filter and is safe public data). `curl`
  across the gallery page and all **18** detail routes (`/prompts/<slug>`
  for every slug, including all 12 new ones) confirms none of them contain
  "Product context:" — the hidden-template guarantee held through the
  3x-larger dataset without any changes to `getPublicPrompts()`'s
  omission logic or the Detail page's prop-passing.

## Related
- [copy-mechanism.md](copy-mechanism.md)
- [detail-page.md](detail-page.md)
- [gallery-page.md](gallery-page.md)
