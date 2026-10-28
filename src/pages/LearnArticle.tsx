import { Link } from "@tanstack/react-router";
import { LEARN_REVIEWED, learnPage, type Citation, type LearnSlug } from "@/content/learn";
import { DenmarkAccess } from "@/components/DenmarkAccess";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

type SourceKind =
  | "Guideline"
  | "Systematic review"
  | "Randomised trial"
  | "Observational"
  | "Preclinical"
  | "Case report"
  | "Fact sheet";

function sourceKind(href: string): SourceKind {
  const url = href.toLowerCase();
  if (url.includes("who.int")) return "Fact sheet";
  if (
    url.includes("nice.org") ||
    url.includes("eshre") ||
    url.includes("35350465") ||
    url.includes("sundhed.dk")
  ) {
    return "Guideline";
  }
  return "Fact sheet";
}

function uniqueCitations(sections: { citations: Citation[] }[]): Citation[] {
  const seen = new Set<string>();
  const list: Citation[] = [];
  for (const section of sections) {
    for (const citation of section.citations) {
      if (seen.has(citation.href)) continue;
      seen.add(citation.href);
      list.push(citation);
    }
  }
  return list;
}

export function LearnArticle({ slug }: { slug: LearnSlug }) {
  const { c, locale, path } = useLang();
  const page = learnPage(locale, slug);
  const current = `/learn/${slug}` as BasePath;
  const sources = uniqueCitations(page.sections);
  const numberOf = (href: string) => sources.findIndex((item) => item.href === href) + 1;

  return (
    <div className="mx-auto max-w-[var(--container)] px-6 pb-24 pt-10">
      <p className="text-sm text-[var(--ink-subtle)]">
        <Link to={path("/learn")} className="text-[var(--ink-subtle)]">
          {c.nav.guides}
        </Link>
        {" / "}
        {page.title}
      </p>
      <div className="mt-6 lg:grid lg:grid-cols-[var(--toc)_minmax(0,var(--content))] lg:gap-10">
        <nav aria-label={c.learn.toc} className="mb-8 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <details className="lg:hidden">
            <summary className="min-h-11 cursor-pointer text-base">{c.learn.toc}</summary>
            <Toc sections={page.sections} />
          </details>
          <div className="hidden lg:block">
            <p className="text-sm uppercase tracking-[0.04em] text-[var(--ink-subtle)]">
              {c.learn.toc}
            </p>
            <Toc sections={page.sections} />
          </div>
        </nav>
        <article className="max-w-[var(--measure)]" lang={locale}>
          <h1 className="text-[var(--text-3xl)]">{page.title}</h1>
          <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--sunken)] p-5">
            <h2 className="text-base font-semibold">{c.learn.inShort}</h2>
            <p className="mt-2 text-[var(--text-md)]">{page.lede}</p>
          </div>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            {c.learn.reviewed} <time dateTime={LEARN_REVIEWED}>28 Oct 2026</time>
            {" · "}
            {c.learn.nextReview} Jan 2027
            {" · "}
            <Link to={path("/about")}>{c.nav.sources}</Link>
          </p>
          <p className="mt-2 text-sm text-[var(--ink-subtle)]">
            {c.learn.quietDisclaimer} <Link to={path("/about")}>{c.learn.howToUse}</Link>
          </p>
          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className="text-[var(--text-2xl)]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-4">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-2">
                  {section.citations.map((citation) => (
                    <Cite key={citation.href} n={numberOf(citation.href)} citation={citation} />
                  ))}
                </p>
              </section>
            ))}
          </div>
          {slug === "diagnosis" ? (
            <p className="mt-10">
              <Link to={path("/access")}>{c.nav.care}</Link>
            </p>
          ) : null}
          {slug === "denmark" ? <DenmarkAccess /> : null}
          <h2 className="mt-14 text-[var(--text-xl)]">{c.learn.sources}</h2>
          <ol className="mt-4 space-y-4">
            {sources.map((citation, index) => (
              <li key={citation.href} id={`source-${index + 1}`} className="text-base">
                <span className="mr-2 inline-flex rounded-full bg-[var(--sunken)] px-2 py-0.5 text-sm">
                  {sourceKind(citation.href)}
                </span>
                <a href={citation.href}>{citation.label}</a>
              </li>
            ))}
          </ol>
          {locale === "da" ? (
            <p className="mt-8 text-sm">
              <Link to={current}>{c.learn.alsoEnglish}</Link>
            </p>
          ) : null}
        </article>
      </div>
    </div>
  );
}

function Toc({ sections }: { sections: { id: string; heading: string }[] }) {
  return (
    <ol className="mt-3 space-y-2 text-base">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="text-[var(--ink)] no-underline">
            {index + 1}. {section.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}

function Cite({ n, citation }: { n: number; citation: Citation }) {
  return (
    <a
      href={`#source-${n}`}
      className="group relative mr-2 text-sm no-underline"
      title={citation.label}
    >
      [{n}]
      <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-64 rounded-[var(--radius-sm)] bg-card p-3 text-left text-sm text-[var(--ink)] shadow-[var(--shadow-card)] group-hover:block group-focus:block">
        <span className="mb-1 block text-xs">{sourceKind(citation.href)}</span>
        {citation.label}
      </span>
    </a>
  );
}
