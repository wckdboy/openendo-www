import type { AccessData, Country } from "@/lib/access.functions";

const LAEGE =
  "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/gynaekologi/tilstande-og-sygdomme/menstruationsproblemer/endometriose/";
const DKMA = "https://laegemiddelstyrelsen.dk/da/nyheder/2024/ryeqo-bevarer-generelt-tilskud/";
const MEDICIN = "https://pro.medicin.dk/Medicin/Praeparater/9905";
const AUH = "https://www.auh.dk/afdelinger/kvindesygdomme-og-fodsler/klinik-for-kvindesygdomme/";
const ENDO = "https://www.endo.dk/radgivning/";
const CHECKED = "2026-10-28";

/**
 * Denmark entries checked on 28 Oct 2026 against Lægehåndbogen, Lægemiddelstyrelsen,
 * medicin.dk, Aarhus University Hospital, and Endometriose Fællesskabet.
 * Anything not confirmed on those pages is removed. Other countries are unchanged.
 * Rigshospitalet's own page did not load, so that centre is not listed.
 */
const denmark: Country = {
  name: { en: "Denmark", da: "Danmark" },
  coverage: "full",
  verified: CHECKED,
  access_path: {
    en: [
      "Start with your GP. If mild disease is suspected, the GP can try a continuous progestogen coil or a continuous combined pill, and paracetamol with an NSAID for period pain.",
      "If the disease seems severe, or pelvic pain continues despite that treatment, ask for a referral to a gynaecologist in a specialist clinic or a hospital department.",
      "If deep disease is suspected, with bladder or bowel symptoms, the referral should be to a highly specialised centre.",
    ],
    da: [
      "Start hos egen læge. Ved mistanke om mild sygdom kan lægen prøve en kontinuerlig gestagenspiral eller kontinuerlige p-piller og paracetamol sammen med et NSAID mod menstruationssmerter.",
      "Ved mistanke om svær sygdom, eller hvis underlivssmerterne fortsætter trods behandlingen, så bed om henvisning til en gynækolog i speciallægepraksis eller på en hospitalsafdeling.",
      "Ved mistanke om dyb sygdom med symptomer fra blære eller tarm bør henvisningen gå til et højt specialiseret center.",
    ],
  },
  medications: [
    {
      id: "first-line",
      name: "Continuous progestogen coil or combined pill, plus paracetamol and an NSAID",
      class: "First treatment when mild disease is suspected",
      approved: true,
      access_level: "prescription",
      access_note: {
        en: "Lægehåndbogen describes this as the first treatment when endometriosis is suspected. Reimbursement depends on the product.",
        da: "Lægehåndbogen beskriver det som den første behandling, når der er mistanke om endometriose. Tilskud afhænger af præparatet.",
      },
      prescription_note: {
        en: "GP",
        da: "Egen læge",
      },
      confidence: "high",
      verified: CHECKED,
      sources: [LAEGE],
    },
    {
      id: "ryeqo",
      name: "Ryeqo (relugolix, estradiol, norethisterone acetate)",
      class: "GnRH antagonist combination",
      approved: true,
      access_level: "reimbursed",
      access_note: {
        en: "Lægemiddelstyrelsen says general reimbursement remains for symptomatic endometriosis after earlier medical or surgical treatment.",
        da: "Lægemiddelstyrelsen skriver, at generelt tilskud består ved symptomatisk endometriose efter tidligere medicinsk eller kirurgisk behandling.",
      },
      approval_note: {
        en: "medicin.dk lists that indication.",
        da: "medicin.dk anfører den indikation.",
      },
      confidence: "high",
      verified: CHECKED,
      sources: [DKMA, MEDICIN],
    },
  ],
  centers: [
    {
      id: "auh-kvindesygdomme",
      name: {
        en: "Aarhus University Hospital, Clinic for Women's Diseases",
        da: "Aarhus Universitetshospital, Klinik for Kvindesygdomme",
      },
      type: "hospital clinic",
      area: { en: "Aarhus", da: "Aarhus" },
      note: {
        en: "The clinic page says one of its four teams treats endometriosis.",
        da: "Klinikkens side skriver, at et af fire teams behandler endometriose.",
      },
      url: AUH,
      confidence: "high",
      verified: CHECKED,
      sources: [AUH, LAEGE],
    },
  ],
  organizations: [
    {
      id: "endo-faellesskabet",
      name: {
        en: "Endometriose Fællesskabet (formerly Endometriose Foreningen)",
        da: "Endometriose Fællesskabet (tidligere Endometriose Foreningen)",
      },
      services: {
        en: "Phone counselling is open to everyone: members and non-members, patients and relatives. The organisation was founded on 21 Aug 1997.",
        da: "Telefonrådgivningen er åben for alle: medlemmer og ikke-medlemmer, patienter og pårørende. Foreningen blev stiftet 21. august 1997.",
      },
      url: ENDO,
      contact: {
        en: "Phone counselling, open to everyone.",
        da: "Telefonrådgivning, åben for alle.",
      },
      confidence: "high",
      verified: CHECKED,
      sources: [ENDO, "https://www.endo.dk/"],
    },
  ],
};

export function reviewDenmark(data: AccessData): AccessData {
  const current = data.countries["DK"];
  const postcode = current?.postcode
    ? {
        ...current.postcode,
        region_note: {
          en: "A postcode shows your region. It does not choose a hospital.",
          da: "Et postnummer viser din region. Det vælger ikke et hospital.",
        },
      }
    : undefined;
  const reviewed: Country = postcode ? { ...denmark, postcode } : denmark;
  return {
    ...data,
    countries: {
      ...data.countries,
      DK: reviewed,
    },
  };
}
