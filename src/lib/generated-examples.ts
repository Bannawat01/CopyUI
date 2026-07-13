/**
 * Generated Examples v1 — public, static metadata describing the *direction*
 * each prompt is designed to produce.
 *
 * NOT the hidden promptTemplate, and not the built prompt. Nothing here is
 * derived from `promptTemplate`; it is hand-written public copy safe to ship
 * to the browser. `tests/generated-examples.test.ts` asserts that no template
 * marker (e.g. "Product context:") appears in this data.
 *
 * These are expectations, not screenshots and not guarantees. AI output varies
 * by tool and by run — the wording throughout says so, and the honesty guard in
 * tests fails the build if it ever starts claiming otherwise.
 */

import type { ToolMode } from "@/lib/tool-modes";

export type GeneratedExample = {
  slug: string;
  exampleTitle: string;
  /** One sentence: what you should expect to get back. */
  outcomeSummary: string;
  /** Schematic structure, rendered as stacked blocks — not a fake screenshot. */
  layoutPreview: string[];
  keyElements: string[];
  bestFor: string[];
  suggestedToolModes: ToolMode[];
  visualNotes: string[];
  /** Where a run is most likely to drift, so nobody is surprised. */
  expectationNote?: string;
};

export const GENERATED_EXAMPLES: GeneratedExample[] = [
  {
    slug: "saas-dashboard",
    exampleTitle: "Ops dashboard with KPI row and activity table",
    outcomeSummary:
      "A data-dense admin screen built for daily scanning: sidebar navigation, a row of headline metrics, two charts, and a sortable activity table.",
    layoutPreview: [
      "Sidebar (240px) + sticky top bar",
      "4 KPI cards in one row",
      "Line chart + bar chart",
      "Sortable activity table",
    ],
    keyElements: [
      "KPI cards with trend badges and sparklines",
      "Usage-over-time line chart with hover tooltip",
      "Revenue-by-segment bar chart",
      "Paginated activity table with status badges",
      "Loading skeletons and empty states",
    ],
    bestFor: [
      "Internal admin and ops tools",
      "B2B SaaS analytics screens",
      "Any screen answering “is anything off today?”",
    ],
    suggestedToolModes: ["v0", "cursor", "claude-code"],
    visualNotes: [
      "Three elevation levels, no drop shadows",
      "Tabular numerals so figures line up",
      "Accent color reserved for active nav and primary actions",
    ],
    expectationNote:
      "Chart libraries vary by tool. Expect the structure to hold; the exact charting implementation may differ.",
  },
  {
    slug: "landing-hero",
    exampleTitle: "Above-the-fold startup hero",
    outcomeSummary:
      "A single, self-contained hero section with one dominant headline, one primary action, and quiet social proof underneath.",
    layoutPreview: [
      "Eyebrow badge",
      "Large headline with one accent phrase",
      "Subtext + CTA row",
      "Grayscale logo strip",
    ],
    keyElements: [
      "Headline with exactly one highlighted phrase",
      "Primary CTA plus a secondary text link",
      "Eyebrow pill badge",
      "5–6 quiet partner wordmarks",
      "Subtle decorative background layer",
    ],
    bestFor: [
      "Startup and product landing pages",
      "Waitlist and early-access pages",
    ],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Headline dominates; everything else is visibly subordinate",
      "Decorative background stays under 20% opacity",
      "Partner logos read as proof marks, never as buttons",
    ],
    expectationNote:
      "Scoped to the hero only. Tools sometimes add a navbar or footer — you can delete those, or say “hero section only”.",
  },
  {
    slug: "pricing-table",
    exampleTitle: "Three-tier pricing with a recommended plan",
    outcomeSummary:
      "A comparison-friendly pricing block where the recommended tier is unmistakable at a glance.",
    layoutPreview: [
      "Monthly / Yearly toggle",
      "3 plan cards, middle one elevated",
      "Feature checklist per card",
      "Footer reassurance note",
    ],
    keyElements: [
      "Billing-period toggle with a savings hint",
      "Price as the largest element in each card",
      "5–8 item feature checklist per tier",
      "“Most Popular” badge on one tier only",
      "Disabled/current-plan CTA state",
    ],
    bestFor: ["SaaS pricing pages", "Upgrade and plan-comparison screens"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "Recommended card scaled up and lifted, with an accent border",
      "Non-recommended CTAs stay neutral so one path leads",
    ],
  },
  {
    slug: "auth-form",
    exampleTitle: "Centered login / signup card",
    outcomeSummary:
      "A minimal authentication card stripped of everything that is not required to sign in, with real validation states.",
    layoutPreview: [
      "Centered card, max-width 400px",
      "Email + password fields",
      "Full-width submit button",
      "Divider + social auth buttons",
    ],
    keyElements: [
      "Persistent visible labels, not placeholder-only",
      "Show/hide password toggle",
      "Inline validation messages under each field",
      "Loading state on submit",
      "Google and GitHub social buttons",
    ],
    bestFor: ["Login and signup flows", "Any product's front door"],
    suggestedToolModes: ["v0", "cursor", "vscode"],
    visualNotes: [
      "Submit button is the only visually dominant control",
      "Social buttons stay neutral so they never compete",
    ],
    expectationNote:
      "Markup and states only — no auth backend is wired up. You bring the provider.",
  },
  {
    slug: "portfolio-grid",
    exampleTitle: "Masonry project grid with hover reveals",
    outcomeSummary:
      "An image-forward portfolio where the work is the entire interface and chrome only appears on hover or focus.",
    layoutPreview: [
      "Category filter pills",
      "Masonry grid, mixed aspect ratios",
      "Hover overlay: title, tags, link",
    ],
    keyElements: [
      "Filter pills with active state",
      "Cards showing cover image only at rest",
      "Overlay revealing title, tags, and “View project”",
      "Empty state when a filter matches nothing",
    ],
    bestFor: ["Designer and developer portfolios", "Studio work pages"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Near-black background so imagery carries the color",
      "Overlay content also appears on keyboard focus, not hover only",
    ],
  },
  {
    slug: "changelog-feed",
    exampleTitle: "Vertical release timeline",
    outcomeSummary:
      "A scannable changelog where a returning user can find the boundary between “new to me” and “already knew”.",
    layoutPreview: [
      "Page header + subscribe CTA",
      "Vertical connector line",
      "Entries: date, version badge, title, notes",
      "Load-more control",
    ],
    keyElements: [
      "Version badges in monospace",
      "New / Improved / Fixed tags with distinct icons",
      "Bulleted release notes per entry",
      "Newest entry visually emphasized",
    ],
    bestFor: ["Public product changelogs", "Release-notes pages"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "Only the newest entry carries the accent color",
      "Entries marked up as a semantic ordered list",
    ],
  },
  {
    slug: "agency-landing",
    exampleTitle: "Agency homepage with case-study proof",
    outcomeSummary:
      "A credibility-first homepage where outcome metrics, not service descriptions, do the selling.",
    layoutPreview: [
      "Sticky nav + full-bleed hero",
      "3-up services grid",
      "2-up case studies with result stats",
      "Client logos + closing CTA band",
    ],
    keyElements: [
      "Hero headline with a services one-liner",
      "Case-study cards where the metric is the biggest text",
      "Services grid with icons",
      "Client logo strip",
    ],
    bestFor: ["Creative and digital agencies", "Studio and consultancy sites"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Warm accent used sparingly — premium, not loud",
      "Outcome metrics outrank project titles",
    ],
  },
  {
    slug: "ai-chat-interface",
    exampleTitle: "Conversational AI workspace",
    outcomeSummary:
      "A long-session chat product: browsable history, readable message threads, and code you can copy without selecting it.",
    layoutPreview: [
      "Sidebar: search, new chat, grouped history",
      "Centered message thread",
      "Composer pinned to the bottom",
    ],
    keyElements: [
      "Conversation list grouped by date",
      "Assistant messages as full-width prose with markdown",
      "Code blocks with a language label and copy button",
      "Streaming indicator and stop button",
      "Example-prompt chips in the empty state",
    ],
    bestFor: ["AI assistant products", "Internal LLM tools"],
    suggestedToolModes: ["v0", "cursor", "claude-code"],
    visualNotes: [
      "Low-glare dark surface for long reading",
      "Comfortable 65–75 character line length",
    ],
    expectationNote:
      "Streaming behavior is described, not implemented — you wire it to your own model.",
  },
  {
    slug: "analytics-command-center",
    exampleTitle: "Wall-display metrics grid",
    outcomeSummary:
      "A dense, no-sidebar monitoring view designed to be read from across a room, with alert states you cannot miss.",
    layoutPreview: [
      "Slim top bar: title, live indicator, range",
      "4-column grid of metric panels",
      "Each panel: value, delta, mini chart",
    ],
    keyElements: [
      "Time-range pill group (1h / 24h / 7d / 30d)",
      "Big tabular values with delta badges",
      "Alert-state panels with a distinct border",
      "Stale-data and loading states",
    ],
    bestFor: ["Ops and NOC dashboards", "Shared team displays"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "High contrast for distance reading",
      "Alert state carries a text label, not color alone",
    ],
  },
  {
    slug: "ecommerce-product-page",
    exampleTitle: "Product detail with variants and reviews",
    outcomeSummary:
      "A conversion-focused product page where the selected variant, its availability, and the add-to-cart button all sit together.",
    layoutPreview: [
      "Gallery + thumbnails | title, price, variants, CTA",
      "Description / specs tabs",
      "Reviews with rating summary",
    ],
    keyElements: [
      "Image gallery with thumbnail selection and zoom",
      "Variant swatches with out-of-stock states",
      "Quantity stepper",
      "Add-to-cart with confirmation state",
      "Star-rating summary and paginated reviews",
    ],
    bestFor: ["Online stores", "Single-product landing pages"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "Product imagery gets a neutral backdrop so colors read true",
      "Add to cart is the single dominant control",
    ],
  },
  {
    slug: "finance-dashboard",
    exampleTitle: "Personal finance overview",
    outcomeSummary:
      "A calm, trustworthy money screen: balances, budget progress, and recent transactions, with nothing that feels salesy.",
    layoutPreview: [
      "Accounts sidebar",
      "Total balance card",
      "Spending chart + budget panel",
      "Transaction list",
    ],
    keyElements: [
      "Total balance as the largest number on the page",
      "Category spending chart with legend",
      "Budget bars: on-track / near-limit / over-limit",
      "Transaction rows with merchant, category, amount",
    ],
    bestFor: ["Fintech and budgeting apps", "Account overview screens"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "Restrained palette — nothing gamified",
      "Over-limit states carry a text label, not just red",
    ],
  },
  {
    slug: "kanban-project-board",
    exampleTitle: "Task board with columns and assignees",
    outcomeSummary:
      "A team board optimized for scanning what is in progress and who owns it, with a keyboard path that does not depend on dragging.",
    layoutPreview: [
      "Top bar: title, filters, add task",
      "Horizontally scrolling columns",
      "Task cards with avatar and due date",
    ],
    keyElements: [
      "Column headers with task counts",
      "Cards with tags, assignee, due date, priority",
      "Drag, hover, and empty-column states",
      "A “Move to…” menu as a keyboard alternative to dragging",
    ],
    bestFor: ["Project management tools", "Internal team boards"],
    suggestedToolModes: ["cursor", "claude-code", "v0"],
    visualNotes: [
      "Priority shown by icon and label, not color alone",
      "Accent reserved for one priority level, not every chip",
    ],
    expectationNote:
      "Drag-and-drop libraries differ per tool. Expect the layout and states; the DnD implementation will vary.",
  },
  {
    slug: "docs-knowledge-base",
    exampleTitle: "Three-column documentation site",
    outcomeSummary:
      "A developer docs layout built for finding a page fast and reading a long technical article without losing your place.",
    layoutPreview: [
      "Nav tree | article | on-this-page TOC",
      "Search with ⌘K hint",
      "Code blocks with copy buttons",
    ],
    keyElements: [
      "Collapsible nav tree with active-page state",
      "Auto-generated table of contents with scroll highlight",
      "Code blocks with language label and copy button",
      "Info / warning / tip callouts",
    ],
    bestFor: ["API and product documentation", "Internal knowledge bases"],
    suggestedToolModes: ["v0", "cursor", "claude-code"],
    visualNotes: [
      "Generous line-height for long reading",
      "Correct heading hierarchy — it is how docs are navigated",
    ],
  },
  {
    slug: "mobile-app-landing",
    exampleTitle: "App landing with phone mockup",
    outcomeSummary:
      "A download-driving marketing page where a phone-frame mockup carries the visual weight.",
    layoutPreview: [
      "Headline + subtext | phone mockup",
      "App Store + Google Play badges",
      "3–4 feature highlights",
    ],
    keyElements: [
      "Phone-frame mockup with a simplified app screen inside",
      "Two equally-weighted store badges",
      "Feature highlight row with icons",
      "Decorative glow behind the device",
    ],
    bestFor: ["Mobile app marketing pages", "Pre-launch app pages"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "The mockup is the strongest visual hook and stacks first on mobile",
      "Neither app store is implied as preferred",
    ],
  },
  {
    slug: "real-estate-listing",
    exampleTitle: "Property listing with inquiry card",
    outcomeSummary:
      "A listing page that puts price, beds/baths, and address up front, with a sticky way to request a tour.",
    layoutPreview: [
      "Full-width photo gallery",
      "Price, address, key facts | sticky contact card",
      "Description + amenities",
    ],
    keyElements: [
      "Gallery with thumbnails and a lightbox",
      "Key-facts grid (beds / baths / sqft)",
      "Amenities checklist",
      "Sticky agent card with an inquiry form",
    ],
    bestFor: ["Real estate listings", "Rental and property sites"],
    suggestedToolModes: ["v0", "cursor"],
    visualNotes: [
      "Price is the largest text on the page",
      "Photos never tinted by the accent color",
    ],
  },
  {
    slug: "restaurant-menu-page",
    exampleTitle: "Digital menu with dietary tags",
    outcomeSummary:
      "A mobile-first menu built for a seated diner scanning dish names, prices, and dietary info in poor lighting.",
    layoutPreview: [
      "Header + category jump-nav",
      "Menu sections",
      "Dish rows: name … price",
    ],
    keyElements: [
      "Sticky category nav with active-section highlight",
      "Dish name and price at opposite ends of one line",
      "Dietary icons with text alternatives",
      "“Chef's pick” badges on select dishes",
    ],
    bestFor: ["Restaurant and café menus", "QR-code table menus"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Warm, editorial type for a hospitality feel",
      "Dietary tags never rely on icon color alone",
    ],
  },
  {
    slug: "event-conference-page",
    exampleTitle: "Conference page with countdown and schedule",
    outcomeSummary:
      "A ticket-driving event page: countdown, speaker lineup, and a day-by-day schedule you can scan across days.",
    layoutPreview: [
      "Hero: name, date, countdown, CTA",
      "Speaker grid",
      "Day tabs + session list",
      "Ticket tiers",
    ],
    keyElements: [
      "Live countdown timer",
      "Speaker cards with photo, name, title",
      "Day-tab schedule switcher",
      "Ticket-tier cards with one highlighted",
    ],
    bestFor: ["Conferences and meetups", "Workshop and summit pages"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Countdown and Get Tickets dominate the hero",
      "Accent means “action”, not decoration",
    ],
  },
  {
    slug: "creator-link-in-bio",
    exampleTitle: "Creator link hub",
    outcomeSummary:
      "A phone-shaped link page for a visitor arriving from a social bio with high intent and low patience.",
    layoutPreview: [
      "Avatar + name + short bio",
      "Stacked full-width link buttons",
      "Social icon row",
    ],
    keyElements: [
      "Circular avatar with name and bio",
      "Equal-weight link buttons, 48px+ tall",
      "One optional featured link",
      "Social platform icon row",
    ],
    bestFor: ["Creator link-in-bio pages", "Personal landing pages"],
    suggestedToolModes: ["v0", "genvibe"],
    visualNotes: [
      "Stays a centered ~420px column even on desktop",
      "Only the featured link uses the accent color",
    ],
  },
];

/** Shown on the homepage — a spread across categories, not the first four. */
export const FEATURED_EXAMPLE_SLUGS = [
  "saas-dashboard",
  "ai-chat-interface",
  "landing-hero",
  "ecommerce-product-page",
] as const;

export function getExampleBySlug(slug: string): GeneratedExample | undefined {
  return GENERATED_EXAMPLES.find((e) => e.slug === slug);
}

export function getFeaturedExamples(): GeneratedExample[] {
  return FEATURED_EXAMPLE_SLUGS.map((slug) => getExampleBySlug(slug)).filter(
    (e): e is GeneratedExample => e !== undefined,
  );
}
