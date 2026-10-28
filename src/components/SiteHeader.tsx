import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const { c, toggle, path } = useLang();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function setTheme(next: boolean) {
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
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
      <div className="mx-auto flex h-16 max-w-[var(--container)] items-center justify-between gap-4 px-6">
        <Link
          to={path("/")}
          className="flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--ink)]"
        >
          <RibbonMark className="h-6 w-6" />
          OpenEndo
        </Link>
        <nav aria-label={c.nav.primary} className="hidden items-center gap-6 xl:flex">
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
          <button
            type="button"
            onClick={() => setTheme(!dark)}
            className="min-h-11 rounded-full px-3 text-sm text-[var(--ink)]"
          >
            {dark ? c.nav.light : c.nav.dark}
          </button>
          <button
            type="button"
            onClick={toggle}
            className="min-h-11 rounded-full px-3 text-sm text-[var(--ink)]"
          >
            {c.nav.switch}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={c.nav.menu}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav aria-label={c.nav.primary} className="border-t border-hairline px-6 py-2 xl:hidden">
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
        </nav>
      ) : null}
    </header>
  );
}
