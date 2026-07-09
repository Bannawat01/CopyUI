"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PromptPreview } from "@/components/prompt-preview";
import { ColorControl } from "@/components/color-control";
import { ToolModeSelector } from "@/components/tool-mode-selector";
import { ThemeModeSelector } from "@/components/theme-mode-selector";
import { PromptIntentSelector } from "@/components/prompt-intent-selector";
import { CopyPromptButton } from "@/components/copy-prompt-button";
import { QualityChecklist } from "@/components/quality-checklist";
import type { PromptTheme } from "@/lib/prompts";
import type { ToolMode } from "@/lib/tool-modes";
import type { PromptIntent, ThemeMode } from "@/lib/prompt-options";

type PromptDetailData = Pick<
  PromptTheme,
  "slug" | "preview" | "defaultPrimaryColor"
>;

export function PromptDetail({ prompt }: { prompt: PromptDetailData }) {
  const [primaryColor, setPrimaryColor] = useState(prompt.defaultPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>();
  const [accentColor, setAccentColor] = useState<string | undefined>();
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [promptIntent, setPromptIntent] = useState<PromptIntent>("build");
  const [toolMode, setToolMode] = useState<ToolMode>("v0");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        className="md:col-span-3"
      >
        <PromptPreview
          preview={prompt.preview}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          className="aspect-video w-full rounded-xl border border-white/10"
        />
      </motion.div>

      <div className="flex flex-col gap-4 sm:gap-6 md:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
        >
          <ColorControl
            id="primary-color"
            label="Primary Color"
            value={primaryColor}
            onChange={setPrimaryColor}
          />
          <ColorControl
            id="secondary-color"
            label="Secondary Color"
            value={secondaryColor}
            onChange={setSecondaryColor}
            onClear={() => setSecondaryColor(undefined)}
          />
          <ColorControl
            id="accent-color"
            label="Accent Color"
            value={accentColor}
            onChange={setAccentColor}
            onClear={() => setAccentColor(undefined)}
          />
          <ThemeModeSelector value={themeMode} onChange={setThemeMode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
          className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-2 ring-foreground/15 sm:p-5"
        >
          <div>
            <h2 className="font-heading text-sm font-medium">Copy Prompt</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The full prompt is hidden. Your colors, theme mode, intent, and
              tool mode are used to build a tailored prompt server-side,
              copied straight to your clipboard — never shown on screen.
            </p>
          </div>
          <PromptIntentSelector
            value={promptIntent}
            onChange={setPromptIntent}
          />
          <ToolModeSelector value={toolMode} onChange={setToolMode} />
          <CopyPromptButton
            slug={prompt.slug}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            themeMode={themeMode}
            promptIntent={promptIntent}
            toolMode={toolMode}
          />
          <QualityChecklist />
        </motion.div>
      </div>
    </div>
  );
}
