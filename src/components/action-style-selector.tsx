"use client";

import { ACTION_STYLES, type ActionStyle } from "@/lib/prompt-options";

export function ActionStyleSelector({
  value,
  onChange,
}: {
  value: ActionStyle;
  onChange: (style: ActionStyle) => void;
}) {
  const selected = ACTION_STYLES.find((s) => s.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span
        id="action-style-label"
        className="text-sm font-medium text-foreground"
      >
        Action Style
      </span>
      <div
        role="radiogroup"
        aria-labelledby="action-style-label"
        className="inline-flex w-fit flex-wrap rounded-lg border border-white/10 bg-white/5 p-1"
      >
        {ACTION_STYLES.map(({ value: style, label }) => {
          const active = value === style;
          return (
            <button
              key={style}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(style)}
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
