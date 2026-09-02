import type { Locale } from "./copy";

export type Stat = { value: string; label: string; note: string };
export type Fact = { title: string; body: string; source: string };
export type Grant = {
  name: string;
  funder: string;
  deadline: string; // ISO date
  amount: string;
  url: string;
};
export type Action = { title: string; body: string; cta: string; url: string };
export type Article = { id: string; heading: string; body: string[]; source: string; url: string };

const statsEn: Stat[] = [
  { value: "190M", label: "people live with endometriosis", note: "Roughly 10% of women and girls of reproductive age. WHO, 2023." },
  { value: "6.6yr", label: "average wait for a diagnosis", note: "Pooled diagnostic delay across high-income countries." },
  { value: "0.05%", label: "of health research funding", note: "Endometriosis' share of public research spend, despite its prevalence." },
  { value: "1", label: "diagnostic gold standard: surgery", note: "No blood test is in routine clinical use anywhere." },
];

const statsDa: Stat[] = [
  { value: "190M", label: "mennesker lever med endometriose", note: "Cirka 10% af kvinder i den fertile alder. WHO, 2023." },
  { value: "6,6 år", label: "gennemsnitlig ventetid på diagnose", note: "Samlet diagnoseforsinkelse i højindkomstlande." },
  { value: "0,05%", label: "af sundhedsforskningsmidlerne", note: "Endometrioses andel af offentlig forskningsstøtte trods udbredelsen." },
  { value: "1", label: "diagnostisk guldstandard: kirurgi", note: "Ingen blodprøve er i rutinemæssig klinisk brug nogen steder." },
];

const factsEn: Fact[] = [
  {
    title: "Pain is still normalised",
    body: "Symptoms are routinely dismissed as ordinary period pain, by families, by teachers, and by clinicians. That dismissal is the single biggest driver of diagnostic delay.",
    source: "WHO fact sheet, endometriosis",
  },
  {
    title: "The money does not match the burden",
    body: "Endometriosis costs European economies tens of billions a year in lost work and care, yet receives a fraction of the research funding given to conditions of similar scale.",
    source: "EU parliamentary questions on endometriosis funding",
  },
  {
    title: "Care is a postcode lottery",
    body: "Access to excision surgery, specialist centres and multidisciplinary pain care varies enormously between and within countries. Most patients never see a specialist centre.",
    source: "ESHRE endometriosis guideline, 2022",
  },
  {
    title: "The data is scattered",
    body: "Trials, publications, funding calls and policy live in separate registries that nobody aggregates. OpenEndo does the aggregation, in public, for free.",
    source: "OpenEndo",
  },
];

const factsDa: Fact[] = [
  {
    title: "Smerter bliver stadig normaliseret",
    body: "Symptomer afvises rutinemæssigt som almindelige menstruationssmerter — af familie, lærere og læger. Den afvisning er den største enkeltårsag til forsinket diagnose.",
    source: "WHO faktaark om endometriose",
  },
  {
    title: "Pengene følger ikke sygdomsbyrden",
    body: "Endometriose koster europæiske økonomier titusinder af milliarder årligt i tabt arbejde og behandling, men får en brøkdel af forskningsmidlerne til lidelser af samme størrelse.",
    source: "EU-forespørgsler om endometrioseforskning",
  },
  {
    title: "Behandling afhænger af postnummeret",
    body: "Adgang til excisionskirurgi, specialcentre og tværfaglig smertebehandling varierer voldsomt mellem og inden for lande. De fleste patienter ser aldrig et specialcenter.",
    source: "ESHRE-retningslinje for endometriose, 2022",
  },
  {
    title: "Data ligger spredt",
    body: "Forsøg, publikationer, puljer og politik ligger i separate registre, som ingen samler. OpenEndo samler dem — offentligt og gratis.",
    source: "OpenEndo",
  },
];

const grantsEn: Grant[] = [
  {
    name: "Horizon Europe — Cluster 1 Health calls",
    funder: "European Commission",
    deadline: "2026-09-16",
    amount: "€6–12M per project",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
  },
  {
    name: "Novo Nordisk Foundation — Women's Health",
    funder: "Novo Nordisk Foundation",
    deadline: "2026-10-01",
    amount: "Up to DKK 15M",
    url: "https://novonordiskfonden.dk/en/grants/",
  },
  {
    name: "Independent Research Fund Denmark — Project 1",
    funder: "Danmarks Frie Forskningsfond",
    deadline: "2026-10-27",
    amount: "DKK 1–4.5M",
    url: "https://dff.dk/en",
  },
  {
    name: "Wellcome Discovery Awards",
    funder: "Wellcome Trust",
    deadline: "2026-11-10",
    amount: "Up to £3M",
    url: "https://wellcome.org/research-funding",
  },
  {
    name: "NIH R01 — standard cycle",
    funder: "National Institutes of Health",
    deadline: "2026-10-05",
    amount: "Varies",
    url: "https://grants.nih.gov/funding/searchguide/index.html",
  },
];

const grantsDa: Grant[] = grantsEn.map((g, i) => ({
  ...g,
  name: [
    "Horizon Europe — Cluster 1, sundhedsopslag",
    "Novo Nordisk Fonden — kvinders sundhed",
    "Danmarks Frie Forskningsfond — Projekt 1",
    "Wellcome Discovery Awards",
    "NIH R01 — ordinær runde",
  ][i]!,
  amount: ["6–12 mio. € pr. projekt", "Op til 15 mio. kr.", "1–4,5 mio. kr.", "Op til 3 mio. £", "Varierer"][i]!,
}));

const actionsEn: Action[] = [
  {
    title: "Add data, not opinions",
    body: "Every dataset, source and script behind this site is public. Fix a number, add a registry, translate a page.",
    cta: "Open the repository",
    url: "https://github.com/wckdboy/openendo",
  },
  {
    title: "Find a trial you can join",
    body: "Recruiting studies are listed with sponsor, phase and country. Bring the record to your own clinician.",
    cta: "Browse recruiting trials",
    url: "/dashboard",
  },
  {
    title: "Send the numbers upward",
    body: "Funding decisions are made by people who have never seen these figures side by side. Send them the dashboard.",
    cta: "Share the dashboard",
    url: "/dashboard",
  },
];

const actionsDa: Action[] = [
  {
    title: "Bidrag med data, ikke holdninger",
    body: "Alle datasæt, kilder og scripts bag siden er offentlige. Ret et tal, tilføj et register, oversæt en side.",
    cta: "Åbn kodelageret",
    url: "https://github.com/wckdboy/openendo",
  },
  {
    title: "Find et forsøg du kan deltage i",
    body: "Rekrutterende studier vises med sponsor, fase og land. Tag registreringen med til din egen læge.",
    cta: "Se rekrutterende forsøg",
    url: "/dashboard",
  },
  {
    title: "Send tallene opad",
    body: "Beslutninger om bevillinger træffes af folk, der aldrig har set disse tal side om side. Send dem dashboardet.",
    cta: "Del dashboardet",
    url: "/dashboard",
  },
];

const articlesEn: Article[] = [
  {
    id: "what-it-is",
    heading: "What endometriosis is",
    body: [
      "Endometriosis is a chronic condition in which tissue resembling the lining of the uterus grows outside it — most often on the ovaries, fallopian tubes, bowel, bladder and the peritoneum lining the pelvis.",
      "That tissue responds to hormonal cycles, inflames the area around it and can form adhesions that bind organs together. It is a whole-body inflammatory disease, not a monthly inconvenience.",
    ],
    source: "WHO",
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
  },
  {
    id: "symptoms",
    heading: "Symptoms worth taking seriously",
    body: [
      "Severe period pain, pain during or after sex, pain when urinating or opening the bowels, chronic pelvic pain, heavy bleeding, bloating, profound fatigue, and difficulty conceiving.",
      "Symptom severity does not track disease stage. Minimal visible disease can cause disabling pain, and extensive disease can be nearly silent. Pain that stops someone attending school or work is reason enough to investigate.",
    ],
    source: "ESHRE guideline",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "diagnosis",
    heading: "How diagnosis actually works",
    body: [
      "Assessment starts with a symptom history, then examination and imaging — transvaginal ultrasound or MRI, which can identify ovarian endometriomas and deep disease but routinely miss superficial disease.",
      "Laparoscopy with histology remains the definitive answer. Guidelines now support starting treatment on clinical suspicion rather than delaying care until surgery, which is why documenting symptoms early matters.",
    ],
    source: "ESHRE guideline",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "treatment",
    heading: "Treatment options",
    body: [
      "Hormonal therapy (combined pill, progestins, GnRH analogues) suppresses cycling and reduces pain for many people, but does not remove lesions and has side effects that matter.",
      "Excision or ablation surgery at a specialist centre treats the disease directly and can improve pain and fertility outcomes. Alongside both sit pelvic physiotherapy, pain medicine, and fertility care.",
      "No treatment is curative today. The realistic goal is fewer symptoms, less disease progression, and a life that is not organised around pain.",
    ],
    source: "ESHRE guideline",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "myths",
    heading: "Myths that cause harm",
    body: [
      "“Pregnancy cures it.” It does not. Symptoms may pause during pregnancy and usually return.",
      "“A hysterectomy fixes it.” Removing the uterus does not remove disease elsewhere in the pelvis.",
      "“Bad periods are normal.” Pain that requires missing school, work or daily life is a clinical finding, not a personality trait.",
    ],
    source: "WHO",
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
  },
  {
    id: "glossary",
    heading: "Glossary",
    body: [
      "Laparoscopy — keyhole surgery through small abdominal incisions, used to see and treat lesions.",
      "Excision — cutting lesions out at the root, as opposed to burning the surface (ablation).",
      "Adenomyosis — related condition where similar tissue grows inside the muscular wall of the uterus.",
      "Endometrioma — an ovarian cyst filled with old blood, sometimes called a chocolate cyst.",
      "Deep endometriosis — lesions infiltrating more than 5mm below the peritoneal surface, often involving bowel or bladder.",
    ],
    source: "OpenEndo",
    url: "https://github.com/wckdboy/openendo",
  },
];

const articlesDa: Article[] = [
  {
    id: "what-it-is",
    heading: "Hvad endometriose er",
    body: [
      "Endometriose er en kronisk sygdom, hvor væv der minder om livmoderens slimhinde vokser uden for livmoderen — oftest på æggestokke, æggeledere, tarm, blære og bughulens inderside.",
      "Vævet reagerer på hormoncyklus, giver inflammation og kan danne sammenvoksninger mellem organer. Det er en inflammatorisk sygdom i hele kroppen, ikke en månedlig gene.",
    ],
    source: "WHO",
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
  },
  {
    id: "symptoms",
    heading: "Symptomer der skal tages alvorligt",
    body: [
      "Kraftige menstruationssmerter, smerter under eller efter sex, smerter ved vandladning eller afføring, kroniske underlivssmerter, kraftig blødning, oppustethed, dyb træthed og svært ved at blive gravid.",
      "Symptomernes styrke følger ikke sygdommens stadie. Minimal synlig sygdom kan give invaliderende smerter. Smerter, der holder nogen væk fra skole eller arbejde, er grund nok til udredning.",
    ],
    source: "ESHRE-retningslinje",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "diagnosis",
    heading: "Sådan foregår diagnosen",
    body: [
      "Udredning starter med sygehistorie, derefter undersøgelse og billeddiagnostik — vaginal ultralyd eller MR, som kan finde endometriomer og dyb sygdom, men rutinemæssigt overser overfladisk sygdom.",
      "Laparoskopi med vævsprøve er stadig det endelige svar. Retningslinjer støtter nu, at behandling startes på klinisk mistanke frem for at vente på kirurgi — derfor betyder tidlig dokumentation af symptomer meget.",
    ],
    source: "ESHRE-retningslinje",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "treatment",
    heading: "Behandlingsmuligheder",
    body: [
      "Hormonbehandling (p-piller, gestagener, GnRH-analoger) dæmper cyklus og mindsker smerter for mange, men fjerner ikke sygdomsvæv og har bivirkninger, der betyder noget.",
      "Excision eller ablation på et specialcenter behandler sygdommen direkte og kan forbedre både smerter og fertilitet. Ved siden af begge står bækkenfysioterapi, smertebehandling og fertilitetsbehandling.",
      "Ingen behandling er helbredende i dag. Det realistiske mål er færre symptomer, mindre progression og et liv, der ikke er indrettet efter smerter.",
    ],
    source: "ESHRE-retningslinje",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline",
  },
  {
    id: "myths",
    heading: "Myter der gør skade",
    body: [
      "“Graviditet kurerer det.” Nej. Symptomer kan pause under graviditet og vender typisk tilbage.",
      "“En fjernelse af livmoderen løser det.” Sygdomsvæv andre steder i bughulen forsvinder ikke.",
      "“Hårde menstruationer er normale.” Smerter, der kræver fravær fra skole, arbejde eller hverdag, er et klinisk fund — ikke et karaktertræk.",
    ],
    source: "WHO",
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
  },
  {
    id: "glossary",
    heading: "Ordliste",
    body: [
      "Laparoskopi — kikkertoperation gennem små snit i maven, bruges til at se og behandle sygdomsvæv.",
      "Excision — sygdomsvævet skæres væk ved roden, i modsætning til at brænde overfladen (ablation).",
      "Adenomyose — beslægtet tilstand, hvor lignende væv vokser inde i livmoderens muskelvæg.",
      "Endometriom — cyste på æggestokken fyldt med gammelt blod, også kaldet chokoladecyste.",
      "Dyb endometriose — sygdomsvæv der vokser mere end 5 mm ind under bughinden, ofte i tarm eller blære.",
    ],
    source: "OpenEndo",
    url: "https://github.com/wckdboy/openendo",
  },
];

export const stats: Record<Locale, Stat[]> = { en: statsEn, da: statsDa };
export const facts: Record<Locale, Fact[]> = { en: factsEn, da: factsDa };
export const grants: Record<Locale, Grant[]> = { en: grantsEn, da: grantsDa };
export const actions: Record<Locale, Action[]> = { en: actionsEn, da: actionsDa };
export const articles: Record<Locale, Article[]> = { en: articlesEn, da: articlesDa };

export const GITHUB_URL = "https://github.com/wckdboy/openendo";
