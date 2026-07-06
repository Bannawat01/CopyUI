export type PreviewKind =
  | "dashboard"
  | "hero"
  | "pricing"
  | "auth"
  | "portfolio"
  | "changelog";

export type PromptTheme = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  preview: {
    gradientFrom: string;
    gradientTo: string;
    accentLabel: string;
    kind: PreviewKind;
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
    preview: {
      gradientFrom: "#1e293b",
      gradientTo: "#0f172a",
      accentLabel: "Dashboard",
      kind: "dashboard",
    },
    defaultPrimaryColor: "#6366f1",
    promptTemplate: `Product context: A B2B SaaS analytics dashboard where operations teams monitor product usage and revenue metrics throughout the day.

Layout: Collapsible left sidebar (icon-only when collapsed) for primary navigation, a sticky top navbar with search and account menu, and a scrollable main content area using a 12-column responsive grid.

Components: A row of 4 KPI summary cards (metric, value, trend %), a large line chart (usage over time) and a bar chart (revenue by segment) side by side, and a paginated recent-activity table below. Use skeleton loading states for async data.

Visual style: Modern, clean, dark-mode-first. Use {{primaryColor}} for active nav items, primary buttons, chart line/bar highlights, and focus rings. Generous whitespace and subtle 1px borders instead of heavy shadows.

Responsive behavior: Sidebar collapses to a bottom nav or hamburger drawer below 768px; KPI cards stack 2x2 on tablet and 1-column on mobile; charts stack vertically and scroll horizontally if needed.

Accessibility: Ensure sufficient contrast for {{primaryColor}} against the dark background, add aria-labels to icon-only nav items, keyboard-navigable table rows, and visible focus-visible outlines on all interactive elements.`,
  },
  {
    slug: "landing-hero",
    title: "Startup Landing Hero",
    description:
      "A bold hero section for a startup landing page with headline, CTA, and social proof.",
    tags: ["landing", "marketing", "hero"],
    preview: {
      gradientFrom: "#312e81",
      gradientTo: "#111827",
      accentLabel: "Landing",
      kind: "hero",
    },
    defaultPrimaryColor: "#8b5cf6",
    promptTemplate: `Product context: The above-the-fold hero section of a startup's marketing landing page, meant to convert first-time visitors within seconds.

Layout: Centered, single-column hero with a small eyebrow label, a large bold headline (2 lines max), a supporting subtext paragraph, a primary CTA button with a secondary ghost link beside it, and a row of partner/customer logos beneath for social proof.

Components: Eyebrow badge, headline, subtext, primary + secondary buttons, logo strip (5-6 grayscale logos), and a subtle decorative background (gradient blob or grid pattern) behind the content.

Visual style: Bold, modern, dark background. Use {{primaryColor}} for the primary CTA button, the eyebrow badge accent, and key highlighted words in the headline. Keep typography confident with tight tracking on the headline.

Responsive behavior: Headline font size scales down on mobile (text-4xl to text-6xl range), buttons stack full-width on small screens, and the logo strip wraps or scrolls horizontally on narrow viewports.

Accessibility: Maintain WCAG AA contrast for {{primaryColor}} text/buttons on the dark background, give the CTA a descriptive accessible name (not just "Click here"), and mark decorative background elements aria-hidden.`,
  },
  {
    slug: "pricing-table",
    title: "Modern Pricing Table",
    description:
      "A three-tier pricing table with a highlighted recommended plan and feature comparison.",
    tags: ["pricing", "saas", "conversion"],
    preview: {
      gradientFrom: "#164e63",
      gradientTo: "#0f172a",
      accentLabel: "Pricing",
      kind: "pricing",
    },
    defaultPrimaryColor: "#06b6d4",
    promptTemplate: `Product context: A SaaS pricing page section that helps prospective customers compare three subscription tiers and pick a plan with confidence.

Layout: Three-column card layout (Starter, Pro, Enterprise) on a shared baseline, with the Pro column slightly elevated/scaled and visually recommended. Each card has a plan name, price with billing-period toggle (monthly/yearly), a feature checklist, and a CTA button.

Components: Billing-period toggle switch above the cards, per-card "Most Popular" badge on Pro, checkmark/x-mark feature list rows, and a footer note about a money-back guarantee or free trial.

Visual style: Clean, modern, dark background with card surfaces slightly lighter than the page background. Use {{primaryColor}} for the Pro card's border/glow, its badge, and all primary CTA buttons across tiers.

Responsive behavior: Columns stack vertically on mobile with the Pro plan reordered to appear first; the billing toggle remains reachable above the stack; feature lists remain fully readable without horizontal scrolling.

Accessibility: Toggle switch must be operable via keyboard with a clear pressed state, feature checkmarks/x-marks need text alternatives (not color-only), and {{primaryColor}} accents must meet contrast requirements against card backgrounds.`,
  },
  {
    slug: "auth-form",
    title: "Minimal Auth Form",
    description:
      "A centered login/signup card with social auth buttons and form validation states.",
    tags: ["auth", "form", "minimal"],
    preview: {
      gradientFrom: "#3f3f46",
      gradientTo: "#18181b",
      accentLabel: "Auth",
      kind: "auth",
    },
    defaultPrimaryColor: "#f59e0b",
    promptTemplate: `Product context: A minimal, distraction-free login/signup screen for a product's authentication flow, optimized for quick completion.

Layout: A single centered card (max-width ~400px) on a plain dark background, containing a logo/title at the top, email and password fields, a primary submit button, a divider labeled "or", and social auth buttons (Google, GitHub) below. Include a small link to toggle between login and signup.

Components: Labeled input fields with inline validation messages, a show/hide password toggle, primary submit button, divider with "or" text, social auth buttons with provider icons, and a "forgot password?" link.

Visual style: Minimal, centered, dark background with a subtly elevated card surface. Use {{primaryColor}} for the primary submit button, input focus rings, and links/hover states.

Responsive behavior: Card takes full width with side padding on mobile (no fixed max-width below 480px), inputs and buttons remain full-width at all sizes, and the social auth buttons stack vertically on very narrow screens.

Accessibility: Every input has a visible, associated label (not placeholder-only), validation errors are announced via aria-live and linked to their field with aria-describedby, and the show/hide password toggle has an accessible name that updates with state.`,
  },
  {
    slug: "portfolio-grid",
    title: "Creative Portfolio Grid",
    description:
      "A masonry-style project grid for a designer or developer portfolio with hover reveals.",
    tags: ["portfolio", "grid", "creative"],
    preview: {
      gradientFrom: "#701a75",
      gradientTo: "#1e1b4b",
      accentLabel: "Portfolio",
      kind: "portfolio",
    },
    defaultPrimaryColor: "#ec4899",
    promptTemplate: `Product context: A creative portfolio page for a designer or developer showcasing past projects to potential clients or employers.

Layout: A masonry-style grid of project cards with varying image aspect ratios, plus a horizontal filter bar above the grid for filtering by project category/tag.

Components: Filter/category pill buttons (with an active state), project cards with a cover image, and a hover overlay revealing the project title, short tags, and a "View project" affordance.

Visual style: Bold, creative, dark background so project imagery pops. Use {{primaryColor}} for the active filter pill, the hover overlay tint, and "View project" link accents.

Responsive behavior: Grid uses CSS columns or a masonry layout that reflows from 3-4 columns on desktop to 2 on tablet and 1 on mobile; the filter bar becomes horizontally scrollable on narrow screens instead of wrapping awkwardly.

Accessibility: Filter buttons need aria-pressed for their active state, hover reveal content must also appear on keyboard focus (not hover-only), and each project card's image needs descriptive alt text.`,
  },
  {
    slug: "changelog-feed",
    title: "Product Changelog Feed",
    description:
      "A vertical timeline-style changelog feed with version tags and release notes.",
    tags: ["changelog", "timeline", "product"],
    preview: {
      gradientFrom: "#14532d",
      gradientTo: "#0f172a",
      accentLabel: "Changelog",
      kind: "changelog",
    },
    defaultPrimaryColor: "#22c55e",
    promptTemplate: `Product context: A public product changelog page where users track new features, improvements, and fixes release by release.

Layout: A single-column vertical timeline with a connecting line running down the left side; each entry sits beside a dot on the line and contains a date, version badge, title, and a bulleted list of release notes.

Components: Version badge (e.g. "v2.4.0"), release-type tags (New / Improved / Fixed), timeline connector line and dots, and an optional "subscribe to updates" call-to-action at the top of the feed.

Visual style: Clean, dark theme, editorial typography. Use {{primaryColor}} for the newest entry's timeline dot, version badge, and release-type tag accents.

Responsive behavior: Timeline remains single-column at all widths; on mobile, reduce left padding and font size slightly so dates and badges don't wrap awkwardly against the connector line.

Accessibility: The timeline should use an ordered list (<ol>) semantically, release-type tags need text labels (not color-only), and the connector line/dots are purely decorative and should be aria-hidden.`,
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
    preview: p.preview,
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
