"use client";

const SWATCHES = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#22c55e",
  "#ef4444",
];

export function ColorControl({
  id = "primary-color",
  label = "Primary Color",
  value,
  onChange,
  onClear,
}: {
  id?: string;
  label?: string;
  value: string | undefined;
  onChange: (color: string) => void;
  /** When provided, renders a "None" affordance for optional colors. */
  onClear?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-sm font-medium text-foreground">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        className="flex flex-wrap items-center gap-2"
      >
        {SWATCHES.map((swatch) => {
          const selected = value?.toLowerCase() === swatch;
          return (
            <button
              key={swatch}
              type="button"
              aria-label={`Use ${swatch} as ${label.toLowerCase()}`}
              aria-pressed={selected}
              onClick={() => onChange(swatch)}
              className="h-7 w-7 rounded-full outline-none ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:ring-ring"
              style={{
                backgroundColor: swatch,
                // @ts-expect-error css var not typed
                "--tw-ring-color": selected ? swatch : "transparent",
              }}
            />
          );
        })}
        <label className="sr-only" htmlFor={`${id}-custom`}>
          Custom {label.toLowerCase()}
        </label>
        <input
          id={`${id}-custom`}
          type="color"
          value={value ?? "#666666"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        />
        {onClear && (
          <button
            type="button"
            aria-pressed={value === undefined}
            onClick={onClear}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
              value === undefined
                ? "border-white/25 bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            None
          </button>
        )}
        <span className="ml-1 text-xs font-mono text-muted-foreground">
          {value ?? "off"}
        </span>
      </div>
    </div>
  );
}
