"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import {
  FEEDBACK_LINKS,
  getFeedbackHref,
  type FeedbackLinkId,
} from "@/lib/feedback";
import { toolModeList } from "@/lib/tool-modes";
import { SITE_URL } from "@/lib/site";
import type { TranslationKey } from "@/lib/i18n";

function ShareCopy() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  // A share message with no link doesn't actually drive anyone anywhere —
  // NEXT_PUBLIC_SITE_URL is inlined at build time, so this is the real
  // deployed domain in production and localhost only in local dev.
  const shareText = t("growth.shareText", {
    tools: toolModeList(),
    url: SITE_URL,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail (permissions, insecure context); the text is
      // still fully selectable in the block below, so nothing is lost.
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("growth.shareHeading")}
      </h3>
      <div className="flex flex-col items-start gap-2 rounded-lg border border-border bg-fill-subtle p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="select-all text-xs leading-relaxed text-foreground/90">
          {shareText}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-md border border-border bg-fill-hover px-2.5 py-1.5 text-xs font-medium text-foreground/90 outline-none transition-colors hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50 sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {t("growth.shareCopied")}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              {t("growth.shareCopy")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Compact homepage "help us improve / share" section. Deliberately lighter
 * than the footer's feedback card grid (same links, same data source — just
 * an inline pill row here) so the two don't read as duplicate UI.
 */
export function GrowthSection() {
  const { t } = useLocale();

  return (
    <section
      aria-label={t("growth.heading")}
      className="mt-10 w-full border-t border-border pt-8 sm:mt-12 sm:pt-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-sm font-medium text-foreground">
          {t("growth.heading")}
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {t("growth.subhead")}
        </p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {FEEDBACK_LINKS.map((link: { id: FeedbackLinkId }) => (
          <li key={link.id}>
            <a
              href={getFeedbackHref(link.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-fill-subtle px-3 py-1.5 text-xs font-medium text-foreground/90 outline-none transition-colors hover:border-foreground/20 hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t(`feedback.${link.id}.label` as TranslationKey)}
              <ArrowUpRight
                className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 max-w-xl">
        <ShareCopy />
      </div>
    </section>
  );
}
