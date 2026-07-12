/**
 * Picks a readable foreground for a user-chosen background color.
 *
 * The Copy button paints `primaryColor` as its background, and that color is
 * whatever the user selects — so a hardcoded white label fails WCAG the moment
 * someone picks a bright hue. The Analytics Command Center theme ships with
 * #eab308 (bright yellow), which made white-on-yellow the default on a real
 * detail page.
 *
 * Follows the WCAG 2.x relative-luminance and contrast-ratio definitions.
 */

/** Near-black rather than pure black — softer against saturated brand colors. */
export const DARK_FOREGROUND = "#0c0c0e";
export const LIGHT_FOREGROUND = "#ffffff";

export type Rgb = { r: number; g: number; b: number };

/** Parses #rgb and #rrggbb (with or without the leading #). Null if invalid. */
export function parseHex(hex: string): Rgb | null {
  if (typeof hex !== "string") return null;
  const value = hex.trim().replace(/^#/, "");

  const expanded =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

/** WCAG relative luminance: sRGB channels linearized, then weighted. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  );
}

/** WCAG contrast ratio between two colors, from 1 (identical) to 21. */
export function contrastRatio(a: string, b: string): number {
  const rgbA = parseHex(a);
  const rgbB = parseHex(b);
  if (!rgbA || !rgbB) return 1;

  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns whichever of the two foregrounds contrasts better against
 * `background`. An unparseable background falls back to the light foreground,
 * matching the previous always-white behavior rather than rendering something
 * unexpected.
 */
export function readableForeground(background: string): string {
  if (!parseHex(background)) return LIGHT_FOREGROUND;

  const onLight = contrastRatio(background, LIGHT_FOREGROUND);
  const onDark = contrastRatio(background, DARK_FOREGROUND);
  return onDark > onLight ? DARK_FOREGROUND : LIGHT_FOREGROUND;
}
