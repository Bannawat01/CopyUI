"use client";

import { PROMPT_INTENTS, type PromptIntent } from "@/lib/prompt-options";
import { useLocale } from "@/components/locale-provider";
import type { TranslationKey } from "@/lib/i18n";

export function PromptIntentSelector({
  value,
  onChange,
}: {
  value: PromptIntent;
  onChange: (intent: PromptIntent) => void;
}) {
  const { t } = useLocale();
  const selected = PROMPT_INTENTS.find((i) => i.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span
        id="prompt-intent-label"
        className="text-sm font-medium text-foreground"
      >
        {t("intent.label")}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="prompt-intent-label"
        className="inline-flex w-fit rounded-lg border border-border bg-fill-subtle p-1"
      >
        {PROMPT_INTENTS.map(({ value: intent }) => {
          const active = value === intent;
          return (
            <button
              key={intent}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(intent)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`intent.${intent}.label` as TranslationKey)}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {selected && t(`intent.${selected.value}.desc` as TranslationKey)}
      </p>
    </div>
  );
}
