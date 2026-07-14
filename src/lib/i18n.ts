/**
 * Lightweight UI localization — a plain dictionary, no i18n framework.
 *
 * SCOPE, and it matters: this translates the *website UI only*. The hidden
 * promptTemplate, the server-built prompt, and everything the API returns
 * stay in English no matter what locale is selected. English prompts are
 * more token-efficient and more reliable in AI UI/code tools, so the copied
 * prompt is deliberately NOT localized. `tests/i18n.test.ts` enforces that
 * the built prompt is byte-identical across locales.
 *
 * English is the source language. Missing keys fall back to English rather
 * than rendering a raw key.
 */

export const LOCALES = ["en", "th", "zh-CN"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Native names — a language picker that names languages in a language you
 *  can't read is useless. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  "zh-CN": "中文",
};

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

const en = {
  // Header / language
  "lang.label": "Language",
  "lang.note":
    "Prompt output stays in English for better AI-tool reliability and token efficiency.",

  // Website appearance (separate from the prompt builder's Theme Mode)
  "appearance.label": "Appearance",
  "appearance.dark": "Dark",
  "appearance.light": "Light",
  "appearance.system": "System",
  "appearance.note":
    "Changes only this website's look. It does not change the Theme Mode inside a copied prompt.",

  // Homepage
  "home.badge": "Prompt Marketplace",
  "home.headline": "Production-ready UI prompts for {tools}",
  "home.subhead":
    "Pick a UI theme, set your brand color, and copy a prompt tuned for your AI tool — no prompt writing required.",
  "home.howItWorks": "How it works",
  "home.step1.title": "Pick a UI prompt",
  "home.step1.desc":
    "Browse 18 production-ready UI themes, from dashboards to landing pages.",
  "home.step2.title": "Customize it",
  "home.step2.desc": "Set your brand color and choose a tool mode — {tools}.",
  "home.step3.title": "Copy and paste",
  "home.step3.desc":
    "One click builds a tailored prompt and copies it straight to your clipboard.",

  // Gallery
  "gallery.heading": "Browse Templates",
  "gallery.searchPlaceholder": "Search templates...",
  "gallery.searchAria": "Search prompts by title, tag, or keyword",
  "gallery.sortAria": "Sort templates",
  "gallery.sort.mostCopied": "Most Copied",
  "gallery.sort.newest": "Newest",
  "gallery.sort.az": "A-Z",
  "gallery.count": "{shown} of {total}",
  "gallery.filterAria": "Filter by category",
  "gallery.empty": "No templates to show.",
  "gallery.emptyQuery": "No templates match “{query}”.",
  "gallery.clearFilters": "Clear filters",

  // Categories (fall back to the raw English name if a key is missing)
  "category.All": "All",
  "category.Landing": "Landing",
  "category.Dashboard": "Dashboard",
  "category.SaaS": "SaaS",
  "category.Ecommerce": "Ecommerce",
  "category.AI": "AI",
  "category.Portfolio": "Portfolio",
  "category.Docs": "Docs",

  // Detail page
  "detail.back": "Back to gallery",
  "detail.panelTitle": "Customize & Copy",
  "detail.panelNote":
    "The full prompt stays hidden — your choices below are built into a tailored prompt server-side and copied to your clipboard.",
  "detail.advanced": "Advanced theme & layout options",
  "detail.primaryColor": "Primary Color",
  "detail.secondaryColor": "Secondary Color",
  "detail.accentColor": "Accent Color",

  // Selectors
  "intent.label": "Prompt Intent",
  "intent.build.label": "Build new UI",
  "intent.build.desc": "Generate a fresh interface from this prompt.",
  "intent.retheme.label": "Retheme existing UI",
  "intent.retheme.desc":
    "Apply this style to an existing frontend while preserving logic and behavior.",
  "theme.label": "Theme Mode",
  "theme.dark": "Dark",
  "theme.light": "Light",
  "theme.system": "System",
  "theme.mono": "Mono",
  "action.label": "Action Style",
  "action.apply.label": "Apply Directly",
  "action.apply.desc": "Ask the tool to edit the files itself.",
  "action.instruct.label": "Instructions Only",
  "action.instruct.desc": "Ask the tool to explain the changes without editing.",
  "tool.label": "Tool Mode",
  "layout.label": "Layout Preset",
  "layout.advisory":
    "In Retheme mode this is advisory only — your existing page structure is preserved.",
  "layout.recommended": "Recommended for this theme",
  "layout.other": "Other layouts",

  // Copy button
  "copy.idle": "Copy for {tool}",
  "copy.copying": "Copying...",
  "copy.copied": "Copied!",
  "copy.failed": "Copy failed",
  "copy.building": "Building a {tool} prompt…",
  "copy.success": "Copied — tailored for {tool}",
  "copy.error": "Couldn't copy the prompt. Please try again.",

  // Generated Examples
  "faq.subhead":
    "Straight answers about consistency and safety — including what these prompts can't promise.",
  "examples.schematic": "Schematic — not a screenshot",
  "examples.homeHeading": "What these prompts can create",
  "examples.homeSubhead":
    "The direction each prompt is designed to produce. Not screenshots — AI output varies by tool and by run.",
  "examples.detailHeading": "What this prompt can generate",
  "examples.expectedDirection": "Expected direction",
  "examples.typicalStructure": "Typical structure",
  "examples.keyElements": "Key UI elements",
  "examples.bestFor": "Best for",
  "examples.recommendedTools": "Works well in",
  "examples.visualNotes": "Visual direction",
  "examples.heads-up": "Heads up",
  "examples.varyNote":
    "This describes the intended direction, not a fixed result. Output may vary by tool and by run. The copied prompt stays in English.",

  // Feedback links (shared by the footer and the homepage growth section)
  "feedback.giveFeedback.label": "Give feedback",
  "feedback.giveFeedback.description": "Ideas for the site, a prompt, or the copy experience.",
  "feedback.requestPrompt.label": "Request a prompt",
  "feedback.requestPrompt.description": "Suggest a UI theme you'd like added to the gallery.",
  "feedback.reportOutput.label": "Report confusing output",
  "feedback.reportOutput.description": "A copied prompt produced unclear or poor results in your AI tool.",

  // Homepage "help us improve" / share section
  "growth.heading": "Help improve CopyUI",
  "growth.subhead":
    "CopyUI is early. Your feedback shapes what gets built next — a confusing result or a missing theme is worth reporting.",
  "growth.shareHeading": "Share CopyUI",
  "growth.shareText":
    "CopyUI is a prompt marketplace for generating and retheming UI with {tools}.",
  "growth.shareCopy": "Copy",
  "growth.shareCopied": "Copied!",

  // Footer
  "footer.heading": "Missing a prompt, or did one fall flat?",
  "footer.blurb":
    "CopyUI is built in the open. Feedback goes straight to GitHub Issues — no account setup beyond GitHub, no forms.",
  "footer.tagline": "CopyUI — production-ready UI prompts for {tools}.",
  "footer.source": "View source on GitHub",
} as const;

export type TranslationKey = keyof typeof en;

const th: Partial<Record<TranslationKey, string>> = {
  "lang.label": "ภาษา",
  "lang.note":
    "เปลี่ยนเฉพาะภาษาของเว็บไซต์ Prompt ที่คัดลอกจะยังเป็นภาษาอังกฤษ เพื่อให้เครื่องมือ AI ทำงานได้เสถียรกว่าและประหยัด token",

  "appearance.label": "รูปแบบเว็บไซต์",
  "appearance.dark": "มืด",
  "appearance.light": "สว่าง",
  "appearance.system": "ตามระบบ",
  "appearance.note":
    "เปลี่ยนเฉพาะหน้าตาเว็บไซต์นี้ ไม่มีผลต่อ Theme Mode ภายใน prompt ที่คัดลอก",

  "home.badge": "แหล่งรวม Prompt",
  "home.headline": "Prompt UI พร้อมใช้งานจริงสำหรับ {tools}",
  "home.subhead":
    "เลือกธีม UI ตั้งสีแบรนด์ แล้วคัดลอก prompt ที่ปรับมาให้เข้ากับเครื่องมือ AI ของคุณ — ไม่ต้องเขียน prompt เอง",
  "home.howItWorks": "วิธีใช้งาน",
  "home.step1.title": "เลือก Prompt UI",
  "home.step1.desc":
    "เลือกจาก 18 ธีม UI พร้อมใช้งานจริง ตั้งแต่แดชบอร์ดไปจนถึงหน้า Landing",
  "home.step2.title": "ปรับแต่ง",
  "home.step2.desc": "ตั้งค่าสีแบรนด์และเลือกโหมดเครื่องมือ — {tools}",
  "home.step3.title": "คัดลอกแล้ววาง",
  "home.step3.desc":
    "คลิกเดียวเพื่อสร้าง prompt ที่ปรับแต่งแล้ว และคัดลอกไปยังคลิปบอร์ดทันที",

  "gallery.heading": "เลือกดูเทมเพลต",
  "gallery.searchPlaceholder": "ค้นหาเทมเพลต...",
  "gallery.searchAria": "ค้นหา prompt จากชื่อ แท็ก หรือคำสำคัญ",
  "gallery.sortAria": "เรียงลำดับเทมเพลต",
  "gallery.sort.mostCopied": "คัดลอกมากที่สุด",
  "gallery.sort.newest": "ใหม่ล่าสุด",
  "gallery.sort.az": "A-Z",
  "gallery.count": "{shown} จาก {total}",
  "gallery.filterAria": "กรองตามหมวดหมู่",
  "gallery.empty": "ไม่มีเทมเพลตที่จะแสดง",
  "gallery.emptyQuery": "ไม่พบเทมเพลตที่ตรงกับ “{query}”",
  "gallery.clearFilters": "ล้างตัวกรอง",

  "category.All": "ทั้งหมด",
  "category.Landing": "Landing",
  "category.Dashboard": "แดชบอร์ด",
  "category.SaaS": "SaaS",
  "category.Ecommerce": "อีคอมเมิร์ซ",
  "category.AI": "AI",
  "category.Portfolio": "พอร์ตโฟลิโอ",
  "category.Docs": "เอกสาร",

  "detail.back": "กลับไปหน้ารวม",
  "detail.panelTitle": "ปรับแต่งและคัดลอก",
  "detail.panelNote":
    "Prompt ฉบับเต็มถูกซ่อนไว้ — ตัวเลือกด้านล่างจะถูกนำไปสร้างเป็น prompt เฉพาะของคุณบนเซิร์ฟเวอร์ แล้วคัดลอกลงคลิปบอร์ด",
  "detail.advanced": "ตัวเลือกธีมและเลย์เอาต์ขั้นสูง",
  "detail.primaryColor": "สีหลัก",
  "detail.secondaryColor": "สีรอง",
  "detail.accentColor": "สีเน้น",

  "intent.label": "เป้าหมายของ Prompt",
  "intent.build.label": "สร้าง UI ใหม่",
  "intent.build.desc": "สร้างหน้าจอใหม่ทั้งหมดจาก prompt นี้",
  "intent.retheme.label": "Retheme UI เดิม",
  "intent.retheme.desc":
    "นำสไตล์นี้ไปใช้กับ frontend เดิม โดยคงตรรกะและการทำงานเดิมไว้",
  "theme.label": "โหมดธีม",
  "theme.dark": "มืด",
  "theme.light": "สว่าง",
  "theme.system": "ตามระบบ",
  "theme.mono": "ขาวดำ",
  "action.label": "รูปแบบการทำงาน",
  "action.apply.label": "แก้ไขไฟล์เลย",
  "action.apply.desc": "ให้เครื่องมือแก้ไขไฟล์ให้อัตโนมัติ",
  "action.instruct.label": "บอกวิธีเท่านั้น",
  "action.instruct.desc": "ให้เครื่องมืออธิบายสิ่งที่ต้องแก้ โดยไม่แตะไฟล์",
  "tool.label": "โหมดเครื่องมือ",
  "layout.label": "เลย์เอาต์สำเร็จรูป",
  "layout.advisory":
    "ในโหมด Retheme นี่เป็นเพียงคำแนะนำ — โครงสร้างหน้าเดิมของคุณจะถูกคงไว้",
  "layout.recommended": "แนะนำสำหรับธีมนี้",
  "layout.other": "เลย์เอาต์อื่น ๆ",

  "copy.idle": "คัดลอกสำหรับ {tool}",
  "copy.copying": "กำลังคัดลอก...",
  "copy.copied": "คัดลอกแล้ว!",
  "copy.failed": "คัดลอกไม่สำเร็จ",
  "copy.building": "กำลังสร้าง prompt สำหรับ {tool}…",
  "copy.success": "คัดลอกแล้ว — ปรับแต่งสำหรับ {tool}",
  "copy.error": "คัดลอก prompt ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",

  "faq.subhead":
    "คำตอบตรง ๆ เรื่องความสม่ำเสมอและความปลอดภัย รวมถึงสิ่งที่ prompt เหล่านี้รับประกันไม่ได้",
  "examples.schematic": "ภาพร่างโครงสร้าง ไม่ใช่ภาพหน้าจอจริง",
  "examples.homeHeading": "prompt เหล่านี้สร้างอะไรได้บ้าง",
  "examples.homeSubhead":
    "ทิศทางที่ prompt แต่ละตัวออกแบบมาให้ได้ ไม่ใช่ภาพหน้าจอจริง — ผลลัพธ์ AI ต่างกันไปตามเครื่องมือและแต่ละครั้งที่รัน",
  "examples.detailHeading": "prompt นี้สร้างอะไรได้",
  "examples.expectedDirection": "ทิศทางที่คาดหวัง",
  "examples.typicalStructure": "โครงสร้างโดยทั่วไป",
  "examples.keyElements": "องค์ประกอบ UI หลัก",
  "examples.bestFor": "เหมาะกับ",
  "examples.recommendedTools": "ใช้ได้ดีกับ",
  "examples.visualNotes": "แนวทางด้านภาพ",
  "examples.heads-up": "ควรรู้ไว้",
  "examples.varyNote":
    "นี่คือทิศทางที่ตั้งใจไว้ ไม่ใช่ผลลัพธ์ตายตัว ผลอาจต่างกันไปตามเครื่องมือและแต่ละครั้งที่รัน และ prompt ที่คัดลอกจะยังเป็นภาษาอังกฤษ",

  "feedback.giveFeedback.label": "ให้ความคิดเห็น",
  "feedback.giveFeedback.description": "ไอเดียเกี่ยวกับเว็บไซต์ prompt หรือประสบการณ์การคัดลอก",
  "feedback.requestPrompt.label": "ขอ Prompt ใหม่",
  "feedback.requestPrompt.description": "แนะนำธีม UI ที่อยากให้เพิ่มในแกลเลอรี",
  "feedback.reportOutput.label": "แจ้งผลลัพธ์ที่สับสน",
  "feedback.reportOutput.description": "Prompt ที่คัดลอกให้ผลลัพธ์ไม่ชัดเจนหรือไม่ดีในเครื่องมือ AI ของคุณ",

  "growth.heading": "ช่วยพัฒนา CopyUI",
  "growth.subhead":
    "CopyUI ยังอยู่ในช่วงเริ่มต้น ความคิดเห็นของคุณช่วยกำหนดสิ่งที่จะพัฒนาต่อไป — ผลลัพธ์ที่สับสนหรือธีมที่ขาดหายไปคุ้มค่าที่จะแจ้งให้เราทราบ",
  "growth.shareHeading": "แชร์ CopyUI",
  "growth.shareText":
    "CopyUI คือแหล่งรวม prompt สำหรับสร้างและ Retheme UI ด้วย {tools}",
  "growth.shareCopy": "คัดลอก",
  "growth.shareCopied": "คัดลอกแล้ว!",

  "footer.heading": "ไม่มี prompt ที่ต้องการ หรือผลลัพธ์ไม่ดี?",
  "footer.blurb":
    "CopyUI พัฒนาแบบเปิด ความคิดเห็นของคุณจะถูกส่งไปยัง GitHub Issues โดยตรง — ไม่ต้องสมัครอะไรเพิ่ม ไม่มีแบบฟอร์ม",
  "footer.tagline": "CopyUI — prompt UI พร้อมใช้งานจริงสำหรับ {tools}",
  "footer.source": "ดูซอร์สโค้ดบน GitHub",
};

const zhCN: Partial<Record<TranslationKey, string>> = {
  "lang.label": "语言",
  "lang.note":
    "仅切换网站界面语言。复制的提示词仍为英文，以提升 AI 工具的稳定性并节省 token。",

  "appearance.label": "外观",
  "appearance.dark": "深色",
  "appearance.light": "浅色",
  "appearance.system": "跟随系统",
  "appearance.note":
    "仅改变本网站的外观，不会影响复制的提示词内部的 Theme Mode。",

  "home.badge": "提示词市场",
  "home.headline": "面向 {tools} 的生产级 UI 提示词",
  "home.subhead":
    "选择 UI 主题，设置品牌色，即可复制一份为你的 AI 工具定制的提示词 — 无需自己撰写。",
  "home.howItWorks": "使用方法",
  "home.step1.title": "选择 UI 提示词",
  "home.step1.desc": "浏览 18 个生产级 UI 主题，从仪表盘到落地页。",
  "home.step2.title": "自定义",
  "home.step2.desc": "设置品牌色并选择工具模式——{tools}。",
  "home.step3.title": "复制粘贴",
  "home.step3.desc": "一键生成定制提示词，并直接复制到剪贴板。",

  "gallery.heading": "浏览模板",
  "gallery.searchPlaceholder": "搜索模板...",
  "gallery.searchAria": "按标题、标签或关键词搜索提示词",
  "gallery.sortAria": "排序模板",
  "gallery.sort.mostCopied": "复制最多",
  "gallery.sort.newest": "最新",
  "gallery.sort.az": "A-Z",
  "gallery.count": "{shown} / {total}",
  "gallery.filterAria": "按类别筛选",
  "gallery.empty": "暂无模板。",
  "gallery.emptyQuery": "没有与“{query}”匹配的模板。",
  "gallery.clearFilters": "清除筛选",

  "category.All": "全部",
  "category.Landing": "落地页",
  "category.Dashboard": "仪表盘",
  "category.SaaS": "SaaS",
  "category.Ecommerce": "电商",
  "category.AI": "AI",
  "category.Portfolio": "作品集",
  "category.Docs": "文档",

  "detail.back": "返回图库",
  "detail.panelTitle": "自定义并复制",
  "detail.panelNote":
    "完整提示词保持隐藏 — 你的选择会在服务端构建为定制提示词，并复制到剪贴板。",
  "detail.advanced": "高级主题与布局选项",
  "detail.primaryColor": "主色",
  "detail.secondaryColor": "辅助色",
  "detail.accentColor": "强调色",

  "intent.label": "提示词意图",
  "intent.build.label": "构建新界面",
  "intent.build.desc": "根据此提示词生成全新的界面。",
  "intent.retheme.label": "现有界面换主题",
  "intent.retheme.desc": "将此风格应用到现有前端，同时保留逻辑与行为。",
  "theme.label": "主题模式",
  "theme.dark": "深色",
  "theme.light": "浅色",
  "theme.system": "跟随系统",
  "theme.mono": "单色",
  "action.label": "执行方式",
  "action.apply.label": "直接修改",
  "action.apply.desc": "让工具自行编辑文件。",
  "action.instruct.label": "仅给出说明",
  "action.instruct.desc": "让工具说明要改什么，但不动文件。",
  "tool.label": "工具模式",
  "layout.label": "布局预设",
  "layout.advisory": "在换主题模式下这仅为建议——你现有的页面结构会被保留。",
  "layout.recommended": "推荐用于此主题",
  "layout.other": "其他布局",

  "copy.idle": "复制 {tool} 提示词",
  "copy.copying": "复制中...",
  "copy.copied": "已复制！",
  "copy.failed": "复制失败",
  "copy.building": "正在生成 {tool} 提示词…",
  "copy.success": "已复制 — 已为 {tool} 定制",
  "copy.error": "复制提示词失败，请重试。",

  "faq.subhead": "关于一致性与安全的直接回答 — 包括这些提示词无法承诺的部分。",
  "examples.schematic": "示意结构 — 并非截图",
  "examples.homeHeading": "这些提示词能做出什么",
  "examples.homeSubhead":
    "每个提示词旨在产出的方向。并非截图 — AI 输出会因工具和每次运行而不同。",
  "examples.detailHeading": "这个提示词能生成什么",
  "examples.expectedDirection": "预期方向",
  "examples.typicalStructure": "典型结构",
  "examples.keyElements": "关键界面元素",
  "examples.bestFor": "适用于",
  "examples.recommendedTools": "适合搭配",
  "examples.visualNotes": "视觉方向",
  "examples.heads-up": "请注意",
  "examples.varyNote":
    "这里描述的是预期方向，而非固定结果。输出会因工具和每次运行而不同。复制的提示词仍为英文。",

  "feedback.giveFeedback.label": "提供反馈",
  "feedback.giveFeedback.description": "关于网站、提示词或复制体验的想法。",
  "feedback.requestPrompt.label": "请求新提示词",
  "feedback.requestPrompt.description": "建议一个想加入图库的 UI 主题。",
  "feedback.reportOutput.label": "反馈令人困惑的输出",
  "feedback.reportOutput.description": "复制的提示词在你的 AI 工具中产生了不清晰或不理想的结果。",

  "growth.heading": "帮助改进 CopyUI",
  "growth.subhead":
    "CopyUI 尚处早期。你的反馈决定接下来要做什么——令人困惑的结果或缺失的主题都值得反馈。",
  "growth.shareHeading": "分享 CopyUI",
  "growth.shareText":
    "CopyUI 是一个提示词市场，用于通过 {tools} 生成和换主题 UI。",
  "growth.shareCopy": "复制",
  "growth.shareCopied": "已复制！",

  "footer.heading": "缺少某个提示词，或效果不理想？",
  "footer.blurb":
    "CopyUI 开源开发。反馈直接提交到 GitHub Issues — 除 GitHub 外无需注册，也没有表单。",
  "footer.tagline": "CopyUI — 面向 {tools} 的生产级 UI 提示词。",
  "footer.source": "在 GitHub 上查看源码",
};

const DICTIONARIES: Record<Locale, Partial<Record<TranslationKey, string>>> = {
  en,
  th,
  "zh-CN": zhCN,
};

/**
 * Look up a UI string, falling back to English when a locale is missing it.
 * `vars` interpolates `{name}` placeholders.
 */
export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const raw = DICTIONARIES[locale]?.[key] ?? en[key];
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Category names come from prompt data, so a missing key falls back to it. */
export function tCategory(locale: Locale, category: string): string {
  const key = `category.${category}` as TranslationKey;
  return key in en ? t(locale, key) : category;
}
