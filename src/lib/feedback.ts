/**
 * Static GitHub Issues links for user feedback — no backend, no forms.
 * Prefills title/body/labels via the documented `/issues/new` query params.
 * NOTE: labels only apply if they already exist in the repo; GitHub
 * silently drops unknown ones rather than failing the link.
 */
export const REPO_URL = "https://github.com/Bannawat01/CopyUI";

function issueUrl({
  title,
  body,
  labels,
}: {
  title: string;
  body: string;
  labels: string;
}): string {
  const params = new URLSearchParams({ title, body, labels });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

export type FeedbackLink = {
  label: string;
  href: string;
  description: string;
};

export const FEEDBACK_LINKS: FeedbackLink[] = [
  {
    label: "Request a prompt",
    description: "Suggest a UI theme you'd like added to the gallery.",
    href: issueUrl({
      title: "[Prompt request] ",
      labels: "enhancement",
      body: [
        "**What UI theme would you like?**",
        "",
        "",
        "**What would you build with it?**",
        "",
        "",
        "**Which tool would you use it in?** (v0.dev / Cursor / GenVibe)",
        "",
      ].join("\n"),
    }),
  },
  {
    label: "Report bad output",
    description: "A copied prompt produced poor results in your AI tool.",
    href: issueUrl({
      title: "[Bad output] ",
      labels: "bug",
      body: [
        "**Which prompt?** (theme name or URL)",
        "",
        "",
        "**Which tool mode?** (v0.dev / Cursor / GenVibe)",
        "",
        "",
        "**What went wrong in the generated output?**",
        "",
        "",
        "**What looked good?**",
        "",
      ].join("\n"),
    }),
  },
  {
    label: "Suggest improvement",
    description: "Ideas for the site, a prompt, or the copy experience.",
    href: issueUrl({
      title: "[Improvement] ",
      labels: "enhancement",
      body: [
        "**What could be better?**",
        "",
        "",
        "**Why does it matter?**",
        "",
      ].join("\n"),
    }),
  },
];
