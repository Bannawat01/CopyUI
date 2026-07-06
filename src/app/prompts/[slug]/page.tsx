import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPromptBySlug, prompts } from "@/lib/prompts";
import { PromptDetail } from "@/components/prompt-detail";

export function generateStaticParams() {
  return prompts.map((p) => ({ slug: p.slug }));
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
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to gallery
      </Link>

      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          UI Prompt Theme
        </span>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {prompt.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {prompt.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <PromptDetail
        prompt={{
          slug: prompt.slug,
          preview: prompt.preview,
          defaultPrimaryColor: prompt.defaultPrimaryColor,
        }}
      />
    </main>
  );
}
