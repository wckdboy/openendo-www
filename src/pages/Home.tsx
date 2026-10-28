import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PRIMARY_SECTIONS } from "@/content/catalog";
import { Disclaimer } from "@/components/Disclaimer";
import { PageCredits } from "@/components/PageCredits";
import { useLang } from "@/lib/i18n";
import { canonicalQueryOptions, type FundingEntry } from "@/lib/canonical";
import { LEARN_REVIEWED } from "@/content/learn";
import { openCalls } from "@/lib/open-calls";
import { useMounted } from "@/lib/use-mounted";
import { GITHUB_URL, RAW_BASE, WHO_FACT_SHEET } from "@/lib/site";

export function Home() {
  const { c, locale, path } = useLang();
  const { data, isFetching, isError } = useQuery(canonicalQueryOptions);
  const mounted = useMounted();
  const today = mounted ? new Date().toISOString().slice(0, 10) : null;
  const grants = today && data ? openCalls(data.funding, today) : [];

  const kpis = [
    { value: data?.meta.counts.recruiting_global, label: c.dashboard.kpi.recruiting },
    { value: data?.meta.counts.denmark, label: c.dashboard.kpi.denmark },
    { value: data?.meta.counts.denmark_recruiting, label: c.dashboard.kpi.denmarkRecruiting },
    { value: data?.meta.counts.pubmed_7d, label: c.dashboard.kpi.papers7 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20">
      <header className="max-w-[var(--token-measure)]">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.home.eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.1] tracking-tight">
          {c.home.titleA} <span className="accent font-normal">{c.home.titleAccent}</span>
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{c.home.lede}</p>
        <PageCredits
          reviewed={LEARN_REVIEWED}
          citations={[
            { label: "WHO fact sheet, endometriosis (15 October 2025)", href: WHO_FACT_SHEET },
            {
              label: "OpenEndo weekly dataset (meta.json)",
              href: `${RAW_BASE}/docs/data/meta.json`,
            },
          ]}
        />
      </header>

      <div className="mt-8 max-w-[var(--token-measure)]">
        <Disclaimer title={c.learn.notAdviceTitle} body={c.learn.notAdviceBody} />
      </div>

      <section className="mt-14" aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-2xl font-semibold tracking-tight">
          {c.home.whyTitle}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRIMARY_SECTIONS.map((section) => {
            const copy = c.sections[section.id];
            return (
              <li key={section.id}>
                <Link
                  to={path(section.path)}
                  className="block h-full rounded-2xl border border-border bg-card px-5 py-5 hover:bg-secondary"
                >
                  <h3 className="text-lg font-semibold tracking-tight">{copy.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {copy.summary}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm">
          <Link to={path("/find")} className="underline underline-offset-4">
            {c.nav.find}
          </Link>
          <span className="text-muted-foreground"> · </span>
          <Link to={path("/sources")} className="underline underline-offset-4">
            {c.nav.sources}
          </Link>
          <span className="text-muted-foreground"> · </span>
          <Link to={path("/access")} className="underline underline-offset-4">
            {c.nav.access}
          </Link>
        </p>
      </section>

      <section
        className="mt-16 max-w-3xl border-t border-border pt-10"
        aria-labelledby="data-heading"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.home.liveEyebrow}
        </p>
        <h2 id="data-heading" className="mt-3 text-2xl font-semibold tracking-tight">
          {c.home.statsTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.home.liveLede}</p>
        {isError ? (
          <p className="mt-4 text-sm text-muted-foreground">{c.common.unavailable}</p>
        ) : null}
        <table className="mt-6 w-full text-left text-sm">
          <caption className="sr-only">{c.home.statsTitle}</caption>
          <tbody>
            {kpis.map((item) => (
              <tr key={item.label} className="border-t border-border">
                <th scope="row" className="py-3 pr-4 font-medium">
                  {item.label}
                </th>
                <td className="numeral py-3 text-right">
                  {item.value === undefined ? "—" : item.value.toLocaleString(locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          {data ? `${c.common.updated} ${data.meta.updated}` : c.dashboard.loading}
          {isFetching ? ` · ${c.common.refreshing}` : ""}
          {" · "}
          <a className="underline underline-offset-4" href={`${RAW_BASE}/docs/data/meta.json`}>
            meta.json
          </a>
        </p>
        <Link to={path("/dashboard")} className="mt-4 inline-flex text-sm font-medium">
          <span className="marker">{c.home.liveCta}</span>
        </Link>
      </section>

      <section
        className="mt-16 max-w-3xl border-t border-border pt-10"
        aria-labelledby="funding-heading"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.home.fundingEyebrow}
        </p>
        <h2 id="funding-heading" className="mt-3 text-2xl font-semibold tracking-tight">
          {c.home.fundingTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.home.fundingLede}</p>
        {!today ? (
          <p className="mt-6 text-sm text-muted-foreground" aria-busy="true">
            {c.home.fundingChecking}
          </p>
        ) : grants.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {c.home.fundingEmpty}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {grants.map((grant) => (
              <GrantRow key={grant.id ?? grant.name} grant={grant} locale={locale} today={today} />
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          <a className="underline underline-offset-4" href={`${RAW_BASE}/docs/data/funding.json`}>
            funding.json
          </a>
          {" · "}
          <Link to={path("/sources")} className="underline underline-offset-4">
            {c.nav.sources}
          </Link>
        </p>
      </section>

      <p className="mt-16 text-sm">
        <a href={GITHUB_URL} className="underline underline-offset-4">
          {c.home.ctaSecondary}
        </a>
      </p>
    </div>
  );
}

function GrantRow({
  grant,
  locale,
  today,
}: {
  grant: FundingEntry;
  locale: "en" | "da";
  today: string;
}) {
  const { c } = useLang();
  const href = grant.url ?? GITHUB_URL;
  const deadlineLabel =
    grant.deadline == null
      ? c.common.noDeadline
      : `${grant.deadline}${daysLeft(grant.deadline, today, c.common.daysLeft, c.common.dueToday)}`;
  return (
    <li>
      <a href={href} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-4">
        <span>
          <span className="block text-[17px] font-medium">{grant.name}</span>
          {grant.org ? (
            <span className="mt-1 block text-sm text-muted-foreground">{grant.org}</span>
          ) : null}
        </span>
        <span className="text-sm text-muted-foreground">{deadlineLabel}</span>
      </a>
    </li>
  );
}

function daysLeft(iso: string, today: string, daysLabel: string, dueToday: string): string {
  const time = Date.parse(`${iso}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(time) || !Number.isFinite(now)) return "";
  const days = Math.round((time - now) / 86_400_000);
  if (days === 0) return ` · ${dueToday}`;
  return ` · ${days} ${daysLabel}`;
}
