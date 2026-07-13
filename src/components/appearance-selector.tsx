"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import {
  APPEARANCES,
  isAppearance,
  useAppearance,
  type Appearance,
} from "@/components/appearance-provider";
import type { TranslationKey } from "@/lib/i18n";

const ICONS: Record<Appearance, typeof Moon> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

export function AppearanceSelector() {
  const { t } = useLocale();
  const { appearance, resolvedTheme, setAppearance } = useAppearance();
  const Icon = ICONS[appearance];

  return (
    <div className="flex items-center gap-2">
      <Icon
        className="h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <label className="sr-only" htmlFor="appearance-select">
        {t("appearance.label")}
      </label>
      <select
        id="appearance-select"
        value={appearance}
        onChange={(e) => {
          if (isAppearance(e.target.value)) setAppearance(e.target.value);
        }}
        // Website appearance vs. prompt Theme Mode is the likeliest confusion
        // here, same pattern as the language selector's tooltip.
        title={t("appearance.note")}
        data-resolved-theme={resolvedTheme}
        className="h-8 rounded-lg border border-border bg-fill-subtle px-2 text-xs text-foreground/90 outline-none transition-colors hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {APPEARANCES.map((a) => (
          <option key={a} value={a} className="bg-popover">
            {t(`appearance.${a}` as TranslationKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
