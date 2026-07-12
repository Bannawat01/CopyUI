"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
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
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
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

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
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
