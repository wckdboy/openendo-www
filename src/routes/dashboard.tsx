import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { openEndoQueryOptions, paperMonthlyQueryOptions } from "@/lib/openendo.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Live endometriosis research dashboard — OpenEndo" },
      {
        name: "description",
        content:
          "Recruiting endometriosis clinical trials worldwide and in Denmark, plus PubMed publication output, fetched live from public registries.",
      },
      { property: "og:title", content: "Live endometriosis research dashboard — OpenEndo" },
      {
        property: "og:description",
        content:
          "Trials by country, Danish trial statuses, monthly publication counts and the newest papers on endometriosis.",
      },
    ],
  }),
  component: Dashboard,
});

type Tab = "global" | "denmark" | "papers";

function Dashboard() {
  const { c, locale } = useLang();
  const { data, isLoading } = useQuery(openEndoQueryOptions);
  const monthlyQuery = useQuery(paperMonthlyQueryOptions);
  const monthly = monthlyQuery.data ?? [];
  const [tab, setTab] = useState<Tab>("global");
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!data) return { global: [], denmark: [], papers: [] };
    const match = (...fields: string[]) =>
      !query || fields.join(" ").toLowerCase().includes(query);
    return {
      global: data.trials.global.filter((t) => match(t.title, t.sponsor, t.countries.join(" "))),
      denmark: data.trials.denmark.filter((t) => match(t.title, t.sponsor, t.status)),
      papers: data.papers.recent.filter((p) => match(p.title, p.journal)),
    };
  }, [data, query]);

  const kpis = [
    { value: data?.trials.globalTotal, label: c.dashboard.kpi.recruiting },
    { value: data?.trials.denmarkTotal, label: c.dashboard.kpi.denmark },
    { value: data?.papers.yearTotal, label: c.dashboard.kpi.papers },
    { value: data?.papers.weekTotal, label: c.dashboard.kpi.papers7 },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "global", label: c.dashboard.tabs.global },
    { id: "denmark", label: c.dashboard.tabs.denmark },
    { id: "papers", label: c.dashboard.tabs.papers },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-8 pt-20">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {c.dashboard.eyebrow}
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {c.dashboard.title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="accent font-normal">{c.dashboard.title.split(" ").slice(-1)}</span>
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {c.dashboard.lede}
      </p>
      {isLoading && <p className="mt-4 text-sm text-muted-foreground">{c.dashboard.loading}</p>}

      {/* KPIs */}
      <div className="mt-14 grid divide-y divide-hairline border-y border-hairline sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
        {kpis.map((k) => (
          <div key={k.label} className="px-2 py-8 sm:px-7 sm:first:pl-0">
            <p className="numeral text-4xl leading-none">
              {k.value === undefined ? "—" : k.value.toLocaleString(locale)}
            </p>
            <p className="mt-3 text-sm leading-snug text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <ChartBlock title={c.dashboard.charts.country}>
          {data?.trials.byCountry.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.trials.byCountry}
                layout="vertical"
                margin={{ left: 0, right: 16 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip content={<Bubble />} cursor={{ fill: "var(--color-secondary)" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                  {data.trials.byCountry.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "var(--color-ribbon)" : "var(--color-chart-4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Unavailable />
          )}
        </ChartBlock>

        <ChartBlock title={c.dashboard.charts.status}>
          {data?.trials.denmarkByStatus.length ? (
            <ul className="divide-y divide-hairline border-t border-hairline">
              {data.trials.denmarkByStatus.map((s) => {
                const max = data.trials.denmarkByStatus[0]?.count || 1;
                return (
                  <li key={s.label} className="flex items-center gap-4 py-3.5">
                    <span className="w-44 shrink-0 truncate text-sm">{s.label}</span>
                    <span className="h-1.5 flex-1 rounded-full bg-secondary">
                      <span
                        className="block h-1.5 rounded-full bg-ribbon"
                        style={{ width: `${Math.max(6, (s.count / max) * 100)}%` }}
                      />
                    </span>
                    <span className="numeral w-8 text-right text-sm">{s.count}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Unavailable />
          )}
        </ChartBlock>

        <div className="lg:col-span-2">
          <ChartBlock title={c.dashboard.charts.pubmed}>
            {monthly.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthly} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-hairline)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip content={<Bubble />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: "var(--color-ribbon)", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "var(--color-ribbon)", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Unavailable />
            )}
          </ChartBlock>
        </div>
      </div>

      {/* Tables */}
      <div className="mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  tab === t.id
                    ? "rounded-full bg-secondary px-4 py-1.5 text-sm font-medium"
                    : "rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={c.dashboard.search}
            className="w-full max-w-xs rounded-full border border-border bg-card px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          {tab === "papers" ? (
            <Table
              head={[c.dashboard.columns.date, c.dashboard.columns.paper, c.dashboard.columns.journal]}
              rows={filtered.papers.map((p) => [
                <span key="d" className="numeral whitespace-nowrap text-muted-foreground">
                  {p.date}
                </span>,
                <a
                  key="t"
                  href={`https://pubmed.ncbi.nlm.nih.gov/${p.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex gap-1 hover:text-foreground"
                >
                  {p.title}
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                </a>,
                <span key="j" className="text-muted-foreground">
                  {p.journal}
                </span>,
              ])}
              empty={data?.papers.ok === false ? c.dashboard.unavailable : c.dashboard.empty}
            />
          ) : tab === "denmark" ? (
            <Table
              head={[
                c.dashboard.columns.trial,
                c.dashboard.columns.status,
                c.dashboard.columns.sponsor,
              ]}
              rows={filtered.denmark.map((t) => [
                <TrialLink key="t" id={t.id} title={t.title} />,
                <span key="s" className="whitespace-nowrap text-muted-foreground">
                  {t.status}
                </span>,
                <span key="sp" className="text-muted-foreground">
                  {t.sponsor}
                </span>,
              ])}
              empty={data?.trials.ok === false ? c.dashboard.unavailable : c.dashboard.empty}
            />
          ) : (
            <Table
              head={[
                c.dashboard.columns.trial,
                c.dashboard.columns.phase,
                c.dashboard.columns.sponsor,
                c.dashboard.columns.countries,
              ]}
              rows={filtered.global.map((t) => [
                <TrialLink key="t" id={t.id} title={t.title} />,
                <span key="p" className="whitespace-nowrap text-muted-foreground">
                  {t.phase}
                </span>,
                <span key="s" className="text-muted-foreground">
                  {t.sponsor}
                </span>,
                <span key="c" className="text-muted-foreground">
                  {t.countries.slice(0, 3).join(", ")}
                  {t.countries.length > 3 ? ` +${t.countries.length - 3}` : ""}
                </span>,
              ])}
              empty={data?.trials.ok === false ? c.dashboard.unavailable : c.dashboard.empty}
            />
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {c.dashboard.sources}
          {data ? ` · ${c.common.updated} ${new Date(data.fetchedAt).toLocaleString(locale)}` : ""}
        </p>
      </div>
    </div>
  );
}

function TrialLink({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`https://clinicaltrials.gov/study/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex gap-1"
    >
      {title}
      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
    </a>
  );
}

function Table({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  empty: string;
}) {
  if (!rows.length) return <p className="py-10 text-sm text-muted-foreground">{empty}</p>;
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          {head.map((h) => (
            <th
              key={h}
              className="whitespace-nowrap border-b border-hairline py-3 pr-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, 60).map((row, i) => (
          <tr key={i} className="border-b border-hairline align-top">
            {row.map((cell, j) => (
              <td key={j} className="max-w-md py-4 pr-6 leading-snug">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Unavailable() {
  const { c } = useLang();
  return <p className="py-12 text-sm text-muted-foreground">{c.dashboard.unavailable}</p>;
}

function Bubble({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium">{label}</p>
      <p className="numeral text-muted-foreground">{payload[0].value}</p>
    </div>
  );
}
