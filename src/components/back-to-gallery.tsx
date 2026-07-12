"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function BackToGallery() {
  const { t } = useLocale();

  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("detail.back")}
    </Link>
  );
}
