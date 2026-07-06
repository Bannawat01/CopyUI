"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PromptGrid } from "@/components/prompt-grid";
import { GALLERY_CATEGORIES, type PublicPromptTheme } from "@/lib/prompts";

type Category = (typeof GALLERY_CATEGORIES)[number];

export function GallerySearch({ prompts }: { prompts: PublicPromptTheme[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [prompts, query, category]);

  const hasActiveFilter = query.trim() !== "" || category !== "All";

  return (
    <section className="mt-6 flex w-full flex-col gap-5 sm:mt-8 sm:gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-heading text-xl font-medium text-white sm:text-2xl">
          Browse Templates
        </h2>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Input
            type="search"
            aria-label="Search prompts by title, tag, or keyword"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full border-white/10 bg-white/5 text-white placeholder:text-white/30 sm:w-72"
          />
          <span className="hidden shrink-0 text-sm text-white/40 sm:inline">
            {filtered.length} of {prompts.length}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {GALLERY_CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active
                  ? "border-white/20 bg-white text-black"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <PromptGrid
        prompts={filtered}
        query={query}
        onClearQuery={
          hasActiveFilter
            ? () => {
                setQuery("");
                setCategory("All");
              }
            : undefined
        }
      />
    </section>
  );
}
