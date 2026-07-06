import {
  LayoutDashboard,
  Sparkles,
  Layers,
  KeyRound,
  LayoutGrid,
  GitCommitVertical,
} from "lucide-react";
import type { PromptTheme, PreviewKind } from "@/lib/prompts";

const PREVIEW_ICON: Record<PreviewKind, typeof Sparkles> = {
  dashboard: LayoutDashboard,
  hero: Sparkles,
  pricing: Layers,
  auth: KeyRound,
  portfolio: LayoutGrid,
  changelog: GitCommitVertical,
};

function PreviewGlyph({
  kind,
  primaryColor,
}: {
  kind: PreviewKind;
  primaryColor?: string;
}) {
  const base = "rounded-sm bg-white/15";

  switch (kind) {
    case "dashboard":
      return (
        <div className="flex h-10 w-16 gap-1">
          <div className={`${base} h-full w-3`} />
          <div className="grid flex-1 grid-cols-2 gap-1">
            <div
              className="rounded-sm"
              style={{ backgroundColor: `${primaryColor}55` }}
            />
            <div className={`${base}`} />
            <div className={`${base}`} />
            <div className={`${base}`} />
          </div>
        </div>
      );
    case "hero":
      return (
        <div className="flex w-20 flex-col items-center gap-1.5">
          <div className={`${base} h-2 w-16`} />
          <div className={`${base} h-2 w-12`} />
          <div
            className="mt-1 h-2.5 w-10 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      );
    case "pricing":
      return (
        <div className="flex h-10 items-end gap-1.5">
          <div className={`${base} h-7 w-4`} />
          <div
            className="w-4 rounded-sm"
            style={{ height: "2.5rem", backgroundColor: `${primaryColor}80` }}
          />
          <div className={`${base} h-7 w-4`} />
        </div>
      );
    case "auth":
      return (
        <div className="flex w-14 flex-col items-center gap-1.5 rounded-md border border-white/15 p-2">
          <div className={`${base} h-1.5 w-full`} />
          <div className={`${base} h-1.5 w-full`} />
          <div
            className="h-2 w-full rounded-sm"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      );
    case "portfolio":
      return (
        <div className="grid w-16 grid-cols-3 gap-1">
          <div className={`${base} h-8 col-span-1`} />
          <div
            className="col-span-2 h-5 rounded-sm"
            style={{ backgroundColor: `${primaryColor}55` }}
          />
          <div className={`${base} col-span-2 h-5`} />
          <div className={`${base} col-span-1 h-8`} />
        </div>
      );
    case "changelog":
      return (
        <div className="flex h-10 flex-col justify-between border-l-2 border-white/15 pl-2">
          <div
            className="-ml-[9px] h-2 w-2 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="-ml-[9px] h-2 w-2 rounded-full bg-white/30" />
          <div className="-ml-[9px] h-2 w-2 rounded-full bg-white/30" />
        </div>
      );
  }
}

export function PromptPreview({
  preview,
  primaryColor,
  className,
}: {
  preview: PromptTheme["preview"];
  primaryColor?: string;
  className?: string;
}) {
  const Icon = PREVIEW_ICON[preview.kind];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${preview.gradientFrom}, ${preview.gradientTo})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen transition-colors duration-300"
        style={{
          background: primaryColor
            ? `radial-gradient(circle at 30% 20%, ${primaryColor}, transparent 60%)`
            : undefined,
        }}
      />
      <div className="relative flex flex-col items-center gap-3 text-white/90">
        <PreviewGlyph kind={preview.kind} primaryColor={primaryColor} />
        <div className="flex flex-col items-center gap-2">
          <Icon
            className="h-5 w-5 transition-colors duration-300"
            style={{ color: primaryColor }}
          />
          <span className="text-xs font-medium uppercase tracking-widest text-white/70">
            {preview.accentLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
