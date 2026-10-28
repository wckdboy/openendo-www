import { Link } from "@tanstack/react-router";
import { LEARN_REVIEWED, learnPage, type Citation, type LearnSlug } from "@/content/learn";
import { DenmarkAccess } from "@/components/DenmarkAccess";
import { Disclaimer } from "@/components/Disclaimer";
import { GuideNav } from "@/components/GuideNav";
import { PageCredits } from "@/components/PageCredits";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

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

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.learn.eyebrow}
        </p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {page.title}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{page.lede}</p>
        <PageCredits reviewed={LEARN_REVIEWED} citations={uniqueCitations(page.sections)} />
        <GuideNav current={current} />
      </header>

      <div className="mt-8">
        <Disclaimer title={c.learn.notAdviceTitle} body={c.learn.notAdviceBody} />
      </div>

      <div className="mt-12 space-y-12">
        {page.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className={index > 0 ? "below-fold border-t border-hairline pt-12" : ""}
          >
            <h2 id={`${section.id}-title`} className="text-2xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-4 text-[16px] leading-relaxed">
                {paragraph}
              </p>
            ))}
            <ul className="mt-4 flex flex-col gap-1.5">
              {section.citations.map((citation) => (
                <li key={citation.href}>
                  <a
                    href={citation.href}
                    className="text-[13px] text-muted-foreground underline decoration-hairline underline-offset-4 hover:text-foreground hover:decoration-ribbon"
                  >
                    {citation.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {slug === "diagnosis" ? (
        <p className="mt-10 text-sm">
          <Link to={path("/access")} className="underline underline-offset-4">
            {c.nav.access}
          </Link>
        </p>
      ) : null}
      {slug === "denmark" ? <DenmarkAccess /> : null}
    </div>
  );
}
