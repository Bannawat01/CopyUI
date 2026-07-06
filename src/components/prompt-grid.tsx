"use client";

import { AnimatePresence, motion } from "framer-motion";
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
      <motion.div
        key="empty"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/15 py-14 text-center sm:py-20"
      >
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
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      <AnimatePresence mode="popLayout" initial={false}>
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.slug}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
              delay: Math.min(index * 0.035, 0.28),
            }}
          >
            <PromptCard prompt={prompt} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
