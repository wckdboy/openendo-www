import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

const ITEMS = {
  en: [
    ["Period pain", "Pain with your period that stops daily activities or affects quality of life"],
    ["Pelvic pain", "Pain in the pelvis that is there outside your period"],
    ["Pain with sex", "Deep pain during or after sex"],
    ["Bowel", "Painful bowel movements, or other bowel symptoms, around your period"],
    ["Bladder", "Pain passing urine, or blood in the urine, around your period"],
    ["Pregnancy", "Trouble getting pregnant, together with one of the symptoms above"],
    ["Family", "A parent, sister, or child with endometriosis"],
  ],
  da: [
    [
      "Menstruationssmerter",
      "Smerter ved menstruation, der stopper hverdagen eller påvirker livskvaliteten",
    ],
    ["Underlivssmerter", "Smerter i underlivet også uden for menstruationen"],
    ["Smerter ved sex", "Dybe smerter under eller efter sex"],
    ["Tarm", "Smerter ved afføring eller andre tarmsymptomer omkring menstruationen"],
    ["Blære", "Smerter ved vandladning eller blod i urinen omkring menstruationen"],
    ["Graviditet", "Svært ved at blive gravid sammen med et af symptomerne ovenfor"],
    ["Familie", "En forælder, søster eller et barn med endometriose"],
  ],
} as const;

export function AppointmentSheet() {
  const { locale, path, c } = useLang();
  const items = ITEMS[locale];
  const title = locale === "da" ? "Tag dette med til lægen" : "Bring this to your appointment";

  return (
    <div className="mx-auto max-w-[var(--measure)] px-6 pb-24 pt-10">
      <p className="no-print text-sm text-[var(--ink-subtle)]">
        <Link to={path("/learn/managing-symptoms")}>
          {locale === "da" ? "Håndter symptomer" : "Managing symptoms"}
        </Link>
      </p>
      <article lang={locale}>
        <h1 className="text-[var(--text-3xl)]">{title}</h1>
        <p className="mt-3 text-base text-[var(--ink-muted)]">
          {locale === "da"
            ? "Listen er de tegn, NICE NG73 siger, man skal mistænke endometriose ved. Dagbogen er den, NICE siger kan hjælpe samtalen."
            : "The list is the signs NICE NG73 says should raise suspicion of endometriosis. The diary is the one NICE says can help the conversation."}{" "}
          <a href="https://www.nice.org.uk/guidance/ng73/chapter/Recommendations">
            NICE NG73 1.3.1–1.3.3
          </a>
        </p>
        <button
          type="button"
          className="no-print mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-primary px-4 text-base text-[var(--on-primary)]"
          onClick={() => window.print()}
        >
          {locale === "da" ? "Udskriv" : "Print"}
        </button>
        <h2 className="mt-8 text-[var(--text-xl)]">
          {locale === "da" ? "Det jeg mærker" : "What I notice"}
        </h2>
        <ul className="mt-4 space-y-3">
          {items.map(([label, detail]) => (
            <li key={label} className="flex gap-3">
              <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" aria-label={label} />
              <span>
                <span className="font-semibold">{label}. </span>
                <span className="text-[var(--ink-muted)]">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-[var(--text-xl)]">{locale === "da" ? "Dagbog" : "Diary"}</h2>
        <table className="mt-4 w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              {(locale === "da"
                ? ["Dato", "Smerte", "Blødning", "Tarm / blære", "Hvad jeg prøvede"]
                : ["Date", "Pain", "Bleeding", "Bowel / bladder", "What I tried"]
              ).map((heading) => (
                <th
                  key={heading}
                  className="border-b border-[var(--border-strong)] py-2 pr-2 font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, index) => (
              <tr key={index} className="h-11">
                {Array.from({ length: 5 }, (_, cell) => (
                  <td key={cell} className="border-b border-hairline" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-sm text-[var(--ink-subtle)]">
          {c.learn.quietDisclaimer} <Link to={path("/about")}>{c.learn.howToUse}</Link>
        </p>
      </article>
    </div>
  );
}
