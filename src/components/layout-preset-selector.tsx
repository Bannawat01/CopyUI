"use client";

import { useLocale } from "@/components/locale-provider";
import { type LayoutPreset } from "@/lib/prompt-options";
import { getGroupedLayoutPresets } from "@/lib/layout-recommendations";
import type { PreviewKind } from "@/lib/prompts";

export function LayoutPresetSelector({
  value,
  onChange,
  previewKind,
  advisory,
}: {
  value: LayoutPreset;
  onChange: (preset: LayoutPreset) => void;
  /** Drives which presets are recommended for this theme. */
  previewKind: PreviewKind;
  /** True in Retheme mode, where the preset only hints at styling. */
  advisory?: boolean;
}) {
  const { t } = useLocale();
  const { auto, recommended, other } = getGroupedLayoutPresets(previewKind);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="layout-preset"
        className="text-sm font-medium text-foreground"
      >
        {t("layout.label")}
      </label>
      <select
        id="layout-preset"
        value={value}
        onChange={(e) => onChange(e.target.value as LayoutPreset)}
        className="h-9 w-full rounded-lg border border-border bg-fill-subtle px-3 text-sm text-foreground outline-none transition-colors hover:bg-fill-hover focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value={auto.value} className="bg-popover">
          {auto.label}
        </option>
        <optgroup label={t("layout.recommended")}>
          {recommended.map((preset) => (
            <option
              key={preset.value}
              value={preset.value}
              className="bg-popover"
            >
              {preset.label}
            </option>
          ))}
        </optgroup>
        <optgroup label={t("layout.other")}>
          {other.map((preset) => (
            <option
              key={preset.value}
              value={preset.value}
              className="bg-popover"
            >
              {preset.label}
            </option>
          ))}
        </optgroup>
      </select>
      {advisory && value !== "auto" && (
        <p className="text-xs text-muted-foreground">{t("layout.advisory")}</p>
      )}
    </div>
  );
}
