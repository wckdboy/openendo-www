import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RibbonMark } from "@/components/RibbonMark";
import { Disclaimer } from "@/components/Disclaimer";
import { useLang } from "@/lib/i18n";
import { canonicalQueryOptions, type ContentBlock, type FundingEntry } from "@/lib/canonical";
import { openCalls } from "@/lib/open-calls";
import { useMounted } from "@/lib/use-mounted";
import { GITHUB_URL, WHO_FACT_SHEET } from "@/lib/site";

export function Home() {
  const { c, locale, path } = useLang();
  const { data, isFetching, isError } = useQuery(canonicalQueryOptions);
  const mounted = useMounted();
  const today = mounted ? new Date().toISOString().slice(0, 10) : null;
  const grants = today && data ? openCalls(data.funding, today) : [];

  const kpis = [
    { value: data?.meta.counts.recruiting_global, label: c.dashboard.kpi.recruiting },
    { value: data?.meta.counts.denmark, label: c.dashboard.kpi.denmark },
    { value: data?.meta.counts.pubmed_7d, label: c.dashboard.kpi.papers7 },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32 lg:pb-28">
          <RibbonMark className="pointer-events-none absolute right-6 top-1/2 h-[520px] w-[520px] -translate-y-1/2 opacity-[0.05] sm:h-[680px] sm:w-[680px] lg:h-[900px] lg:w-[900px]" />
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="rise text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {c.home.eyebrow}
              </p>
              <h1 className="rise mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                {c.home.titleA} <span className="accent font-normal">{c.home.titleAccent}</span>
              </h1>
              <p className="rise mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                {c.home.lede}
              </p>
              <div className="rise mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to={path("/learn")}
                  className="group inline-flex items-center gap-2 rounded-full bg-ribbon px-6 py-3 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
                >
                  {c.nav.learn}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to={path("/dashboard")}
                  className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.home.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                {c.home.trust.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rise lg:col-span-5">
              <div className="rounded-3xl border border-hairline bg-ribbon-soft/50 p-7 sm:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {c.home.liveEyebrow}
                </p>
                <h2 className="mt-3 text-lg font-semibold tracking-tight">{c.home.liveTitle}</h2>
                <dl className="mt-7 grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-hairline">
                  {kpis.map((item) => (
                    <div
                      key={item.label}
                      className="lg:flex lg:items-baseline lg:justify-between lg:gap-6 lg:py-4 lg:first:pt-0 lg:last:pb-0"
                    >
                      <dd className="numeral text-3xl leading-none lg:order-2 lg:text-[28px]">
                        {item.value === undefined ? "—" : item.value.toLocaleString(locale)}
                      </dd>
                      <dt className="mt-2 text-xs leading-snug text-muted-foreground lg:order-1 lg:mt-0 lg:text-sm">
                        {item.label}
                      </dt>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">
                  {data ? `${c.common.updated} ${data.meta.updated}` : c.dashboard.loading}
                  {isFetching ? ` · ${c.common.refreshing}` : ""}
                </p>
                <Link
                  to={path("/dashboard")}
                  className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium"
                >
                  <span className="marker">{c.home.liveCta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Disclaimer title={c.learn.notAdviceTitle} body={c.learn.notAdviceBody} />
      </div>

      <Section eyebrow="" title={c.home.statsTitle} lede={c.home.liveLede}>
        {isError && <p className="text-sm text-muted-foreground">{c.common.unavailable}</p>}
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.content.stats ?? []).map((stat) => (
            <div key={stat.label.en} className="border-t border-foreground/15 pt-5">
              <p className="numeral text-5xl leading-none">{stat.value}</p>
              <p className="mt-4 text-[15px] leading-snug">{stat.label[locale]}</p>
              {stat.source ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  <SourceText source={stat.source} />
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow={c.home.whyEyebrow} title={c.home.whyTitle} lede="">
        <div className="grid max-w-5xl gap-x-16 gap-y-12 md:grid-cols-2">
          {(data?.content.problems ?? []).map((fact, index) => (
            <Fact key={fact.title.en} fact={fact} index={index} locale={locale} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow={c.home.fundingEyebrow}
        title={c.home.fundingTitle}
        lede={c.home.fundingLede}
      >
        {!today ? (
          <p className="text-sm text-muted-foreground" aria-busy="true">
            {c.home.fundingChecking}
          </p>
        ) : grants.length === 0 ? (
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {c.home.fundingEmpty}
          </p>
        ) : (
          <ul className="max-w-4xl divide-y divide-hairline border-t border-hairline">
            {grants.map((grant) => (
              <GrantRow key={grant.id ?? grant.name} grant={grant} locale={locale} today={today} />
            ))}
          </ul>
        )}
      </Section>

      <Section eyebrow={c.learn.eyebrow} title={c.learn.titleA} lede={c.learn.lede}>
        <div className="flex flex-wrap gap-3">
          <Link
            to={path("/learn")}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            {c.learn.readGuide}
          </Link>
          <Link
            to={path("/evidence")}
            className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium"
          >
            {c.nav.evidence}
          </Link>
          <Link
            to={path("/access")}
            className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium"
          >
            {c.nav.access}
          </Link>
        </div>
      </Section>

      <Section eyebrow={c.home.actionEyebrow} title={c.home.actionTitle} lede="">
        <div className="grid gap-10 md:grid-cols-3">
          {(data?.content.actions ?? []).slice(0, 6).map((action) => (
            <div key={action.title.en} className="border-t border-foreground/15 pt-5">
              <h3 className="text-lg font-semibold tracking-tight">{action.title[locale]}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {action.body[locale]}
              </p>
              <a
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
              >
                <span className="marker">{action.cta[locale]}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {data?.content.methodology[locale]}
        </p>
        <a
          href={GITHUB_URL}
          className="mt-4 inline-flex text-sm font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="marker">{c.home.ctaSecondary}</span>
        </a>
      </Section>
    </div>
  );
}

function Fact({ fact, index, locale }: { fact: ContentBlock; index: number; locale: "en" | "da" }) {
  return (
    <div>
      <p className="numeral text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">{fact.title[locale]}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{fact.body[locale]}</p>
      {fact.source ? (
        <p className="mt-3 text-xs text-muted-foreground/80">
          <SourceText source={fact.source} />
        </p>
      ) : null}
    </div>
  );
}

function SourceText({ source }: { source: string }) {
  const href = source.startsWith("WHO")
    ? WHO_FACT_SHEET
    : source.includes("ClinicalTrials")
      ? "https://clinicaltrials.gov/"
      : undefined;
  if (!href) return source;
  return (
    <a href={href} className="underline decoration-hairline underline-offset-4">
      {source}
    </a>
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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group -mx-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 rounded-xl px-3 py-6 transition-colors hover:bg-secondary/50"
      >
        <div className="min-w-0">
          <p className="text-[17px] font-medium tracking-tight">{grant.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{grant.org}</p>
          {grant.desc?.[locale] ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {grant.desc[locale]}
            </p>
          ) : null}
        </div>
        <p className="numeral shrink-0 text-sm text-muted-foreground">{deadlineLabel}</p>
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
    <section className="below-fold mx-auto max-w-6xl border-b border-hairline px-6 py-20 last:border-b-0 sm:py-24">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {lede ? (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{lede}</p>
      ) : null}
      <div className="mt-10 sm:mt-12">{children}</div>
    </section>
  );
}
