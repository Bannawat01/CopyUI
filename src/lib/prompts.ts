export type PromptTheme = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  preview: {
    gradientFrom: string;
    gradientTo: string;
    accentLabel: string;
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
    },
    defaultPrimaryColor: "#6366f1",
    promptTemplate:
      "Design a SaaS analytics dashboard with a collapsible sidebar, top navbar, and a responsive grid of KPI cards. Use {{primaryColor}} as the primary accent color for active nav items, buttons, and chart highlights. Include a line chart, a bar chart, and a recent activity table. Style should be modern, clean, and dark-mode friendly.",
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
    },
    defaultPrimaryColor: "#8b5cf6",
    promptTemplate:
      "Create a startup landing page hero section with a bold headline, supporting subtext, a primary call-to-action button, and a row of logos for social proof. Use {{primaryColor}} for the CTA button and key highlighted text. Add subtle background gradient and grid pattern. Fully responsive.",
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
    },
    defaultPrimaryColor: "#06b6d4",
    promptTemplate:
      "Build a three-tier pricing table (Starter, Pro, Enterprise) with the Pro plan visually highlighted using {{primaryColor}} as the accent border and badge color. Each tier should list features with checkmarks, a price, and a call-to-action button. Responsive layout that stacks on mobile.",
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
    },
    defaultPrimaryColor: "#f59e0b",
    promptTemplate:
      "Design a centered authentication card with email/password fields, a {{primaryColor}} primary submit button, divider, and social login buttons (Google, GitHub). Include subtle input focus states using {{primaryColor}} and inline validation messages. Minimal, centered, dark background.",
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
    },
    defaultPrimaryColor: "#ec4899",
    promptTemplate:
      "Create a masonry-style portfolio grid of project cards with image thumbnails. On hover, reveal the project title and tags with an overlay in {{primaryColor}} at low opacity. Include a filter bar above the grid for project categories. Fully responsive with smooth hover transitions.",
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
    },
    defaultPrimaryColor: "#22c55e",
    promptTemplate:
      "Build a vertical timeline changelog feed. Each entry has a date, a version badge colored with {{primaryColor}}, a title, and release notes in a bulleted list. Add a connecting vertical line between entries. Dark theme, clean typography, responsive single-column layout.",
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
