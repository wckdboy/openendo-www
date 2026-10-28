export type SourceKind =
  | "Guideline"
  | "Systematic review"
  | "Randomised trial"
  | "Observational"
  | "Preclinical"
  | "Case report"
  | "Fact sheet"
  | "Review";

export type EvidenceSource = {
  id: string;
  short: string;
  title: string;
  org: string;
  url: string;
  kind: SourceKind;
  accessed: "2026-10-28";
  section: string;
};

export const SOURCES = {
  who: {
    id: "who",
    short: "WHO fact sheet, 15 Oct 2025",
    title: "Endometriosis fact sheet",
    org: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "Key facts; Overview; Causes; Diagnosis; Treatment; Impact; Prevention; Challenges",
  },
  nice: {
    id: "nice",
    short: "NICE NG73, updated 2024",
    title: "Endometriosis: diagnosis and management (NG73)",
    org: "NICE",
    url: "https://www.nice.org.uk/guidance/ng73/chapter/Recommendations",
    kind: "Guideline",
    accessed: "2026-10-28",
    section: "Recommendations 1.3 to 1.10, and the November 2024 and April 2024 update notes",
  },
  eshre: {
    id: "eshre",
    short: "ESHRE guideline, 2022",
    title: "ESHRE guideline: endometriosis (2022)",
    org: "ESHRE",
    url: "https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS-2022_1.pdf",
    kind: "Guideline",
    accessed: "2026-10-28",
    section:
      "Introduction; I. Diagnosis; II. Treatment of endometriosis-associated pain, recommendations 10–38",
  },
  "eshre-patient": {
    id: "eshre-patient",
    short: "ESHRE patient leaflet, 2022",
    title: "Information for women with endometriosis",
    org: "ESHRE",
    url: "https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-ENDOMETRIOSIS-patient-Guideline_21032022.pdf",
    kind: "Guideline",
    accessed: "2026-10-28",
    section: "What causes endometriosis?; Symptoms and diagnosis; staging",
  },
  cmaj: {
    id: "cmaj",
    short: "CMAJ review, 2023",
    title: "Diagnosis and management of endometriosis",
    org: "Canadian Medical Association Journal",
    url: "https://doi.org/10.1503/cmaj.220637",
    kind: "Review",
    accessed: "2026-10-28",
    section: "What causes endometriosis?; subtypes; central sensitization; surgery recurrence",
  },
  cell: {
    id: "cell",
    short: "Cell review, 2021",
    title: "Endometriosis: etiology, pathobiology, and therapeutic prospects",
    org: "Cell",
    url: "https://doi.org/10.1016/j.cell.2021.04.041",
    kind: "Review",
    accessed: "2026-10-28",
    section: "Endometriotic lesions: Origins; Genetic and genomic impacts",
  },
  vercellini: {
    id: "vercellini",
    short: "Hum Reprod review, 2024",
    title:
      "Müllerian anomalies and endometriosis as models for retrograde menstruation and embryonic-remnant theories",
    org: "Human Reproduction",
    url: "https://academic.oup.com/humrep/article/39/7/1460/7668508",
    kind: "Systematic review",
    accessed: "2026-10-28",
    section: "Abstract; Wider implications",
  },
  nhs: {
    id: "nhs",
    short: "NHS, endometriosis",
    title: "Endometriosis",
    org: "NHS",
    url: "https://www.nhs.uk/conditions/endometriosis/",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "Symptoms; Non-urgent advice: See a GP",
  },
  laege: {
    id: "laege",
    short: "Lægehåndbogen, updated 12 Jun 2026",
    title: "Endometriose",
    org: "Lægehåndbogen, sundhed.dk",
    url: "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/gynaekologi/tilstande-og-sygdomme/menstruationsproblemer/endometriose/",
    kind: "Guideline",
    accessed: "2026-10-28",
    section: "Resumé; Behandling; Henvisning",
  },
  dkma: {
    id: "dkma",
    short: "Lægemiddelstyrelsen, 2024",
    title: "Ryeqo bevarer generelt tilskud",
    org: "Lægemiddelstyrelsen",
    url: "https://laegemiddelstyrelsen.dk/da/nyheder/2024/ryeqo-bevarer-generelt-tilskud/",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "News text on generelt tilskud after the endometriosis indication",
  },
  "medicin-ryeqo": {
    id: "medicin-ryeqo",
    short: "medicin.dk, Ryeqo",
    title: "Ryeqo, komb.",
    org: "medicin.dk",
    url: "https://pro.medicin.dk/Medicin/Praeparater/9905",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "Indication: symptombehandling ved endometriose",
  },
  auh: {
    id: "auh",
    short: "Aarhus University Hospital",
    title: "Klinik for Kvindesygdomme",
    org: "Aarhus Universitetshospital",
    url: "https://www.auh.dk/afdelinger/kvindesygdomme-og-fodsler/klinik-for-kvindesygdomme/",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "Teams, including endometriose",
  },
  "endo-dk": {
    id: "endo-dk",
    short: "Endometriose Fællesskabet",
    title: "Rådgivning",
    org: "Endometriose Fællesskabet",
    url: "https://www.endo.dk/radgivning/",
    kind: "Fact sheet",
    accessed: "2026-10-28",
    section: "Telefonrådgivning is open to everyone",
  },
} as const satisfies Record<string, EvidenceSource>;

export type SourceId = keyof typeof SOURCES;

export function sourceById(id: string): EvidenceSource | undefined {
  return (SOURCES as Record<string, EvidenceSource>)[id];
}
