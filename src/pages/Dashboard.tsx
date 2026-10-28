import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  ChartFrame,
  DataTable,
  HorizontalBars,
  MonthColumns,
} from "@/components/charts/SnapshotCharts";
import { countryBars, monthPoints, snapshotUpdateDue, statusBars } from "@/lib/charts";
import { formatDate } from "@/lib/dates";
import { PageCredits } from "@/components/PageCredits";
import { LEARN_REVIEWED } from "@/content/learn";
import { useLang } from "@/lib/i18n";
import { RAW_BASE } from "@/lib/site";
import { canonicalQueryOptions, displayPhase, displayStatus } from "@/lib/canonical";
import { DataCard } from "@/components/DataCard";
import { openCalls } from "@/lib/open-calls";

type Tab = "global" | "denmark" | "papers";

export function Dashboard() {
  const { c, locale, path } = useLang();
  const { data, isFetching, isError } = useQuery(canonicalQueryOptions);
  const [tab, setTab] = useState<Tab>(locale === "da" ? "denmark" : "global");
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const model = useMemo(() => {
    if (!data) return null;
    const global = data.trialsGlobal.trials.map((trial) => ({
      id: trial.nct_id,
      title: trial.title,
      status: displayStatus(trial.status),
      phase: displayPhase(trial.phase, locale),
      sponsor: trial.sponsor,
      countries: trial.countries,
      url: trial.url,
    }));
    const denmark = data.trialsDenmark.trials.map((trial) => ({
      id: trial.nct_id,
      title: trial.title,
      status: displayStatus(trial.status),
      phase: displayPhase(trial.phase, locale),
      sponsor: trial.sponsor,
      countries: trial.countries,
      url: trial.url,
    }));
    const papers = data.pubmedRecent.papers.map((paper) => ({
      id: paper.pmid,
      title: paper.title,
      journal: paper.journal,
      date: paper.date,
      url: paper.url,
    }));
    return {
      global,
      denmark,
      papers,
      byCountry: countryBars(global, (count) => `${c.dashboard.otherCountries} (${count})`),
      denmarkByStatus: statusBars(
        data.trialsDenmark.trials.map((trial) => trial.status),
        (bucket) => c.dashboard.statusLabel[bucket] ?? bucket,
      ),
      monthly: monthPoints(data.pubmedMonthly.months, data.meta.updated, locale),
    };
  }, [data, locale, c]);

  const filtered = useMemo(() => {
    if (!model) return { global: [], denmark: [], papers: [] };
    const match = (...fields: string[]) => !query || fields.join(" ").toLowerCase().includes(query);
    return {
      global: model.global.filter((trial) =>
        match(trial.title, trial.sponsor, trial.countries.join(" ")),
      ),
      denmark: model.denmark.filter((trial) => match(trial.title, trial.sponsor, trial.status)),
      papers: model.papers.filter((paper) => match(paper.title, paper.journal)),
    };
  }, [model, query]);

  const kpis = [
    { value: data?.meta.counts.recruiting_global, label: c.dashboard.kpi.recruiting },
    { value: data?.meta.counts.denmark, label: c.dashboard.kpi.denmark },
    { value: data?.meta.counts.denmark_recruiting, label: c.dashboard.kpi.denmarkRecruiting },
    { value: data?.meta.counts.pubmed_7d, label: c.dashboard.kpi.papers7 },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "global", label: c.dashboard.tabs.global },
    { id: "denmark", label: c.dashboard.tabs.denmark },
    { id: "papers", label: c.dashboard.tabs.papers },
  ];

  const snapshot = data?.meta.updated ?? "";
  const stale = snapshot ? snapshotUpdateDue(snapshot) : false;

  return (
    <div className="pb-16">
      {/* Ribbon header band */}
      <header className="border-b border-hairline bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-20">
          <div className="mb-5 h-[3px] w-16 bg-[var(--ribbon)]" aria-hidden />
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
            {c.dashboard.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl">{c.dashboard.title}</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {c.dashboard.lede}
          </p>
          <PageCredits
            reviewed={data?.meta.updated ?? LEARN_REVIEWED}
            citations={[
              {
                label: "OpenEndo weekly dataset",
                href: `${RAW_BASE}/docs/data/meta.json`,
              },
              { label: "ClinicalTrials.gov", href: "https://clinicaltrials.gov/" },
              { label: "PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/" },
            ]}
          />
          {isFetching && (
            <p className="mt-3 text-sm text-muted-foreground">{c.common.refreshing}</p>
          )}
          {isError && <p className="mt-3 text-sm text-muted-foreground">{c.common.unavailable}</p>}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* KPIs */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {kpis.slice(0, 3).map((item) => (
            <DataCard
              key={item.label}
              label={item.label}
              value={item.value === undefined ? "—" : item.value.toLocaleString(locale)}
              context={
                item.label === c.dashboard.kpi.recruiting
                  ? c.dashboard.meanings.recruiting
                  : item.label === c.dashboard.kpi.denmark
                    ? c.dashboard.meanings.denmark
                    : c.dashboard.meanings.denmarkRecruiting
              }
              snapshot={data?.meta.updated ?? ""}
              href={path("/dashboard")}
              staleLabel={c.home.staleChip}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="mt-12 grid gap-12 sm:mt-16 sm:gap-16 lg:grid-cols-2">
          <ChartFrame
            title={c.dashboard.charts.country}
            caption={`${c.dashboard.countryNote} ${c.dashboard.sources} ${formatDate(snapshot, locale)}.`}
            snapshot={snapshot}
            stale={stale}
            staleText={c.dashboard.updateDue}
            tail={c.dashboard.updateDueTail}
            locale={locale}
            emptyText={c.dashboard.emptyChart}
            hasData={Boolean(model?.byCountry.length)}
            tableLabel={c.dashboard.showTable}
            table={<DataTable rows={model?.byCountry ?? []} />}
          >
            <HorizontalBars rows={model?.byCountry ?? []} locale={locale} />
          </ChartFrame>
          <ChartFrame
            title={c.dashboard.charts.status}
            caption={`${c.dashboard.charts.status}. ${formatDate(snapshot, locale)}.`}
            snapshot={snapshot}
            stale={stale}
            staleText={c.dashboard.updateDue}
            tail={c.dashboard.updateDueTail}
            locale={locale}
            emptyText={c.dashboard.emptyChart}
            hasData={Boolean(model?.denmarkByStatus.length)}
            tableLabel={c.dashboard.showTable}
            table={<DataTable rows={model?.denmarkByStatus ?? []} />}
          >
            <HorizontalBars rows={model?.denmarkByStatus ?? []} locale={locale} />
          </ChartFrame>
          <div className="lg:col-span-2">
            <ChartFrame
              title={c.dashboard.charts.pubmed}
              caption={`${c.dashboard.charts.pubmed}. PubMed. ${formatDate(snapshot, locale)}.`}
              snapshot={snapshot}
              stale={stale}
              staleText={c.dashboard.updateDue}
              tail={c.dashboard.updateDueTail}
              locale={locale}
              emptyText={c.dashboard.emptyChart}
              hasData={Boolean(model?.monthly.length)}
              tableLabel={c.dashboard.showTable}
              table={
                <DataTable
                  rows={(model?.monthly ?? []).map((point) => ({
                    label: point.month,
                    count: point.count,
                  }))}
                />
              }
            >
              <MonthColumns
                points={model?.monthly ?? []}
                soFar={c.dashboard.soFar}
                locale={locale}
              />
            </ChartFrame>
          </div>
        </div>

        {/* Feed */}
        <div className="mt-16 sm:mt-24">
          <div className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    tab === t.id
                      ? "shrink-0 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] font-medium sm:px-4 sm:text-sm"
                      : "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground sm:px-4 sm:text-sm"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              aria-label={c.dashboard.search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c.dashboard.search}
              className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring sm:w-64"
            />
          </div>

          {tab === "papers" ? (
            <Feed
              head={[
                c.dashboard.columns.date,
                c.dashboard.columns.paper,
                c.dashboard.columns.journal,
              ]}
              widths={["w-[92px]", "", "w-[26%]"]}
              items={filtered.papers.map((p) => ({
                key: p.id,
                title: (
                  <ExternalTitle href={`https://pubmed.ncbi.nlm.nih.gov/${p.id}/`}>
                    {p.title}
                  </ExternalTitle>
                ),
                cells: [
                  <span key="d" className="numeral whitespace-nowrap text-muted-foreground">
                    {p.date}
                  </span>,
                  null,
                  <span key="j" className="text-muted-foreground">
                    {p.journal}
                  </span>,
                ],
                meta: [
                  { label: c.dashboard.columns.journal, value: p.journal },
                  { label: c.dashboard.columns.date, value: p.date },
                ],
              }))}
              empty={isError ? c.dashboard.unavailable : c.dashboard.empty}
            />
          ) : tab === "denmark" ? (
            <Feed
              head={[
                c.dashboard.columns.trial,
                c.dashboard.columns.status,
                c.dashboard.columns.sponsor,
              ]}
              widths={["", "w-[22%]", "w-[26%]"]}
              items={filtered.denmark.map((t) => ({
                key: t.id,
                title: (
                  <ExternalTitle href={`https://clinicaltrials.gov/study/${t.id}`}>
                    {t.title}
                  </ExternalTitle>
                ),
                cells: [
                  null,
                  <span key="s" className="text-muted-foreground">
                    {t.status}
                  </span>,
                  <span key="sp" className="text-muted-foreground">
                    {t.sponsor}
                  </span>,
                ],
                meta: [
                  { label: c.dashboard.columns.status, value: t.status, tag: true },
                  { label: c.dashboard.columns.sponsor, value: t.sponsor },
                ],
              }))}
              empty={isError ? c.dashboard.unavailable : c.dashboard.empty}
            />
          ) : (
            <Feed
              head={[
                c.dashboard.columns.trial,
                c.dashboard.columns.phase,
                c.dashboard.columns.sponsor,
                c.dashboard.columns.countries,
              ]}
              widths={["", "w-[14%]", "w-[22%]", "w-[22%]"]}
              items={filtered.global.map((t) => {
                const countries =
                  t.countries.slice(0, 3).join(", ") +
                  (t.countries.length > 3 ? ` +${t.countries.length - 3}` : "");
                return {
                  key: t.id,
                  title: (
                    <ExternalTitle href={`https://clinicaltrials.gov/study/${t.id}`}>
                      {t.title}
                    </ExternalTitle>
                  ),
                  cells: [
                    null,
                    <span key="p" className="whitespace-nowrap text-muted-foreground">
                      {t.phase}
                    </span>,
                    <span key="s" className="text-muted-foreground">
                      {t.sponsor}
                    </span>,
                    <span key="c" className="text-muted-foreground">
                      {countries}
                    </span>,
                  ],
                  meta: [
                    { label: c.dashboard.columns.phase, value: t.phase, tag: true },
                    { label: c.dashboard.columns.sponsor, value: t.sponsor },
                    { label: c.dashboard.columns.countries, value: countries },
                  ],
                };
              })}
              empty={isError ? c.dashboard.unavailable : c.dashboard.empty}
            />
          )}

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            {c.dashboard.sources}
            {data ? ` · ${c.common.updated} ${data.meta.updated}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExternalTitle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex gap-1 hover:text-foreground"
    >
      <span>{children}</span>
      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
    </a>
  );
}

type FeedItem = {
  key: string;
  title: React.ReactNode;
  /** Desktop cells; `null` marks the slot filled by the title. */
  cells: (React.ReactNode | null)[];
  meta: { label: string; value: string; tag?: boolean }[];
};

function Feed({
  head,
  widths,
  items,
  empty,
}: {
  head: string[];
  widths: string[];
  items: FeedItem[];
  empty: string;
}) {
  if (!items.length) return <p className="py-10 text-sm text-muted-foreground">{empty}</p>;
  const rows = items.slice(0, 60);

  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="divide-y divide-hairline sm:hidden">
        {rows.map((item) => (
          <li key={item.key} className="py-4">
            <p className="text-[15px] font-medium leading-snug">{item.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
              {item.meta.map((m, i) =>
                m.tag ? (
                  <span
                    key={i}
                    className="rounded-full bg-ribbon-soft px-2 py-0.5 text-[11px] font-medium text-foreground"
                  >
                    {m.value}
                  </span>
                ) : (
                  <span key={i} className="flex min-w-0 max-w-full items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden className="text-muted-foreground/50">
                        ·
                      </span>
                    )}
                    <span className="min-w-0 truncate">{m.value}</span>
                  </span>
                ),
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr>
              {head.map((h, i) => (
                <th
                  key={h}
                  className={`${widths[i] ?? ""} border-b border-hairline py-3 pr-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.key} className="border-b border-hairline align-top">
                {item.cells.map((cell, j) => (
                  <td key={j} className="py-4 pr-5 leading-snug">
                    {cell === null ? item.title : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
