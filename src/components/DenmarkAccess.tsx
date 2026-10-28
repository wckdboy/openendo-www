import { useQuery } from "@tanstack/react-query";
import { accessQueryOptions, pick } from "@/lib/access.functions";
import { useLang } from "@/lib/i18n";

export function DenmarkAccess() {
  const { c, locale } = useLang();
  const t = c.learn;
  const query = useQuery(accessQueryOptions);
  const country = query.data?.countries.DK;

  if (query.isPending) {
    return (
      <p className="mt-10 text-sm text-muted-foreground" aria-busy="true">
        {t.loadingAccess}
      </p>
    );
  }

  if (query.isError || !country) {
    return (
      <div className="mt-10 rounded-2xl border border-hairline bg-secondary/40 p-5">
        <h2 className="text-lg font-semibold tracking-tight">{t.accessErrorTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.accessErrorBody}</p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          {c.access.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-12">
      <p className="text-xs text-muted-foreground">
        {query.data?.disclaimer ? pick(query.data.disclaimer, locale) : null}
        {country.verified ? ` · ${c.access.verified} ${country.verified}` : ""}
      </p>

      {country.access_path ? (
        <section aria-labelledby="dk-path">
          <h2 id="dk-path" className="text-2xl font-semibold tracking-tight">
            {c.access.pathTitle}
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed">
            {country.access_path[locale].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {country.centers?.length ? (
        <section aria-labelledby="dk-centers">
          <h2 id="dk-centers" className="text-2xl font-semibold tracking-tight">
            {c.access.centersTitle}
          </h2>
          <ul className="mt-5 divide-y divide-hairline border-t border-hairline">
            {country.centers.map((center) => (
              <li key={center.id ?? pick(center.name, locale)} className="py-4">
                <p className="font-medium">{pick(center.name, locale)}</p>
                {center.note ? (
                  <p className="mt-1 text-sm text-muted-foreground">{pick(center.note, locale)}</p>
                ) : null}
                {center.url ? (
                  <a
                    href={center.url}
                    className="mt-2 inline-block text-sm underline decoration-hairline underline-offset-4"
                  >
                    {center.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {country.medications?.length ? (
        <section aria-labelledby="dk-meds">
          <h2 id="dk-meds" className="text-2xl font-semibold tracking-tight">
            {c.access.medsTitle}
          </h2>
          <ul className="mt-5 divide-y divide-hairline border-t border-hairline">
            {country.medications.map((med) => (
              <li key={med.id ?? med.name} className="py-4">
                <p className="font-medium">{med.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.access.levels[med.access_level] ?? med.access_level}
                  {med.confidence ? ` · ${med.confidence} ${c.access.confidence}` : ""}
                </p>
                {med.access_note ? (
                  <p className="mt-2 text-sm leading-relaxed">{pick(med.access_note, locale)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {country.organizations?.length ? (
        <section aria-labelledby="dk-orgs">
          <h2 id="dk-orgs" className="text-2xl font-semibold tracking-tight">
            {c.access.orgsTitle}
          </h2>
          <ul className="mt-5 divide-y divide-hairline border-t border-hairline">
            {country.organizations.map((org) => (
              <li key={org.id ?? pick(org.name, locale)} className="py-4">
                <p className="font-medium">{pick(org.name, locale)}</p>
                {org.services ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {pick(org.services, locale)}
                  </p>
                ) : null}
                {org.url ? (
                  <a
                    href={org.url}
                    className="mt-2 inline-block text-sm underline decoration-hairline underline-offset-4"
                  >
                    {org.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
