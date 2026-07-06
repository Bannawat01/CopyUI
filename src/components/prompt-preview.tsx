import { Sparkles } from "lucide-react";
import type { PromptTheme } from "@/lib/prompts";

export function PromptPreview({
  preview,
  primaryColor,
  className,
}: {
  preview: PromptTheme["preview"];
  primaryColor?: string;
  className?: string;
}) {
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
      <div className="relative flex flex-col items-center gap-2 text-white/90">
        <Sparkles
          className="h-6 w-6 transition-colors duration-300"
          style={{ color: primaryColor }}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-white/70">
          {preview.accentLabel}
        </span>
      </div>
    </div>
  );
}
