"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { getTrustFaq } from "@/lib/trust-copy";

/** Compact accordion — collapsed by default so it never crowds the gallery. */
export function TrustFaq() {
  const { locale, t } = useLocale();
  const faq = getTrustFaq(locale);

  return (
    <section
      aria-label="Frequently asked questions"
      className="mt-10 w-full border-t border-white/10 pt-8 sm:mt-12 sm:pt-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-sm font-medium text-white/90">
          What to expect from AI output
        </h2>
        <p className="text-xs text-white/45">{t("lang.note")}</p>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {faq.map((item) => (
          <li key={item.question}>
            <details className="group rounded-lg border border-white/10 bg-white/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/75 outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-white/40 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-4 pb-4 text-xs leading-relaxed text-white/50">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
