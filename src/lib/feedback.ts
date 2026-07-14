/**
 * Static GitHub Issues links for user feedback — no backend, no forms.
 * Prefills title/body/labels via the documented `/issues/new` query params.
 * NOTE: labels only apply if they already exist in the repo; GitHub
 * silently drops unknown ones rather than failing the link.
 *
 * Display text (label/description) lives in `src/lib/i18n.ts` under the
 * `feedback.<id>.*` keys, not here — this file only builds URLs, which stay
 * English regardless of site locale (a GitHub issue body is read by
 * maintainers, not by the visitor). Consumers look up copy by `id`.
 */
import { TOOL_MODE_LABELS } from "@/lib/tool-modes";

export const REPO_URL = "https://github.com/Bannawat01/CopyUI";

/**
 * Optional external feedback form (Google Form, Tally, Typeform, a custom
 * page — whatever gets set up later). Not configured yet, and no placeholder
 * URL is hardcoded here on purpose: a fake link is worse than none. Set
 * NEXT_PUBLIC_FEEDBACK_URL in the deployment environment to point the
 * general "Give feedback" action at a real form; every action falls back to
 * GitHub Issues until then, which works with zero setup and no backend.
 *
 * Only the general action redirects here — "Request a prompt" and "Report
 * confusing output" keep their structured GitHub issue templates even if
 * this is set, since a generic external form wouldn't carry the same
 * prefilled fields.
 */
export const EXTERNAL_FEEDBACK_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_URL || null;

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

export type FeedbackLinkId = "giveFeedback" | "requestPrompt" | "reportOutput";

export type FeedbackLink = {
  id: FeedbackLinkId;
  href: string;
};

export const FEEDBACK_LINKS: FeedbackLink[] = [
  {
    id: "requestPrompt",
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
        `**Which tool would you use it in?** (${TOOL_MODE_LABELS.join(" / ")})`,
        "",
      ].join("\n"),
    }),
  },
  {
    id: "reportOutput",
    href: issueUrl({
      title: "[Confusing output] ",
      labels: "bug",
      body: [
        "**Which prompt?** (theme name or URL)",
        "",
        "",
        `**Which tool mode?** (${TOOL_MODE_LABELS.join(" / ")})`,
        "",
        "",
        "**What was confusing or wrong about the output?**",
        "",
        "",
        "**What looked good?**",
        "",
      ].join("\n"),
    }),
  },
  {
    id: "giveFeedback",
    href: issueUrl({
      title: "[Feedback] ",
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

/**
 * The href for a feedback action. "giveFeedback" prefers the external form
 * if one is configured; the other two always keep their GitHub template.
 */
export function getFeedbackHref(id: FeedbackLinkId): string {
  if (id === "giveFeedback" && EXTERNAL_FEEDBACK_URL) {
    return EXTERNAL_FEEDBACK_URL;
  }
  return FEEDBACK_LINKS.find((link) => link.id === id)!.href;
}
