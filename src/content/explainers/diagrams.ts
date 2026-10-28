import type { SourceId } from "@/content/explainers/sources";

export type Strength = "established" | "likely" | "uncertain" | "not-yet-shown";
export type Locale = "en" | "da";
export type Copy = { en: string; da: string };

export type Claim = {
  id: string;
  title: Copy;
  detail: Copy;
  strength: Strength;
  sources: SourceId[];
};

export type FlowDiagram = {
  kind: "flow";
  id: string;
  title: Copy;
  caption: Copy;
  nodes: Claim[];
  /** Node id after which the side branch hangs. */
  sideAfter?: string;
  side?: Claim;
};

export type TheoryRow = Claim & { level: 1 | 2 | 3 | 4 };

export type TheoryDiagram = {
  kind: "theories";
  id: string;
  title: Copy;
  caption: Copy;
  rows: TheoryRow[];
};

export type MechNode = Claim & { col: 0 | 1 | 2; row: number };
export type MechEdge = { from: string; to: string; strength: Strength; sources: SourceId[] };

export type MechanismDiagram = {
  kind: "mechanisms";
  id: string;
  title: Copy;
  caption: Copy;
  nodes: MechNode[];
  edges: MechEdge[];
};

export type TreatmentOption = Claim & { guideline: Copy };
export type TreatmentGroup = { id: string; title: Copy; options: TreatmentOption[] };

export type TreatmentDiagram = {
  kind: "treatment";
  id: string;
  title: Copy;
  caption: Copy;
  groups: TreatmentGroup[];
};

export type KnownDiagram = {
  kind: "known";
  id: string;
  title: Copy;
  caption: Copy;
  known: Claim[];
  unknown: Claim[];
  questions: Copy[];
};

export type Diagram =
  FlowDiagram | TheoryDiagram | MechanismDiagram | TreatmentDiagram | KnownDiagram;

const strengthWord: Record<Strength, Copy> = {
  established: { en: "Established", da: "Etableret" },
  likely: { en: "Likely", da: "Sandsynligt" },
  uncertain: { en: "Uncertain", da: "Usikkert" },
  "not-yet-shown": { en: "Not yet shown", da: "Endnu ikke vist" },
};

export function strengthLabel(strength: Strength, locale: Locale): string {
  return strengthWord[strength][locale];
}

export function text(copy: Copy, locale: Locale): string {
  return copy[locale];
}

const develops: FlowDiagram = {
  kind: "flow",
  id: "develops",
  title: { en: "How it develops", da: "Sådan udvikler det sig" },
  caption: {
    en: "What the tissue is, and what is established about how it behaves. The cause itself is still unknown.",
    da: "Hvad vævet er, og hvad der er etableret om, hvordan det opfører sig. Selve årsagen kendes ikke.",
  },
  nodes: [
    {
      id: "tissue",
      title: { en: "Similar tissue", da: "Lignende væv" },
      detail: {
        en: "Tissue like the lining of the womb grows outside the womb.",
        da: "Væv, der ligner livmoderens slimhinde, vokser uden for livmoderen.",
      },
      strength: "established",
      sources: ["who"],
    },
    {
      id: "pelvis",
      title: { en: "Mostly the pelvis", da: "Oftest i bækkenet" },
      detail: {
        en: "It is most often in the pelvis. In some people it is in the abdomen or chest.",
        da: "Det sidder oftest i bækkenet. Hos nogle er det i maven eller brystkassen.",
      },
      strength: "established",
      sources: ["who"],
    },
    {
      id: "oestrogen",
      title: { en: "Needs oestrogen", da: "Kræver østrogen" },
      detail: {
        en: "The tissue needs oestrogen, a hormone of the reproductive years, to establish and grow.",
        da: "Vævet har brug for østrogen, et hormon i de fertile år, for at sætte sig og vokse.",
      },
      strength: "established",
      sources: ["eshre"],
    },
    {
      id: "inflammation",
      title: { en: "Inflammation and scar", da: "Betændelse og arvæv" },
      detail: {
        en: "The tissue causes inflammation and scar tissue.",
        da: "Vævet giver inflammation og arvæv.",
      },
      strength: "established",
      sources: ["who", "eshre"],
    },
    {
      id: "unknown-cause",
      title: { en: "Cause unknown", da: "Årsag ukendt" },
      detail: {
        en: "Several theories exist. None is proven.",
        da: "Der findes flere teorier. Ingen er bevist.",
      },
      strength: "established",
      sources: ["who", "eshre-patient"],
    },
  ],
};

const theories: TheoryDiagram = {
  kind: "theories",
  id: "theories",
  title: { en: "Leading theories", da: "De førende teorier" },
  caption: {
    en: "Ideas about origin. The scale is a reading of the sources, not a percentage.",
    da: "Ideer om oprindelse. Skalaen er en læsning af kilderne, ikke en procent.",
  },
  rows: [
    {
      id: "retrograde",
      level: 3,
      title: {
        en: "Retrograde menstruation",
        da: "Retrograd menstruation (implantationsteorien)",
      },
      detail: {
        en: "Backward flow happens in about 90% of women who menstruate, so on its own it does not explain who gets endometriosis.",
        da: "Tilbageløb sker hos de fleste kvinder. En oversigt angiver omkring 90 procent. Det forklarer ikke i sig selv, hvem der får endometriose.",
      },
      strength: "likely",
      sources: ["cmaj", "sundhed-patient"],
    },
    {
      id: "coelomic",
      level: 2,
      title: { en: "Coelomic metaplasia", da: "Bughinden omdannes (metaplasiteorien)" },
      detail: {
        en: "It could only explain lesions on the peritoneum (the lining of the abdomen), not lesions elsewhere.",
        da: "Den kan kun forklare forandringer på bughinden, ikke andre steder.",
      },
      strength: "uncertain",
      sources: ["cmaj", "cell"],
    },
    {
      id: "remnants",
      level: 2,
      title: { en: "Embryonic remnants", da: "Rester fra fosterlivet (embryonale rester)" },
      detail: {
        en: "A proposal that leftover embryonic tissue becomes endometriosis. A 2024 review found low-certainty evidence and did not support it as the main route.",
        da: "Et forslag om, at rester af fostervæv bliver til endometriose. En oversigt fra 2024 fandt evidens med lav sikkerhed og støttede det ikke som hovedvejen.",
      },
      strength: "uncertain",
      sources: ["vercellini"],
    },
    {
      id: "spread",
      level: 2,
      title: {
        en: "Blood or lymph spread",
        da: "Spredning med blod eller lymfe (metastaseteorien)",
      },
      detail: {
        en: "Suggested to explain disease outside the pelvis, including the chest. Not proven.",
        da: "Foreslået for at forklare sygdom uden for bækkenet, også i brystkassen. Ikke bevist.",
      },
      strength: "uncertain",
      sources: ["cmaj", "cell"],
    },
    {
      id: "stem",
      level: 1,
      title: { en: "Stem cells", da: "Stamceller" },
      detail: {
        en: "Rare progenitor cells exist in the womb lining and in menstrual blood. It is not shown that they are the main starting tissue.",
        da: "Der findes sjældne forløberceller i livmoderens slimhinde og i menstruationsblod. Det er ikke vist, at de er det væv, sygdommen starter fra.",
      },
      strength: "not-yet-shown",
      sources: ["cell"],
    },
    {
      id: "genes",
      level: 3,
      title: { en: "Genes and immunity", da: "Gener og immunforsvar" },
      detail: {
        en: "It runs in some families, and immune conditions are more common. These factors change risk. They are not a single cause.",
        da: "Det findes i nogle familier, og immunsygdomme er mere almindelige. Faktorerne ændrer risikoen. De er ikke én årsag.",
      },
      strength: "likely",
      sources: ["who", "eshre-patient", "cell"],
    },
  ],
};

const mechanisms: MechanismDiagram = {
  kind: "mechanisms",
  id: "mechanisms",
  title: { en: "What happens in the body", da: "Det der sker i kroppen" },
  caption: {
    en: "How the disease links to symptoms. How much pain you have does not follow how widespread the lesions are.",
    da: "Sådan hænger sygdommen sammen med symptomer. Hvor stærke smerterne er, følger ikke hvor udbredt vævet er.",
  },
  nodes: [
    {
      id: "m-oestrogen",
      col: 0,
      row: 0,
      title: { en: "Oestrogen", da: "Østrogen" },
      detail: {
        en: "Lesions depend on oestrogen.",
        da: "Læsionerne er afhængige af østrogen.",
      },
      strength: "established",
      sources: ["eshre"],
    },
    {
      id: "m-inflammation",
      col: 0,
      row: 2,
      title: { en: "Inflammation", da: "Inflammation" },
      detail: {
        en: "The tissue sets up inflammation.",
        da: "Vævet sætter en inflammation i gang.",
      },
      strength: "established",
      sources: ["who", "eshre"],
    },
    {
      id: "m-nerves",
      col: 0,
      row: 4,
      title: { en: "Nerve changes", da: "Nerveændringer" },
      detail: {
        en: "Ongoing pain can involve the nerves. The nervous system can become more sensitive to pain (central sensitisation).",
        da: "Vedvarende smerte kan involvere nerverne. Nervesystemet bliver mere følsomt for smerte (central sensibilisering).",
      },
      strength: "uncertain",
      sources: ["eshre", "cmaj"],
    },
    {
      id: "e-growth",
      col: 1,
      row: 0,
      title: { en: "Lesions grow", da: "Læsioner vokser" },
      detail: {
        en: "Implants can grow and bleed with the cycle.",
        da: "Vævet kan vokse og bløde i takt med cyklussen.",
      },
      strength: "established",
      sources: ["eshre", "nhs"],
    },
    {
      id: "e-scar",
      col: 1,
      row: 2,
      title: { en: "Scar and adhesions", da: "Arvæv og sammenvoksninger" },
      detail: {
        en: "Scar can stick organs together. These are adhesions.",
        da: "Arvæv kan klæbe organer sammen. Det er sammenvoksninger.",
      },
      strength: "established",
      sources: ["who", "eshre-patient"],
    },
    {
      id: "e-sens",
      col: 1,
      row: 4,
      title: { en: "Pain stays on", da: "Smerten bliver hængende" },
      detail: {
        en: "Pain can continue after lesions are treated.",
        da: "Smerter kan fortsætte, efter læsionerne er behandlet.",
      },
      strength: "uncertain",
      sources: ["cmaj"],
    },
    {
      id: "s-period",
      col: 2,
      row: 0,
      title: { en: "Period pain", da: "Menstruationssmerter" },
      detail: {
        en: "Pain with a period that stops daily life.",
        da: "Smerter ved menstruation, der stopper hverdagen.",
      },
      strength: "established",
      sources: ["who", "nice"],
    },
    {
      id: "s-sex",
      col: 2,
      row: 1,
      title: { en: "Pain with sex", da: "Smerter ved sex" },
      detail: {
        en: "Deep pain during or after sex.",
        da: "Dybe smerter under eller efter sex.",
      },
      strength: "established",
      sources: ["nice", "who"],
    },
    {
      id: "s-bowel",
      col: 2,
      row: 2,
      title: { en: "Bowel or bladder", da: "Tarm eller blære" },
      detail: {
        en: "Deep disease can involve the bowel or bladder and cause pain there.",
        da: "Dyb sygdom kan sidde på tarm eller blære og give smerter der.",
      },
      strength: "established",
      sources: ["laege", "sundhed-patient"],
    },
    {
      id: "s-fertility",
      col: 2,
      row: 3,
      title: { en: "Getting pregnant", da: "At blive gravid" },
      detail: {
        en: "Some people have trouble conceiving. Many do not.",
        da: "Nogle har svært ved at blive gravide. Mange har ikke.",
      },
      strength: "likely",
      sources: ["who"],
    },
    {
      id: "s-fatigue",
      col: 2,
      row: 4,
      title: { en: "Fatigue", da: "Træthed" },
      detail: {
        en: "Severe pain, bleeding, and low iron can exhaust you.",
        da: "Stærke smerter, blødning og lavt jern kan udmatte.",
      },
      strength: "established",
      sources: ["who"],
    },
  ],
  edges: [
    { from: "m-oestrogen", to: "e-growth", strength: "established", sources: ["eshre"] },
    { from: "m-inflammation", to: "e-scar", strength: "established", sources: ["who"] },
    { from: "m-nerves", to: "e-sens", strength: "uncertain", sources: ["eshre", "cmaj"] },
    { from: "e-growth", to: "s-period", strength: "established", sources: ["who", "nhs"] },
    { from: "e-growth", to: "s-sex", strength: "likely", sources: ["nice"] },
    {
      from: "e-growth",
      to: "s-bowel",
      strength: "established",
      sources: ["laege", "sundhed-patient"],
    },
    { from: "e-growth", to: "s-fatigue", strength: "established", sources: ["who"] },
    { from: "e-scar", to: "s-fertility", strength: "uncertain", sources: ["sundhed-patient"] },
  ],
};

const diagnosisEn: FlowDiagram = {
  kind: "flow",
  id: "diagnosis",
  title: { en: "Diagnosis pathway", da: "Udredning" },
  caption: {
    en: "The NICE path in England. A normal scan does not rule endometriosis out. WHO puts the average delay at 4 to 12 years.",
    da: "NICE-forløbet i England. En normal scanning udelukker ikke endometriose. WHO sætter den gennemsnitlige forsinkelse til 4 til 12 år.",
  },
  nodes: [
    {
      id: "history",
      title: { en: "History and diary", da: "Historie og dagbog" },
      detail: {
        en: "Symptoms and a pain diary start the assessment.",
        da: "Symptomer og en smertedagbog starter vurderingen.",
      },
      strength: "established",
      sources: ["nice", "who"],
    },
    {
      id: "exam",
      title: { en: "Examination", da: "Undersøgelse" },
      detail: {
        en: "An abdominal and pelvic exam is offered. A normal exam does not rule it out.",
        da: "En undersøgelse af maven og underlivet tilbydes. En normal undersøgelse udelukker det ikke.",
      },
      strength: "established",
      sources: ["nice"],
    },
    {
      id: "imaging",
      title: { en: "Ultrasound or MRI", da: "Ultralyd eller MR" },
      detail: {
        en: "A transvaginal ultrasound can show cysts on the ovary and deep disease. It misses superficial disease. MRI is an option for deep disease.",
        da: "En vaginal ultralyd kan vise cyster på æggestokken og dyb sygdom. Den overser overfladisk sygdom. MR er en mulighed ved dyb sygdom.",
      },
      strength: "established",
      sources: ["nice", "cmaj"],
    },
    {
      id: "specialist",
      title: { en: "Specialist care", da: "Specialist" },
      detail: {
        en: "Referral if first treatment fails, daily life is affected, or deep disease is suspected.",
        da: "Henvisning hvis den første behandling ikke hjælper, hverdagen er ramt, eller dyb sygdom mistænkes.",
      },
      strength: "established",
      sources: ["nice"],
    },
    {
      id: "scope",
      title: { en: "Laparoscopy if needed", da: "Kikkertoperation ved behov" },
      detail: {
        en: "Keyhole surgery can be considered even when scans are normal. Treatment can start before surgery.",
        da: "En kikkertoperation kan overvejes, også når scanninger er normale. Behandling kan starte før operation.",
      },
      strength: "established",
      sources: ["nice", "who"],
    },
  ],
  sideAfter: "imaging",
  side: {
    id: "normal-scan",
    title: { en: "Normal scan?", da: "Normal scanning?" },
    detail: {
      en: "It can still be endometriosis. Next step: referral can still be right.",
      da: "Det kan stadig være endometriose. Næste skridt: henvisning kan stadig være rigtig.",
    },
    strength: "established",
    sources: ["nice"],
  },
};

const diagnosisDa: FlowDiagram = {
  kind: "flow",
  id: "diagnosis-da",
  title: { en: "Care pathway in Denmark", da: "Forløb i Danmark" },
  caption: {
    en: "The Danish clinical overview on sundhed.dk. This is not the NHS pathway.",
    da: "Den danske kliniske oversigt på sundhed.dk. Det er ikke NHS-forløbet.",
  },
  nodes: [
    {
      id: "gp",
      title: { en: "Your GP", da: "Egen læge" },
      detail: {
        en: "For suspected mild disease, the GP can try a continuous progestogen coil or a continuous pill, and, if needed, paracetamol with an NSAID.",
        da: "Ved mistanke om mild sygdom kan egen læge prøve en kontinuerlig gestagenspiral eller kontinuerlige p-piller, om nødvendigt sammen med paracetamol og et NSAID.",
      },
      strength: "established",
      sources: ["laege"],
    },
    {
      id: "scan-da",
      title: { en: "Exam and ultrasound", da: "Undersøgelse og ultralyd" },
      detail: {
        en: "The diagnosis is now usually made by examination and transvaginal ultrasound.",
        da: "Diagnosen stilles i dag typisk ved undersøgelse og vaginal ultralyd.",
      },
      strength: "established",
      sources: ["laege"],
    },
    {
      id: "gyn",
      title: { en: "Gynaecologist", da: "Gynækolog" },
      detail: {
        en: "Refer if disease seems severe, or pelvic pain continues despite medicine.",
        da: "Henvis hvis sygdommen virker svær, eller underlivssmerterne fortsætter trods medicin.",
      },
      strength: "established",
      sources: ["laege"],
    },
    {
      id: "centre",
      title: { en: "Specialised centre", da: "Specialiseret center" },
      detail: {
        en: "Suspected deep disease, with bladder or bowel symptoms, should be referred to a highly specialised centre.",
        da: "Mistanke om dyb sygdom med symptomer fra blære eller tarm bør henvises til et højt specialiseret center.",
      },
      strength: "established",
      sources: ["laege"],
    },
    {
      id: "scope-da",
      title: { en: "Laparoscopy sometimes", da: "Kikkertoperation nogle gange" },
      detail: {
        en: "Keyhole surgery with a biopsy is sometimes needed to confirm the disease.",
        da: "Kikkertoperation med en vævsprøve er nogle gange nødvendig for at bekræfte sygdommen.",
      },
      strength: "established",
      sources: ["laege"],
    },
  ],
  sideAfter: "gp",
  side: {
    id: "settles",
    title: { en: "Pain settles?", da: "Smerten letter?" },
    detail: {
      en: "With mild disease, if symptoms ease on the pill or pain medicine, further tests are often not needed.",
      da: "Ved mild sygdom er der ofte ikke grund til flere undersøgelser, hvis symptomerne letter på p-piller eller smertestillende.",
    },
    strength: "likely",
    sources: ["laege"],
  },
};

const treatment: TreatmentDiagram = {
  kind: "treatment",
  id: "treatment",
  title: { en: "Treatment options", da: "Behandlingsmuligheder" },
  caption: {
    en: "Options the guidelines name. They are not ranked. There is no cure, and no doses are given here.",
    da: "Muligheder retningslinjerne nævner. De er ikke rangeret. Der findes ingen kur, og der står ingen doser her.",
  },
  groups: [
    {
      id: "pain",
      title: { en: "Pain relief", da: "Smertelindring" },
      options: [
        {
          id: "nsaid",
          guideline: { en: "NICE, ESHRE", da: "NICE, ESHRE" },
          title: { en: "Paracetamol or NSAID", da: "Paracetamol eller NSAID" },
          detail: {
            en: "A short trial can be considered for pain, and these medicines may be offered. The trials behind that are very low quality.",
            da: "Et kort forsøg mod smerter kan overvejes, og medicinen kan tilbydes. Forsøgene bag er af meget lav kvalitet.",
          },
          strength: "uncertain",
          sources: ["nice", "eshre"],
        },
        {
          id: "tens",
          guideline: { en: "ESHRE", da: "ESHRE" },
          title: { en: "TENS", da: "TENS" },
          detail: {
            en: "Small trials found some improvement in pain or quality of life. They are low quality, and ESHRE makes no recommendation.",
            da: "Små forsøg fandt en vis bedring i smerte eller livskvalitet. De er af lav kvalitet, og ESHRE giver ingen anbefaling.",
          },
          strength: "uncertain",
          sources: ["eshre"],
        },
      ],
    },
    {
      id: "hormonal",
      title: { en: "Hormonal", da: "Hormoner" },
      options: [
        {
          id: "cocp",
          guideline: { en: "NICE, ESHRE", da: "NICE, ESHRE" },
          title: { en: "Combined pill", da: "Kombinations-p-pille" },
          detail: {
            en: "It reduces pain with periods, pain with sex, and pelvic pain. It does not permanently reduce later fertility. It is not used to help you conceive.",
            da: "Den mindsker menstruationssmerter, smerter ved sex og underlivssmerter. Den nedsætter ikke senere fertilitet varigt. Den bruges ikke til at hjælpe dig med at blive gravid.",
          },
          strength: "established",
          sources: ["nice", "eshre", "who"],
        },
        {
          id: "progestogen",
          guideline: { en: "NICE, ESHRE", da: "NICE, ESHRE" },
          title: { en: "Progestogens", da: "Gestagener" },
          detail: {
            en: "Progestogens reduce endometriosis pain. Side effects differ between products.",
            da: "Gestagener mindsker endometrioserelaterede smerter. Bivirkningerne er forskellige fra præparat til præparat.",
          },
          strength: "established",
          sources: ["nice", "eshre"],
        },
        {
          id: "lng",
          guideline: { en: "ESHRE, WHO", da: "ESHRE, WHO" },
          title: { en: "Hormonal coil", da: "Hormonspiral" },
          detail: {
            en: "A levonorgestrel coil reduces endometriosis pain. It is also a contraceptive.",
            da: "En hormonspiral med levonorgestrel mindsker endometrioserelaterede smerter. Den er også prævention.",
          },
          strength: "established",
          sources: ["eshre", "who"],
        },
        {
          id: "gnrh-ag",
          guideline: { en: "ESHRE", da: "ESHRE" },
          title: { en: "GnRH agonist", da: "GnRH-agonist" },
          detail: {
            en: "Second line, because of side effects from low oestrogen. Add-back treatment (low-dose oestrogen and progestogen) is used to protect bone and limit those effects.",
            da: "Andet valg på grund af bivirkninger fra lavt østrogen. Add-back-behandling (lavdosis østrogen og gestagen) bruges for at beskytte knoglerne og dæmpe bivirkningerne.",
          },
          strength: "likely",
          sources: ["eshre", "who"],
        },
        {
          id: "gnrh-ant",
          guideline: { en: "ESHRE, NICE", da: "ESHRE, NICE" },
          title: { en: "GnRH antagonist", da: "GnRH-antagonist" },
          detail: {
            en: "This can be considered. The recommendation is weak, and it is second line. Add-back treatment (low-dose oestrogen and progestogen) limits low-oestrogen effects.",
            da: "Det kan overvejes. Anbefalingen er svag, og det er andet valg. Add-back-behandling (lavdosis østrogen og gestagen) dæmper virkningerne af lavt østrogen.",
          },
          strength: "likely",
          sources: ["eshre", "nice"],
        },
      ],
    },
    {
      id: "surgery",
      title: { en: "Surgery", da: "Kirurgi" },
      options: [
        {
          id: "excision",
          guideline: { en: "NICE, ESHRE", da: "NICE, ESHRE" },
          title: { en: "Excision or ablation", da: "Fjernelse eller afbrænding" },
          detail: {
            en: "Surgery is one option to reduce pain. A Cochrane review cited for this is uncertain about the size of the effect on overall pain. Lesions can return.",
            da: "Operation er én mulighed for at mindske smerter. Et Cochrane-review, som retningslinjen citerer, er usikker på størrelsen af effekten på den samlede smerte. Vævet kan komme igen.",
          },
          strength: "likely",
          sources: ["nice", "eshre", "who"],
        },
        {
          id: "endometrioma",
          guideline: { en: "NICE, ESHRE", da: "NICE, ESHRE" },
          title: { en: "Ovarian cyst surgery", da: "Operation for cyste" },
          detail: {
            en: "Removing the cyst wall (cystectomy) is preferred to reduce pain and recurrence. Draining and ablating it may spare more ovarian reserve when fertility is a priority.",
            da: "Fjernelse af cystevæggen (cystektomi) foretrækkes for at mindske smerter og tilbagefald. Tømning og afbrænding kan spare mere af ægreserven, når fertilitet er vigtigst.",
          },
          strength: "likely",
          sources: ["nice", "eshre"],
        },
        {
          id: "hysterectomy",
          guideline: { en: "WHO, ESHRE, NICE", da: "WHO, ESHRE, NICE" },
          title: { en: "Hysterectomy", da: "Fjernelse af livmoderen" },
          detail: {
            en: "Removal of the womb is not a cure. It is considered when other care has not helped and pregnancy is not planned. Visible lesions should be removed at the same time.",
            da: "Fjernelse af livmoderen er ikke en kur. Det overvejes, når anden behandling ikke har hjulpet, og graviditet ikke er planen. Synligt væv bør fjernes samtidig.",
          },
          strength: "uncertain",
          sources: ["who", "eshre", "nice"],
        },
      ],
    },
    {
      id: "fertility",
      title: { en: "Fertility", da: "Fertilitet" },
      options: [
        {
          id: "no-hormone-conceive",
          guideline: { en: "NICE", da: "NICE" },
          title: { en: "Hormones and conception", da: "Hormoner og graviditet" },
          detail: {
            en: "Hormonal treatment is not offered to raise the chance of conceiving without assistance.",
            da: "Hormonbehandling tilbydes ikke for at øge chancen for at blive gravid uden hjælp.",
          },
          strength: "established",
          sources: ["nice"],
        },
        {
          id: "surgery-fertility",
          guideline: { en: "NICE", da: "NICE" },
          title: { en: "Surgery and conception", da: "Operation og graviditet" },
          detail: {
            en: "Removing peritoneal disease, or treating an endometrioma, can improve the chance of conceiving without IVF.",
            da: "Fjernelse af sygdom på bughinden, eller behandling af et endometriom, kan øge chancen for at blive gravid uden IVF.",
          },
          strength: "likely",
          sources: ["nice"],
        },
        {
          id: "art",
          guideline: { en: "WHO", da: "WHO" },
          title: { en: "Fertility treatment", da: "Fertilitetsbehandling" },
          detail: {
            en: "Ovulation induction, insemination, or IVF may be offered. Among women with infertility, as many as 25 to 50 percent have endometriosis.",
            da: "Ægløsningsstimulation, insemination eller IVF kan tilbydes. Blandt kvinder med infertilitet har helt op til 25 til 50 procent endometriose.",
          },
          strength: "likely",
          sources: ["who"],
        },
      ],
    },
    {
      id: "support",
      title: { en: "Support", da: "Støtte" },
      options: [
        {
          id: "mdt",
          guideline: { en: "WHO, ESHRE", da: "WHO, ESHRE" },
          title: { en: "Physio and psychology", da: "Fysioterapi og psykologi" },
          detail: {
            en: "Physiotherapy and cognitive behavioural therapy can reduce pain for some people. No specific non-medical treatment is recommended, because benefits and harms are unclear.",
            da: "Fysioterapi og kognitiv adfærdsterapi kan mindske smerter hos nogle. Der anbefales ikke en bestemt ikke-medicinsk behandling, fordi gavn og skade er uklare.",
          },
          strength: "uncertain",
          sources: ["who", "eshre"],
        },
      ],
    },
  ],
};

const known: KnownDiagram = {
  kind: "known",
  id: "known",
  title: { en: "Known and not yet known", da: "Kendt og endnu ikke kendt" },
  caption: {
    en: "A short account of what the sources support, and what they still list as open.",
    da: "En kort redegørelse for, hvad kilderne støtter, og hvad de stadig lader stå åbent.",
  },
  known: [
    {
      id: "prevalence",
      title: { en: "About 1 in 10", da: "Omkring 1 ud af 10" },
      detail: {
        en: "WHO estimates about 10 percent (190 million) of women of reproductive age. ESHRE says the exact figure is unknown and cites a range of 2 to 10 percent.",
        da: "WHO anslår omkring 10 procent (190 millioner) af kvinder i den fertile alder. ESHRE skriver, at det præcise tal er ukendt, og nævner et spænd fra 2 til 10 procent.",
      },
      strength: "likely",
      sources: ["who", "eshre"],
    },
    {
      id: "no-cure",
      title: { en: "No cure", da: "Ingen kur" },
      detail: {
        en: "Treatment aims to control symptoms. Symptoms can continue or return.",
        da: "Behandling sigter mod at dæmpe symptomer. Symptomer kan fortsætte eller vende tilbage.",
      },
      strength: "established",
      sources: ["who", "eshre"],
    },
    {
      id: "no-blood",
      title: { en: "No blood test", da: "Ingen blodprøve" },
      detail: {
        en: "Do not use CA125 to diagnose it. No biomarker is proven for diagnosis.",
        da: "Brug ikke CA125 til at stille diagnosen. Ingen biomarkør er bevist til diagnose.",
      },
      strength: "established",
      sources: ["nice", "eshre-patient"],
    },
    {
      id: "delay",
      title: { en: "Diagnosis takes years", da: "Diagnosen tager år" },
      detail: {
        en: "WHO says the average time to diagnosis is 4 to 12 years.",
        da: "WHO skriver, at den gennemsnitlige tid til diagnose er 4 til 12 år.",
      },
      strength: "established",
      sources: ["who"],
    },
  ],
  unknown: [
    {
      id: "cause-open",
      title: { en: "The cause", da: "Årsagen" },
      detail: {
        en: "The cause is not known. The theories above are not settled.",
        da: "Årsagen kendes ikke. Teorierne ovenfor er ikke afgjort.",
      },
      strength: "established",
      sources: ["who", "eshre-patient"],
    },
    {
      id: "test-open",
      title: { en: "A simple test", da: "En simpel test" },
      detail: {
        en: "Saliva, blood, and menstrual-blood tests are described as emerging. They are not the established way to diagnose.",
        da: "Spyt-, blod- og menstruationsblodtests beskrives som noget, der er på vej. De er ikke den etablerede måde at stille diagnosen på.",
      },
      strength: "not-yet-shown",
      sources: ["who"],
    },
    {
      id: "prevent",
      title: { en: "Prevention", da: "Forebyggelse" },
      detail: {
        en: "There is no known way to prevent endometriosis.",
        da: "Der kendes ingen måde at forebygge endometriose på.",
      },
      strength: "established",
      sources: ["who"],
    },
    {
      id: "recur",
      title: { en: "Who relapses", da: "Hvem får tilbagefald" },
      detail: {
        en: "Lesions can return after removal, and symptoms often return when treatment stops. A 2023 review cites about 22 percent at 2 years and 40 to 50 percent at 5 years after surgery.",
        da: "Væv kan komme igen efter fjernelse, og symptomer vender ofte tilbage, når behandlingen stopper. En oversigt fra 2023 nævner omkring 22 procent efter 2 år og 40 til 50 procent efter 5 år efter operation.",
      },
      strength: "uncertain",
      sources: ["who", "eshre", "cmaj"],
    },
  ],
  questions: [
    {
      en: "Which lesions will grow, stay the same, or shrink is not predictable for one person.",
      da: "Hvilke læsioner der vil vokse, stå stille eller svinde, kan ikke forudsiges for én person.",
    },
    {
      en: "Treatments that control pain without blocking pregnancy are still needed.",
      da: "Der er stadig brug for behandling, der dæmper smerter uden at forhindre graviditet.",
    },
  ],
};

export const EXPLAINERS: Diagram[] = [
  develops,
  theories,
  mechanisms,
  diagnosisEn,
  treatment,
  known,
];

export function diagnosisFor(locale: Locale): FlowDiagram {
  return locale === "da" ? diagnosisDa : diagnosisEn;
}

export function diagramsFor(locale: Locale): Diagram[] {
  return [develops, theories, mechanisms, diagnosisFor(locale), treatment, known];
}

export function treatmentDiagram(): TreatmentDiagram {
  return treatment;
}

export function mechanismDiagram(): MechanismDiagram {
  return mechanisms;
}

function claimsIn(diagram: Diagram): Claim[] {
  switch (diagram.kind) {
    case "flow":
      return diagram.side ? [...diagram.nodes, diagram.side] : diagram.nodes;
    case "theories":
      return diagram.rows;
    case "mechanisms":
      return diagram.nodes;
    case "treatment":
      return diagram.groups.flatMap((group) => group.options);
    case "known":
      return [...diagram.known, ...diagram.unknown];
    default: {
      const never: never = diagram;
      return never;
    }
  }
}

export const MANAGING: Claim[] = [
  {
    id: "flare-diary",
    title: { en: "Write it down", da: "Skriv det ned" },
    detail: {
      en: "When pain rises, note the date, what you could not do, bleeding, bowel and bladder symptoms, and what you tried.",
      da: "Når smerten stiger, så notér datoen, hvad du ikke kunne, blødning, tarm og blære, og hvad du prøvede.",
    },
    strength: "established",
    sources: ["nice"],
  },
  {
    id: "flare-trial",
    title: { en: "Ask about a short trial", da: "Spørg om et kort forsøg" },
    detail: {
      en: "A short trial of paracetamol or an NSAID, alone or together, can be considered for pain.",
      da: "Et kort forsøg med paracetamol eller et NSAID, alene eller sammen, kan overvejes mod smerter.",
    },
    strength: "uncertain",
    sources: ["nice", "eshre"],
  },
  {
    id: "flare-refer",
    title: { en: "Ask for a referral", da: "Bed om en henvisning" },
    detail: {
      en: "If that trial does not help enough, ask about other pain care and a referral.",
      da: "Hvis forsøget ikke hjælper nok, så spørg om anden smertebehandling og en henvisning.",
    },
    strength: "established",
    sources: ["nice"],
  },
  {
    id: "work",
    title: { en: "Work and school", da: "Arbejde og skole" },
    detail: {
      en: "Pain can stop people going to work or school. Tell them which tasks you cannot do on bad days, and bring the diary.",
      da: "Smerter kan holde mennesker væk fra arbejde eller skole. Fortæl, hvilke opgaver du ikke kan på dårlige dage, og tag dagbogen med.",
    },
    strength: "established",
    sources: ["who", "nice"],
  },
  {
    id: "heat",
    title: { en: "Heat", da: "Varme" },
    detail: {
      en: "Heat has no evidence grade for endometriosis.",
      da: "Varme har ingen evidensgrad for endometriose.",
    },
    strength: "not-yet-shown",
    sources: ["nice", "eshre"],
  },
];

export function allClaims(): Claim[] {
  const extra = claimsIn(diagnosisDa);
  return [...EXPLAINERS.flatMap(claimsIn), ...extra, ...MANAGING];
}

export function claimSourceIds(claims: { sources: SourceId[] }[]): SourceId[] {
  const ids: SourceId[] = [];
  for (const claim of claims) {
    for (const id of claim.sources) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

export function mechanismEdges(): MechEdge[] {
  return mechanisms.edges;
}

export function pageSourceIds(locale: Locale): SourceId[] {
  const items: { sources: SourceId[] }[] = [];
  for (const diagram of diagramsFor(locale)) {
    items.push(...claimsIn(diagram));
    if (diagram.kind === "mechanisms") items.push(...diagram.edges);
  }
  return claimSourceIds(items);
}

export function sourceIdsUsed(): string[] {
  const ids: string[] = [];
  for (const claim of allClaims()) {
    for (const id of claim.sources) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  for (const edge of mechanisms.edges) {
    for (const id of edge.sources) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}
