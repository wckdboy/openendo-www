import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { RibbonMark } from "./RibbonMark";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

const LINKS: { to: BasePath; key: "guides" | "evidence" | "trials" | "care" | "about" }[] = [
  { to: "/learn", key: "guides" },
  { to: "/evidence", key: "evidence" },
  { to: "/dashboard", key: "trials" },
  { to: "/access", key: "care" },
  { to: "/about", key: "about" },
];

export function SiteHeader() {
  const { c, toggle, path, locale } = useLang();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset["theme"] === "dark");
  }, []);

  function setTheme(next: boolean) {
    setDark(next);
    if (next) document.documentElement.dataset["theme"] = "dark";
    else delete document.documentElement.dataset["theme"];
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const labels = {
    guides: c.nav.guides,
    evidence: c.nav.evidenceNav,
    trials: c.nav.trials,
    care: c.nav.care,
    about: c.nav.about,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background">
      <div className="mx-auto flex h-16 max-w-[var(--container)] items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to={path("/")}
          className="flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--ink)]"
        >
          <RibbonMark className="h-6 w-6" />
          OpenEndo
        </Link>
        <nav aria-label={c.nav.primary} className="hidden items-center gap-5 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={path(link.to)}
              className="border-b-[3px] border-transparent py-2 text-base text-[var(--ink)] no-underline"
              activeProps={{
                className:
                  "border-b-[3px] border-[var(--ribbon)] py-2 text-base text-[var(--ink)] no-underline",
              }}
              activeOptions={{ exact: false }}
            >
              {labels[link.key]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            to={path("/access")}
            className="inline-flex min-h-11 items-center px-2 text-base font-medium text-[var(--ink)] no-underline md:hidden"
          >
            {c.nav.care}
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <Settings
              dark={dark}
              setTheme={setTheme}
              toggle={toggle}
              locale={locale}
              lightLabel={c.nav.light}
              darkLabel={c.nav.dark}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={c.nav.menu}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav aria-label={c.nav.primary} className="border-t border-hairline px-4 py-2 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={path(link.to)}
              onClick={() => setOpen(false)}
              className="block min-h-11 py-2 text-base text-[var(--ink)] no-underline"
            >
              {labels[link.key]}
            </Link>
          ))}
          <div className="mt-2 border-t border-hairline pt-2">
            <Settings
              dark={dark}
              setTheme={setTheme}
              toggle={toggle}
              locale={locale}
              lightLabel={c.nav.light}
              darkLabel={c.nav.dark}
            />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Settings({
  dark,
  setTheme,
  toggle,
  locale,
  lightLabel,
  darkLabel,
}: {
  dark: boolean;
  setTheme: (next: boolean) => void;
  toggle: () => void;
  locale: "en" | "da";
  lightLabel: string;
  darkLabel: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setTheme(!dark)}
        aria-label={dark ? lightLabel : darkLabel}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink)]"
      >
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-[var(--ink)]"
      >
        {locale === "da" ? "EN" : "DA"}
      </button>
    </div>
  );
}
