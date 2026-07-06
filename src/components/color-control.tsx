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
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span id="primary-color-label" className="text-sm font-medium text-foreground">
        Primary Color
      </span>
      <div
        role="group"
        aria-labelledby="primary-color-label"
        className="flex flex-wrap items-center gap-2.5"
      >
        {SWATCHES.map((swatch) => {
          const selected = value.toLowerCase() === swatch;
          return (
            <button
              key={swatch}
              type="button"
              aria-label={`Use ${swatch} as primary color`}
              aria-pressed={selected}
              onClick={() => onChange(swatch)}
              className="h-7 w-7 rounded-full outline-none ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:ring-ring"
              style={{
                backgroundColor: swatch,
                // @ts-expect-error css var not typed
                "--tw-ring-color": selected ? swatch : "transparent",
              }}
            />
          );
        })}
        <label className="sr-only" htmlFor="custom-primary-color">
          Custom primary color
        </label>
        <input
          id="custom-primary-color"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <span className="ml-1 text-xs font-mono text-muted-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}
