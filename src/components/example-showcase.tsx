"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { getFeaturedExamples } from "@/lib/generated-examples";

/**
 * Homepage: a few featured examples showing the *direction* a prompt produces.
 * Deliberately schematic — stacked labelled blocks, never a fake screenshot,
 * because pretending to show real generated output would be the exact kind of
 * overpromise the rest of the product avoids.
 */
export function ExampleShowcase() {
  const { t } = useLocale();
  const examples = getFeaturedExamples();

  return (
    <section
      aria-label={t("examples.homeHeading")}
      className="mt-10 w-full border-t border-border pt-8 sm:mt-12 sm:pt-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-sm font-medium text-foreground">
          {t("examples.homeHeading")}
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {t("examples.homeSubhead")}
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {examples.map((example) => (
          <li key={example.slug}>
            <Link
              href={`/prompts/${example.slug}`}
              className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-fill-subtle p-4 outline-none transition-colors hover:border-foreground/20 hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {/* Schematic block stack — structure, not pixels. */}
              <div
                aria-hidden="true"
                className="flex flex-col gap-1 rounded-lg border border-border bg-fill-sunken p-2"
              >
                <span className="px-1 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t("examples.schematic")}
                </span>
                {example.layoutPreview.map((row, i) => (
                  <span
                    key={row}
                    className={`truncate rounded px-2 py-1 text-[10px] leading-tight ${
                      i === 0
                        ? "bg-fill-hover text-muted-foreground"
                        : "bg-fill-subtle text-muted-foreground"
                    }`}
                  >
                    {row}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                  {example.exampleTitle}
                </span>
                <span className="text-[11px] leading-relaxed text-muted-foreground">
                  {example.outcomeSummary}
                </span>
              </div>

              <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground/90">
                {t("examples.expectedDirection")}
                <ArrowRight
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
