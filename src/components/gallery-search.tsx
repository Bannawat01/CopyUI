"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/locale-provider";
import { PromptGrid } from "@/components/prompt-grid";
import {
  GALLERY_CATEGORIES,
  type Category as FullCategory,
  type PublicPromptTheme,
} from "@/lib/prompts";
import type { TranslationKey } from "@/lib/i18n";

type Category = (typeof GALLERY_CATEGORIES)[number];

type SortOption = "most-copied" | "newest" | "a-z";

const SORT_OPTIONS: { value: SortOption; labelKey: TranslationKey }[] = [
  { value: "most-copied", labelKey: "gallery.sort.mostCopied" },
  { value: "newest", labelKey: "gallery.sort.newest" },
  { value: "a-z", labelKey: "gallery.sort.az" },
];

export function GallerySearch({ prompts }: { prompts: PublicPromptTheme[] }) {
  const { t, tCategory } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState<SortOption>("most-copied");

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FullCategory | "All", number>> = {
      All: prompts.length,
    };
    for (const p of prompts) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [prompts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = prompts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    const sorted = [...matched];
    if (sort === "most-copied") {
      sorted.sort((a, b) => b.meta.copies - a.meta.copies);
    } else if (sort === "newest") {
      sorted.sort((a, b) => prompts.indexOf(b) - prompts.indexOf(a));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [prompts, query, category, sort]);

  const hasActiveFilter = query.trim() !== "" || category !== "All";

  return (
    <section className="mt-6 flex w-full flex-col gap-5 sm:mt-8 sm:gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-heading text-xl font-medium text-white sm:text-2xl">
          {t("gallery.heading")}
        </h2>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Input
            type="search"
            aria-label={t("gallery.searchAria")}
            placeholder={t("gallery.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full border-white/10 bg-white/5 text-white placeholder:text-white/30 sm:w-72"
          />
          <label className="sr-only" htmlFor="gallery-sort">
            {t("gallery.sortAria")}
          </label>
          <select
            id="gallery-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111]">
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
          <span className="hidden shrink-0 text-sm text-white/55 sm:inline">
            {t("gallery.count", {
              shown: filtered.length,
              total: prompts.length,
            })}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label={t("gallery.filterAria")}
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
              className={`relative rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active
                  ? "text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="category-pill-active"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {tCategory(c)}
                <span
                  className={`text-xs ${active ? "text-black/60" : "text-white/55"}`}
                >
                  {categoryCounts[c] ?? 0}
                </span>
              </span>
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
