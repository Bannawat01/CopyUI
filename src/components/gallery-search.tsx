"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PromptGrid } from "@/components/prompt-grid";
import type { PublicPromptTheme } from "@/lib/prompts";

export function GallerySearch({ prompts }: { prompts: PublicPromptTheme[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prompts;
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [prompts, query]);

  return (
    <>
      <div className="mt-2 w-full max-w-md">
        <Input
          type="search"
          aria-label="Search prompts by title, tag, or keyword"
          placeholder="Search by title, tag, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11"
        />
      </div>

      <section className="mt-8 flex w-full flex-col gap-4 sm:mt-12 sm:gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-medium">All Themes</h2>
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {prompts.length}
          </span>
        </div>
        <PromptGrid
          prompts={filtered}
          query={query}
          onClearQuery={() => setQuery("")}
        />
      </section>
    </>
  );
}
