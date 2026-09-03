import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight, Info, MapPin, ShieldAlert } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { GITHUB_URL } from "@/content/data";
import {
  accessQueryOptions,
  pick,
  resolveRegion,
  type Center,
  type Country,
  type Medication,
  type Organization,
} from "@/lib/access.functions";


const LEVEL_STYLES: Record<string, string> = {
  reimbursed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  nhs_option: "bg-sky-50 text-sky-800 ring-sky-200",
  specialist: "bg-sky-50 text-sky-800 ring-sky-200",
  prescription: "bg-secondary text-foreground ring-border",
  out_of_pocket: "bg-amber-50 text-amber-900 ring-amber-200",
  conditional: "bg-amber-50 text-amber-900 ring-amber-200",
  not_approved: "bg-rose-50 text-rose-800 ring-rose-200",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Access() {
  const { c, locale, path } = useLang();
  const t = c.access;
  const query = useQuery(accessQueryOptions);

  const [code, setCode] = useState("");
  const [postcode, setPostcode] = useState("");
  const [submitted, setSubmitted] = useState<{ code: string; postcode: string } | null>(null);

  const countries = useMemo(() => {
    const entries = Object.entries(query.data?.countries ?? {});
    return entries
      .map(([iso, country]) => ({ iso, label: pick(country.name, locale), country }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [query.data, locale]);

  const selected = submitted ? query.data?.countries[submitted.code] : undefined;
  const postcodeSupported = code ? query.data?.countries[code]?.postcode?.supported : false;
  const postcodeInvalid = postcode.length > 0 && !/^\d{4}$/.test(postcode);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.eyebrow}</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 max-w-2xl text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {t.titleA} <span className="accent font-normal">{t.titleAccent}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{t.lede}</p>
      </header>

      {/* Input card */}
      <form
        className="mt-10 rounded-2xl border border-hairline bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!code || postcodeInvalid) return;
          setSubmitted({ code, postcode });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t.countryLabel}
            </span>
            <select
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setPostcode("");
              }}
              disabled={query.isLoading || query.isError}
              className={`mt-2 w-full appearance-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-[15px] text-foreground disabled:opacity-50 ${focusRing}`}
            >
              <option value="">{t.countryPlaceholder}</option>
              {countries.map((x) => (
                <option key={x.iso} value={x.iso}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>

          {postcodeSupported ? (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t.postcodeLabel}
              </span>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                autoComplete="off"
                placeholder={t.postcodePlaceholder}
                aria-invalid={postcodeInvalid}
                className={`mt-2 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-[15px] tabular-nums ${focusRing}`}
              />
            </label>
          ) : (
            <div className="hidden sm:block" />
          )}

          <button
            type="submit"
            disabled={!code || postcodeInvalid || query.isLoading}
            className={`rounded-full bg-primary px-6 py-2.5 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 ${focusRing}`}
          >
            {t.submit}
          </button>
        </div>

        {postcodeInvalid && <p className="mt-3 text-sm text-destructive">{t.postcodeInvalid}</p>}

        {postcodeSupported && (
          <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{pick(query.data?.countries[code]?.postcode?.region_note, locale)}</span>
          </p>
        )}
      </form>

      {query.isLoading && <Skeleton label={t.loading} />}

      {query.isError && (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-card p-6">
          <h2 className="text-lg font-semibold">{t.errorTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.errorBody}</p>
          <button
            onClick={() => query.refetch()}
            className={`mt-4 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-secondary ${focusRing}`}
          >
            {t.retry}
          </button>
        </div>
      )}

      {submitted && query.data && (
        <div className="mt-14 pb-8">
          {selected ? (
            <Results
              country={selected}
              postcode={submitted.postcode}
              disclaimer={pick(query.data.disclaimer, locale)}
              updated={query.data.updated}
            />
          ) : (
            <MissingCountry code={submitted.code} />
          )}
        </div>
      )}
    </div>
  );
}

function Skeleton({ label }: { label: string }) {
  return (
    <div className="mt-8" aria-live="polite">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {lede && <p className="mt-1.5 text-sm text-muted-foreground">{lede}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Meta({
  verified,
  confidence,
}: {
  verified?: string | undefined;
  confidence?: string | undefined;
}) {
  const { c } = useLang();
  if (!verified && !confidence) return null;
  return (
    <p className="mt-4 text-[12px] text-muted-foreground">
      {verified && `${c.access.verified} ${verified}`}
      {verified && confidence && " · "}
      {confidence && `${confidence} ${c.access.confidence}`}
    </p>
  );
}

function Sources({ sources }: { sources?: string[] | undefined }) {
  const { c } = useLang();
  if (!sources?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {c.access.sources}
      </span>
      {sources.map((s, i) => (
        <a
          key={s}
          href={s}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded text-[12px] text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors hover:text-foreground hover:decoration-ribbon ${focusRing}`}
        >
          {sourceLabel(s, i)}
        </a>
      ))}
    </div>
  );
}

function sourceLabel(url: string, i: number) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return `#${i + 1}`;
  }
}

function ExternalLink({ href, label }: { href?: string | undefined; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-foreground transition-colors hover:text-muted-foreground ${focusRing}`}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}

function Results({
  country,
  postcode,
  disclaimer,
  updated,
}: {
  country: Country;
  postcode: string;
  disclaimer: string;
  updated?: string | undefined;
}) {
  const { c, locale } = useLang();
  const t = c.access;
  const meds = country.medications ?? [];
  const centers = country.centers ?? [];
  const orgs = country.organizations ?? [];
  const path = country.access_path?.[locale] ?? country.access_path?.en ?? [];
  const region = postcode ? resolveRegion(postcode, country.postcode) : null;

  const nearest =
    region && centers.length
      ? (centers.find((x) =>
          region.side === "east" ? /rigshospital/i.test(x.id ?? "") : /skejby|aarhus|auh/i.test(x.id ?? ""),
        ) ?? null)
      : null;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        <span className="marker">{pick(country.name, locale)}</span>
      </h2>
      {updated && (
        <p className="mt-2 text-[13px] text-muted-foreground">
          {t.updated} {updated}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-hairline bg-ribbon-soft p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
          {t.disclaimerTitle}
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/80">{disclaimer}</p>
      </div>

      {region && (
        <div className="mt-6 rounded-2xl border border-hairline bg-card p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {t.yourRegion}
          </p>
          <p className="numeral mt-2 text-2xl">{region.region}</p>
          {nearest && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t.nearestCenter}: <span className="text-foreground">{pick(nearest.name, locale)}</span>
            </p>
          )}
        </div>
      )}

      {country.coverage !== "full" && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <p className="text-sm font-semibold text-amber-900">{t.partialTitle}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-amber-900/85">{t.partialBody}</p>
        </div>
      )}

      {meds.length > 0 && (
        <Section title={t.medsTitle} lede={t.medsLede}>
          <div className="grid gap-4 lg:grid-cols-2">
            {meds.map((m) => (
              <MedicationCard key={m.id ?? m.name} med={m} />
            ))}
          </div>
        </Section>
      )}

      {centers.length > 0 && (
        <Section title={t.centersTitle} lede={t.centersLede}>
          <div className="grid gap-4 lg:grid-cols-2">
            {centers.map((x) => (
              <CenterCard key={x.id ?? pick(x.name, locale)} center={x} />
            ))}
          </div>
        </Section>
      )}

      {path.length > 0 && (
        <Section title={t.pathTitle} lede={t.pathLede}>
          <ol className="space-y-4 border-l border-hairline pl-6">
            {path.map((step, i) => (
              <li key={i} className="relative text-[15px] leading-relaxed">
                <span className="numeral absolute -left-[2.05rem] flex h-6 w-6 items-center justify-center rounded-full bg-ribbon text-[13px] text-ink">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {orgs.length > 0 && (
        <Section title={t.orgsTitle} lede={t.orgsLede}>
          <div className="grid gap-4 lg:grid-cols-2">
            {orgs.map((o) => (
              <OrgCard key={o.id ?? pick(o.name, locale)} org={o} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function MedicationCard({ med }: { med: Medication }) {
  const { c, locale } = useLang();
  const t = c.access;
  const level = med.access_level;
  const style = LEVEL_STYLES[level] ?? "bg-secondary text-foreground ring-border";

  return (
    <article className="flex flex-col rounded-2xl border border-hairline bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-[26ch] text-[15px] font-semibold leading-snug">{med.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${style}`}
        >
          {t.levels[level] ?? level.replace(/_/g, " ")}
        </span>
      </div>

      {med.class && <p className="mt-1.5 text-[13px] text-muted-foreground">{med.class}</p>}

      <div className="mt-4 space-y-2.5 text-[14px] leading-relaxed">
        {med.access_note && <p>{pick(med.access_note, locale)}</p>}
        {med.approval_note && (
          <p className="text-muted-foreground">{pick(med.approval_note, locale)}</p>
        )}
        {med.prescription_note && (
          <p className="text-muted-foreground">{pick(med.prescription_note, locale)}</p>
        )}
        {med.price_note && (
          <p className="numeral text-[15px]">{pick(med.price_note, locale)}</p>
        )}
      </div>

      <div className="mt-auto">
        <Meta verified={med.verified} confidence={med.confidence} />
        <Sources sources={med.sources} />
      </div>
    </article>
  );
}

function CenterCard({ center }: { center: Center }) {
  const { c, locale } = useLang();
  return (
    <article className="flex flex-col rounded-2xl border border-hairline bg-card p-5">
      <h3 className="text-[15px] font-semibold leading-snug">{pick(center.name, locale)}</h3>
      {center.area && (
        <p className="mt-1.5 inline-flex w-fit rounded-full bg-ribbon-soft px-2.5 py-1 text-[12px] font-medium">
          {pick(center.area, locale)}
        </p>
      )}
      {center.note && (
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {pick(center.note, locale)}
        </p>
      )}
      <ExternalLink href={center.url} label={c.access.website} />
      <div className="mt-auto">
        <Meta verified={center.verified} confidence={center.confidence} />
        <Sources sources={center.sources} />
      </div>
    </article>
  );
}

function OrgCard({ org }: { org: Organization }) {
  const { c, locale } = useLang();
  return (
    <article className="flex flex-col rounded-2xl border border-hairline bg-card p-5">
      <h3 className="text-[15px] font-semibold leading-snug">{pick(org.name, locale)}</h3>
      {org.services && (
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {pick(org.services, locale)}
        </p>
      )}
      {org.contact && <p className="mt-3 text-[14px]">{pick(org.contact, locale)}</p>}
      <ExternalLink href={org.url} label={c.access.website} />
      <div className="mt-auto">
        <Meta verified={org.verified} confidence={org.confidence} />
        <Sources sources={org.sources} />
      </div>
    </article>
  );
}

function MissingCountry({ code }: { code: string }) {
  const { c } = useLang();
  const t = c.access;
  return (
    <div className="rounded-2xl border border-hairline bg-card p-8 text-center">
      <h2 className="text-xl font-semibold tracking-tight">
        {t.missingTitle} <span className="accent font-normal">{code}</span>
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t.missingBody}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to={path("/knowledge")}
          className={`rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
        >
          {t.missingKnowledge}
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary ${focusRing}`}
        >
          {t.missingContribute}
        </a>
      </div>
    </div>
  );
}
