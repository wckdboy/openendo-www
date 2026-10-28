import type { AccessData, Country } from "@/lib/access.functions";

const LAEGE =
  "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/gynaekologi/tilstande-og-sygdomme/menstruationsproblemer/endometriose/";
const DKMA = "https://laegemiddelstyrelsen.dk/da/nyheder/2024/ryeqo-bevarer-generelt-tilskud/";
const MEDICIN = "https://pro.medicin.dk/Medicin/Praeparater/9905";
const AUH = "https://www.auh.dk/afdelinger/kvindesygdomme-og-fodsler/klinik-for-kvindesygdomme/";
const FORLOEB =
  "https://www.sundhed.dk/sundhedsfaglig/information-til-praksis/hovedstaden/almen-praksis/patientbehandling/patientforloeb/forloebsbeskrivelser-icpc/x-kvindelige-koensorganer/endomitrose/";
const ENDO = "https://www.endo.dk/radgivning/";
const CHECKED = "2026-10-28";

/**
 * Denmark entries checked on 28 Oct 2026 against Lægehåndbogen, Lægemiddelstyrelsen,
 * medicin.dk, Aarhus University Hospital, and Endometriose Fællesskabet.
 * Anything not confirmed on those pages is removed. Other countries are unchanged.
 * Rigshospitalet is named from Lægehåndbogen and the Capital Region pathway, not from the hospital's own page.
 */
const denmark: Country = {
  name: { en: "Denmark", da: "Danmark" },
  coverage: "full",
  verified: CHECKED,
  access_path: {
    en: [
      "Start with your GP. If mild disease is suspected, the GP can try a continuous progestogen coil or a continuous combined pill, and, if needed, paracetamol with an NSAID.",
      "If the disease seems severe, or pelvic pain continues despite that treatment, ask for a referral to a gynaecologist in a specialist clinic or a hospital department.",
      "If deep disease is suspected, with bladder or bowel symptoms, the referral should be to a highly specialised centre.",
    ],
    da: [
      "Start hos egen læge. Ved mistanke om mild sygdom kan lægen prøve en kontinuerlig gestagenspiral eller kontinuerlige p-piller, om nødvendigt sammen med paracetamol og et NSAID.",
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
        en: "Ryeqo keeps general reimbursement after its approval was extended to endometriosis in people treated before.",
        da: "Ryeqo beholder generelt tilskud, efter godkendelsen blev udvidet til endometriose hos personer, der er behandlet før.",
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
      id: "rigshospitalet",
      name: { en: "Rigshospitalet", da: "Rigshospitalet" },
      type: "specialised department",
      area: { en: "Eastern Denmark", da: "Østdanmark" },
      note: {
        en: "Lægehåndbogen says surgery for deep endometriosis, when pain continues despite medicine, should be at Rigshospitalet or Aarhus University Hospital, Skejby. The Capital Region pathway names the same two teams.",
        da: "Lægehåndbogen skriver, at operation for dyb endometriose, når smerterne fortsætter trods medicin, skal foregå på Rigshospitalet eller Aarhus Universitetshospital, Skejby. Region Hovedstadens forløb nævner de samme to teams.",
      },
      url: FORLOEB,
      confidence: "high",
      verified: CHECKED,
      sources: [LAEGE, FORLOEB],
    },
    {
      id: "auh-kvindesygdomme",
      name: {
        en: "Aarhus University Hospital, Clinic for Women's Diseases",
        da: "Aarhus Universitetshospital, Klinik for Kvindesygdomme",
      },
      type: "hospital clinic",
      area: { en: "Aarhus", da: "Aarhus" },
      note: {
        en: "The clinic page says one of its four teams treats endometriosis. Lægehåndbogen names Aarhus University Hospital, Skejby, with Rigshospitalet for deep disease.",
        da: "Klinikkens side skriver, at et af fire teams behandler endometriose. Lægehåndbogen nævner Aarhus Universitetshospital, Skejby, sammen med Rigshospitalet ved dyb sygdom.",
      },
      url: AUH,
      confidence: "high",
      verified: CHECKED,
      sources: [AUH, LAEGE, FORLOEB],
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
