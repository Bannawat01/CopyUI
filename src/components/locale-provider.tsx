"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  t as translate,
  tCategory as translateCategory,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n";

const STORAGE_KEY = "copyui:locale";
const LOCALE_EVENT = "copyui:locale-change";

/** Narrow shapes so these can be exercised without a DOM. */
type LocaleStorage = Pick<Storage, "getItem">;
type LangTarget = { documentElement: { lang: string } };

/** Any unrecognized or absent stored value resolves to English. */
export function readStoredLocale(storage: LocaleStorage): Locale {
  const stored = storage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

/**
 * Keeps <html lang> truthful. Serving Thai or Chinese text under lang="en"
 * makes screen readers pronounce it with an English voice, so this must run
 * whenever the *resolved* locale changes — not only when the user clicks the
 * selector. A returning visitor never clicks anything.
 */
export function syncDocumentLang(locale: Locale, target: LangTarget): void {
  target.documentElement.lang = locale;
}

/**
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than an effect. The server snapshot is always
 * the default locale, which keeps SSR/hydration in agreement; React then
 * swaps in the stored locale on the client without a mismatch.
 */
const localeStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(LOCALE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(LOCALE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  getSnapshot(): Locale {
    return readStoredLocale(window.localStorage);
  },
  getServerSnapshot(): Locale {
    return DEFAULT_LOCALE;
  },
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  tCategory: (category: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    localeStore.subscribe,
    localeStore.getSnapshot,
    localeStore.getServerSnapshot,
  );

  // Writes a DOM attribute, not React state — so it stays outside the render
  // pass and never triggers the cascading-render lint rule.
  useEffect(() => {
    syncDocumentLang(locale, document);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (key, vars) => translate(locale, key, vars),
    tCategory: (category) => translateCategory(locale, category),
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return ctx;
}
