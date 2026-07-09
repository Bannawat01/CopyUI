"use client";

import { THEME_MODES, type ThemeMode } from "@/lib/prompt-options";

export function ThemeModeSelector({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        id="theme-mode-label"
        className="text-sm font-medium text-foreground"
      >
        Theme Mode
      </span>
      <div
        role="radiogroup"
        aria-labelledby="theme-mode-label"
        className="inline-flex w-fit rounded-lg border border-white/10 bg-white/5 p-1"
      >
        {THEME_MODES.map(({ value: mode, label }) => {
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(mode)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
