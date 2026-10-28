import { Link } from "@tanstack/react-router";
import { LEARN_SLUGS, learnPage } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

export function GuideNav({ current }: { current?: BasePath }) {
  const { c, locale, path } = useLang();
  const links: { to: BasePath; label: string }[] = [
    { to: "/learn", label: c.learn.indexLabel },
    ...LEARN_SLUGS.map((slug) => ({
      to: `/learn/${slug}` as BasePath,
      label: learnPage(locale, slug).title,
    })),
    { to: "/evidence", label: c.nav.evidence },
  ];

  return (
    <nav aria-label={c.learn.guidesLabel} className="mt-8 flex gap-2 overflow-x-auto pb-1">
      {links.map((link) => {
        const active = current === link.to;
        return (
          <Link
            key={link.to}
            to={path(link.to)}
            className={
              active
                ? "shrink-0 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background"
                : "shrink-0 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground"
            }
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
