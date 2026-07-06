"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolModeLabel, type ToolMode } from "@/lib/tool-modes";

type CopyState = "idle" | "loading" | "success" | "error";

export function CopyPromptButton({
  slug,
  primaryColor,
  toolMode,
}: {
  slug: string;
  primaryColor: string;
  toolMode: ToolMode;
}) {
  const [state, setState] = useState<CopyState>("idle");

  const statusText: Record<CopyState, string> = {
    idle: "",
    loading: `Building a ${getToolModeLabel(toolMode)} prompt…`,
    success: `Copied — tailored for ${getToolModeLabel(toolMode)}`,
    error: "Couldn't copy the prompt. Please try again.",
  };

  async function handleCopy() {
    setState("loading");
    try {
      const res = await fetch(`/api/prompts/${slug}/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor, toolMode }),
      });
      if (!res.ok) throw new Error("Failed to build prompt");
      const { text } = await res.json();
      await navigator.clipboard.writeText(text);
      setState("success");
    } catch {
      setState("error");
    } finally {
      setTimeout(() => setState("idle"), 2200);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        whileTap={{ scale: 0.97 }}
        animate={{ scale: state === "success" ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="inline-block"
      >
        <Button
          size="lg"
          onClick={handleCopy}
          disabled={state === "loading"}
          aria-busy={state === "loading"}
          style={{ backgroundColor: primaryColor }}
          className="gap-2 text-white shadow-lg transition-colors hover:opacity-90 disabled:opacity-80"
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === "loading" ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" /> Copying...
              </motion.span>
            ) : state === "success" ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Copied!
              </motion.span>
            ) : state === "error" ? (
              <motion.span
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" /> Copy failed
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" /> Copy Prompt
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <p
        role="status"
        aria-live="polite"
        className={`text-xs font-medium ${
          state === "success"
            ? "text-emerald-500"
            : state === "error"
              ? "text-destructive"
              : "text-transparent"
        }`}
      >
        {statusText[state] || " "}
      </p>
    </div>
  );
}
