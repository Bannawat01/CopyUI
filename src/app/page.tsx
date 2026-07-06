import { GallerySearch } from "@/components/gallery-search";
import { getPublicPrompts } from "@/lib/prompts";

export default function GalleryPage() {
  const prompts = getPublicPrompts();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center bg-[#050505] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <section className="flex w-full flex-col items-start gap-2 border-b border-white/10 pb-8 text-left sm:pb-10">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/50">
          Prompt Marketplace
        </span>
        <h1 className="font-heading max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Copy premium UI prompts, ship faster
        </h1>
        <p className="max-w-xl text-balance text-sm text-white/50 sm:text-base">
          Browse production-ready UI prompts, customize them to your brand,
          and copy a ready-to-use prompt for v0.dev, Cursor, or GenVibe.
        </p>
      </section>

      <GallerySearch prompts={prompts} />
    </main>
  );
}
