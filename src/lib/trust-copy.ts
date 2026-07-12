/**
 * Trust copy answering the two questions early users asked most:
 * "will the same prompt produce the same page every time?" and
 * "will Retheme Mode delete my existing code?"
 *
 * Deliberately honest, not reassuring. AI tools are non-deterministic and
 * can make mistakes; claiming otherwise would be the fastest way to lose
 * the trust this copy exists to build. Phrases like "guaranteed",
 * "always identical", or "never deletes code" must never appear here —
 * `tests/trust-copy.test.ts` enforces that for English, and asserts the
 * translations keep the same shape.
 */

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_BY_LOCALE: Record<Locale, FaqItem[]> = {
  en: [
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
    {
      question: "Is the copied prompt translated into my language?",
      answer:
        "No. Changing the site language changes this website's interface only. The copied prompt stays in English, because English prompts are more token-efficient and produce more reliable results in AI UI and code tools.",
    },
  ],
  th: [
    {
      question: "ถ้ารัน prompt เดิม 10 ครั้ง จะได้หน้าเดิมทุกครั้งไหม?",
      answer:
        "ไม่เหมือนกันทุกพิกเซล เครื่องมือ AI ไม่ได้ทำงานแบบตายตัว — prompt เดิมอาจให้ระยะห่าง ข้อความ หรือรายละเอียดคอมโพเนนต์ที่ต่างกันในแต่ละครั้ง สิ่งที่ prompt ของ CopyUI ออกแบบมาให้คงที่คือ ทิศทาง ได้แก่ โครงเลย์เอาต์ ลำดับความสำคัญทางสายตา การเลือกคอมโพเนนต์ ข้อจำกัด และแนวทางสไตล์ รัน 10 ครั้งควรได้โครงสร้างแบบเดียวกัน แต่พิกเซลจะต่างกันไป",
    },
    {
      question: "ทำอย่างไรให้ผลลัพธ์สม่ำเสมอมากขึ้น?",
      answer:
        "ตั้งค่าตัวเลือกให้คงเดิม และใช้เครื่องมือเป้าหมายเดิม การเปลี่ยนโหมดธีม เลย์เอาต์ หรือโหมดเครื่องมือ จะเปลี่ยน prompt ทำให้ผลลัพธ์เปลี่ยนตาม ถ้าใช้ prompt เดิม เครื่องมือเดิม และตัวเลือกเดิม โดยทั่วไปจะได้ทิศทางเดียวกัน",
    },
    {
      question: "โหมดเปลี่ยนธีมจะลบโค้ดเดิมของฉันไหม?",
      answer:
        "โหมดเปลี่ยนธีมถูกออกแบบมาให้คง route, ตรรกะ, state, การเรียก API, event handler และพฤติกรรมเดิมไว้ และเปลี่ยนเฉพาะสไตล์ที่มองเห็น แต่มันก็ยังเป็นเครื่องมือ AI และ AI ยังผิดพลาดได้ ควร commit หรือแยก branch ก่อนให้ AI แก้ไฟล์ และตรวจสอบ diff ก่อนยอมรับการเปลี่ยนแปลงเสมอ นั่นคือเกราะป้องกันจริง ๆ ของคุณ ไม่ใช่ถ้อยคำใน prompt ของเรา",
    },
    {
      question: "ควรใช้รูปแบบการทำงานแบบไหนกับโปรเจกต์เดิม?",
      answer:
        "ถ้าโค้ดเบสใหญ่หรือมีความเสี่ยง ให้เลือก 'บอกวิธีเท่านั้น' เครื่องมือจะอธิบายการเปลี่ยนแปลงและคุณลงมือเอง เลือก 'แก้ไขไฟล์ให้เลย' เฉพาะเมื่อคุณสบายใจที่จะให้เครื่องมือแก้ไฟล์ และมี commit ที่สะอาดรองรับแล้ว",
    },
    {
      question: "prompt ที่คัดลอกจะถูกแปลเป็นภาษาของฉันไหม?",
      answer:
        "ไม่ การเปลี่ยนภาษาเว็บไซต์จะเปลี่ยนเฉพาะหน้าตาของเว็บนี้เท่านั้น prompt ที่คัดลอกจะยังเป็นภาษาอังกฤษ เพราะ prompt ภาษาอังกฤษประหยัด token มากกว่า และให้ผลลัพธ์ที่เชื่อถือได้มากกว่าในเครื่องมือ AI",
    },
  ],
  "zh-CN": [
    {
      question: "同一个提示词运行 10 次，会得到完全相同的页面吗？",
      answer:
        "不会做到像素级一致。AI 界面工具并非确定性的——同一个提示词每次运行可能产生不同的间距、文案或组件细节。CopyUI 的提示词旨在稳定的是「方向」：布局意图、视觉层级、组件选择、约束条件与风格指引。运行十次在结构上应当落在同一处，但具体像素会有差异。",
    },
    {
      question: "怎样让结果更一致？",
      answer:
        "保持选项不变，并使用同一个目标工具。更改主题模式、布局预设或工具模式都会改变提示词，结果自然随之漂移。相同提示词 + 相同工具 + 相同选项，通常会得到相同的方向。",
    },
    {
      question: "换主题模式会删除我现有的代码吗？",
      answer:
        "换主题模式旨在保留你现有的路由、逻辑、状态、API 调用、事件处理与行为，只改变视觉样式。但它仍然是 AI 工具，而 AI 会犯错。在让 AI 修改之前先提交或新建分支，并在接受改动前审查 diff——这才是你真正的安全网，而不是我们的提示词措辞。",
    },
    {
      question: "在已有项目上该选择哪种执行方式？",
      answer:
        "代码库较大或风险较高时，请选择「仅给出说明」：工具解释改动，由你自己动手。只有当你愿意让工具直接编辑文件、且已有干净的提交时，才选择「直接修改」。",
    },
    {
      question: "复制的提示词会翻译成我的语言吗？",
      answer:
        "不会。切换站点语言只会改变本网站的界面。复制的提示词仍为英文，因为英文提示词更节省 token，并且在 AI 界面与代码工具中结果更可靠。",
    },
  ],
};

const RETHEME_TITLE_BY_LOCALE: Record<Locale, string> = {
  en: "Before you apply a retheme",
  th: "ก่อนเปลี่ยนธีม",
  "zh-CN": "在应用换主题之前",
};

const RETHEME_POINTS_BY_LOCALE: Record<Locale, string[]> = {
  en: [
    "This prompt is designed to preserve your routes, logic, state, API calls, event handlers, and behavior — and to change visual styling only.",
    "AI tools can still make mistakes. Commit or branch first, then review the diff before accepting the changes.",
    "On a large or risky project, pick Instructions Only. Pick Apply Directly only when you are comfortable with the tool editing files.",
  ],
  th: [
    "prompt นี้ออกแบบมาให้คง route, ตรรกะ, state, การเรียก API, event handler และพฤติกรรมเดิมไว้ และเปลี่ยนเฉพาะสไตล์ที่มองเห็นเท่านั้น",
    "AI ยังผิดพลาดได้ ควร commit หรือแยก branch ก่อน แล้วตรวจสอบ diff ก่อนยอมรับการเปลี่ยนแปลง",
    "ถ้าโปรเจกต์ใหญ่หรือมีความเสี่ยง ให้เลือก 'บอกวิธีเท่านั้น' เลือก 'แก้ไขไฟล์ให้เลย' เฉพาะเมื่อคุณสบายใจที่จะให้เครื่องมือแก้ไฟล์",
  ],
  "zh-CN": [
    "该提示词旨在保留你的路由、逻辑、状态、API 调用、事件处理与行为，仅改变视觉样式。",
    "AI 仍会犯错。请先提交或新建分支，并在接受改动前审查 diff。",
    "项目较大或风险较高时，请选择「仅给出说明」。只有当你愿意让工具直接编辑文件时，才选择「直接修改」。",
  ],
};

export function getTrustFaq(locale: Locale = DEFAULT_LOCALE): FaqItem[] {
  return FAQ_BY_LOCALE[locale] ?? FAQ_BY_LOCALE.en;
}

export function getRethemeSafetyTitle(locale: Locale = DEFAULT_LOCALE): string {
  return RETHEME_TITLE_BY_LOCALE[locale] ?? RETHEME_TITLE_BY_LOCALE.en;
}

export function getRethemeSafetyPoints(
  locale: Locale = DEFAULT_LOCALE,
): string[] {
  return RETHEME_POINTS_BY_LOCALE[locale] ?? RETHEME_POINTS_BY_LOCALE.en;
}

/** English source copy — what the honesty guard in tests runs against. */
export const TRUST_FAQ = FAQ_BY_LOCALE.en;
export const RETHEME_SAFETY_TITLE = RETHEME_TITLE_BY_LOCALE.en;
export const RETHEME_SAFETY_POINTS = RETHEME_POINTS_BY_LOCALE.en;
