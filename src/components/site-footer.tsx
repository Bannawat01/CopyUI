"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { FEEDBACK_LINKS, REPO_URL } from "@/lib/feedback";
import { toolModeList } from "@/lib/tool-modes";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-sm font-medium text-white/90">
            {t("footer.heading")}
          </h2>
          <p className="text-xs text-white/55">{t("footer.blurb")}</p>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FEEDBACK_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 outline-none transition-colors hover:border-white/20 hover:bg-white/[0.06] focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                  {link.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-white/30 transition-colors group-hover:text-white/60"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xs leading-relaxed text-white/55">
                  {link.description}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-white/5 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.tagline", { tools: toolModeList() })}</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-md outline-none transition-colors hover:text-white/70 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("footer.source")}
          </a>
        </div>
      </div>
    </footer>
  );
}
