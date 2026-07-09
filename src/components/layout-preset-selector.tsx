"use client";

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
  const { auto, recommended, other } = getGroupedLayoutPresets(previewKind);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="layout-preset"
        className="text-sm font-medium text-foreground"
      >
        Layout Preset
      </label>
      <select
        id="layout-preset"
        value={value}
        onChange={(e) => onChange(e.target.value as LayoutPreset)}
        className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value={auto.value} className="bg-[#111]">
          {auto.label}
        </option>
        <optgroup label="Recommended for this theme">
          {recommended.map((preset) => (
            <option
              key={preset.value}
              value={preset.value}
              className="bg-[#111]"
            >
              {preset.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Other layouts">
          {other.map((preset) => (
            <option
              key={preset.value}
              value={preset.value}
              className="bg-[#111]"
            >
              {preset.label}
            </option>
          ))}
        </optgroup>
      </select>
      {advisory && value !== "auto" && (
        <p className="text-xs text-muted-foreground">
          In Retheme mode this is advisory only — your existing page
          structure is preserved.
        </p>
      )}
    </div>
  );
}
