import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToGallery } from "@/components/back-to-gallery";
import { getPromptBySlug, prompts } from "@/lib/prompts";
import { toolModeList } from "@/lib/tool-modes";
import { PromptDetail } from "@/components/prompt-detail";
import { DetailHeader } from "@/components/detail-header";
import { ExampleOutcome } from "@/components/example-outcome";

export function generateStaticParams() {
  return prompts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return {};

  const title = `${prompt.title} UI Prompt`;
  const description = `${prompt.description} Customize the color and tool mode, then copy a production-ready prompt for ${toolModeList()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/prompts/${prompt.slug}` },
    openGraph: {
      title,
      description,
      url: `/prompts/${prompt.slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) notFound();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 bg-[#050505] px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:px-10">
      <BackToGallery />

      <DetailHeader
        title={prompt.title}
        description={prompt.description}
        tags={prompt.tags}
      />

      <PromptDetail
        prompt={{
          slug: prompt.slug,
          preview: prompt.preview,
          defaultPrimaryColor: prompt.defaultPrimaryColor,
        }}
      />

      <ExampleOutcome slug={prompt.slug} />
    </main>
  );
}
