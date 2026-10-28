import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { RibbonMark } from "./RibbonMark";
import { useLang } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export function SiteHeader() {
  const { c, toggle, path } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: path("/learn"), label: c.nav.learn, exact: false },
    { to: path("/learn/diagnosis"), label: c.nav.diagnosis, exact: false },
    { to: path("/learn/treatment"), label: c.nav.treatment, exact: false },
    { to: path("/learn/living"), label: c.nav.living, exact: false },
    { to: path("/learn/denmark"), label: c.nav.denmark, exact: true },
    { to: path("/evidence"), label: c.nav.evidence, exact: false },
    { to: path("/dashboard"), label: c.nav.dashboard, exact: false },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to={path("/")}
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
        >
          <RibbonMark className="h-6 w-6" />
          OpenEndo
        </Link>

        <nav
          aria-label={c.nav.primary}
          className="hidden items-center gap-4 text-[13px] text-muted-foreground xl:flex"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.exact }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {c.nav.switch}
          </button>
          <Link
            to={path("/find")}
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            {c.nav.find}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            {c.nav.github}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={c.nav.menu}
            aria-expanded={open}
            className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label={c.nav.primary}
          className="border-t border-hairline bg-background px-6 py-3 xl:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-muted-foreground"
              activeProps={{ className: "block py-2.5 text-[15px] text-foreground" }}
              activeOptions={{ exact: l.exact }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={path("/find")}
            onClick={() => setOpen(false)}
            className="block py-2.5 text-[15px] text-muted-foreground"
          >
            {c.nav.find}
          </Link>
          <Link
            to={path("/sources")}
            onClick={() => setOpen(false)}
            className="block py-2.5 text-[15px] text-muted-foreground"
          >
            {c.nav.sources}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2.5 text-[15px] text-muted-foreground"
          >
            {c.nav.github}
          </a>
        </nav>
      )}
    </header>
  );
}
