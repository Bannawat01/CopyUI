"use client";

import { Globe } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { LOCALES, LOCALE_LABELS, isLocale } from "@/lib/i18n";

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
      <label className="sr-only" htmlFor="locale-select">
        {t("lang.label")}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => {
          if (isLocale(e.target.value)) setLocale(e.target.value);
        }}
        // The note explains that switching the site language does NOT switch
        // the copied prompt's language — the single most likely misreading.
        title={t("lang.note")}
        className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/80 outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-[#111]">
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
