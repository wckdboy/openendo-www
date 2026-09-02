# OpenEndo — clean rebuild

A calm, Apple-quiet replacement for openendo.org: white space, one strong idea per screen, the yellow endometriosis ribbon as the only loud element, and a serif accent face used sparingly for emphasis and numbers.

## Design direction

- **Palette:** near-white canvas (#FCFCFA), ink near-black text, soft grey hairlines, deep ink footer. Ribbon yellow (#FFD60A) reserved for the mark, emphasis underlines, and one primary action per screen.
- **Type:** Fraunces (already your brand serif) for headline emphasis, big stat numbers, and pull quotes — set in a warm dark tone, not yellow, so it reads as editorial rather than decorative. Clean geometric sans for everything else.
- **Structure:** wide margins, generous vertical rhythm, hairline dividers instead of card borders where possible, no drop-shadow soup, no alternating background bands. Charts rendered flat and monochrome with a single yellow highlight series.
- **Motion:** restrained — quiet fade/rise on section entry, nothing looping.
- Rebuilt SVG ribbon mark, drawn cleanly for use at nav size and as a large watermark in the hero.

## Pages

**Home (/)** — one focused scroll:
1. Hero: eyebrow, headline with serif emphasis phrase, one sentence of plain-language purpose, single primary CTA to the dashboard plus a quiet GitHub link.
2. Four-figure stat strip (diagnosis delay, prevalence, research funding gap, trials open now) — big serif numerals, hairline separators, each with source note.
3. "Why this exists" — four short facts, text-forward, no icon clutter.
4. Live snapshot: three headline KPIs and one chart, linking through to the full dashboard.
5. Funding deadlines: next few, as a clean list with days-remaining.
6. Take action: three concrete steps.
7. Footer: data sources, licence, GitHub, language toggle.

**Dashboard (/dashboard)** — all the numbers, calmly laid out: KPI row, recruiting-trials-by-country bar chart, Denmark status breakdown, PubMed output over time, then tabbed tables (worldwide recruiting trials, Denmark trials, new papers last 7 days) with search and a link out to each record.

**Knowledge (/knowledge)** — editorial reading layout: sticky table of contents, long-form sections on what endometriosis is, symptoms, diagnosis path, treatment options, myths, and glossary. Each entry cites its source.

**Language** — EN/DA toggle in the header, all copy driven through a translation map, choice persisted in localStorage.

## Data

Since this site replaces openendo.org, it fetches sources directly rather than depending on the old JSON files:

- Clinical trials from the ClinicalTrials.gov v2 API (worldwide recruiting + Denmark, all statuses).
- Publication counts and recent papers from PubMed E-utilities.
- Funding opportunities and knowledge/wiki content live as curated files in the repo, easy to edit by hand.

All fetching happens in server functions with cached results and TanStack Query on the client, so a source outage shows the last shape of the page with a quiet "data unavailable" note instead of an empty screen.

## Technical notes

- TanStack Start routes: `index.tsx`, `dashboard.tsx`, `knowledge.tsx`, shared header/footer in `__root.tsx`.
- Design tokens (ribbon yellow, ink, canvas, radii, serif/sans families) defined in `src/styles.css` under `@theme`; Fraunces + sans loaded via `<link>` in the root head.
- Charts with Recharts, restyled to the flat monochrome-plus-yellow treatment.
- Server functions in `src/lib/openendo.functions.ts` calling ClinicalTrials.gov and PubMed; Zod-validated shapes; short in-memory cache.
- Per-route `head()` metadata, JSON-LD Dataset + Organization carried over from the current site, canonical tags, sitemap-friendly real routes (no hash-only sections).
