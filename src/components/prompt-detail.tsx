"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PromptPreview } from "@/components/prompt-preview";
import { ColorControl } from "@/components/color-control";
import { ToolModeSelector } from "@/components/tool-mode-selector";
import { ThemeModeSelector } from "@/components/theme-mode-selector";
import { PromptIntentSelector } from "@/components/prompt-intent-selector";
import { ActionStyleSelector } from "@/components/action-style-selector";
import { LayoutPresetSelector } from "@/components/layout-preset-selector";
import { CopyPromptButton } from "@/components/copy-prompt-button";
import { QualityChecklist } from "@/components/quality-checklist";
import { RethemeSafetyNote } from "@/components/retheme-safety-note";
import { useLocale } from "@/components/locale-provider";
import type { PromptTheme } from "@/lib/prompts";
import type { ToolMode } from "@/lib/tool-modes";
import type {
  ActionStyle,
  LayoutPreset,
  PromptIntent,
  ThemeMode,
} from "@/lib/prompt-options";

type PromptDetailData = Pick<
  PromptTheme,
  "slug" | "preview" | "defaultPrimaryColor"
>;

export function PromptDetail({ prompt }: { prompt: PromptDetailData }) {
  const { t } = useLocale();
  const [primaryColor, setPrimaryColor] = useState(prompt.defaultPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>();
  const [accentColor, setAccentColor] = useState<string | undefined>();
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [promptIntent, setPromptIntent] = useState<PromptIntent>("build");
  const [actionStyle, setActionStyle] = useState<ActionStyle>("apply");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("auto");
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
          className="aspect-video w-full rounded-xl border border-border"
        />
      </motion.div>

      {/* One consolidated panel: customize + copy without scrolling apart.
          Sticky on desktop with its own scroll if taller than the viewport. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-2 ring-foreground/15 sm:p-5 md:col-span-2 md:sticky md:top-6 md:self-start md:max-h-[calc(100vh-3rem)] md:overflow-y-auto"
      >
        <div>
          <h2 className="font-heading text-sm font-medium">
            {t("detail.panelTitle")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("detail.panelNote")}
          </p>
        </div>

        <ColorControl
          id="primary-color"
          label={t("detail.primaryColor")}
          value={primaryColor}
          onChange={setPrimaryColor}
        />

        <details className="group rounded-lg border border-border bg-fill-subtle">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
            {t("detail.advanced")}
            <ChevronDown
              className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="flex flex-col gap-4 px-3 pb-3 pt-1">
            <ColorControl
              id="secondary-color"
              label={t("detail.secondaryColor")}
              value={secondaryColor}
              onChange={setSecondaryColor}
              onClear={() => setSecondaryColor(undefined)}
            />
            <ColorControl
              id="accent-color"
              label={t("detail.accentColor")}
              value={accentColor}
              onChange={setAccentColor}
              onClear={() => setAccentColor(undefined)}
            />
            <ThemeModeSelector value={themeMode} onChange={setThemeMode} />
            <LayoutPresetSelector
              value={layoutPreset}
              onChange={setLayoutPreset}
              previewKind={prompt.preview.kind}
              advisory={promptIntent === "retheme"}
            />
          </div>
        </details>

        <PromptIntentSelector value={promptIntent} onChange={setPromptIntent} />
        {promptIntent === "retheme" && <RethemeSafetyNote />}
        <ActionStyleSelector value={actionStyle} onChange={setActionStyle} />
        <ToolModeSelector value={toolMode} onChange={setToolMode} />

        <CopyPromptButton
          slug={prompt.slug}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          themeMode={themeMode}
          promptIntent={promptIntent}
          actionStyle={actionStyle}
          layoutPreset={layoutPreset}
          toolMode={toolMode}
        />
        <QualityChecklist />
      </motion.div>
    </div>
  );
}
