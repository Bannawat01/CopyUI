"use client";

import { Info } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { getExampleBySlug } from "@/lib/generated-examples";
import { getToolModeLabel } from "@/lib/tool-modes";

function Bullets({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </h3>
      <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-white/60">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Detail page: what this prompt is designed to produce. Sits below the copy
 * panel so it informs the decision without interrupting the copy flow.
 */
export function ExampleOutcome({ slug }: { slug: string }) {
  const { t } = useLocale();
  const example = getExampleBySlug(slug);

  if (!example) return null;

  return (
    <section
      aria-label={t("examples.detailHeading")}
      className="flex w-full flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-sm font-medium text-white/90">
          {t("examples.detailHeading")}
        </h2>
        <p className="text-sm leading-relaxed text-white/60">
          {example.outcomeSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
            {t("examples.typicalStructure")}
          </h3>
          <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-black/30 p-2">
            {example.layoutPreview.map((row, i) => (
              <span
                key={row}
                className={`rounded px-2 py-1 text-[11px] leading-tight ${
                  i === 0
                    ? "bg-white/[0.08] text-white/60"
                    : "bg-white/[0.04] text-white/55"
                }`}
              >
                {row}
              </span>
            ))}
          </div>
        </div>

        <Bullets label={t("examples.keyElements")} items={example.keyElements} />
        <Bullets label={t("examples.bestFor")} items={example.bestFor} />
        <Bullets
          label={t("examples.visualNotes")}
          items={example.visualNotes}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
          {t("examples.recommendedTools")}
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {example.suggestedToolModes.map((mode) => (
            <li
              key={mode}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60"
            >
              {getToolModeLabel(mode)}
            </li>
          ))}
        </ul>
      </div>

      {example.expectationNote && (
        <p className="text-xs leading-relaxed text-white/55">
          <span className="font-medium text-white/60">
            {t("examples.heads-up")}:
          </span>{" "}
          {example.expectationNote}
        </p>
      )}

      <p className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-white/55">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t("examples.varyNote")}
      </p>
    </section>
  );
}
