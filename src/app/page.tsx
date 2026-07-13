import { GallerySearch } from "@/components/gallery-search";
import { HomeIntro } from "@/components/home-intro";
import { ExampleShowcase } from "@/components/example-showcase";
import { TrustFaq } from "@/components/trust-faq";
import { getPublicPrompts } from "@/lib/prompts";

export default function GalleryPage() {
  const prompts = getPublicPrompts();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <HomeIntro />

      <GallerySearch prompts={prompts} />

      <ExampleShowcase />

      <TrustFaq />
    </main>
  );
}
