import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { copy, type Locale } from "@/content/copy";
import { basePathFromPathname, localizedPath, type AppPath, type BasePath } from "@/lib/site";

export type { AppPath, BasePath };
export { basePathFromPathname };

/** Map a canonical path to the URL for a given language. */
export function localePath(path: BasePath, locale: Locale): AppPath {
  return localizedPath(path, locale);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/da" || pathname.startsWith("/da/") ? "da" : "en";
}

type Ctx = {
  locale: Locale;
  /** Current page in canonical (English) path form. */
  basePath: BasePath;
  /** Resolve a canonical path to the current language. */
  path: (p: BasePath) => AppPath;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  c: (typeof copy)["en"];
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const locale = localeFromPathname(pathname);
  const basePath = basePathFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      navigate({ to: localePath(basePath, l) });
    },
    [basePath, locale, navigate],
  );

  const toggle = useCallback(() => {
    setLocale(locale === "en" ? "da" : "en");
  }, [locale, setLocale]);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      basePath,
      path: (p: BasePath) => localePath(p, locale),
      setLocale,
      toggle,
      c: copy[locale],
    }),
    [locale, basePath, setLocale, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
