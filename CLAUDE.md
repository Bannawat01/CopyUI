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