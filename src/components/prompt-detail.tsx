"use client";

import { useState } from "react";
import { PromptPreview } from "@/components/prompt-preview";
import { ColorControl } from "@/components/color-control";
import { CopyPromptButton } from "@/components/copy-prompt-button";
import type { PromptTheme } from "@/lib/prompts";

type PromptDetailData = Pick<
  PromptTheme,
  "slug" | "preview" | "defaultPrimaryColor"
>;

export function PromptDetail({ prompt }: { prompt: PromptDetailData }) {
  const [primaryColor, setPrimaryColor] = useState(prompt.defaultPrimaryColor);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
      <div className="md:col-span-3">
        <PromptPreview
          preview={prompt.preview}
          primaryColor={primaryColor}
          className="aspect-video w-full rounded-xl border border-white/10"
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 md:col-span-2">
        <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
          <ColorControl value={primaryColor} onChange={setPrimaryColor} />
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-2 ring-foreground/15 sm:p-5">
          <div>
            <h2 className="font-heading text-sm font-medium">Copy Prompt</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The full prompt is hidden. Your selected color is injected into
              the template and copied to your clipboard — never shown on
              screen.
            </p>
          </div>
          <CopyPromptButton slug={prompt.slug} primaryColor={primaryColor} />
        </div>
      </div>
    </div>
  );
}
