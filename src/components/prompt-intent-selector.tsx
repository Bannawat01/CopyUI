"use client";

import { PROMPT_INTENTS, type PromptIntent } from "@/lib/prompt-options";

export function PromptIntentSelector({
  value,
  onChange,
}: {
  value: PromptIntent;
  onChange: (intent: PromptIntent) => void;
}) {
  const selected = PROMPT_INTENTS.find((i) => i.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span
        id="prompt-intent-label"
        className="text-sm font-medium text-foreground"
      >
        Prompt Intent
      </span>
      <div
        role="radiogroup"
        aria-labelledby="prompt-intent-label"
        className="inline-flex w-fit rounded-lg border border-white/10 bg-white/5 p-1"
      >
        {PROMPT_INTENTS.map(({ value: intent, label }) => {
          const active = value === intent;
          return (
            <button
              key={intent}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(intent)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{selected?.description}</p>
    </div>
  );
}
