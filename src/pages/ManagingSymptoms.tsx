import { Link } from "@tanstack/react-router";
import { TreatmentExplainer } from "@/components/explainers/Explainers";
import {
  MANAGING,
  claimSourceIds,
  strengthLabel,
  text,
  treatmentDiagram,
} from "@/content/explainers/diagrams";
import { useLang } from "@/lib/i18n";
import { formatDate } from "@/lib/dates";

const REVIEWED = "2026-10-28";

export function ManagingSymptoms() {
  const { c, locale, path } = useLang();
  const order = claimSourceIds(treatmentDiagram().groups.flatMap((group) => group.options));

  return (
    <div className="mx-auto max-w-[var(--container)] px-6 pb-24 pt-10">
      <p className="text-sm text-[var(--ink-subtle)]">
        <Link to={path("/learn")} className="text-[var(--ink-subtle)]">
          {c.nav.guides}
        </Link>
        {" / "}
        {locale === "da" ? "Håndter symptomer" : "Managing symptoms"}
      </p>
      <article className="mt-6 max-w-[720px]" lang={locale}>
        <h1 className="text-[var(--text-3xl)]">
          {locale === "da" ? "Håndter symptomer" : "Managing symptoms"}
        </h1>
        <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--sunken)] p-5">
          <h2 className="text-base font-semibold">{c.learn.inShort}</h2>
          <p className="mt-2 text-[var(--text-md)]">
            {locale === "da"
              ? "Smertebehandling, hormoner og operation kan dæmpe symptomer. Ingen af dem kurerer sygdommen. Varme har ingen evidensgrad i NICE eller ESHRE."
              : "Pain medicines, hormones, and surgery can ease symptoms. None of them cures the disease. Heat has no evidence grade in NICE or ESHRE."}
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--ink-subtle)]">
          {c.learn.writtenBy} · {c.learn.reviewed}{" "}
          <time dateTime={REVIEWED}>{formatDate(REVIEWED, locale)}</time>
          {" · "}
          {c.learn.noClinicalReview}
        </p>
        <div className="mt-8 rounded-[var(--radius-md)] bg-[var(--info-bg)] p-5">
          <h2 className="text-[var(--text-lg)] text-[var(--info)]">
            {locale === "da" ? "Når smerten stiger" : "When pain rises"}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {MANAGING.filter((claim) => claim.id.startsWith("flare") || claim.id === "heat").map(
              (claim) => (
                <li key={claim.id}>
                  <span className="font-semibold">{text(claim.title, locale)}. </span>
                  {text(claim.detail, locale)}{" "}
                  <span className="text-sm text-[var(--ink-muted)]">
                    ({strengthLabel(claim.strength, locale)})
                  </span>
                  {claim.sources.map((id) => (
                    <sup key={id} className="ml-0.5">
                      <a href={`#treatment-source-${order.indexOf(id) + 1}`}>
                        {order.indexOf(id) + 1}
                      </a>
                    </sup>
                  ))}
                </li>
              ),
            )}
          </ol>
          <p className="mt-4">
            <Link to={path("/learn/appointment")} className="font-medium">
              {locale === "da" ? "Tag dette med til lægen" : "Bring this to your appointment"}
            </Link>
          </p>
        </div>
        <section className="mt-10" id="work">
          <h2 className="text-[var(--text-2xl)]">
            {locale === "da" ? "Arbejde og skole" : "Work and school"}
          </h2>
          {MANAGING.filter((claim) => claim.id === "work").map((claim) => (
            <p key={claim.id} className="mt-3">
              {text(claim.detail, locale)}
              {claim.sources.map((id) => (
                <sup key={id} className="ml-0.5">
                  <a href={`#treatment-source-${order.indexOf(id) + 1}`}>{order.indexOf(id) + 1}</a>
                </sup>
              ))}
            </p>
          ))}
        </section>
        <div className="mt-12">
          <TreatmentExplainer
            locale={locale}
            showAsText={c.learn.showAsText}
            listHeading={c.learn.sources}
          />
        </div>
        <p className="mt-8">
          <Link to={path("/access")}>{c.nav.care}</Link>
        </p>
      </article>
    </div>
  );
}
