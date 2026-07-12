"use client";

import { ShieldAlert } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { getRethemeSafetyPoints, getRethemeSafetyTitle } from "@/lib/trust-copy";

/** Rendered in the detail panel only while Retheme Mode is selected. */
export function RethemeSafetyNote() {
  const { locale } = useLocale();

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3">
      <h3 className="flex items-center gap-1.5 text-xs font-medium text-amber-200/90">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {getRethemeSafetyTitle(locale)}
      </h3>
      <ul className="flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-amber-100/50">
        {getRethemeSafetyPoints(locale).map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
