import { Check } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Product context",
  "Layout direction",
  "Component requirements",
  "Responsive behavior",
  "Accessibility notes",
  "Tool-specific framing",
] as const;

/**
 * Static trust signal describing what every hidden prompt template
 * covers — it lists section names only, never template content.
 */
export function QualityChecklist() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <span className="text-xs font-medium uppercase tracking-widest text-white/55">
        Every prompt includes
      </span>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-1.5 min-[380px]:grid-cols-2">
        {CHECKLIST_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 text-xs text-white/60"
          >
            <Check
              className="h-3 w-3 shrink-0 text-emerald-500"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
