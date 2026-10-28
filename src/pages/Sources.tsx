import { Link } from "@tanstack/react-router";
import { Disclaimer } from "@/components/Disclaimer";
import { PageCredits } from "@/components/PageCredits";
import { LEARN_REVIEWED } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import { ESHRE_PMID, GITHUB_URL, NICE_NG73, RAW_BASE, WHO_FACT_SHEET } from "@/lib/site";

export function Sources() {
  const { c, path } = useLang();
  const t = c.sources;
  const blocks = [
    { title: t.guidesTitle, body: t.guidesBody },
    { title: t.dataTitle, body: t.dataBody },
    { title: t.fundingTitle, body: t.fundingBody },
    { title: t.limitsTitle, body: t.limitsBody },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-14 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.1] tracking-tight">
          {t.title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{t.lede}</p>
        <PageCredits
          reviewed={LEARN_REVIEWED}
          citations={[
            { label: "WHO fact sheet, endometriosis (15 October 2025)", href: WHO_FACT_SHEET },
            { label: "NICE NG73", href: NICE_NG73 },
            { label: "ESHRE guideline: endometriosis, 2022 (PMID 35350465)", href: ESHRE_PMID },
            { label: "OpenEndo repository", href: GITHUB_URL },
          ]}
        />
      </header>
      <div className="mt-8">
        <Disclaimer title={c.learn.notAdviceTitle} body={c.learn.notAdviceBody} />
      </div>
      <div className="mt-12 space-y-10">
        {blocks.map((block) => (
          <section key={block.title} className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold tracking-tight">{block.title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed">{block.body}</p>
          </section>
        ))}
      </div>
      <ul className="mt-12 space-y-2 text-sm">
        <li>
          <a className="underline underline-offset-4" href={`${RAW_BASE}/docs/data/meta.json`}>
            meta.json
          </a>
        </li>
        <li>
          <a className="underline underline-offset-4" href={`${RAW_BASE}/docs/data/funding.json`}>
            funding.json
          </a>
        </li>
        <li>
          <a
            className="underline underline-offset-4"
            href={`${RAW_BASE}/docs/research/evidence/weekly/LATEST`}
          >
            weekly/LATEST
          </a>
        </li>
        <li>
          <Link to={path("/find")} className="underline underline-offset-4">
            {c.nav.find}
          </Link>
        </li>
      </ul>
    </div>
  );
}
