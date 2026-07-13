"use client";

import { LayoutTemplate, Palette, ClipboardCopy } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { toolModeList, toolModeShortList } from "@/lib/tool-modes";
import type { TranslationKey } from "@/lib/i18n";

const STEPS: {
  icon: typeof LayoutTemplate;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  {
    icon: LayoutTemplate,
    titleKey: "home.step1.title",
    descKey: "home.step1.desc",
  },
  { icon: Palette, titleKey: "home.step2.title", descKey: "home.step2.desc" },
  {
    icon: ClipboardCopy,
    titleKey: "home.step3.title",
    descKey: "home.step3.desc",
  },
];

export function HomeIntro() {
  const { t } = useLocale();
  const tools = toolModeList();

  return (
    <>
      <section className="flex w-full flex-col items-start gap-2 text-left">
        <span className="rounded-full bg-fill-subtle px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t("home.badge")}
        </span>
        <h1 className="font-heading max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t("home.headline", { tools: toolModeShortList(2) })}
        </h1>
        <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
          {t("home.subhead")}
        </p>
      </section>

      <section
        aria-label={t("home.howItWorks")}
        className="mt-8 grid w-full grid-cols-1 gap-3 border-b border-border pb-8 sm:grid-cols-3 sm:gap-4 sm:pb-10"
      >
        {STEPS.map((step, i) => (
          <div
            key={step.titleKey}
            className="flex items-start gap-3 rounded-xl border border-border bg-fill-subtle p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fill-subtle">
              <step.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-foreground">
                <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
                {t(step.titleKey)}
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(step.descKey, { tools })}
              </p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
