# OpenEndo: design direction v0.1 (Percival)
Built from the live site (fetched 2026-10-28: home, /learn/symptoms, /evidence, /dashboard, /knowledge, /research, /access) and `src/styles.css` plus `SiteHeader.tsx` in wckdboy/openendo-www. Tokens are in `tokens.css`. Contrast was computed (WCAG 2.x) and is in `contrast.json`.

## 0. What's wrong with the current site
The content discipline is genuinely excellent. The symptoms page and the digest are careful and well cited. The design and framing work against that.
1. **The homepage reads like a campaign, not a reference.** "The real state of the fight", "Four facts that should not still be true", "Raise your voice", and "Grants worth chasing… if anyone applies" are exactly the outrage tone the brief rules out. So is the section on pain not being taken seriously.
2. **Shock stats are the hero:** 190M, 1 in 10, 4–12 yrs, and a "cures" stat whose value doesn't show in the page HTML.
3. **Stale content on the homepage.** On 28 Oct it still shows the 13 Sep and 22 Sep deadlines on the politician one-pagers, and the grants block's HTML says "Checking which calls are still open…".
4. **Empty pages without JavaScript.** /knowledge, /research and /access contain only "Loading…" in the HTML, and /access lists no countries. Search engines, AI crawlers, slow phones and some screen readers get nothing. For a "verified source" site, this is the biggest credibility leak. Server-render or prerender these pages.
5. **The navigation is seven overlapping words** (Learn, Knowledge, Research, Evidence, Dashboard, Access) plus GitHub, set in 13px muted grey. Nobody can tell Knowledge from Learn from Research.
6. **The evidence digest is a wall of text with internal plumbing up front:** "open as PR #51", `weekly/2026-10-16.json`, pdat/edat queries. The science is great but buried.
7. **Dashboard problems.** The trial list appears twice in the markup (as a list and as a table). Most rows say phase "N/A". In the HTML, the stat labels sit next to the wrong values ("Trials recruiting worldwide 15… Recruiting in Denmark 29"), which needs checking on screen.
8. **The type says lifestyle magazine.** Fraunces italic headings plus a yellow highlighter underline is campaign or editorial energy, not reference. Body text is 16px, which is small for long medical reading.
9. **The disclaimer box repeats prominently on every page and again in the footer.** It reads as defensive.
10. **Inconsistent wording:** "women" in some places and "women and people" in others.
11. **The focus ring (`--ring` oklch(0.75 0.05 96)) looks below 3:1 against the background.** Check it. The yellow ribbon is about 1.5–1.8:1 on paper, which is fine for decoration but not for anything that carries meaning.

## 1. Tone and references
- The idea: **"the calm, sourced reference."** It's the page a clinician would be happy to see a patient print. It is confident, plain, kind, and precise. No pity, no outrage, no hype.
- References:
  - [NHS website](https://www.nhs.uk) for plain, task-led health pages.
  - [Our World in Data](https://ourworldindata.org) for showing the source and date on every chart.
  - [Cochrane plain language summaries](https://www.cochranelibrary.com) for certainty language.
  - [GOV.UK Design System](https://design-system.service.gov.uk) for component discipline.
  - [sundhed.dk](https://www.sundhed.dk) for the Danish register.
- Voice rules:
  - Second person where it helps ("You can ask for a referral…").
  - Say "people with endometriosis" / "personer med endometriose" everywhere.
  - Banned words: fight, suffer/sufferer, warrior, battle, "should not still be true", "if anyone applies", "dismissed".
  - Every number comes with its source, its date, and one line of context.
  - Use certainty words consistently: "established", "likely", "uncertain", "not yet shown".
- Advocacy material (the one-pagers for decision-makers) moves to `/about/for-decision-makers`, written neutrally. It should not be on the homepage.

## 2. Typography (self-hosted WOFF2 through Fontsource or local files. No Google Fonts CDN, because a CDN sends visitors' IPs to Google, which is a GDPR issue for an EU audience)
- **Headings: Source Serif 4** (Adobe, SIL OFL 1.1). Upright only, weights 600/700, optical sizing on. It's authoritative without being fashionable. Drop Fraunces italic.
- **Body and UI: Atkinson Hyperlegible Next** (Braille Institute, SIL OFL 1.1). It's built for legibility, which is itself a credibility signal, and it covers æ, ø and å.
- **IDs: Atkinson Hyperlegible Mono** (OFL) for PMIDs and NCT numbers only.
- Scale:
  - 14px for metadata and badges.
  - 16px for UI and captions.
  - **18px body**, line height 1.6, measure 68ch.
  - 22px lead / h4, 28px h3.
  - h2 28–34px and h1 34–44px (fluid `clamp`).
  - Data values 36–48px, using tabular figures (`font-variant-numeric: tabular-nums`).
- Sentence case everywhere. No all caps except 14px overline labels, with letter-spacing 0.04em.
- Set `lang="da"` and `hyphens: auto` on Danish pages, because long compounds break layouts.

## 3. Colour (every text pair passes AA; most pass AAA)
| Token | Light | on paper | Dark | on paper |
|---|---|---|---|---|
| paper / surface / sunken | #FBFAF7 / #FFFFFF / #F3F1EC | n/a | #14171A / #1B1F23 / #101315 | n/a |
| ink (body) | #1B1F23 | 15.9 | #ECEAE5 | 15.0 |
| ink-muted | #4A525A | 7.6 | #B5B9BE | 9.1 |
| ink-subtle (meta only) | #5F6770 | 5.5 | #9AA0A7 | 6.8 |
| primary (links, buttons, focus) | #1D5C66 deep teal | 7.3 (white on it 7.6) | #7CC4CE | 9.1 |
| primary-hover | #154850 | 9.7 | #9AD3DB | 10.9 |
| link-visited | #4B3F72 | 8.9 | #B9AEE0 | 8.7 |
| ribbon (mark + rules only) | #E8B931 | 1.8, **never text** | #E8B931 | 9.8 |
| ribbon-text | #7A5C00 | 6.0 | #E8B931 | 9.8 |
| info | #1F4E8C | 8.0 | #8DB4EA | 8.4 |
| caution | #8A5A00 | 5.7 | #E9B35A | 9.5 |
| danger (real errors only) | #B3261E | 6.3 | #F2938B | 8.0 |
| success | #1E6B45 | 6.2 | #7FCB9E | 9.4 |
| border-strong (controls, 3:1 rule) | #8C857A | 3.5 | #6E747B | 3.8 |
- Keep the yellow awareness ribbon as a small identity nod: the logo mark, a 3px rule over the active nav item, and chart highlights paired with ink labels. Teal does the actual work.
- **No red or pink for the disease**, no trend arrows on prevalence figures, and no colour as the only signal (always pair it with a label or icon).
- Charts: primary teal plus a grey ramp, labels placed directly on the data instead of in a legend, and the source and snapshot date under every chart.
- Focus: a 2px primary outline with a 2px offset, at 7:1. That replaces the current pale ring.

## 4. Layout and navigation
- Grid: 1200px container, 12 columns with 24px gutters, 4px spacing base. Section rhythm is 64px on desktop and 48px on mobile.
- **Primary nav: five items, 16px, ink colour.** The active item gets the 3px ribbon rule.
  1. **Guides** (Symptoms, Diagnosis, Treatment, Living with endometriosis, Care in Denmark). This is the old Learn and Knowledge combined; Knowledge topics become guides or a "Topics A–Z" index under Guides.
  2. **Evidence** (Weekly digest, Research programme, which is the old Research page).
  3. **Trials & funding** (the old Dashboard plus open funding calls, with past deadlines hidden automatically).
  4. **Find care** (the old Access page, with Denmark as the default for DA and the country picker server-rendered).
  5. **About** (Method and sources, Editorial policy, Who checks this, For decision-makers, GitHub).
- Top right: a language toggle labelled in the target language ("Dansk" / "English"), and later a search button (⌘K).
- **Home, top to bottom:**
  1. A plain promise: "Clear, sourced information about endometriosis", with one line of subtext.
  2. Two buttons: "Read the guides" and "This week's evidence".
  3. Five guide cards.
  4. "This week in research": three plain bullets, a date, and "Read the digest".
  5. A data strip with three cards: recruiting trials, Danish trials, new papers, each with source and date.
  6. "How we check": sources (WHO, NICE NG73, ESHRE), review dates, open data and repo.
  7. Footer.
- **Content page:** breadcrumb, then H1, then an "In short" box (2–4 sentences), then the meta row, then the body. On desktop, a sticky table of contents sits in a 220px left column, the body is 680px, and there is no right rail. On mobile, the table of contents becomes an "On this page" disclosure.

## 5. Key components
**Content page with citations and review date**
- Meta row (14px, ink-subtle): "Last reviewed 28 Oct 2026 · Next review Jan 2027 · Sources: WHO, NICE NG73 · How we check". Name who reviewed it **only if that's true**. Never imply a clinical review that didn't happen.
- Citations are numbered superscripts `[1]` that link to a Sources list at the end. On hover or tap, a popover shows the source title, organisation, date, and source-type badge, plus "Open source ↗".
- Source-type badges, ordered by strength of evidence: Guideline, Systematic review, Randomised trial, Observational, Preclinical, Case report, Fact sheet. Neutral pill shape, label always visible.
- Callouts, a maximum of one per section: "When to ask for care" (info), "Good to know" (sunken). No red boxes.
- Disclaimer: one quiet line under the meta row ("General information, not medical advice. How to use this site"). The full text lives in the footer and on About. Remove the repeated box.
- Danish pages are written in Danish, not a word-for-word copy of the English. Show "Also in English" only when the page exists in English.

**Data card**
- Overline label (14px caps), value (stat size, tabular figures), one context line ("recruiting worldwide, ClinicalTrials.gov"), and footer "Snapshot 26 Oct 2026 · See all →".
- Server-render the last-known value. Never show "Loading…" as the only content.
- If the data is more than 8 days old, show a caution chip, "Data from 26 Oct". On error, show the last value plus "Couldn't refresh".
- No sparkline unless the trend is the point. No up or down colouring.

**Evidence list (weekly digest)**
- Header: "Week of 16–23 Oct 2026". Below it, an "In short" panel with 3–5 bullets taken from the "Notable clinical signals".
- Filter chips for topic (Diagnosis, Surgery, Treatment, Mechanisms, Burden) and study type, plus a "Patient-relevant only" toggle.
- Each entry is a row or card with:
  - A plain-language title.
  - Study-type badge, the number of people studied, and a certainty word.
  - "What it found", one sentence.
  - "Why it matters", one sentence.
  - The PMID in mono, linking to PubMed.
  - "Details" expands the full paragraph that exists today.
- Methods (queries, screened, dropped as noise, carry-overs, PR and file references) move into a collapsed **"How this digest was made"** section at the bottom. Nothing is lost.
- Archive: a list of past weeks with entry counts.

**Trials table**
- Sentence-case titles. Phase shows "Observational / not phased" instead of "N/A". Columns: status chip, sponsor, countries, and "View on ClinicalTrials.gov ↗".
- Table on desktop and cards on mobile, but **only one rendered** at a time (fix the duplicate markup). Default filter is Denmark on /da.

## 6. Imagery
- **Never:** people clutching their stomachs, grimacing, hot-water bottles, red, pink "femtech" pastel, uterus clip art, flowers, or ribbon-wrapped hands.
- **Yes:**
  - Data visualisation as the main imagery.
  - Clean, medically accurate line diagrams for anatomy, laparoscopy and ultrasound, in ink and teal at a 1.5px stroke.
  - Where photography is used, ordinary, diverse people in ordinary settings (at work, talking with a clinician, walking), often Danish contexts, with neutral expressions. Real people, not staged pain.
- Icons: Lucide (already installed) at 1.5px stroke and 20/24px sizes, in ink colour. Colour comes from state only.
- No hero image on the homepage. The promise and the guides are the hero.

## 7. Motion and accessibility
- 150ms fades and expands only, no parallax, and `prefers-reduced-motion` turns them off.
- Tap targets are 44px. Skip link. Visible focus everywhere. `lang` switches per locale. Charts have table equivalents.
- Target WCAG 2.2 AA site-wide. Body text already passes AAA.

## 8. Build order for the coding agent
1. Server-render or prerender /knowledge, /research and /access, and fix the duplicate trials markup and the stat labels.
2. Add the tokens and fonts, and replace Fraunces and Manrope.
3. Change the nav to five items, with redirects from the old routes.
4. Rewrite the homepage structure and copy to the new tone, and move advocacy to About.
5. Build the content-page template with the meta row, citations and a single disclaimer, then apply it to the five guides in EN and DA.
6. Build the evidence-list component, using the digest's existing sections as data.
7. Rework data cards and the trials table.
