# CopyUI Tool Dashboard

Dashboard for tracking tools, ideas, GitHub repos, and articles collected for the CopyUI project.

---

## Tools to Try First

| # | Tool / Topic | Purpose | Status |
|---|---|---|---|
| 1 | Obsidian Web Clipper Templates | Create structured clip templates for GitHub repos, articles, and tool notes | todo |
| 2 | Dataview | Build dashboards from clipped notes | in-use |
| 3 | Templater | Create reusable note templates such as Tool Note, Prompt Idea, UI Inspiration | todo |
| 4 | MarkItDown | Convert PDF/DOCX/PPTX/HTML files into Markdown for LLM use | todo |
| 5 | awesome-shadcn-ui | Find shadcn/ui + Tailwind UI inspiration for CopyUI | todo |

> Note: Repomix is skipped for now. Use it later after CopyUI has real app code.

---

## Raw Clips Waiting for Claude

```dataview
TABLE status, type, source_url, file.mtime AS updated
FROM "raw/clips"
WHERE project = "CopyUI" AND status = "unprocessed"
SORT file.mtime DESC
```

---

## All CopyUI Clips

```dataview
TABLE status, type, source_url, captured, file.mtime AS updated
FROM "raw/clips"
WHERE project = "CopyUI"
SORT file.mtime DESC
```

---

## Tool Notes

```dataview
TABLE status, source_url, file.mtime AS updated
FROM "raw/clips"
WHERE project = "CopyUI" AND type = "tool"
SORT file.mtime DESC
```

---

## UI Inspiration Clips

```dataview
TABLE status, source_url, file.mtime AS updated
FROM "raw/clips"
WHERE project = "CopyUI" AND type = "ui-inspiration"
SORT file.mtime DESC
```

---

## Prompt Ideas

```dataview
TABLE status, source_url, file.mtime AS updated
FROM "raw/clips"
WHERE project = "CopyUI" AND type = "prompt-idea"
SORT file.mtime DESC
```

---

# CopyUI Notes

## Useful for CopyUI

- card layouts
- prompt marketplace layouts
- detail page layouts
- copy button interactions
- pricing cards
- dark mode patterns
- premium gradients
- hover animations
- Framer Motion micro-interactions
- shadcn/ui component examples

## Avoid for Now

- auth system
- payments
- admin dashboard
- database
- user accounts
- marketplace backend
- anything that makes the MVP too large

---

# How to Use This Dashboard

1. Clip useful websites or GitHub repos into `raw/clips`.
2. Make sure clipped notes have frontmatter like `project: CopyUI` and `status: unprocessed`.
3. Open this dashboard to see which clips still need processing.
4. Ask Claude to process only the relevant clips.
5. After processing, change `status` to `processed`.