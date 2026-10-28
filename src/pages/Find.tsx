import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { INDEX_PATHS, PRIMARY_SECTIONS } from "@/content/catalog";
import { LEARN_SLUGS, learnPage } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

type Hit = { key: string; title: string; text: string; to: BasePath; hash?: string };

export function Find() {
  const { c, locale, path } = useLang();
  const [query, setQuery] = useState("");
  const hits = useMemo(() => buildIndex(locale, c), [locale, c]);
  const q = query.trim().toLowerCase();
  const shown = q
    ? hits.filter((hit) => `${hit.title} ${hit.text}`.toLowerCase().includes(q))
    : hits;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-14 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.find.eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.1] tracking-tight">
          {c.find.title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{c.find.lede}</p>
      </header>
      <form className="mt-8" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-medium" htmlFor="site-index">
          {c.find.placeholder}
        </label>
        <input
          id="site-index"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={c.find.placeholder}
          className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-base"
        />
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        {shown.length} {c.find.count}
      </p>
      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{c.find.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {shown.map((hit) => (
            <li key={hit.key} className="py-4">
              <Link
                to={path(hit.to)}
                hash={hit.hash}
                className="text-[17px] font-medium underline-offset-4 hover:underline"
              >
                {hit.title}
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{hit.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function buildIndex(
  locale: "en" | "da",
  c: {
    sections: Record<string, { title: string; summary: string }>;
    nav: { access: string; research: string; knowledge: string; sources: string };
    sources: { lede: string };
    access: { lede: string };
    research: { lede: string };
    knowledge: { lede: string };
  },
): Hit[] {
  const hits: Hit[] = PRIMARY_SECTIONS.map((section) => ({
    key: section.path,
    title: c.sections[section.id]?.title ?? section.id,
    text: c.sections[section.id]?.summary ?? "",
    to: section.path,
  }));

  for (const slug of LEARN_SLUGS) {
    const page = learnPage(locale, slug);
    if (!hits.some((hit) => hit.to === `/learn/${slug}`)) {
      hits.push({
        key: page.slug,
        title: page.title,
        text: page.lede,
        to: `/learn/${slug}`,
      });
    }
    for (const section of page.sections) {
      hits.push({
        key: `${slug}-${section.id}`,
        title: section.heading,
        text: section.paragraphs[0] ?? "",
        to: `/learn/${slug}`,
        hash: section.id,
      });
    }
  }

  const extras: Hit[] = [
    { key: "access", title: c.nav.access, text: c.access.lede, to: "/access" },
    { key: "research-doc", title: c.nav.research, text: c.research.lede, to: "/research" },
    { key: "knowledge", title: c.nav.knowledge, text: c.knowledge.lede, to: "/knowledge" },
    { key: "sources", title: c.nav.sources, text: c.sources.lede, to: "/sources" },
  ];
  for (const extra of extras) {
    if (INDEX_PATHS.includes(extra.to as (typeof INDEX_PATHS)[number]) || extra.to === "/sources") {
      if (!hits.some((hit) => hit.key === extra.key)) hits.push(extra);
    }
  }
  return hits;
}
