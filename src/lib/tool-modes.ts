export type ToolMode =
  | "v0"
  | "cursor"
  | "genvibe"
  | "vscode"
  | "claude-code"
  | "windsurf";

export const TOOL_MODES: { value: ToolMode; label: string }[] = [
  { value: "v0", label: "v0.dev" },
  { value: "cursor", label: "Cursor" },
  { value: "vscode", label: "VS Code / Copilot" },
  { value: "claude-code", label: "Claude Code" },
  { value: "windsurf", label: "Windsurf" },
  { value: "genvibe", label: "GenVibe" },
];

export function isToolMode(value: unknown): value is ToolMode {
  return TOOL_MODES.some((m) => m.value === value);
}

export function getToolModeLabel(mode: ToolMode): string {
  return TOOL_MODES.find((m) => m.value === mode)?.label ?? mode;
}

/** Short caption telling the user what to do with the copied prompt. */
const TOOL_MODE_CAPTION: Record<ToolMode, string> = {
  v0: "Paste this into a new v0 chat.",
  cursor: "Paste this into Cursor Chat or an implementation prompt.",
  genvibe: "Paste this into GenVibe for visual direction.",
  vscode: "Paste this into Copilot Chat in VS Code.",
  "claude-code": "Paste this into a Claude Code session in your repo.",
  windsurf: "Paste this into Windsurf's Cascade chat.",
};

export function getToolModeCaption(mode: ToolMode): string {
  return TOOL_MODE_CAPTION[mode];
}

/**
 * Server-side-only framing prepended to a theme's base prompt so the same
 * hidden template produces output tuned for the selected AI tool, without
 * needing a separate template per tool per theme.
 */
const TOOL_MODE_FRAMING: Record<ToolMode, string> = {
  v0: `Target tool: v0.dev. Optimize this brief for a visual UI generation model — prioritize layout composition, component selection (prefer shadcn/ui primitives where applicable), Tailwind utility classes, and responsive breakpoints. Populate every element with realistic sample content (real-sounding names, numbers, and copy, never Lorem Ipsum) so the generated screen looks production-ready in one pass. Favor a single polished, working visual output over exhaustive code comments, file-splitting guidance, or backend concerns, and do not add sections or components beyond what's described below.`,
  cursor: `Target tool: Cursor. Optimize this brief for an AI coding agent working inside a real codebase — propose a concrete file/component structure (e.g. App Router file paths, component boundaries, prop and state types), idiomatic React/Next.js and TypeScript patterns, and brief code-quality notes (naming, reusability, avoiding prop drilling, client vs. server component boundaries where relevant) alongside the UI spec below. Call out which interactive states (loading, empty, error, disabled) need real logic versus which can be static markup for now. Follow the execution mode stated below if one is given: when it says to apply changes, edit the workspace files directly rather than only giving advice; only respond with guidance alone when instructions-only is requested.`,
  genvibe: `Target tool: GenVibe. Optimize this brief for a creative-direction-focused generator — lead with the interaction texture (motion, easing curves, hover/press feedback and their approximate duration), visual polish details (depth, light, material, spacing rhythm), and the emotional tone the design should evoke, in addition to the structural spec below. Prefer a small number of deliberate, well-timed motion moments over animating every element.`,
  vscode: `Target tool: VS Code with GitHub Copilot (Copilot Chat or inline). Optimize this brief for an editor-embedded coding assistant working in an open workspace — reference files by path, propose concrete per-file edits (exact components, class names, token values), and keep each suggested change small enough to review in a diff. Follow the execution mode stated below if one is given (apply edits directly vs. instructions only).`,
  "claude-code": `Target tool: Claude Code. Optimize this brief for an agentic CLI coding assistant that can read, edit, and run the codebase directly — favor concrete, verifiable steps: inspect the relevant files first, make file-level edits, and state what to check afterward (build passes, affected pages render). Follow the execution mode stated below if one is given (apply edits directly vs. instructions only).`,
  windsurf: `Target tool: Windsurf. Optimize this brief for an agentic AI IDE (Cascade) working in a real workspace — ground changes in the existing files, apply edits incrementally with brief verification between steps, and reference files/components by path. Follow the execution mode stated below if one is given (apply edits directly vs. instructions only).`,
};

export function applyToolMode(basePrompt: string, toolMode?: string): string {
  const mode = isToolMode(toolMode) ? toolMode : undefined;
  if (!mode) return basePrompt;
  return `${TOOL_MODE_FRAMING[mode]}\n\n${basePrompt}`;
}
