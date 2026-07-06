"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PromptPreview } from "@/components/prompt-preview";
import type { PublicPromptTheme } from "@/lib/prompts";

export function PromptCard({ prompt }: { prompt: PublicPromptTheme }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-lg hover:shadow-black/20 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
    >
      <PromptPreview
        preview={prompt.preview}
        primaryColor={prompt.defaultPrimaryColor}
        className="h-40 w-full"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-heading text-base font-medium">{prompt.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {prompt.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={`/prompts/${prompt.slug}`}
          aria-label={`View prompt: ${prompt.title}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground outline-none transition-colors after:absolute after:inset-0 group-hover:text-primary focus-visible:text-primary"
        >
          View Prompt
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
