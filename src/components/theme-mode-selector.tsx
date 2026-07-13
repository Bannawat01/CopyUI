"use client";

import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";

import { THEME_MODES, type ThemeMode } from "@/lib/prompt-options";

export function ThemeModeSelector({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <span
        id="theme-mode-label"
        className="text-sm font-medium text-foreground"
      >
        {t("theme.label")}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="theme-mode-label"
        className="inline-flex w-fit rounded-lg border border-border bg-fill-subtle p-1"
      >
        {THEME_MODES.map(({ value: mode }) => {
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(mode)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`theme.${mode}` as TranslationKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
