# CopyUI - Prompt Marketplace MVP

## Project Overview
CopyUI is a web-based MVP platform where users can discover, customize, and copy production-ready UI prompts to use in AI tools like v0.dev, Cursor, or GenVibe. The focus is on a premium visual experience and seamless copying mechanism.

## Tech Stack
- **Framework:** React (Next.js)
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Animations:** Framer Motion

## Core AI Agent Instructions
When writing or modifying code for this project, you must adhere to the following rules:

1. **Code Style & Structure:**
   - Use TypeScript and functional React components.
   - Strictly use Tailwind CSS for styling. Do not write custom CSS unless absolutely necessary.
   - Prioritize using existing `shadcn/ui` components before building custom ones.

2. **UI/UX Guidelines:**
   - The design must be premium, modern, and default to Dark Mode.
   - Implement smooth micro-interactions (e.g., hover effects on cards, click animations on the Copy button).

3. **Core MVP Features (Focus Areas):**
   - **Gallery Page:** A responsive grid showing UI theme cards (Thumbnail, Title, Tags).
   - **Detail Page:** Must include a visual preview, a color-picker for customization, and a prominent "Copy Prompt" button.
   - **Copy Mechanism:** The prompt text should be hidden from the UI. When the user clicks "Copy", dynamically insert their selected variables (e.g., Primary Color) into the prompt template and copy it to the clipboard.

## 🚨 Token Efficiency & Memory Rules
- **Do not scan the entire repository unprompted.** Read only the specific files necessary for the current task.
- Before proposing complex architectural changes, outline the plan briefly and ask for confirmation.
- Write modular code to keep file sizes small, which helps optimize token usage and caching.

## RTK Token Saving Rules
- Prefer RTK-wrapped commands for noisy repository inspection:
  - `rtk tree`
  - `rtk read <file>`
  - `rtk rg "<term>" .`
  - `rtk git diff`
  - `rtk npm test`
  - `rtk npm run build`
- Do not use raw `tree`, broad `cat`, or large unfiltered logs unless necessary.
- If RTK output is insufficient for a precise bug fix, read only the exact relevant file or function in full.
- After each task, check `rtk gain` to confirm actual savings.

## Token Budget Rules

Default to small scoped tasks.

Before reading files, identify the minimum files needed. Do not scan the whole repo. Do not read `wiki/raw`, `.next`, `node_modules`, build output, generated files, or unrelated tests unless explicitly needed.

Use RTK for noisy commands:
- `rtk tree`
- `rtk read <file>`
- `rtk rg "<term>" .`
- `rtk git diff`
- `rtk npm test`
- `rtk npm run lint`
- `rtk npm run build`

For small UI/code changes:
- Do not update the wiki.
- Do not read all wiki pages.
- Do not run full build unless the task touches routing, metadata, API routes, or production behavior.
- Prefer editing only 1–3 files.

For medium changes:
- Update only the most relevant wiki page or `wiki/log.md`.

For large feature or architecture changes:
- Read `wiki/index.md` and only relevant wiki pages.
- Update relevant wiki pages concisely.
- Record decisions, not full code or logs.

Validation rules:
- Pure function change: run `rtk npm test`.
- Small component/UI change: run `rtk npm run lint`.
- Route/API/metadata/security change: run `rtk npm test`, `rtk npm run lint`, and `rtk npm run build`.

After each final response, include:
- files changed
- commands run
- whether wiki was updated
- next smallest useful task