import { GallerySearch } from "@/components/gallery-search";
import { getPublicPrompts } from "@/lib/prompts";

export default function GalleryPage() {
  const prompts = getPublicPrompts();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="flex flex-col items-center gap-3 text-center sm:gap-4">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Prompt Marketplace
        </span>
        <h1 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Copy premium UI prompts, ship faster
        </h1>
        <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
          Browse production-ready UI prompts, customize them to your brand,
          and copy a ready-to-use prompt for v0.dev, Cursor, or GenVibe.
        </p>
      </section>

      <GallerySearch prompts={prompts} />
    </main>
  );
}
