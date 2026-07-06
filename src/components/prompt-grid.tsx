import { SearchX } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import type { PublicPromptTheme } from "@/lib/prompts";

export function PromptGrid({
  prompts,
  query,
  onClearQuery,
}: {
  prompts: PublicPromptTheme[];
  query?: string;
  onClearQuery?: () => void;
}) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/15 py-14 text-center sm:py-20">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">
          {query ? (
            <>No prompts match &ldquo;{query}&rdquo;.</>
          ) : (
            <>No prompts to show.</>
          )}
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Try a different keyword or tag, like &ldquo;dashboard&rdquo; or
          &ldquo;landing&rdquo;.
        </p>
        {onClearQuery && (
          <button
            type="button"
            onClick={onClearQuery}
            className="mt-1 rounded-lg text-sm font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.slug} prompt={prompt} />
      ))}
    </div>
  );
}
