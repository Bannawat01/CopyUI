"use client";

import { useLocale } from "@/components/locale-provider";
import { TOOL_MODES, type ToolMode } from "@/lib/tool-modes";

export function ToolModeSelector({
  value,
  onChange,
}: {
  value: ToolMode;
  onChange: (mode: ToolMode) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <span id="tool-mode-label" className="text-sm font-medium text-foreground">
        {t("tool.label")}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="tool-mode-label"
        className="inline-flex w-fit flex-wrap gap-y-1 rounded-lg border border-border bg-fill-subtle p-1"
      >
        {TOOL_MODES.map(({ value: mode, label }) => {
          const selected = value === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(mode)}
              className={`rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                selected
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
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
