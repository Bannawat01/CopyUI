export type PreviewKind =
  | "dashboard"
  | "hero"
  | "pricing"
  | "auth"
  | "portfolio"
  | "changelog"
  | "agency"
  | "chat"
  | "analytics"
  | "ecommerce"
  | "finance"
  | "kanban"
  | "docs"
  | "mobile"
  | "realestate"
  | "menu"
  | "event"
  | "linkbio";

export type Category =
  | "Landing"
  | "Dashboard"
  | "SaaS"
  | "Ecommerce"
  | "AI"
  | "Portfolio"
  | "Docs"
  | "Form"
  | "Mobile"
  | "Finance"
  | "Real Estate"
  | "Content";

/** Category pills shown above the gallery grid. */
export const GALLERY_CATEGORIES = [
  "All",
  "Landing",
  "Dashboard",
  "SaaS",
  "Ecommerce",
  "AI",
  "Portfolio",
  "Docs",
] as const;

export type PromptTheme = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: Category;
  preview: {
    gradientFrom: string;
    gradientTo: string;
    accentLabel: string;
    kind: PreviewKind;
  };
  /** Mock marketplace metadata — local display data only, no accounts/backend. */
  meta: {
    creator: string;
    copies: number;
  };
  defaultPrimaryColor: string;
  promptTemplate: string;
};

export const prompts: PromptTheme[] = [
  {
    slug: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    description:
      "A clean, data-dense dashboard layout with sidebar navigation, KPI cards, and charts.",
    tags: ["dashboard", "saas", "charts"],
    category: "Dashboard",
    preview: {
      gradientFrom: "#1e293b",
      gradientTo: "#0f172a",
      accentLabel: "Dashboard",
      kind: "dashboard",
    },
    meta: { creator: "CopyUI Studio", copies: 842 },
    defaultPrimaryColor: "#6366f1",
    promptTemplate: `Product context: A B2B SaaS analytics dashboard used by operations teams to monitor product usage and revenue metrics throughout the workday. Optimize for fast daily scanning, not first-time delight. Populate every metric, chart, and table row with realistic sample data (specific dollar amounts, percentages, dates, user names) — never Lorem Ipsum or generic "Value 1" placeholders.

Layout: 240px left sidebar (collapses to 64px icon rail below 1280px, fully hidden behind a drawer below 768px) + sticky 64px top navbar (breadcrumb/page title left, search input center, notifications and account menu right) + main content area on a 12-column grid with 24px gutters and a 1280px max content width, 32px page padding on desktop / 16px on mobile.

Visual hierarchy: Page title (text-2xl, font-semibold) sits above a single non-wrapping row of exactly 4 KPI cards on desktop — these are the primary focal point and should use the largest numerals on the page (text-3xl, tabular-nums). Charts are secondary (text-sm section labels, text-lg titles); the activity table is tertiary and scrolls independently rather than competing for vertical space. Never let body copy or table text exceed the visual weight of the KPI numbers, and never let a 5th ad-hoc card sneak into the KPI row.

Components & states: 4 KPI cards (label, value, trend badge with up/down icon and percentage, sparkline); a line chart (usage over time, with hover tooltip and a visible empty state for zero-data ranges); a bar chart (revenue by segment, with a loading skeleton matching its final aspect ratio); a paginated, sortable activity table with columns for user (avatar + name), action, timestamp, and a status badge — plus a loading skeleton, empty state, and zebra-striped or bordered rows for scanability. Buttons and nav items need explicit default/hover/active/disabled states.

Design language: Dark surface system with 3 elevation levels — base background, card surface one step lighter, and hover/active state one step lighter still (avoid drop shadows; use background-color and a 1px border at low opacity to convey elevation). Use {{primaryColor}} sparingly and consistently: active nav item background, primary buttons, chart line/bar fill, and focus rings — never as a body-text color. Typography: one sans-serif family, tight line-height on numerals, relaxed line-height on body text. Use an 8px spacing scale throughout (8/16/24/32).

Responsive behavior: Below 1280px the sidebar becomes an icon-only rail (labels in tooltips); below 768px it moves to a slide-in drawer triggered by a hamburger icon in the navbar, and KPI cards reflow from a 4-column row to a 2x2 grid to a single column. Charts stack vertically below 900px; if a chart's data table would overflow, wrap it in a horizontally scrollable container with a visible scroll affordance rather than shrinking text.

Accessibility: Target WCAG AA contrast (4.5:1 body text, 3:1 large text/UI) for {{primaryColor}} against the dark background — pick a lighter tint if the base value fails at small sizes. Icon-only nav items and buttons get descriptive aria-labels; the activity table uses real <table> markup with <th scope="col"> headers and is fully operable via keyboard (Tab/Shift+Tab between rows, Enter to open a row); all interactive elements show a visible focus-visible outline distinct from hover state.`,
  },
  {
    slug: "landing-hero",
    title: "Startup Landing Hero",
    description:
      "A bold hero section for a startup landing page with headline, CTA, and social proof.",
    tags: ["landing", "marketing", "hero"],
    category: "Landing",
    preview: {
      gradientFrom: "#312e81",
      gradientTo: "#111827",
      accentLabel: "Landing",
      kind: "hero",
    },
    meta: { creator: "CopyUI Studio", copies: 1204 },
    defaultPrimaryColor: "#8b5cf6",
    promptTemplate: `Product context: The above-the-fold hero section of a startup's marketing landing page. Its only job is to make a first-time visitor understand the product's value proposition and take one action within 3 seconds of landing. This is a single self-contained section — do not generate a navbar, testimonial carousel, pricing block, or footer unless explicitly asked; scope the output to exactly what's described below.

Layout: Centered single-column hero, max-width 720px for text content, vertically centered within a full-viewport-height (min-h-screen) section. Stacking order top to bottom: eyebrow label, headline, subtext, button row, logo strip — each separated by a consistent 24px vertical rhythm, with a larger 64px gap before the logo strip to visually separate "pitch" from "proof."

Visual hierarchy: The headline is the single dominant element (text-5xl to text-6xl, font-bold, tight tracking, 1.05 line-height) — everything else is visibly subordinate: eyebrow is small and uppercase (text-xs, letter-spacing-wide), subtext is muted and lighter weight (text-lg, text-white/70), and the logo strip is the quietest element on the page (low-opacity grayscale). Exactly one word or short phrase in the headline is highlighted in {{primaryColor}} — not the whole headline — to keep it purposeful rather than decorative.

Components & states: Eyebrow badge (pill shape, subtle border, small dot or icon); headline with one {{primaryColor}}-highlighted phrase; subtext paragraph (1-2 sentences, no more); a primary CTA button (filled, {{primaryColor}} background, px-6 py-3, rounded-lg, text-base font-medium) with explicit hover (slight brightness/scale change) and focus states, plus a secondary ghost/text link beside it at matching height; a logo strip of 5-6 grayscale partner/customer logos (wordmarks or simple placeholder marks, not stock-photo logos); a decorative background layer (gradient blob or dot-grid) that never overlaps or reduces contrast behind the text. Avoid decorative emoji, stock photography, or illustration filler — every element must serve the hierarchy above.

Design language: Dark, high-contrast background (near-black, not pure gray) so the {{primaryColor}} accent and white text pop. Confident, editorial typography — one bold display weight for the headline, one regular weight for everything else, no more than 2 font sizes competing at the same visual level. Avoid generic centered-gradient-blob clichés by keeping the decorative background subtle (10-20% opacity) so it never competes with the text.

Responsive behavior: Headline steps down through the type scale on smaller viewports (text-6xl desktop → text-4xl mobile) rather than just wrapping; the button row stacks to full-width buttons below 480px with the primary button first; the logo strip wraps to 2-3 per row on mobile instead of scrolling, since horizontal scroll on a hero reads as broken rather than intentional.

Accessibility: The {{primaryColor}}-highlighted headline text and the primary CTA button must meet WCAG AA contrast (4.5:1) against the dark background — adjust the tint lighter if needed rather than lowering opacity. The CTA has a specific, descriptive accessible name (e.g. "Start free trial," never "Click here"). All decorative background elements (gradient blobs, grid patterns) are marked aria-hidden="true" and excluded from tab order.`,
  },
  {
    slug: "pricing-table",
    title: "Modern Pricing Table",
    description:
      "A three-tier pricing table with a highlighted recommended plan and feature comparison.",
    tags: ["pricing", "saas", "conversion"],
    category: "SaaS",
    preview: {
      gradientFrom: "#164e63",
      gradientTo: "#0f172a",
      accentLabel: "Pricing",
      kind: "pricing",
    },
    meta: { creator: "CopyUI Studio", copies: 631 },
    defaultPrimaryColor: "#06b6d4",
    promptTemplate: `Product context: A SaaS pricing page section whose job is to remove decision friction — a prospective customer should be able to compare three tiers and pick one within seconds, with the recommended plan unmistakable.

Layout: Billing-period toggle (Monthly/Yearly) centered above a three-column card grid (Starter, Pro, Enterprise), 24px gutter, equal card widths, aligned to a shared baseline. The Pro card is scaled 1.05x and shifted up 8-12px relative to the others so it visually sits "in front," with a "Most Popular" badge overlapping its top edge.

Visual hierarchy: Price is the largest element in every card (text-4xl, font-bold, tabular-nums) — plan name is smaller and above it (text-sm, uppercase, muted), billing period ("/month") is smaller still and directly beside the price, never on its own line. Feature lists are body-weight text; the CTA button is the second-largest visual weight in the card after the price. On the Pro card specifically, its border/glow and badge should make it identifiable from a blurred thumbnail at a glance.

Components & states: Billing toggle (switch or two-tab control, with a clear active/pressed state and a "Save 20%" hint on Yearly); 3 pricing cards each with plan name, price, billing period, a 5-8 item feature checklist (checkmark or x-mark icon + text label per row), and a CTA button; a "Most Popular" badge on Pro only; a footer note (money-back guarantee or free-trial length) below the cards. Include disabled/current-plan states for the CTA in case this is shown to an already-subscribed user.

Design language: Dark background with card surfaces one elevation step lighter than the page (subtle background-color shift, not a heavy drop shadow); Pro's card gets a {{primaryColor}} border (1.5-2px) and a soft outer glow (large blur, low opacity) to separate it without looking gaudy. Use {{primaryColor}} consistently for: the Pro card border/glow, the "Most Popular" badge, all primary CTA buttons, and the toggle's active state — non-Pro CTAs can be a neutral outline/secondary style so Pro still reads as the recommended path.

Responsive behavior: Below 900px, columns stack vertically in this order: Pro first (with its badge and scale-up preserved), then Starter, then Enterprise — so the recommended plan is still what a scrolling mobile user sees first. The billing toggle stays pinned above the stack, not repeated per card. Feature lists never introduce horizontal scroll; wrap long feature text onto a second line instead.

Accessibility: The billing toggle is a real button/switch, keyboard-operable (Space/Enter to toggle) with an explicit pressed/checked state exposed to assistive tech (aria-pressed or role="switch" aria-checked). Every feature row's check/x status has a text or visually-hidden label ("Included" / "Not included") so meaning doesn't depend on icon color alone. {{primaryColor}} used on the Pro border, badge, and buttons must meet 3:1 contrast (UI components) against its card background.`,
  },
  {
    slug: "auth-form",
    title: "Minimal Auth Form",
    description:
      "A centered login/signup card with social auth buttons and form validation states.",
    tags: ["auth", "form", "minimal"],
    category: "Form",
    preview: {
      gradientFrom: "#3f3f46",
      gradientTo: "#18181b",
      accentLabel: "Auth",
      kind: "auth",
    },
    meta: { creator: "CopyUI Studio", copies: 397 },
    defaultPrimaryColor: "#f59e0b",
    promptTemplate: `Product context: A login/signup screen for a product's authentication flow. The only success metric is completion speed — remove every element that isn't required to sign in or sign up.

Layout: A single centered card, max-width 400px, vertically and horizontally centered on a plain dark background (no distracting imagery). Inside the card, top to bottom: logo/title, form heading ("Log in" or "Create account"), input fields, primary submit button, a labeled divider ("or continue with"), social auth buttons, then a single footer line linking to the alternate flow (login ↔ signup). 16-20px spacing between elements, 32px card padding.

Visual hierarchy: The submit button is the most visually dominant interactive element (full-width, filled {{primaryColor}}, largest touch target on the card) — social auth buttons are visually secondary (outline or neutral-filled style, equal size, never competing with the primary button's color). The "forgot password?" link is small and low-emphasis, positioned beside or below the password field, not near the submit button where it could be mistaken for the primary action.

Components & states: Email and password fields with persistent visible labels (not placeholder-only), a show/hide password icon-toggle inside the password field, inline validation messages that appear directly under their field, a full-width primary submit button with a loading state (spinner, disabled) during submission, a divider with "or continue with" text, 2 social auth buttons (Google, GitHub) with provider icon + label, and a "forgot password?" link plus a footer login/signup toggle link.

Design language: Minimal and calm — dark background, card surface one elevation step lighter with a thin low-opacity border (no heavy shadow). Use {{primaryColor}} only for: the primary submit button, input focus rings/borders, and text links — social auth buttons stay neutral so they don't visually compete with the primary path. One consistent input height and border radius across all fields and buttons.

Responsive behavior: Below 480px the card drops its max-width and becomes full-bleed with 16-20px side padding instead of appearing to float in empty space; all inputs and buttons stay full-width at every breakpoint (never shrink to an awkward partial width); the two social auth buttons stack vertically instead of side-by-side once the card width can't fit both comfortably with readable labels.

Accessibility: Every input has a real, visible <label> (not a placeholder standing in for one). Validation errors are exposed via aria-live="polite" and linked to their field with aria-describedby so screen readers announce them in context. The show/hide password toggle updates its accessible name/aria-label between "Show password" and "Hide password" as its state changes. Submit button shows aria-busy during the loading state and is disabled (not just visually dimmed) to prevent double submits.`,
  },
  {
    slug: "portfolio-grid",
    title: "Creative Portfolio Grid",
    description:
      "A masonry-style project grid for a designer or developer portfolio with hover reveals.",
    tags: ["portfolio", "grid", "creative"],
    category: "Portfolio",
    preview: {
      gradientFrom: "#701a75",
      gradientTo: "#1e1b4b",
      accentLabel: "Portfolio",
      kind: "portfolio",
    },
    meta: { creator: "CopyUI Studio", copies: 519 },
    defaultPrimaryColor: "#ec4899",
    promptTemplate: `Product context: A creative portfolio page for a designer or developer, shown to potential clients or employers who will judge craft quality from the browsing experience itself, not just the projects inside it.

Layout: A horizontal filter bar (category/tag pills) sits above a masonry-style project grid — use CSS columns (column-count) or a JS masonry approach so image cards of different aspect ratios tile without uniform-height cropping. 16-20px gap between cards, page content capped at a comfortable max-width (e.g. 1400px) with consistent side padding.

Visual hierarchy: Project imagery is the entire visual hierarchy — cards have no visible chrome (no borders, titles, or tags) until hover/focus, at which point an overlay introduces title (largest), then 1-2 tags (smaller, muted), then a "View project" affordance (smallest, but with the strongest {{primaryColor}} accent) in that descending order of size. The filter bar is intentionally quiet (small pill buttons, low-contrast until active) so it never competes with the imagery below it.

Components & states: Filter/category pill buttons with distinct default, hover, and active/selected states; project cards showing only a cover image at rest; on hover/focus, a dark scrim overlay fades in with title, tags, and a "View project" link/arrow; include a graceful empty state ("No projects match this filter") for when a filter yields zero results.

Design language: Bold and image-forward — near-black background so full-bleed project imagery has maximum contrast and color pops. Use {{primaryColor}} sparingly as a single unifying accent: the active filter pill's background or underline, the hover overlay's tint/gradient, and the "View project" link/icon — never as a color competing with the project images themselves.

Responsive behavior: Grid reflows from 3-4 columns on desktop (≥1280px) to 2 columns on tablet (768-1279px) to a single column on mobile (<768px), re-tiling rather than just shrinking card width. The filter bar becomes a horizontally scrollable single row on narrow screens (with a subtle edge-fade to hint more content) instead of wrapping to multiple rows, which would push the grid down awkwardly.

Accessibility: Filter buttons expose aria-pressed for their active/selected state. Hover-revealed overlay content (title, tags, "View project") must also appear on keyboard focus, not hover-only, so keyboard users get equivalent information — use :focus-within or a focus-visible trigger, not a hover-only CSS transition. Every project cover image needs descriptive alt text (project name + one-line description), not filenames or "image" placeholders.`,
  },
  {
    slug: "changelog-feed",
    title: "Product Changelog Feed",
    description:
      "A vertical timeline-style changelog feed with version tags and release notes.",
    tags: ["changelog", "timeline", "product"],
    category: "Content",
    preview: {
      gradientFrom: "#14532d",
      gradientTo: "#0f172a",
      accentLabel: "Changelog",
      kind: "changelog",
    },
    meta: { creator: "CopyUI Studio", copies: 276 },
    defaultPrimaryColor: "#22c55e",
    promptTemplate: `Product context: A public product changelog page where users scan release history to understand what's new since they last checked in — optimize for fast top-to-bottom scanning of many entries, not deep reading of any one.

Layout: A page header ("Changelog" title + optional "Subscribe to updates" CTA) above a single-column vertical timeline, max-width ~720px, left-aligned. A connector line runs down the left edge; each entry's dot sits on that line at a fixed offset, with the entry content (date, version badge, title, release notes) indented to the right of it. 40-48px vertical spacing between entries so each release reads as a distinct block, not a continuous wall of text.

Visual hierarchy: Entry title is the primary scan target per row (text-lg, font-semibold) — version badge and date sit above or beside it as smaller metadata (text-xs, muted, monospace for the version number). Release-type tags (New/Improved/Fixed) are compact pills, visually secondary to the title but still scannable at a glance via distinct (non-color-only) icon or label per type. The single newest entry is the only one visually emphasized (via its {{primaryColor}} dot and badge) — older entries recede to a neutral/muted treatment so the eye is drawn to what's new first.

Components & states: Page header with title and optional subscribe CTA; per entry — a timeline dot, a date, a version badge (e.g. "v2.4.0", monospace), 1 or more release-type tags per line item (New/Improved/Fixed, each with a distinct icon), a title, and a short bulleted list of release notes (2-5 items). Include a "Load more" button or pagination control at the bottom rather than rendering an unbounded list.

Design language: Dark background, editorial typography — a serif or high-contrast sans for entry titles, a smaller monospace treatment for version numbers reinforces a "release log" feel. Use {{primaryColor}} exclusively for the newest entry's dot, its version badge, and its "New" tags — every other entry's tags/badges use a muted neutral tone so the color accent stays meaningful as a "what's new" signal rather than decoration repeated on every row.

Responsive behavior: Timeline stays single-column at every width (never a mobile-vs-desktop layout change) — only spacing and font size shrink on small screens (reduce left indent, tighten vertical rhythm to 32px between entries) so dates, badges, and tags don't wrap into the connector line. Release-type tags wrap to a second line if needed rather than shrinking to unreadable sizes.

Accessibility: Mark up the sequence of entries as a semantic ordered list (<ol>), one <li> per release. Release-type tags carry a visible text label, not color alone, so type is distinguishable without color vision. The connector line and dots are purely decorative — wrap them in aria-hidden="true" so screen readers announce only the entry content, not the visual timeline scaffolding.`,
  },
  {
    slug: "agency-landing",
    title: "Creative Agency Landing",
    description:
      "A confident agency homepage with a services overview, selected work, and client logos.",
    tags: ["agency", "landing", "marketing"],
    category: "Landing",
    preview: {
      gradientFrom: "#451a03",
      gradientTo: "#1c1917",
      accentLabel: "Agency",
      kind: "agency",
    },
    meta: { creator: "CopyUI Studio", copies: 388 },
    defaultPrimaryColor: "#f97316",
    promptTemplate: `Product context: A creative/digital agency's homepage, meant to win discovery calls by demonstrating taste within the first scroll.

Layout: Sticky nav (logo, 4 links, "Start a project" button) + full-bleed hero (large headline + one-line services summary) + a 3-up services grid + a 2-up featured case-study row (image + result stat) + client logo strip + a closing CTA band.

Visual hierarchy: The hero headline dominates (text-5xl+, tight tracking); each case study's outcome metric (e.g. "+140% signups") is the largest text within its card, bigger than the project title, since results sell more than labels.

Components & states: Nav with active-link underline and hover states; services grid cards (icon, title, one-line description); case-study cards (image, title, metric, "View case study" link) with a hover image-zoom; a logo strip (6-8 grayscale-to-color-on-hover logos); a footer CTA band with a single button.

Design language: Near-black background, warm {{primaryColor}} accent used only on the nav CTA, section eyebrow labels, and case-study metrics — restrained enough to read premium rather than loud. One bold display weight for headlines, one regular weight for body copy.

Responsive behavior: Services grid steps 3→2→1 columns; the case-study row goes 2→1; nav collapses to a hamburger menu below 768px with the CTA button remaining visible outside the drawer.

Accessibility: Logo strip images need descriptive alt text (client name); hover-only image zoom must never hide text needed to understand a case study; all CTAs have specific, descriptive accessible names.`,
  },
  {
    slug: "ai-chat-interface",
    title: "AI Chat Interface",
    description:
      "A conversational AI product UI with chat history, message bubbles, and a composer.",
    tags: ["ai", "chat", "product"],
    category: "AI",
    preview: {
      gradientFrom: "#0c4a6e",
      gradientTo: "#082f49",
      accentLabel: "AI Chat",
      kind: "chat",
    },
    meta: { creator: "CopyUI Studio", copies: 967 },
    defaultPrimaryColor: "#0ea5e9",
    promptTemplate: `Product context: A conversational AI assistant product used daily for extended work sessions — prioritize readability of long message threads, fast access to past conversations, and confidence that a response is (or isn't) still streaming.

Layout: 280px left sidebar (search input + "New chat" button pinned at top, conversation list grouped under "Today" / "Yesterday" / "Previous 7 days" headers below, a compact user account row pinned at the bottom) + a centered main chat column, max-width 760px, with a scrollable message list (24px vertical gap between message groups) and a composer pinned to the bottom of the viewport (auto-growing textarea supporting 1-6 visible lines, send button, model/tool selector as a small dropdown to its left).

Visual hierarchy: The current message thread is the dominant element on the page — sidebar text is smaller (text-sm) and muted (text-white/50) except the active conversation, which gets a filled background and full-opacity text. The sidebar itself is secondary but must not read as bare or unfinished: give it a subtle right border separating it from the chat column, a small icon or avatar next to "New chat," and date-group headers in a smaller, uppercase, letter-spaced style so it has clear internal structure even though it's visually quieter than the chat column. The composer is the third layer — visually elevated (a subtle top border plus a background one step lighter than the page) but never exceeding ~20% of viewport height, so at least 3-4 messages stay visible above it at all times.

Components & states: Sidebar conversation items (title truncated to one line, relative timestamp, active/selected state with a filled pill background, a hover background on inactive items so the list doesn't feel static); a sidebar loading skeleton (3-4 muted placeholder rows) for the initial conversation-list fetch, and a compact empty state ("No conversations yet") if the list is empty. User vs. assistant message bubbles with distinct alignment and styling — assistant messages are left-aligned, no bubble, full-width prose with markdown support (headings, lists, and fenced code blocks in a monospace font). Every fenced code block is a required, non-negotiable component: a header row with the language label on the left and a copy-to-clipboard icon button on the right, always visible (not hover-only), which swaps to a checkmark + "Copied" label for ~2 seconds after use. User messages are right-aligned, max-width 70%, in a {{primaryColor}}-tinted rounded bubble. The composer's send button is disabled while the input is empty and swaps to a stop/cancel icon while a response is streaming; an inline streaming indicator (animated cursor or three-dot pulse) appears at the end of the in-progress assistant message rather than as a separate loading row. A "scroll to latest" pill button appears only when the user has scrolled up during an active stream. When a conversation has no messages yet, replace the message list with a centered empty state: a short greeting headline and a row of 3-4 clickable example-prompt chips that populate the composer when clicked.

Design language: Dark, low-glare background suited for long reading sessions (avoid pure black; use a card-tier surface one step lighter for the composer, and a surface one step lighter still for the sidebar's active-item pill and hover state so the UI reads as layered, not flat). Use {{primaryColor}} only for the user message bubble, the active sidebar item, the send button, the example-prompt chip border/hover, and the copy-button success state — assistant responses and code blocks stay neutral/high-contrast for readability. Generous line-height (1.6+) and a comfortable line length (65-75 characters) on message text; code blocks use a slightly smaller monospace size than surrounding prose.

Responsive behavior: Sidebar collapses to an overlay drawer below 768px, toggled from a slim top bar showing the current conversation title and a menu icon — the drawer overlays the chat column (does not squeeze it) and closes on backdrop tap or conversation selection. Below 480px, reduce message-list side padding to 12px, cap user-bubble max-width at 85% (not 70%) so bubbles don't look artificially narrow on small screens, and collapse the model/tool selector to an icon-only trigger (opening a full-width sheet or dropdown on tap) so it doesn't crowd the composer row next to the send button. The composer stays fixed to the bottom of the viewport at every breakpoint, with its max-width shrinking alongside the chat column rather than going full-bleed on tablet widths, and its internal padding tightening slightly on mobile so the send button remains a comfortable tap target without pushing the textarea too narrow.

Accessibility: New assistant message content is announced via aria-live="polite" in incremental, sentence-sized chunks as it streams — not on every character; the composer's send/stop button has a clear disabled state and an accessible name that changes with its mode ("Send message" / "Stop generating"); conversation list items, example-prompt chips, and code-block copy buttons are keyboard-navigable via Tab with a visible focus-visible outline; code blocks expose their language to screen readers via a visually-hidden label, and the copy button's "Copied" confirmation is also announced via aria-live so the success state isn't visual-only.`,
  },
  {
    slug: "analytics-command-center",
    title: "Analytics Command Center",
    description:
      "A full-bleed, multi-panel analytics view for monitoring several live metrics at once.",
    tags: ["analytics", "dashboard", "saas"],
    category: "Dashboard",
    preview: {
      gradientFrom: "#422006",
      gradientTo: "#171308",
      accentLabel: "Analytics",
      kind: "analytics",
    },
    meta: { creator: "CopyUI Studio", copies: 445 },
    defaultPrimaryColor: "#eab308",
    promptTemplate: `Product context: A full-screen "mission control" analytics view for an ops/monitoring team watching several live metrics simultaneously, often on a large shared display.

Layout: No sidebar — a slim top bar (title, live/paused indicator, time-range selector) above a dense responsive grid (4 columns on desktop) of independent metric panels, each a self-contained mini dashboard (chart + current value + delta).

Visual hierarchy: Every panel's current value is its dominant element (text-2xl+, tabular-nums); panel titles are small and uppercase. An alert-state panel (a value breaching its threshold) is visually distinct via a {{primaryColor}} or warning-colored border, not just a text change, so it's noticeable from across a room.

Components & states: A time-range selector (pill group: 1h/24h/7d/30d); metric panels (title, big value, delta badge, mini chart) with a loading skeleton and a "stale data" state (dimmed, timestamp shown); a live/paused toggle in the top bar.

Design language: Very dark, high-contrast background suited for at-a-glance reading from a distance; consistent panel elevation (one step lighter than the page, subtle border, no drop shadow). Use {{primaryColor}} for the live indicator dot, the active time-range pill, and any panel currently in an alert state.

Responsive behavior: The grid steps from 4 columns to 2 to 1 as the viewport shrinks; this view's primary use case is a large/desktop display, so on small screens it's acceptable for panels to simply stack rather than redesign the density.

Accessibility: The live/paused state change is announced via aria-live="polite"; alert-state panels carry a text label ("Alert") in addition to the color/border treatment; time-range pills expose aria-pressed for their active state.`,
  },
  {
    slug: "ecommerce-product-page",
    title: "E-commerce Product Page",
    description:
      "A conversion-focused product detail page with gallery, pricing, variants, and reviews.",
    tags: ["ecommerce", "product", "shop"],
    category: "Ecommerce",
    preview: {
      gradientFrom: "#4c0519",
      gradientTo: "#18181b",
      accentLabel: "Product",
      kind: "ecommerce",
    },
    meta: { creator: "CopyUI Studio", copies: 703 },
    defaultPrimaryColor: "#f43f5e",
    promptTemplate: `Product context: A single product detail page for an e-commerce store, whose only job is to move a visitor from "browsing" to "add to cart" with full confidence in what they're buying.

Layout: Two-column layout above the fold — left: image gallery (large primary image + thumbnail strip); right: product title, price, variant selectors (size/color), quantity stepper, and a prominent "Add to cart" button. Below the fold: description/specs tabs, then a customer reviews section with a rating summary.

Visual hierarchy: Price is the second-largest element on the page after the product title (text-2xl+, font-semibold); the "Add to cart" button is the single most visually dominant interactive element on the page — no other button competes with it in size or color saturation.

Components & states: Image gallery with thumbnail selection (active state) and a zoom-on-hover or click-to-enlarge interaction; variant selector chips/swatches with selected/out-of-stock states; a quantity stepper; a primary "Add to cart" button with an added-to-cart confirmation state; a star-rating summary and a paginated reviews list.

Design language: Dark background with the product image given a neutral/light card backdrop so product colors read accurately. Use {{primaryColor}} for the "Add to cart" button, the selected variant swatch, and the star-rating fill — never on the product image backdrop itself.

Responsive behavior: Below 900px the two-column layout stacks (gallery, then title/price/variants/CTA, then description and reviews) — keep the gallery a reasonable height so the CTA is still reachable within one scroll on mobile.

Accessibility: Variant swatches (color/size) need text alternatives via aria-label, not color alone; out-of-stock variants are marked aria-disabled and visually distinct beyond opacity alone; the gallery's thumbnails are keyboard-operable and the enlarged view is dismissible via Escape.`,
  },
  {
    slug: "finance-dashboard",
    title: "Personal Finance Dashboard",
    description:
      "A calm, trustworthy dashboard for tracking balances, spending, and budgets.",
    tags: ["finance", "dashboard", "fintech"],
    category: "Finance",
    preview: {
      gradientFrom: "#042f2e",
      gradientTo: "#0c0c0e",
      accentLabel: "Finance",
      kind: "finance",
    },
    meta: { creator: "CopyUI Studio", copies: 512 },
    defaultPrimaryColor: "#0d9488",
    promptTemplate: `Product context: A personal finance / fintech dashboard where a user checks account balances, recent transactions, and budget progress — trust and clarity matter more than visual excitement; never let the design feel "salesy."

Layout: Left sidebar (accounts list) + main content: a large total-balance card at top, a spending-by-category chart beside a budget-progress panel, and a recent-transactions list below.

Visual hierarchy: Total balance is the single largest number on the page (text-4xl+, tabular-nums); individual transaction amounts are smaller and right-aligned in their rows; budget progress bars are the most colorful element after the balance, using {{primaryColor}} to fill only the "on track" state.

Components & states: Account list items (name, balance, selected state); a total balance card (amount, period-over-period delta); a category spending chart (donut or bar) with a legend; budget progress bars per category (on-track / near-limit / over-limit states, each with a distinct treatment, not color alone); a transaction list with merchant, category tag, date, and signed amount.

Design language: Calm, high-trust dark palette — avoid saturated or "gamified" colors. Use {{primaryColor}} sparingly for on-track budget bars, the active account in the sidebar, and primary buttons only. Tabular numerals throughout for scanability of amounts.

Responsive behavior: Sidebar collapses to a drawer below 768px; the chart and budget panel stack vertically below 900px; transaction rows keep their amount right-aligned at every width rather than wrapping awkwardly.

Accessibility: Over-limit budget states must include a text label ("Over budget"), not rely on red color alone; monetary values use consistent, unambiguous formatting; the account list is keyboard-navigable with a visible focus state distinct from the selected state.`,
  },
  {
    slug: "kanban-project-board",
    title: "Kanban Project Board",
    description:
      "A drag-and-drop style project board with columns, task cards, and assignee avatars.",
    tags: ["kanban", "project management", "saas"],
    category: "SaaS",
    preview: {
      gradientFrom: "#1e3a8a",
      gradientTo: "#0c0c0e",
      accentLabel: "Board",
      kind: "kanban",
    },
    meta: { creator: "CopyUI Studio", copies: 588 },
    defaultPrimaryColor: "#3b82f6",
    promptTemplate: `Product context: A project management board (Kanban-style) used by a small team to track task status day to day; optimize for quick scanning of what's in progress and who owns it.

Layout: A top bar (board title, filter/sort controls, "Add task" button) above a horizontally-scrollable row of columns (e.g. Backlog, In Progress, In Review, Done), each column a fixed width with its own header (name + task count) and a vertically stacked list of task cards.

Visual hierarchy: Task card titles are the primary scan target (text-sm, font-medium); assignee avatar and due-date/priority indicators are secondary, positioned consistently in the same corner of every card so the eye can scan a whole column for overdue items at a glance.

Components & states: Column header (name, count badge, "+" add button); task cards (title, tag/label chips, assignee avatar, due date, priority indicator) with default/hover/dragging states (dragging: slight lift + rotation + reduced opacity of the original slot); an empty-column state ("No tasks yet"); a priority indicator using both color and shape/icon, not color alone.

Design language: Dark background with each column as a subtly distinct surface from the page background. Use {{primaryColor}} for the "Add task" button, the active/selected task card's border, and one specific priority level (e.g. "Urgent") only — not every tag chip, or the color loses meaning.

Responsive behavior: Columns scroll horizontally as a single row at every screen size (expected for this pattern) rather than stacking vertically; on mobile, reduce column width and card padding rather than changing the horizontal-scroll layout.

Accessibility: Provide a keyboard-operable alternative to drag-and-drop (e.g. a "Move to..." menu on each card), since native drag-and-drop is difficult for keyboard/screen-reader users. Priority indicators carry a text label. Column task counts are announced via aria-live="polite" when a task moves.`,
  },
  {
    slug: "docs-knowledge-base",
    title: "Docs Knowledge Base",
    description:
      "A searchable documentation site with a nav tree, article content, and a table of contents.",
    tags: ["docs", "content", "developer"],
    category: "Docs",
    preview: {
      gradientFrom: "#134e4a",
      gradientTo: "#0c0c0e",
      accentLabel: "Docs",
      kind: "docs",
    },
    meta: { creator: "CopyUI Studio", copies: 421 },
    defaultPrimaryColor: "#14b8a6",
    promptTemplate: `Product context: A product documentation / knowledge-base site used by developers integrating an API or product — the primary task is finding the right page fast and reading a technical article without losing your place.

Layout: Three-column layout on desktop — left: collapsible nav tree grouped by section; center: article content (max-width ~720px for readability) with headings, code blocks, and inline callouts; right: an auto-generated "On this page" table of contents that highlights the currently-scrolled section.

Visual hierarchy: Article headings establish a clear scale (h1 > h2 > h3, each visually distinct); code blocks are visually set apart from prose (monospace font, distinct background, copy button) so a scanning reader immediately distinguishes "read this" from "copy this."

Components & states: A search input (with a keyboard-shortcut hint, e.g. "⌘K") at the top of the nav tree; nav tree items with an active/current-page state; code blocks with a language label and copy button (with a copied confirmation state); callout boxes (info/warning/tip, each with a distinct icon and accent, not color alone); the right-side TOC with an active-section highlight.

Design language: Dark background optimized for long reading sessions — restrained color, generous line-height (1.7+) on prose. Use {{primaryColor}} for the active nav-tree item, the active TOC entry, inline links, and the code-block copy button's success state only.

Responsive behavior: Below 1280px the right-side TOC collapses into a disclosure at the top of the article; below 768px the left nav tree becomes a slide-in drawer, and the article's max-width becomes fluid with side padding.

Accessibility: Heading hierarchy must be semantically correct (no skipped levels), since it's how screen reader users navigate docs; the copy button announces its success state via aria-live; the nav tree's expand/collapse controls are real buttons with aria-expanded, not divs with click handlers.`,
  },
  {
    slug: "mobile-app-landing",
    title: "Mobile App Landing Page",
    description:
      "A landing page for a mobile app with a phone mockup, feature highlights, and store badges.",
    tags: ["mobile", "landing", "app"],
    category: "Mobile",
    preview: {
      gradientFrom: "#4a044e",
      gradientTo: "#0c0c0e",
      accentLabel: "App",
      kind: "mobile",
    },
    meta: { creator: "CopyUI Studio", copies: 654 },
    defaultPrimaryColor: "#d946ef",
    promptTemplate: `Product context: A marketing landing page for a mobile app (iOS/Android), whose job is to communicate the app's core value and drive store downloads.

Layout: A centered hero with headline + subtext on one side and a large phone-frame mockup showing the app's main screen on the other (two-column on desktop, stacked on mobile with the phone mockup first); app store badges (App Store / Google Play) directly beneath the headline; a horizontal feature-highlight row below the hero.

Visual hierarchy: The phone mockup is the single most visually arresting element on the page (largest, most detailed) since it's effectively the product screenshot; the headline is next in weight; app-store badges are small and consistently sized so neither store is implied as preferred.

Components & states: A phone-frame mockup (device outline + a simplified app-screen illustration inside it, not a real screenshot); headline + subtext; two app-store badge buttons (equal visual weight); a row of 3-4 feature highlights (icon, short title, one-line description); a decorative background glow behind the phone mockup.

Design language: Dark, vibrant — the phone mockup's screen content can use {{primaryColor}} generously (it's a product-screenshot stand-in), while the surrounding page uses {{primaryColor}} sparingly (store-badge hover state, one headline accent word, feature-icon accents).

Responsive behavior: The two-column hero (text | phone) stacks to a single column below 900px, with the phone mockup first since it's the strongest visual hook; the feature-highlight row goes from 4 columns to 2 to 1.

Accessibility: The phone mockup's illustrative screen content is decorative relative to page meaning and should be aria-hidden if it duplicates information already in the headline/features; app-store badges use their official accessible names ("Download on the App Store," "Get it on Google Play"), not generic "Download" text.`,
  },
  {
    slug: "real-estate-listing",
    title: "Real Estate Listing Page",
    description:
      "A property listing detail page with a photo gallery, key facts, and an inquiry form.",
    tags: ["real estate", "listing", "property"],
    category: "Real Estate",
    preview: {
      gradientFrom: "#083344",
      gradientTo: "#0c0c0e",
      accentLabel: "Listing",
      kind: "realestate",
    },
    meta: { creator: "CopyUI Studio", copies: 334 },
    defaultPrimaryColor: "#0891b2",
    promptTemplate: `Product context: A single property listing page for a real estate site — a prospective buyer/renter needs the key facts (price, beds/baths, address) immediately and an easy way to request a showing.

Layout: A full-width photo gallery at the top (large hero image + thumbnail strip), below it a two-column layout — left: price, address, a key-facts grid (beds/baths/sqft), description, amenities list; right: a sticky "Request a tour" contact card (agent info + inquiry form).

Visual hierarchy: Price is the largest text element on the page (text-3xl+, font-bold); address is secondary but still prominent (text-lg); the key-facts grid uses equally-weighted icons + numbers so no single fact dominates over the others.

Components & states: A photo gallery with thumbnail navigation and a full-screen lightbox view; a key-facts grid (icon + value + label per fact); an amenities list (checkmark rows); a sticky contact/inquiry card (agent photo + name, phone/email, a short form: name/email/phone/message, submit button) that stays visible while scrolling listing details on desktop.

Design language: Photography-forward — dark surrounding UI so listing photos have maximum visual weight. Use {{primaryColor}} for the price, the "Request a tour" button, and the active gallery thumbnail — never tinting the property photos themselves.

Responsive behavior: The two-column layout stacks below 900px with the contact/inquiry card moving to appear directly after the key facts, not at the very bottom, so it stays easy to find; the sticky behavior only applies on desktop.

Accessibility: Gallery thumbnails and the lightbox are keyboard-operable (arrow keys to navigate, Escape to close); every listing photo needs descriptive alt text (e.g. "Kitchen with island seating"), not "photo 1"; the inquiry form's fields have visible labels and clear required-field indicators.`,
  },
  {
    slug: "restaurant-menu-page",
    title: "Restaurant Menu Page",
    description:
      "An elegant digital menu page with sectioned dishes, prices, and dietary tags.",
    tags: ["restaurant", "menu", "content"],
    category: "Content",
    preview: {
      gradientFrom: "#451a03",
      gradientTo: "#0c0c0e",
      accentLabel: "Menu",
      kind: "menu",
    },
    meta: { creator: "CopyUI Studio", copies: 241 },
    defaultPrimaryColor: "#ca8a04",
    promptTemplate: `Product context: A restaurant's digital menu page, viewed mostly on mobile by a diner deciding what to order — prioritize fast scanning of dish names, prices, and dietary info over marketing copy.

Layout: A short header (restaurant name/logo, a category jump-nav) above a single-column list of menu sections (e.g. Starters, Mains, Desserts, Drinks), each section a heading followed by dish rows (name, short description, price, dietary tag icons).

Visual hierarchy: Dish name and price are the two dominant elements per row, positioned at opposite ends of the same line so a scanning eye can pair name-to-price instantly; descriptions are smaller and muted; dietary tags (vegetarian/vegan/gluten-free/spicy) are the smallest elements, using icons with text alternatives.

Components & states: A sticky category jump-nav (tab-like, active-section highlight as the user scrolls); menu section headings; dish rows (name, description, price, dietary icon row); an optional "Chef's pick" or "Popular" badge on select dishes.

Design language: Warm, editorial, restrained — a serif or high-contrast display font for the restaurant name and section headings reinforces a hospitality feel. Use {{primaryColor}} only for the active category-nav tab, "Chef's pick" badges, and section-heading accents — never as a background wash across the whole page.

Responsive behavior: A single-column layout is correct at every width for this content type; on desktop, increase side margins and optionally show two menu sections side by side rather than changing the row layout itself.

Accessibility: Dietary tag icons must have text alternatives (aria-label or visually-hidden text), not rely on icon shape/color alone; the category jump-nav's active state is exposed via aria-current="true" for the currently-viewed section.`,
  },
  {
    slug: "event-conference-page",
    title: "Event & Conference Page",
    description:
      "A conference landing page with a countdown, schedule, and speaker lineup.",
    tags: ["event", "conference", "landing"],
    category: "Landing",
    preview: {
      gradientFrom: "#431407",
      gradientTo: "#0c0c0e",
      accentLabel: "Event",
      kind: "event",
    },
    meta: { creator: "CopyUI Studio", copies: 298 },
    defaultPrimaryColor: "#ea580c",
    promptTemplate: `Product context: A landing page for a conference/event, meant to drive ticket registrations by communicating date, lineup, and schedule credibility at a glance.

Layout: A hero with event name, date/location, and a "Get tickets" CTA plus a live countdown timer; below it, a speaker lineup grid (photo, name, title); below that, a day-by-day schedule (tabs per day, session list with time/title/speaker); a ticket-tiers section near the bottom.

Visual hierarchy: The countdown timer and "Get tickets" CTA are the two most visually dominant elements in the hero; speaker photos dominate the lineup section over their name/title text; schedule session times align in a consistent column so the eye can scan "what's at 2pm" across days.

Components & states: A countdown timer (days/hours/minutes, updating); a primary CTA button; speaker cards (photo, name, title/company); a day-tab schedule switcher (active-day state) with session rows (time, title, speaker, track/room tag); ticket-tier cards (name, price, perks, CTA).

Design language: Bold, high-energy but still premium-dark. Use {{primaryColor}} for the countdown numbers, the primary "Get tickets" CTA, the active day-tab, and one highlighted ticket tier — keep speaker photos and schedule text neutral so the color reads as "action," not decoration.

Responsive behavior: The speaker grid steps 4→3→2→1 columns; the day-tab schedule switcher becomes a horizontally scrollable single row on mobile instead of wrapping; countdown timer digits shrink but never wrap onto multiple lines.

Accessibility: The live-updating countdown should not aggressively interrupt screen readers — use a static accessible label (e.g. "Event starts in 3 days") updated at a reasonable interval rather than announcing every second; the day-tab switcher exposes aria-selected on the active tab; every speaker photo has descriptive alt text (name + title).`,
  },
  {
    slug: "creator-link-in-bio",
    title: "Creator Link-in-Bio Page",
    description:
      "A minimal, mobile-first link hub for a creator's social profiles and content.",
    tags: ["creator", "links", "content"],
    category: "Content",
    preview: {
      gradientFrom: "#3b0764",
      gradientTo: "#0c0c0e",
      accentLabel: "Links",
      kind: "linkbio",
    },
    meta: { creator: "CopyUI Studio", copies: 812 },
    defaultPrimaryColor: "#c026d3",
    promptTemplate: `Product context: A single "link in bio" page for a content creator, linked from their social media profiles — visitors arrive with high intent to find a specific piece of content or link within seconds, on a phone.

Layout: A mobile-first single centered column (works identically on desktop, just centered with side margins): profile photo/avatar, name and short bio at top, followed by a vertically stacked list of full-width link buttons, with a row of small social-icon links at the very bottom.

Visual hierarchy: The avatar and name are the visual anchor at the top; every link button is equal in size and weight except for one optional "featured" link (e.g. "New video out now") which is visually elevated with a {{primaryColor}} fill or border so it stands out from the otherwise neutral list.

Components & states: A circular avatar image placeholder, name + short bio text; a vertical stack of link buttons (icon/thumbnail + label, default and pressed/hover states) with one optional featured/highlighted variant; a row of small social-platform icon links at the bottom; an optional profile view counter or verified badge.

Design language: Minimal, mobile-native — generous tap targets (48px+ height per link button), calm dark background so the avatar and any link thumbnails are the only strong visual focus. Use {{primaryColor}} only for the featured link and any active/pressed button state.

Responsive behavior: The column stays centered with a fixed comfortable max-width (~420px) at every viewport, including desktop — this page type intentionally does not "use" extra desktop width, since a phone-shaped column reinforces the mobile-native context it's meant for.

Accessibility: Every link button has a descriptive accessible name (the destination, not just "Link"); social-icon links at the bottom include visually-hidden text naming the platform; tap targets meet the 44x44px minimum touch-target guideline.`,
  },
];

export function getPromptBySlug(slug: string): PromptTheme | undefined {
  return prompts.find((p) => p.slug === slug);
}

/** Prompt data safe to ship to the client — excludes the hidden template. */
export type PublicPromptTheme = Omit<PromptTheme, "promptTemplate">;

export function getPublicPrompts(): PublicPromptTheme[] {
  return prompts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    category: p.category,
    preview: p.preview,
    meta: p.meta,
    defaultPrimaryColor: p.defaultPrimaryColor,
  }));
}

export function buildPrompt(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    variables[key] ?? "",
  );
}
