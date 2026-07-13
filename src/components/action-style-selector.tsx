"use client";

import { ACTION_STYLES, type ActionStyle } from "@/lib/prompt-options";
import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";

export function ActionStyleSelector({
  value,
  onChange,
}: {
  value: ActionStyle;
  onChange: (style: ActionStyle) => void;
}) {
  const { t } = useLocale();
  const selected = ACTION_STYLES.find((s) => s.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span
        id="action-style-label"
        className="text-sm font-medium text-foreground"
      >
        {t("action.label")}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="action-style-label"
        className="inline-flex w-fit flex-wrap rounded-lg border border-border bg-fill-subtle p-1"
      >
        {ACTION_STYLES.map(({ value: style }) => {
          const active = value === style;
          return (
            <button
              key={style}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(style)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`action.${style}.label` as TranslationKey)}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {selected && t(`action.${selected.value}.desc` as TranslationKey)}
      </p>
    </div>
  );
}
