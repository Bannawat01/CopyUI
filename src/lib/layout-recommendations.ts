import type { PreviewKind } from "@/lib/prompts";
import { LAYOUT_PRESETS, type LayoutPreset } from "@/lib/prompt-options";

/**
 * Which layout presets suit each theme. Keyed by `preview.kind` (one per
 * theme) so no new field is added to PromptTheme and nothing extra is
 * shipped to the client. Recommendations are a hint, not a restriction:
 * every preset stays selectable — see getGroupedLayoutPresets().
 */
const RECOMMENDED: Record<PreviewKind, LayoutPreset[]> = {
  dashboard: ["sidebar-dashboard", "bento-grid", "card-grid"],
  hero: ["centered-hero", "split-hero"],
  pricing: ["pricing-grid", "card-grid"],
  auth: ["centered-hero"],
  portfolio: ["bento-grid", "card-grid"],
  changelog: ["docs-layout", "card-grid"],
  agency: ["split-hero", "bento-grid", "centered-hero"],
  chat: ["sidebar-dashboard"],
  analytics: ["bento-grid", "sidebar-dashboard", "card-grid"],
  ecommerce: ["split-hero", "card-grid"],
  finance: ["sidebar-dashboard", "bento-grid"],
  kanban: ["sidebar-dashboard", "card-grid"],
  docs: ["docs-layout"],
  mobile: ["mobile-app", "split-hero", "centered-hero"],
  realestate: ["split-hero", "card-grid"],
  menu: ["centered-hero", "card-grid"],
  event: ["centered-hero", "card-grid", "bento-grid"],
  linkbio: ["mobile-app", "centered-hero"],
};

export function getRecommendedLayoutPresets(kind: PreviewKind): LayoutPreset[] {
  return RECOMMENDED[kind];
}

export function isRecommendedLayoutPreset(
  kind: PreviewKind,
  preset: LayoutPreset,
): boolean {
  return RECOMMENDED[kind].includes(preset);
}

export type LayoutPresetOption = { value: LayoutPreset; label: string };

/**
 * Options split for the selector: "auto" always first (the default),
 * then recommended presets in their curated order, then the rest.
 */
export function getGroupedLayoutPresets(kind: PreviewKind): {
  auto: LayoutPresetOption;
  recommended: LayoutPresetOption[];
  other: LayoutPresetOption[];
} {
  const byValue = new Map(LAYOUT_PRESETS.map((p) => [p.value, p]));
  const recommendedValues = RECOMMENDED[kind];

  return {
    auto: byValue.get("auto")!,
    recommended: recommendedValues.map((v) => byValue.get(v)!),
    other: LAYOUT_PRESETS.filter(
      (p) => p.value !== "auto" && !recommendedValues.includes(p.value),
    ),
  };
}
