import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, getPromptBySlug } from "@/lib/prompts";
import { applyToolMode, isToolMode } from "@/lib/tool-modes";

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

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
    typeof body.primaryColor === "string" && HEX_COLOR.test(body.primaryColor)
      ? body.primaryColor
      : prompt.defaultPrimaryColor;
  const toolMode = isToolMode(body.toolMode) ? body.toolMode : undefined;

  const base = buildPrompt(prompt.promptTemplate, { primaryColor });
  const text = applyToolMode(base, toolMode);

  return NextResponse.json({ text, toolMode: toolMode ?? null });
}
