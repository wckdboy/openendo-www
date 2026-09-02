import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RibbonMark } from "@/components/RibbonMark";
import { useLang } from "@/lib/i18n";
import { openEndoQueryOptions } from "@/lib/openendo.functions";
import { actions, facts, grants, stats, GITHUB_URL } from "@/content/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenEndo — open data on endometriosis research, trials and funding" },
      {
        name: "description",
        content:
          "Live, open analytics on endometriosis clinical trials, research and funding. Because 190 million people deserve to be taken seriously.",
      },
      {
        property: "og:title",
        content: "OpenEndo — open data on endometriosis research, trials and funding",
      },
      {
        property: "og:description",
        content:
          "Every endometriosis trial, paper and grant, tracked in the open and refreshed from public registries.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { c, locale } = useLang();
  const { data } = useQuery(openEndoQueryOptions);

  const grantList = grants[locale]
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  const kpis = [
    { value: data?.trials.globalTotal, label: c.dashboard.kpi.recruiting },
    { value: data?.trials.denmarkTotal, label: c.dashboard.kpi.denmark },
    { value: data?.papers.weekTotal, label: c.dashboard.kpi.papers7 },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <RibbonMark className="pointer-events-none absolute -right-24 -top-20 h-[420px] w-[420px] opacity-[0.07]" />
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-32">
          <p className="rise text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {c.home.eyebrow}
          </p>
          <h1 className="rise mt-6 max-w-3xl text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {c.home.titleA} <span className="accent font-normal">{c.home.titleAccent}</span>
          </h1>
          <p className="rise mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            {c.home.lede}
          </p>
          <div className="rise mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-ribbon px-6 py-3 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              {c.home.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.home.ctaSecondary}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {c.home.trust.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stats */}
      <Section eyebrow="" title={c.home.statsTitle} lede="">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats[locale].map((s) => (
            <div key={s.label} className="border-t border-foreground/15 pt-5">
              <p className="numeral text-5xl leading-none">{s.value}</p>
              <p className="mt-4 text-[15px] leading-snug">{s.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section eyebrow={c.home.whyEyebrow} title={c.home.whyTitle} lede="">
        <div className="grid gap-x-14 gap-y-12 md:grid-cols-2">
          {facts[locale].map((f, i) => (
            <div key={f.title}>
              <p className="numeral text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
              <p className="mt-3 text-xs text-muted-foreground/80">{f.source}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Live snapshot */}
      <Section eyebrow={c.home.liveEyebrow} title={c.home.liveTitle} lede={c.home.liveLede}>
        <div className="grid divide-y divide-hairline border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {kpis.map((k) => (
            <div key={k.label} className="px-2 py-8 sm:px-8 sm:first:pl-0">
              <p className="numeral text-4xl leading-none">
                {k.value === undefined ? "—" : k.value.toLocaleString(locale)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium"
        >
          <span className="marker">{c.home.liveCta}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      {/* Funding */}
      <Section eyebrow={c.home.fundingEyebrow} title={c.home.fundingTitle} lede={c.home.fundingLede}>
        <ul className="divide-y divide-hairline border-t border-hairline">
          {grantList.map((g) => (
            <li key={g.name}>
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6 transition-colors hover:bg-secondary/50"
              >
                <div className="min-w-0">
                  <p className="text-[17px] font-medium tracking-tight">{g.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {g.funder} · {g.amount}
                  </p>
                </div>
                <p className="numeral shrink-0 text-sm text-muted-foreground">
                  <Countdown iso={g.deadline} />
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* Action */}
      <Section eyebrow={c.home.actionEyebrow} title={c.home.actionTitle} lede="">
        <div className="grid gap-10 md:grid-cols-3">
          {actions[locale].map((a) => (
            <div key={a.title} className="border-t border-foreground/15 pt-5">
              <h3 className="text-lg font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{a.body}</p>
              {a.url.startsWith("/") ? (
                <Link
                  to="/dashboard"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  <span className="marker">{a.cta}</span>
                </Link>
              ) : (
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  <span className="marker">{a.cta}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Countdown({ iso }: { iso: string }) {
  const { c } = useLang();
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  const label = days < 0 ? c.common.closed : days === 0 ? c.common.dueToday : `${days} ${c.common.daysLeft}`;
  return (
    <span>
      {iso} · {label}
    </span>
  );
}

function Section({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      )}
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {lede && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{lede}</p>}
      <div className="mt-14">{children}</div>
    </section>
  );
}
