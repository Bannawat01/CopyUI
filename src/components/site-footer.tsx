"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { FEEDBACK_LINKS, REPO_URL, getFeedbackHref } from "@/lib/feedback";
import { toolModeList } from "@/lib/tool-modes";
import type { TranslationKey } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-sm font-medium text-foreground">
            {t("footer.heading")}
          </h2>
          <p className="text-xs text-muted-foreground">{t("footer.blurb")}</p>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FEEDBACK_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={getFeedbackHref(link.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-1 rounded-xl border border-border bg-fill-subtle p-4 outline-none transition-colors hover:border-foreground/20 hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                  {t(`feedback.${link.id}.label` as TranslationKey)}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {t(`feedback.${link.id}.description` as TranslationKey)}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.tagline", { tools: toolModeList() })}</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-md outline-none transition-colors hover:text-foreground/70 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("footer.source")}
          </a>
        </div>
      </div>
    </footer>
  );
}
