import { LayoutTemplate, Palette, ClipboardCopy } from "lucide-react";
import { GallerySearch } from "@/components/gallery-search";
import { getPublicPrompts } from "@/lib/prompts";

const HOW_IT_WORKS = [
  {
    icon: LayoutTemplate,
    title: "Pick a UI prompt",
    description: "Browse 18 production-ready UI themes, from dashboards to landing pages.",
  },
  {
    icon: Palette,
    title: "Customize it",
    description: "Set your brand color and choose a tool mode — v0.dev, Cursor, or GenVibe.",
  },
  {
    icon: ClipboardCopy,
    title: "Copy and paste",
    description: "One click builds a tailored prompt and copies it straight to your clipboard.",
  },
] as const;

export default function GalleryPage() {
  const prompts = getPublicPrompts();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center bg-[#050505] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <section className="flex w-full flex-col items-start gap-2 text-left">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/50">
          Prompt Marketplace
        </span>
        <h1 className="font-heading max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Production-ready UI prompts for v0, Cursor, and GenVibe
        </h1>
        <p className="max-w-xl text-balance text-sm text-white/50 sm:text-base">
          Pick a UI theme, set your brand color, and copy a prompt tuned for
          your AI tool — no prompt writing required.
        </p>
      </section>

      <section
        aria-label="How it works"
        className="mt-8 grid w-full grid-cols-1 gap-3 border-b border-white/10 pb-8 sm:grid-cols-3 sm:gap-4 sm:pb-10"
      >
        {HOW_IT_WORKS.map((step, i) => (
          <div
            key={step.title}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <step.icon className="h-4 w-4 text-white/60" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-white/90">
                <span className="mr-1.5 text-white/40">{i + 1}.</span>
                {step.title}
              </h2>
              <p className="text-xs leading-relaxed text-white/45">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      <GallerySearch prompts={prompts} />
    </main>
  );
}
