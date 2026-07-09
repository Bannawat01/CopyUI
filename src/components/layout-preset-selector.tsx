"use client";

import { LAYOUT_PRESETS, type LayoutPreset } from "@/lib/prompt-options";

export function LayoutPresetSelector({
  value,
  onChange,
  advisory,
}: {
  value: LayoutPreset;
  onChange: (preset: LayoutPreset) => void;
  /** True in Retheme mode, where the preset only hints at styling. */
  advisory?: boolean;
}) {
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
        {LAYOUT_PRESETS.map((preset) => (
          <option
            key={preset.value}
            value={preset.value}
            className="bg-[#111]"
          >
            {preset.label}
          </option>
        ))}
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
