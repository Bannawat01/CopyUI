"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PromptPreview } from "@/components/prompt-preview";
import type { PublicPromptTheme } from "@/lib/prompts";

const cardVariants = {
  rest: { y: 0 },
  active: { y: -6 },
};

export function PromptCard({ prompt }: { prompt: PublicPromptTheme }) {
  const [active, setActive] = useState(false);
  const initial = prompt.meta.creator.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      animate={active ? "active" : "rest"}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:border-foreground/20 hover:shadow-[0_2px_24px_-8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_48px_-16px_rgba(0,0,0,0.6)] has-[a:focus-visible]:border-ring has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          background: `radial-gradient(400px circle at 50% 0%, ${prompt.defaultPrimaryColor}22, transparent 70%)`,
        }}
      />

      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 scale-100 transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]">
          <PromptPreview
            preview={prompt.preview}
            primaryColor={prompt.defaultPrimaryColor}
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-medium text-foreground">
            {prompt.title}
          </h3>
          <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground group-focus-within:text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-border bg-fill-subtle text-[10px] text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-focus-within:text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-foreground/90"
              style={{ backgroundColor: `${prompt.defaultPrimaryColor}33` }}
            >
              {initial}
            </span>
            <span>{prompt.meta.creator}</span>
          </div>
          <span>{prompt.meta.copies.toLocaleString()} copies</span>
        </div>
      </div>

      <Link
        href={`/prompts/${prompt.slug}`}
        aria-label={`View prompt: ${prompt.title}`}
        className="absolute inset-0 rounded-2xl outline-none focus-visible:outline-none"
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <span className="sr-only">View prompt: {prompt.title}</span>
      </Link>
    </motion.div>
  );
}
