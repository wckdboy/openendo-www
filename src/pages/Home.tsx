import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataCard } from "@/components/DataCard";
import { canonicalQueryOptions } from "@/lib/canonical";
import { parseDigest, plainHeadline } from "@/lib/digest";
import { useLang } from "@/lib/i18n";
import { ESHRE_PMID, NICE_NG73, WHO_FACT_SHEET } from "@/lib/site";

const GUIDES = [
  { to: "/learn/how-it-works" as const, title: "how" as const },
  { to: "/learn/diagnosis" as const, title: "diagnosis" as const },
  { to: "/learn/managing-symptoms" as const, title: "managing" as const },
  { to: "/learn/living" as const, title: "living" as const },
];

export function Home() {
  const { c, locale, path } = useLang();
  const { data, isError, isFetching } = useQuery(canonicalQueryOptions);
  const digest = data ? parseDigest(data.latestDigest.markdown) : null;
  const snapshot = data?.meta.updated ?? "";

  return (
    <div className="mx-auto max-w-[var(--container)] px-6 pb-24 pt-14 sm:pt-20">
      <header className="max-w-[var(--measure)]">
        <h1 className="home-title">{c.home.promise}</h1>
        <p className="mt-4 text-[var(--text-lg)] text-[var(--ink-muted)]">{c.home.sub}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to={path("/learn/symptoms")}
            className="flex min-h-[120px] flex-col justify-center rounded-[var(--radius-md)] bg-primary px-5 py-4 text-[var(--on-primary)] no-underline"
          >
            <span className="text-[var(--text-lg)] font-semibold">{c.home.tileMightTitle}</span>
            <span className="mt-2 text-base">{c.home.tileMightBody}</span>
          </Link>
          <Link
            to={path("/access")}
            className="flex min-h-[120px] flex-col justify-center rounded-[var(--radius-md)] px-5 py-4 text-[var(--ink)] no-underline ring-1 ring-[var(--border-strong)]"
          >
            <span className="text-[var(--text-lg)] font-semibold">{c.home.tileCareTitle}</span>
            <span className="mt-2 text-base text-[var(--ink-muted)]">{c.home.tileCareBody}</span>
          </Link>
        </div>
      </header>

      <section className="mt-10 max-w-[var(--measure)]" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="text-[var(--text-2xl)]">
          {c.home.moreGuides}
        </h2>
        <ul className="mt-4 divide-y divide-hairline border-t border-hairline">
          {GUIDES.map((guide) => (
            <li key={guide.to}>
              <Link to={path(guide.to)} className="block min-h-11 py-3 no-underline">
                <span className="text-base font-semibold text-[var(--ink)]">
                  {c.sections[guide.title].title}
                </span>
                <span className="mt-1 block text-base text-[var(--ink-muted)]">
                  {c.sections[guide.title].summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 max-w-[var(--measure)]" aria-labelledby="week-heading">
        <h2 id="week-heading" className="text-[var(--text-2xl)]">
          {c.home.weekTitle}
        </h2>
        {digest ? (
          <>
            <p className="mt-2 text-sm text-[var(--ink-subtle)]">{digest.weekLabel}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base">
              {digest.signals.slice(0, 3).map((signal) => (
                <li key={signal.slice(0, 48)}>{plainHeadline(signal)}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-base text-[var(--ink-muted)]">{c.common.unavailable}</p>
        )}
        <Link to={path("/evidence")} className="mt-4 inline-flex min-h-11 items-center font-medium">
          {c.home.readDigest}
        </Link>
      </section>

      <section className="mt-16" aria-labelledby="data-heading">
        <h2 id="data-heading" className="text-[var(--text-2xl)]">
          {c.home.dataTitle}
        </h2>
        {isError ? (
          <p className="mt-2 text-sm text-[var(--caution)]">{c.home.staleRefresh}</p>
        ) : null}
        {isFetching ? (
          <p className="mt-2 text-sm text-[var(--ink-subtle)]">{c.common.refreshing}</p>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DataCard
            label={c.dashboard.kpi.recruiting}
            value={data ? data.meta.counts.recruiting_global.toLocaleString(locale) : "—"}
            context={c.dashboard.meanings.recruiting}
            snapshot={snapshot}
            href={path("/dashboard")}
            staleLabel={c.home.staleChip}
          />
          <DataCard
            label={c.dashboard.kpi.denmark}
            value={data ? data.meta.counts.denmark.toLocaleString(locale) : "—"}
            context={c.dashboard.meanings.denmark}
            snapshot={snapshot}
            href={path("/dashboard")}
            staleLabel={c.home.staleChip}
          />
          <DataCard
            label={c.dashboard.kpi.papers7}
            value={data ? data.meta.counts.pubmed_7d.toLocaleString(locale) : "—"}
            context={c.dashboard.meanings.papers7}
            snapshot={snapshot}
            href={path("/dashboard")}
            staleLabel={c.home.staleChip}
          />
        </div>
      </section>

      <section className="mt-16 max-w-[var(--measure)]" aria-labelledby="check-heading">
        <h2 id="check-heading" className="text-[var(--text-2xl)]">
          {c.home.checkTitle}
        </h2>
        <p className="mt-3 text-base text-[var(--ink-muted)]">{c.home.checkBody}</p>
        <ul className="mt-4 space-y-1 text-base">
          <li>
            <a href={WHO_FACT_SHEET}>WHO fact sheet, 15 Oct 2025</a>
          </li>
          <li>
            <a href={NICE_NG73}>NICE NG73</a>
          </li>
          <li>
            <a href={ESHRE_PMID}>ESHRE 2022, PMID 35350465</a>
          </li>
        </ul>
        <Link to={path("/about")} className="mt-4 inline-flex min-h-11 items-center font-medium">
          {c.nav.about}
        </Link>
      </section>
    </div>
  );
}
