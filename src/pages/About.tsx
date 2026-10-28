import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LEARN_REVIEWED } from "@/content/learn";
import { PageCredits } from "@/components/PageCredits";
import { useLang } from "@/lib/i18n";
import { canonicalQueryOptions } from "@/lib/canonical";
import { openCalls } from "@/lib/open-calls";
import { useMounted } from "@/lib/use-mounted";
import { ESHRE_PMID, GITHUB_URL, NICE_NG73, WHO_FACT_SHEET } from "@/lib/site";

export function About() {
  const { c, path } = useLang();
  return (
    <div className="mx-auto max-w-[var(--measure)] px-6 pb-24 pt-14">
      <h1>{c.about.title}</h1>
      <p className="mt-4 text-[var(--text-lg)] text-[var(--ink-muted)]">{c.about.lede}</p>
      <PageCredits
        reviewed={LEARN_REVIEWED}
        citations={[
          { label: "WHO fact sheet, 15 Oct 2025", href: WHO_FACT_SHEET },
          { label: "NICE NG73", href: NICE_NG73 },
          { label: "ESHRE 2022, PMID 35350465", href: ESHRE_PMID },
        ]}
      />
      <section className="mt-10">
        <h2 className="text-[var(--text-xl)]">{c.sources.guidesTitle}</h2>
        <p className="mt-3">{c.sources.guidesBody}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-[var(--text-xl)]">{c.sources.dataTitle}</h2>
        <p className="mt-3">{c.sources.dataBody}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-[var(--text-xl)]">{c.about.whoTitle}</h2>
        <p className="mt-3">{c.about.whoBody}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-[var(--text-xl)]">{c.about.policyTitle}</h2>
        <p className="mt-3">{c.about.policyBody}</p>
      </section>
      <ul className="mt-8 space-y-2">
        <li>
          <Link to={path("/about/for-decision-makers")}>{c.about.decision}</Link>
        </li>
        <li>
          <Link to={path("/find")}>{c.nav.find}</Link>
        </li>
        <li>
          <Link to={path("/knowledge")}>{c.nav.knowledge}</Link>
        </li>
        <li>
          <a href={GITHUB_URL}>{c.nav.github}</a>
        </li>
      </ul>
      <p className="mt-10 text-sm text-[var(--ink-subtle)]">{c.learn.quietDisclaimer}</p>
    </div>
  );
}

export function DecisionMakers() {
  const { c, locale } = useLang();
  const { data } = useQuery(canonicalQueryOptions);
  const mounted = useMounted();
  const today = mounted ? new Date().toISOString().slice(0, 10) : "2026-10-28";
  const actions = data?.content.actions ?? [];
  const open = data ? openCalls(data.funding, today) : [];

  return (
    <div className="mx-auto max-w-[var(--measure)] px-6 pb-24 pt-14">
      <h1>{c.about.decision}</h1>
      <p className="mt-4 text-[var(--ink-muted)]">{c.about.decisionLede}</p>
      <h2 className="mt-10 text-[var(--text-xl)]">{c.home.fundingTitle}</h2>
      <ul className="mt-4 space-y-3">
        {open.map((call) => (
          <li key={call.id ?? call.name}>
            <a href={call.url}>{call.name}</a>
            {call.deadline ? (
              <span className="text-[var(--ink-subtle)]"> · {call.deadline}</span>
            ) : null}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-[var(--text-xl)]">{c.about.links}</h2>
      <ul className="mt-4 space-y-4">
        {actions.map((action) => (
          <li key={action.url}>
            <a href={action.url}>{action.title[locale]}</a>
            <p className="mt-1 text-base text-[var(--ink-muted)]">{action.body[locale]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
