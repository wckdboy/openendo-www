import { Link } from "@tanstack/react-router";
import { ExplainerSet, SourceList } from "@/components/explainers/Explainers";
import { pageSourceIds } from "@/content/explainers/diagrams";
import { useLang } from "@/lib/i18n";
import { formatDate } from "@/lib/dates";

const REVIEWED = "2026-10-28";

export function HowItWorks() {
  const { c, locale, path } = useLang();
  const ids = pageSourceIds(locale);

  return (
    <div className="mx-auto max-w-[var(--container)] px-6 pb-24 pt-10">
      <p className="text-sm text-[var(--ink-subtle)]">
        <Link to={path("/learn")} className="text-[var(--ink-subtle)]">
          {c.nav.guides}
        </Link>
        {" / "}
        {locale === "da" ? "Sådan virker endometriose" : "How endometriosis works"}
      </p>
      <article className="mt-6 max-w-[720px]" lang={locale}>
        <h1 className="text-[var(--text-3xl)]">
          {locale === "da" ? "Sådan virker endometriose" : "How endometriosis works"}
        </h1>
        <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--sunken)] p-5">
          <h2 className="text-base font-semibold">{c.learn.inShort}</h2>
          <p className="mt-2 text-[var(--text-md)]">
            {locale === "da"
              ? "Væv, der ligner livmoderens slimhinde, vokser uden for livmoderen. Årsagen er ikke fuldt kendt. Der findes ingen kur. Behandling sigter mod symptomerne."
              : "Tissue like the lining of the womb grows outside the womb. The cause is not fully known. There is no cure. Treatment aims at symptoms."}
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--ink-subtle)]">
          {c.learn.writtenBy} · {c.learn.reviewed}{" "}
          <time dateTime={REVIEWED}>{formatDate(REVIEWED, locale)}</time>
          {" · "}
          {c.learn.noClinicalReview}
        </p>
        <p className="mt-2 text-sm text-[var(--ink-subtle)]">
          {c.learn.quietDisclaimer} <Link to={path("/about")}>{c.learn.howToUse}</Link>
        </p>
        <div className="mt-10">
          <ExplainerSet locale={locale} showAsText={c.learn.showAsText} />
        </div>
        <SourceList ids={ids} heading={c.learn.sources} />
      </article>
    </div>
  );
}
