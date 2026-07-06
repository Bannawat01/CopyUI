"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function DetailHeader({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        UI Prompt Theme
      </span>
      <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
