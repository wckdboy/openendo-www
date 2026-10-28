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
    { to: path("/"), label: c.nav.home, exact: true },
    { to: path("/learn"), label: c.nav.learn, exact: false },
    { to: path("/dashboard"), label: c.nav.dashboard, exact: false },
    { to: path("/evidence"), label: c.nav.evidence, exact: false },
    { to: path("/research"), label: c.nav.research, exact: false },
    { to: path("/access"), label: c.nav.access, exact: false },
    { to: path("/knowledge"), label: c.nav.knowledge, exact: false },
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
          className="hidden items-center gap-5 text-[13px] text-muted-foreground lg:flex"
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
            className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label={c.nav.primary}
          className="border-t border-hairline bg-background px-6 py-3 lg:hidden"
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
