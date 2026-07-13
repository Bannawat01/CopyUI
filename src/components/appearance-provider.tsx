"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

/**
 * Website appearance (Dark / Light / System) — a separate concept from the
 * prompt builder's Theme Mode. This never touches promptTemplate, the build
 * API, or the copied prompt; it only toggles a class on <html> for CSS.
 */
export type Appearance = "dark" | "light" | "system";

export const APPEARANCES: Appearance[] = ["dark", "light", "system"];

export function isAppearance(value: unknown): value is Appearance {
  return APPEARANCES.includes(value as Appearance);
}

/** Existing brand identity — the toggle adds an option, it doesn't flip the default. */
const DEFAULT_APPEARANCE: Appearance = "dark";

const STORAGE_KEY = "copyui:appearance";
const APPEARANCE_EVENT = "copyui:appearance-change";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

type ResolvedTheme = "dark" | "light";

/** What "system" resolves to right now, given the OS preference. */
function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(MEDIA_QUERY).matches
  );
}

function resolveTheme(appearance: Appearance): ResolvedTheme {
  if (appearance === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }
  return appearance;
}

type AppearanceStorage = Pick<Storage, "getItem">;

export function readStoredAppearance(storage: AppearanceStorage): Appearance {
  const stored = storage.getItem(STORAGE_KEY);
  return isAppearance(stored) ? stored : DEFAULT_APPEARANCE;
}

type ThemeTarget = { documentElement: { classList: { toggle: (c: string, on: boolean) => void } } };

/** Same pattern as syncDocumentLang: a DOM write keyed on the resolved value,
 *  not a React state update inside an effect. */
export function syncDocumentTheme(resolved: ResolvedTheme, target: ThemeTarget): void {
  target.documentElement.classList.toggle("dark", resolved === "dark");
}

const appearanceStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(APPEARANCE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    const media = window.matchMedia(MEDIA_QUERY);
    // Live-updates "system" if the OS theme changes while the tab is open.
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener(APPEARANCE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
      media.removeEventListener("change", onChange);
    };
  },
  getSnapshot(): Appearance {
    return readStoredAppearance(window.localStorage);
  },
  getServerSnapshot(): Appearance {
    return DEFAULT_APPEARANCE;
  },
};

type AppearanceContextValue = {
  appearance: Appearance;
  resolvedTheme: ResolvedTheme;
  setAppearance: (appearance: Appearance) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const appearance = useSyncExternalStore(
    appearanceStore.subscribe,
    appearanceStore.getSnapshot,
    appearanceStore.getServerSnapshot,
  );
  const resolvedTheme = resolveTheme(appearance);

  useEffect(() => {
    syncDocumentTheme(resolvedTheme, document);
  }, [resolvedTheme]);

  const setAppearance = useCallback((next: Appearance) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(APPEARANCE_EVENT));
  }, []);

  const value: AppearanceContextValue = { appearance, resolvedTheme, setAppearance };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used inside <AppearanceProvider>");
  }
  return ctx;
}
