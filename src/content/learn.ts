import type { Locale } from "@/content/copy";
import { ESHRE_GUIDELINE, ESHRE_PMID, NICE_NG73_RECS, WHO_FACT_SHEET } from "@/lib/site";

export const LEARN_SLUGS = ["symptoms", "diagnosis", "treatment", "living", "denmark"] as const;
export type LearnSlug = (typeof LEARN_SLUGS)[number];

export type Citation = { label: string; href: string };

export type LearnSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  citations: Citation[];
};

export type LearnPage = {
  slug: LearnSlug;
  title: string;
  description: string;
  lede: string;
  sections: LearnSection[];
};

export type FaqItem = { question: string; answer: string; citations: Citation[] };

const who: Citation = {
  label: "WHO fact sheet, endometriosis (15 October 2025)",
  href: WHO_FACT_SHEET,
};
const nice: Citation = { label: "NICE NG73 recommendations", href: NICE_NG73_RECS };
const eshre: Citation = {
  label: "ESHRE guideline: endometriosis, 2022 (PMID 35350465)",
  href: ESHRE_PMID,
};
const eshrePage: Citation = { label: "ESHRE endometriosis guideline", href: ESHRE_GUIDELINE };

const laege: Citation = {
  label: "Lægehåndbogen — endometriose",
  href: "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/gynaekologi/tilstande-og-sygdomme/menstruationsproblemer/endometriose/",
};
const endoDk: Citation = { label: "Endometriose Fællesskabet", href: "https://www.endo.dk" };

const pages: Record<Locale, Record<LearnSlug, LearnPage>> = {
  en: {
    symptoms: {
      slug: "symptoms",
      title: "Symptoms",
      description:
        "Endometriosis symptoms as described by WHO, and when NICE says to suspect the condition. Not a diagnosis.",
      lede: "Symptoms vary widely. Some people are very unwell. Some have endometriosis and few symptoms. This page lists what the World Health Organization and NICE actually name — it does not diagnose you.",
      sections: [
        {
          id: "what-who-lists",
          heading: "What WHO lists as symptoms",
          paragraphs: [
            "WHO describes endometriosis as a chronic disease. The symptoms it names are severe pain during menstruation, heavy menstrual bleeding, chronic pelvic pain that does not go away when the period ends, infertility, and abdominal bloating and nausea.",
            "It can also affect sex, bowel movements, and urination, and it can affect mental health, including depression and anxiety. The disease is most often in the pelvis. In some people it occurs elsewhere, including the abdomen and chest.",
            "WHO also says some people with endometriosis are asymptomatic, and that symptoms are variable enough that health workers may not recognise them easily.",
          ],
          citations: [who],
        },
        {
          id: "when-to-suspect",
          heading: "When NICE says to suspect it",
          paragraphs: [
            "NICE guideline NG73 is written for the NHS in England. It says to suspect endometriosis in women and people, including those aged 17 and under, who have one or more of: chronic pelvic pain; period-related pain that affects daily activities and quality of life; deep pain during or after sex; period-related or cyclical gastrointestinal symptoms, especially painful bowel movements; period-related or cyclical urinary symptoms, especially blood in the urine or pain passing urine; or infertility together with one or more of those.",
            "NICE also says a pain and symptom diary can help the conversation with a clinician, and that a normal examination does not exclude the condition. A diary is a record, not a diagnosis.",
          ],
          citations: [nice],
        },
        {
          id: "daily-life",
          heading: "When symptoms stop ordinary life",
          paragraphs: [
            "WHO says some people have pain or other symptoms that stop them going to work or school, with lost income for them and their families. It also says these impacts are made worse by stigma and by the belief that period pain is something to ignore. That is a reason to ask for care.",
          ],
          citations: [who],
        },
      ],
    },
    diagnosis: {
      slug: "diagnosis",
      title: "Diagnosis",
      description:
        "How endometriosis is diagnosed: history, ultrasound, MRI, and why a normal scan or a CA-125 test does not settle it. Sources: WHO and NICE NG73.",
      lede: "Diagnosis is a clinical process. A scan can find some disease and miss other disease. Surgery is not always required before treatment starts. The sentences below are the ones WHO and NICE publish.",
      sections: [
        {
          id: "history",
          heading: "It starts with the history",
          paragraphs: [
            "WHO says a careful menstrual health history — pain, how heavy the bleeding is, and associated symptoms — can help with diagnosis. WHO also says the average time to diagnosis is between 4 and 12 years, and that long delays are common.",
          ],
          citations: [who],
        },
        {
          id: "imaging",
          heading: "Ultrasound and MRI",
          paragraphs: [
            "WHO says endometriosis is diagnosed using imaging such as ultrasound, and that a clinical diagnosis may be made from symptoms and imaging tests such as ultrasound or MRI. Surgery is not necessarily required before treatment starts.",
            "NICE says to offer a transvaginal ultrasound to people with suspected endometriosis, even if the abdominal or pelvic examination is normal. If that scan is declined or not suitable, consider a transabdominal pelvic ultrasound. NICE is explicit: do not exclude endometriosis if the examination and the ultrasound are normal. Referral may still be necessary.",
            "For deep disease, NICE says to consider a specialist transvaginal ultrasound or a pelvic MRI to diagnose deep endometriosis and to assess how far it extends.",
          ],
          citations: [who, nice],
        },
        {
          id: "ca125",
          heading: "A blood test does not diagnose it",
          paragraphs: [
            "NICE recommendation 1.5.8 says: do not use serum CA125 to diagnose endometriosis. A raised or normal CA125 does not answer the question.",
          ],
          citations: [nice],
        },
        {
          id: "surgery",
          heading: "Laparoscopy",
          paragraphs: [
            "WHO says laparoscopic surgery, where tissue can be seen directly or sampled, can be recommended, and that this procedure is inaccessible to many people. It remains a way to confirm disease. It is not a requirement in every case before treatment, which is why the history and imaging matter.",
          ],
          citations: [who],
        },
        {
          id: "emerging",
          heading: "Newer tests are still emerging",
          paragraphs: [
            "WHO says new tests aimed at finding endometriosis earlier include symptom checklists, blood tests, and self-tests using saliva or menstrual blood. It lists them as emerging. It does not describe a saliva or blood test as the established way to diagnose the disease. Laparoscopy and clinical assessment remain the methods WHO describes for diagnosis.",
          ],
          citations: [who],
        },
      ],
    },
    treatment: {
      slug: "treatment",
      title: "Treatment",
      description:
        "Endometriosis treatments named by WHO and NICE: pain medicines, hormones, surgery, and fertility care. There is no cure. Not a personal treatment plan.",
      lede: "There is no cure. Treatment aims to control symptoms. Which option fits depends on the person, the side effects, whether pregnancy is wanted, and what is available. This is a map of the options guidelines name, not a prescription.",
      sections: [
        {
          id: "no-cure",
          heading: "No cure — symptom control",
          paragraphs: [
            "WHO says there is currently no cure, and no treatment that definitively cures the disease. Treatment aims to control symptoms and limit long-term impacts. The choice depends on severity, individual preferences, side effects, long-term safety, cost, availability, and whether pregnancy is desired.",
            "WHO says symptoms can continue or return after treatment starts.",
          ],
          citations: [who],
        },
        {
          id: "pain-medicines",
          heading: "Medicines for pain",
          paragraphs: [
            "WHO says NSAIDs such as ibuprofen and naproxen, and other painkillers, are often used for pain.",
            "NICE says to discuss the benefits and risks of analgesics, and to consider a short trial — for example three months — of paracetamol or an NSAID, alone or together, as first-line management of endometriosis-related pain. If that trial does not give adequate relief, consider other pain management and referral.",
          ],
          citations: [who, nice],
        },
        {
          id: "hormones",
          heading: "Hormonal treatment",
          paragraphs: [
            "WHO says hormonal medicines may reduce how severe pain is, or how often it happens, for some people. The methods it names are combined hormonal contraceptives (pill, patch, ring), progestins (hormonal IUD, DMPA), and GnRH analogues. It also mentions aromatase inhibitors as other hormonal modulators. Some of these are not suitable for people who want to become pregnant.",
            "NICE says to offer hormonal treatment, for example the combined oral contraceptive pill or a progestogen, to people with suspected, confirmed, or recurrent endometriosis, and to explain that hormonal treatment can reduce pain and has no permanent negative effect on later fertility.",
          ],
          citations: [who, nice],
        },
        {
          id: "surgery",
          heading: "Surgery, including hysterectomy",
          paragraphs: [
            "WHO says surgery can remove endometriosis lesions, adhesions, and scar tissue. How much it reduces pain, and how much it changes pregnancy rates, often depends on the extent of disease. Lesions may come back after they have been removed. Pelvic floor muscle problems can also contribute to chronic pelvic pain.",
            "WHO says hysterectomy, usually with removal of the ovaries, may be considered for people who do not respond to other treatments and are not planning to have a child. It also says hysterectomy is not a cure, and some people still have symptoms afterwards.",
          ],
          citations: [who],
        },
        {
          id: "fertility",
          heading: "Fertility care",
          paragraphs: [
            "WHO says fertility treatments — ovulation induction, intrauterine insemination, or IVF — may be recommended for people who are having difficulty conceiving because of endometriosis. Among people with infertility, WHO says as many as 25–50% have endometriosis. That figure is about people already being seen for infertility. It is not the chance that any one person with endometriosis cannot conceive.",
          ],
          citations: [who],
        },
        {
          id: "other-care",
          heading: "Physiotherapy, psychology, and support",
          paragraphs: [
            "WHO says that alongside medical care, local patient groups can help, and that multidisciplinary pain care — including physiotherapy and cognitive behavioural therapy — can reduce endometriosis-associated pain for some people.",
          ],
          citations: [who],
        },
      ],
    },
    living: {
      slug: "living",
      title: "Living with endometriosis",
      description:
        "Work, school, fatigue, mood, and stigma: what WHO reports about life with endometriosis, plus where to find care. Not medical advice.",
      lede: "Endometriosis is not only a list of treatments. WHO describes effects on work, school, sex, mood, and money. This page stays inside those statements and points to support. It does not tell you how to live.",
      sections: [
        {
          id: "quality",
          heading: "What it can change",
          paragraphs: [
            "WHO says severe pain, heavy bleeding, fatigue, depression, anxiety, infertility, poor sexual health, and social isolation can sharply reduce quality of life. Heavy bleeding can contribute to iron deficiency and fatigue. Painful sex can lead people to stop or avoid intercourse.",
            "There is no known way to prevent endometriosis. WHO says earlier diagnosis and good care may slow or halt progression and reduce long-term symptoms. That is a hope attached to care, not a promise.",
          ],
          citations: [who],
        },
        {
          id: "stigma",
          heading: "Pain is still treated as normal",
          paragraphs: [
            "WHO says that in many countries the public, families, and most health workers do not recognise that this chronic pelvic pain is not normal. Normalising the pain, and the stigma around periods, harms mental health.",
            "If a clinician dismisses symptoms as ordinary periods, that is a reason to ask for another assessment. NICE's suspect-list is a useful thing to take to that conversation. It is a UK guideline, so a Danish or other clinic may follow a different pathway. The symptoms themselves are not jurisdiction-specific.",
          ],
          citations: [who, nice],
        },
        {
          id: "diary",
          heading: "A symptom diary",
          paragraphs: [
            "NICE says to tell people that keeping a pain and symptom diary can help discussions. Dates, what the pain stopped you doing, bleeding, bowel and bladder symptoms, and what you tried are the useful columns. Bring it to the appointment. It does not replace an examination.",
          ],
          citations: [nice],
        },
        {
          id: "support",
          heading: "Where to go next",
          paragraphs: [
            "Talk to a clinician about your own symptoms. OpenEndo's access finder lists sourced centres, medicines, and patient organisations by country, with the date each record was checked. Patient groups are support. They are not an emergency service and not a specialist clinic.",
            "The European guideline from ESHRE (2022) is the document many specialists use alongside national guidance. This site does not restate its recommendations line by line. Read it, or ask a clinician who uses it, when you need that level of detail.",
          ],
          citations: [eshre, eshrePage],
        },
      ],
    },
    denmark: {
      slug: "denmark",
      title: "Endometriosis care in Denmark",
      description:
        "How endometriosis care is organised in Denmark, from the sourced OpenEndo access file: GP, referral, two specialist centres, and the patient organisation.",
      lede: "Denmark's pathway is not the NHS pathway. The steps, centres, and medicines below come from OpenEndo's sourced access file, which is updated in the open repository. Confirm anything that affects your care with your own clinician or the official page linked on the record.",
      sections: [
        {
          id: "orientation",
          heading: "How to read this page",
          paragraphs: [
            "The care steps, centre names, and medicine notes are rendered from docs/data/access.json in the OpenEndo repository. Each record carries its own sources and a verified date. If that file cannot be loaded, this page says so. It does not fall back to an older handwritten list.",
            "General facts about the disease — that there is no cure, and that diagnosis is often delayed — are the WHO statements on the other guides. They are not Danish law.",
          ],
          citations: [who],
        },
        {
          id: "danish-sources",
          heading: "Danish sources to read alongside this",
          paragraphs: [
            "Lægehåndbogen on sundhed.dk is the Danish clinical overview used by clinicians. Endometriose Fællesskabet is the patient organisation: counselling, community, and help with rights at work and in the system. The two specialised centres named in the access file are Rigshospitalet in the east and Aarhus University Hospital, Skejby, in the west. The live list below is the one to use if those names or roles change.",
          ],
          citations: [laege, endoDk],
        },
      ],
    },
  },
  da: {
    symptoms: {
      slug: "symptoms",
      title: "Symptomer",
      description:
        "Symptomer på endometriose som WHO beskriver dem, og hvornår NICE siger man skal mistænke sygdommen. Ikke en diagnose.",
      lede: "Symptomerne varierer. Nogle er meget syge. Nogle har endometriose og få symptomer. Siden gengiver det, WHO og NICE faktisk nævner — den stiller ikke en diagnose.",
      sections: [
        {
          id: "what-who-lists",
          heading: "Det WHO nævner som symptomer",
          paragraphs: [
            "WHO beskriver endometriose som en kronisk sygdom. Symptomerne er kraftige menstruationssmerter, kraftig blødning, kroniske underlivssmerter der ikke forsvinder når menstruationen slutter, infertilitet samt oppustethed og kvalme.",
            "Sygdommen kan også påvirke sex, afføring og vandladning og den psykiske sundhed, herunder depression og angst. Den sidder oftest i bækkenet. Hos nogle findes den andre steder, også i maven og brystkassen.",
            "WHO skriver også, at nogle med endometriose ingen symptomer har, og at symptomerne er så forskellige, at sundhedspersoner ikke altid genkender dem.",
          ],
          citations: [who],
        },
        {
          id: "when-to-suspect",
          heading: "Hvornår NICE siger, man skal mistænke det",
          paragraphs: [
            "NICE-retningslinjen NG73 er skrevet til NHS i England. Den siger, at man skal mistænke endometriose hos kvinder og personer, også under 18 år, med ét eller flere af disse: kroniske underlivssmerter; menstruationssmerter der påvirker hverdag og livskvalitet; dybe smerter under eller efter sex; menstruationsrelaterede eller cykliske mave-tarm-symptomer, især smerter ved afføring; menstruationsrelaterede eller cykliske urinvejssymptomer, især blod i urinen eller smerter ved vandladning; eller infertilitet sammen med ét af de andre.",
            "NICE siger også, at en smerte- og symptomdagbog kan hjælpe samtalen med en læge, og at en normal undersøgelse ikke udelukker sygdommen. En dagbog er et notat, ikke en diagnose.",
          ],
          citations: [nice],
        },
        {
          id: "daily-life",
          heading: "Når symptomerne stopper hverdagen",
          paragraphs: [
            "WHO skriver, at nogle har smerter eller andre symptomer, der holder dem væk fra arbejde eller skole, med tabt indtægt for dem og deres familie. Virkningen bliver værre af stigma og af forestillingen om, at menstruationssmerter bare skal ignoreres. Det er en grund til at søge hjælp.",
          ],
          citations: [who],
        },
      ],
    },
    diagnosis: {
      slug: "diagnosis",
      title: "Diagnose",
      description:
        "Sådan stilles diagnosen endometriose: sygehistorie, ultralyd, MR, og hvorfor en normal scanning eller CA-125 ikke afgør det. Kilder: WHO og NICE NG73.",
      lede: "Diagnose er en klinisk proces. En scanning kan finde noget sygdom og overse anden sygdom. Operation er ikke altid nødvendig, før behandling starter. Sætningerne nedenfor er dem, WHO og NICE har udgivet.",
      sections: [
        {
          id: "history",
          heading: "Det starter med sygehistorien",
          paragraphs: [
            "WHO skriver, at en grundig menstruationsanamnese — smerter, blødningens styrke og ledsagende symptomer — kan hjælpe diagnosen. WHO skriver også, at den gennemsnitlige tid til diagnose er mellem 4 og 12 år, og at lange forsinkelser er almindelige.",
          ],
          citations: [who],
        },
        {
          id: "imaging",
          heading: "Ultralyd og MR",
          paragraphs: [
            "WHO skriver, at endometriose diagnosticeres med billeddiagnostik som ultralyd, og at en klinisk diagnose kan stilles ud fra symptomer og billeddiagnostik som ultralyd eller MR. Operation er ikke nødvendigvis påkrævet, før behandling starter.",
            "NICE siger, at personer med mistanke om endometriose skal tilbydes vaginal ultralyd, også når undersøgelsen af maven og underlivet er normal. Hvis den scanning afvises eller ikke er egnet, kan man overveje ultralyd gennem bugvæggen. NICE er tydelig: udeluk ikke endometriose, hvis undersøgelsen og ultralyden er normale. Henvisning kan stadig være nødvendig.",
            "Ved dyb sygdom siger NICE, at man kan overveje specialist-vaginal ultralyd eller MR af bækkenet for at diagnosticere dyb endometriose og vurdere udbredelsen.",
          ],
          citations: [who, nice],
        },
        {
          id: "ca125",
          heading: "En blodprøve stiller ikke diagnosen",
          paragraphs: [
            "NICE-anbefaling 1.5.8 siger: brug ikke serum-CA125 til at diagnosticere endometriose. En forhøjet eller normal CA125 svarer ikke på spørgsmålet.",
          ],
          citations: [nice],
        },
        {
          id: "surgery",
          heading: "Laparoskopi",
          paragraphs: [
            "WHO skriver, at laparoskopi, hvor vævet kan ses direkte eller der kan tages prøver, kan anbefales, og at indgrebet er utilgængeligt for mange. Det er stadig en måde at bekræfte sygdom på. Det er ikke et krav i alle tilfælde, før behandling starter. Derfor betyder sygehistorien og billeddiagnostikken noget.",
          ],
          citations: [who],
        },
        {
          id: "emerging",
          heading: "Nyere tests er stadig på vej",
          paragraphs: [
            "WHO nævner nye tests, der sigter mod tidligere fund: symptomtjeklister, blodprøver og selvtests af spyt eller menstruationsblod. De står som noget, der er på vej. WHO beskriver ikke en spyt- eller blodtest som den etablerede måde at stille diagnosen på.",
          ],
          citations: [who],
        },
      ],
    },
    treatment: {
      slug: "treatment",
      title: "Behandling",
      description:
        "Behandlinger WHO og NICE nævner: smertestillende, hormoner, kirurgi og fertilitetshjælp. Der findes ingen kur. Ikke en personlig behandlingsplan.",
      lede: "Der findes ingen kur. Behandling sigter mod at dæmpe symptomer. Hvad der passer, afhænger af personen, bivirkningerne, om graviditet ønskes, og hvad der er tilgængeligt. Dette er et kort over de muligheder, retningslinjerne nævner — ikke en recept.",
      sections: [
        {
          id: "no-cure",
          heading: "Ingen kur — symptomkontrol",
          paragraphs: [
            "WHO skriver, at der i dag ikke findes en kur, og ingen behandling der endegyldigt helbreder sygdommen. Behandling sigter mod at kontrollere symptomer og begrænse langtidseffekter. Valget afhænger af sværhedsgrad, ønsker, bivirkninger, langsigtet sikkerhed, pris, tilgængelighed og om graviditet ønskes.",
            "WHO skriver, at symptomer kan fortsætte eller vende tilbage, efter behandling er startet.",
          ],
          citations: [who],
        },
        {
          id: "pain-medicines",
          heading: "Medicin mod smerter",
          paragraphs: [
            "WHO skriver, at NSAID som ibuprofen og naproxen og andre smertestillende ofte bruges mod smerter.",
            "NICE siger, at fordele og risici ved smertestillende skal drøftes, og at man kan overveje et kort forsøg — for eksempel tre måneder — med paracetamol eller et NSAID, alene eller sammen, som førstevalg mod endometrioserelaterede smerter. Hvis det ikke giver tilstrækkelig lindring, skal anden smertebehandling og henvisning overvejes.",
          ],
          citations: [who, nice],
        },
        {
          id: "hormones",
          heading: "Hormonbehandling",
          paragraphs: [
            "WHO skriver, at hormonmedicin kan mindske smertens styrke eller hyppighed hos nogle. Metoderne er kombinerede hormonelle præventionsmidler (p-pille, plaster, ring), gestagener (hormonspiral, DMPA) og GnRH-analoger. Aromatasehæmmere nævnes som andre hormonelle midler. Nogle af dem egner sig ikke til personer, der ønsker at blive gravide.",
            "NICE siger, at man skal tilbyde hormonbehandling, for eksempel kombinations-p-pille eller et gestagen, til personer med mistænkt, bekræftet eller tilbagevendende endometriose, og forklare at hormonbehandling kan mindske smerter og ikke har varig negativ effekt på senere fertilitet.",
          ],
          citations: [who, nice],
        },
        {
          id: "surgery",
          heading: "Kirurgi, herunder fjernelse af livmoderen",
          paragraphs: [
            "WHO skriver, at kirurgi kan fjerne endometriosevæv, sammenvoksninger og arvæv. Hvor meget det mindsker smerter, og hvordan det påvirker graviditet, afhænger ofte af sygdommens udbredelse. Vævet kan komme igen, efter det er fjernet. Bækkenbundsmuskler kan også bidrage til kroniske underlivssmerter.",
            "WHO skriver, at fjernelse af livmoderen, ofte sammen med æggestokkene, kan overvejes hos personer der ikke har gavn af anden behandling og ikke planlægger at få et barn. WHO skriver også, at indgrebet ikke er en kur, og at nogle stadig har symptomer bagefter.",
          ],
          citations: [who],
        },
        {
          id: "fertility",
          heading: "Fertilitet",
          paragraphs: [
            "WHO skriver, at fertilitetsbehandling — ægløsningsstimulation, insemination eller IVF — kan anbefales til personer, der har svært ved at blive gravide på grund af endometriose. Blandt personer med infertilitet skriver WHO, at helt op til 25–50 % har endometriose. Tallet handler om personer, der allerede er i fertilitetsudredning. Det er ikke sandsynligheden for, at en bestemt person med endometriose ikke kan blive gravid.",
          ],
          citations: [who],
        },
        {
          id: "other-care",
          heading: "Fysioterapi, psykologi og støtte",
          paragraphs: [
            "WHO skriver, at patientforeninger kan hjælpe ved siden af den medicinske behandling, og at tværfaglig smertebehandling — herunder fysioterapi og kognitiv adfærdsterapi — kan mindske endometrioserelaterede smerter hos nogle.",
          ],
          citations: [who],
        },
      ],
    },
    living: {
      slug: "living",
      title: "At leve med endometriose",
      description:
        "Arbejde, skole, træthed, humør og stigma: det WHO skriver om livet med endometriose, og hvor man finder hjælp. Ikke lægefaglig rådgivning.",
      lede: "Endometriose er ikke kun en liste over behandlinger. WHO beskriver følger for arbejde, skole, sex, humør og økonomi. Siden holder sig til de udsagn og peger på støtte. Den fortæller dig ikke, hvordan du skal leve.",
      sections: [
        {
          id: "quality",
          heading: "Det sygdommen kan ændre",
          paragraphs: [
            "WHO skriver, at kraftige smerter, kraftig blødning, træthed, depression, angst, infertilitet, dårlig seksuel sundhed og social isolation kan sænke livskvaliteten markant. Kraftig blødning kan bidrage til jernmangel og træthed. Smerter ved sex kan få mennesker til at undgå samleje.",
            "Der kendes ingen måde at forebygge endometriose på. WHO skriver, at tidligere diagnose og god behandling kan bremse udviklingen og mindske langtidssymptomer. Det er et håb knyttet til behandling, ikke et løfte.",
          ],
          citations: [who],
        },
        {
          id: "stigma",
          heading: "Smerter bliver stadig kaldt normale",
          paragraphs: [
            "WHO skriver, at offentligheden, familier og de fleste sundhedspersoner i mange lande ikke anerkender, at de kroniske underlivssmerter ikke er normale. At normalisere smerterne, og stigmaet omkring menstruation, skader den psykiske sundhed.",
            "Hvis en læge affærdiger symptomer som almindelig menstruation, er det en grund til at bede om en ny vurdering. NICE's liste over mistanke er noget, man kan tage med til samtalen. Det er en britisk retningslinje, så et dansk forløb kan være et andet. Symptomerne selv er ikke begrænset til ét land.",
          ],
          citations: [who, nice],
        },
        {
          id: "diary",
          heading: "En symptomdagbog",
          paragraphs: [
            "NICE siger, at en dagbog over smerter og symptomer kan hjælpe samtalen. Datoer, hvad smerterne forhindrede, blødning, tarm og blære, og hvad du har prøvet, er de nyttige kolonner. Tag den med til konsultationen. Den erstatter ikke en undersøgelse.",
          ],
          citations: [nice],
        },
        {
          id: "support",
          heading: "Hvor du kan gå hen",
          paragraphs: [
            "Tal med en læge om dine egne symptomer. OpenEndos adgangsside viser centre, medicin og patientforeninger pr. land, med den dato posten er tjekket. Patientforeninger er støtte. De er ikke en akutfunktion og ikke et specialeafsnit.",
            "Den europæiske retningslinje fra ESHRE (2022) er det dokument, mange specialister bruger ved siden af nationale vejledninger. Siden her gengiver ikke anbefalingerne linje for linje. Læs den, eller spørg en læge der bruger den, når du har brug for det detaljeniveau.",
          ],
          citations: [eshre, eshrePage],
        },
      ],
    },
    denmark: {
      slug: "denmark",
      title: "Endometriosebehandling i Danmark",
      description:
        "Sådan er endometriosebehandlingen organiseret i Danmark ifølge OpenEndos kildebelagte adgangsfil: egen læge, henvisning, to specialcentre og patientforeningen.",
      lede: "Det danske forløb er ikke NHS-forløbet. Trin, centre og medicin nedenfor kommer fra OpenEndos adgangsfil, som opdateres i det åbne repositorium. Bekræft alt, der har betydning for din behandling, med din egen læge eller den officielle side, posten linker til.",
      sections: [
        {
          id: "orientation",
          heading: "Sådan skal siden læses",
          paragraphs: [
            "Behandlingstrin, centernavne og medicinnoter hentes fra docs/data/access.json i OpenEndo-repositoriet. Hver post har sine egne kilder og en verificeret dato. Hvis filen ikke kan hentes, siger siden det. Den falder ikke tilbage på en ældre håndskrevet liste.",
            "Generelle fakta om sygdommen — at der ikke findes en kur, og at diagnosen ofte er forsinket — er WHO's udsagn på de andre sider. De er ikke dansk lov.",
          ],
          citations: [who],
        },
        {
          id: "danish-sources",
          heading: "Danske kilder ved siden af denne side",
          paragraphs: [
            "Lægehåndbogen på sundhed.dk er den danske kliniske oversigt, klinikere bruger. Endometriose Fællesskabet er patientforeningen: rådgivning, fællesskab og hjælp til rettigheder på arbejde og i systemet. De to specialcentre i adgangsfilen er Rigshospitalet i øst og Aarhus Universitetshospital, Skejby, i vest. Den levende liste nedenfor er den, der gælder, hvis navne eller roller ændrer sig.",
          ],
          citations: [laege, endoDk],
        },
      ],
    },
  },
};

export function learnPage(locale: Locale, slug: LearnSlug): LearnPage {
  return pages[locale][slug];
}

export function learnFaq(locale: Locale): FaqItem[] {
  if (locale === "da") {
    return [
      {
        question: "Findes der en kur?",
        answer:
          "Nej. WHO skriver, at der ikke findes en kur, og at behandling sigter mod at kontrollere symptomer.",
        citations: [who],
      },
      {
        question: "Udelukker en normal ultralyd endometriose?",
        answer:
          "Nej. NICE siger, at man ikke må udelukke endometriose, hvis undersøgelsen og ultralyden er normale.",
        citations: [nice],
      },
      {
        question: "Kurerer fjernelse af livmoderen sygdommen?",
        answer:
          "Nej. WHO skriver, at hysterektomi ikke er en kur, og at nogle stadig har symptomer bagefter.",
        citations: [who],
      },
    ];
  }
  return [
    {
      question: "Is there a cure?",
      answer: "No. WHO says there is no cure, and that treatment aims to control symptoms.",
      citations: [who],
    },
    {
      question: "Does a normal ultrasound rule endometriosis out?",
      answer:
        "No. NICE says not to exclude endometriosis if the examination and the ultrasound are normal.",
      citations: [nice],
    },
    {
      question: "Does a hysterectomy cure it?",
      answer: "No. WHO says hysterectomy is not a cure, and that some people still have symptoms.",
      citations: [who],
    },
  ];
}

export const LEARN_REVIEWED = "2026-10-28";
