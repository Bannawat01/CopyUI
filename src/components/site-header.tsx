import Link from "next/link";
import { LanguageSelector } from "@/components/language-selector";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-heading rounded-md text-sm font-semibold tracking-tight text-white outline-none transition-colors hover:text-white/80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {SITE_NAME}
        </Link>
        <LanguageSelector />
      </div>
    </header>
  );
}
