import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, getPromptBySlug } from "@/lib/prompts";
import { applyToolMode, isToolMode } from "@/lib/tool-modes";
import {
  applyPromptOptions,
  isActionStyle,
  isLayoutPreset,
  isPromptIntent,
  isThemeMode,
} from "@/lib/prompt-options";

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function hexOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" && HEX_COLOR.test(value)
    ? value
    : undefined;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const primaryColor =
    hexOrUndefined(body.primaryColor) ?? prompt.defaultPrimaryColor;
  const secondaryColor = hexOrUndefined(body.secondaryColor);
  const accentColor = hexOrUndefined(body.accentColor);
  const toolMode = isToolMode(body.toolMode) ? body.toolMode : undefined;
  const themeMode = isThemeMode(body.themeMode) ? body.themeMode : undefined;
  const promptIntent = isPromptIntent(body.promptIntent)
    ? body.promptIntent
    : "build";
  const actionStyle = isActionStyle(body.actionStyle)
    ? body.actionStyle
    : undefined;
  const layoutPreset = isLayoutPreset(body.layoutPreset)
    ? body.layoutPreset
    : "auto";

  const base = buildPrompt(prompt.promptTemplate, { primaryColor });
  const withOptions = applyPromptOptions(base, {
    secondaryColor,
    accentColor,
    themeMode,
    promptIntent,
    actionStyle,
    layoutPreset,
  });
  const text = applyToolMode(withOptions, toolMode);

  return NextResponse.json({
    text,
    toolMode: toolMode ?? null,
    themeMode: themeMode ?? null,
    promptIntent,
    actionStyle: actionStyle ?? null,
    layoutPreset,
  });
}
