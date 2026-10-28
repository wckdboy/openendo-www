import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageCredits } from "@/components/PageCredits";
import { LEARN_REVIEWED } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import { KNOWLEDGE_INDEX_URL, knowledgeQueryOptions } from "@/lib/knowledge.functions";
import type { KnowledgeConfidence, KnowledgeKind, KnowledgePage } from "@/lib/knowledge.types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const KIND_ORDER: Record<KnowledgeKind, number> = {
  entity: 0,
  concept: 1,
  comparison: 2,
  query: 3,
};

function sectionLabel(
  kind: KnowledgeKind,
  sections: { entities: string; concepts: string; comparisons: string; queries: string },
): string {
  switch (kind) {
    case "entity":
      return sections.entities;
    case "concept":
      return sections.concepts;
    case "comparison":
      return sections.comparisons;
    case "query":
      return sections.queries;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function confidenceClass(value: KnowledgeConfidence): string {
  switch (value) {
    case "high":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "medium":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    case "low":
      return "bg-rose-50 text-rose-800 ring-rose-200";
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

function groupPages(pages: KnowledgePage[]): { kind: KnowledgeKind; pages: KnowledgePage[] }[] {
  const groups = new Map<KnowledgeKind, KnowledgePage[]>();
  for (const page of pages) {
    if (!page.kind) continue;
    const list = groups.get(page.kind) ?? [];
    list.push(page);
    groups.set(page.kind, list);
  }
  return [...groups.entries()]
    .sort((a, b) => KIND_ORDER[a[0]] - KIND_ORDER[b[0]])
    .map(([kind, grouped]) => ({ kind, pages: grouped }));
}

export function Knowledge() {
  const { c, locale } = useLang();
  const t = c.knowledge;
  const query = useQuery(knowledgeQueryOptions);

  const entries = query.data?.pages ?? [];
  const groups = groupPages(entries);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 max-w-2xl text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {t.title.split(",")[0]},{" "}
          <span className="accent font-normal">{t.title.split(",").slice(1).join(",").trim()}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{t.lede}</p>
        <PageCredits
          reviewed={LEARN_REVIEWED}
          citations={[{ label: "OpenEndo knowledge index", href: KNOWLEDGE_INDEX_URL }]}
        />
        {entries.length > 0 && (
          <div className="mt-3 max-w-xl space-y-1 text-sm text-muted-foreground">
            <p>{t.caption}</p>
            {locale === "da" ? <p>{t.languageNote}</p> : null}
          </div>
        )}
      </header>

      {query.isPending && (
        <div className="mt-16 space-y-4" aria-busy="true">
          <p className="text-sm text-muted-foreground">{t.loading}</p>
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-secondary" />
          <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
        </div>
      )}

      {query.isError && (
        <div className="mt-16 max-w-xl rounded-2xl border border-hairline bg-secondary/50 p-6">
          <h2 className="text-[17px] font-semibold tracking-tight">{t.errorTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.errorBody}</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            className={`mt-5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background ${focusRing}`}
          >
            {t.retry}
          </button>
        </div>
      )}

      {!query.isPending && !query.isError && (
        <div className="mt-16 gap-16 lg:flex">
          <aside className="mb-14 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:w-56 lg:shrink-0">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t.toc}
            </h2>
            {groups.length ? (
              <nav className="mt-4 space-y-6">
                {groups.map((group) => (
                  <div key={group.kind}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {sectionLabel(group.kind, t.sections)}
                    </p>
                    <ul className="mt-2 space-y-2.5 border-l border-hairline">
                      {group.pages.map((page) => (
                        <li key={page.id}>
                          <a
                            href={`#${page.id}`}
                            className="-ml-px block border-l border-transparent pl-4 text-sm text-muted-foreground transition-colors hover:border-ribbon hover:text-foreground"
                          >
                            {page.heading}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            ) : (
              <ul className="mt-4 space-y-2.5 border-l border-hairline">
                {entries.map((page) => (
                  <li key={page.id}>
                    <a
                      href={`#${page.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-sm text-muted-foreground transition-colors hover:border-ribbon hover:text-foreground"
                    >
                      {page.heading}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="min-w-0 max-w-2xl">
            {entries.map((page) => (
              <article
                key={page.id}
                id={page.id}
                className="scroll-mt-24 border-t border-hairline py-12 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {page.kind && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {sectionLabel(page.kind, t.sections)}
                    </span>
                  )}
                  {page.confidence && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${confidenceClass(page.confidence)}`}
                    >
                      {page.confidence} {t.confidence}
                    </span>
                  )}
                  {page.contested && (
                    <span className="text-[11px] text-amber-800">{t.contested}</span>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{page.heading}</h2>
                {page.updated && (
                  <p className="mt-2 text-[12px] text-muted-foreground">
                    {t.updated} {page.updated}
                  </p>
                )}
                <div
                  className="knowledge-prose mt-4"
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />
                {page.sources.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {page.sources.length > 1 ? t.sources : t.source}
                    </span>
                    {page.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded text-[12px] text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground hover:decoration-ribbon ${focusRing}`}
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                )}
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
                >
                  {t.openSource}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <p className="mt-16 text-sm text-muted-foreground">
          <a
            href={KNOWLEDGE_INDEX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-medium text-foreground ${focusRing}`}
          >
            <span className="marker">{t.openIndex}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </p>
      )}
    </div>
  );
}
