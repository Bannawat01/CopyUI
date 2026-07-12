/**
 * Trust copy answering the two questions early users asked most:
 * "will the same prompt produce the same page every time?" and
 * "will Retheme Mode delete my existing code?"
 *
 * Deliberately honest, not reassuring. AI tools are non-deterministic and
 * can make mistakes; claiming otherwise would be the fastest way to lose
 * the trust this copy exists to build. Phrases like "guaranteed",
 * "always identical", or "never deletes code" must never appear here —
 * `tests/trust-copy.test.ts` enforces that.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export const TRUST_FAQ: FaqItem[] = [
  {
    question: "If I run the same prompt 10 times, do I get the same page?",
    answer:
      "Not pixel-for-pixel, no. AI UI tools are not deterministic — the same prompt can produce different spacing, wording, or component details on each run. What CopyUI prompts are designed to hold steady is the direction: the layout intent, the visual hierarchy, the component choices, the constraints, and the style guidance. Ten runs should land in the same place structurally, but the exact pixels will vary.",
  },
  {
    question: "How do I get more consistent results?",
    answer:
      "Keep your options stable and reuse the same target tool. Changing the theme mode, layout preset, or tool mode changes the prompt, so results drift. Same prompt plus same tool plus same options usually gives you the same direction — that is the consistency worth aiming for.",
  },
  {
    question: "Will Retheme Mode delete my existing code?",
    answer:
      "Retheme Mode is designed to preserve your existing routes, logic, state, API calls, event handlers, and behavior, and to change visual styling only. But it is still an AI tool, and AI tools can make mistakes. Commit or branch before you apply any AI edit, and review the diff before you accept it — that is your real safety net, not our prompt wording.",
  },
  {
    question: "Which action style should I use on an existing project?",
    answer:
      "Use Instructions Only for a large or risky codebase: the tool explains the changes and you apply them yourself. Use Apply Directly only when you are comfortable with the tool editing files, and only with a clean commit behind you.",
  },
];

/** Shown in the detail panel when Retheme Mode is selected. */
export const RETHEME_SAFETY_TITLE = "Before you apply a retheme";

export const RETHEME_SAFETY_POINTS: string[] = [
  "This prompt is designed to preserve your routes, logic, state, API calls, event handlers, and behavior — and to change visual styling only.",
  "AI tools can still make mistakes. Commit or branch first, then review the diff before accepting the changes.",
  "On a large or risky project, pick Instructions Only. Pick Apply Directly only when you are comfortable with the tool editing files.",
];
