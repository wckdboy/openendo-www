# OpenEndo Clarity — structural map

## 1. Routes / pages inventory

| Route file | URL | Purpose |
|------------|-----|---------|
| `src/routes/__root.tsx` | `/*` | Root shell: fonts, meta, JSON-LD org schema, sticky `SiteHeader`, `<Outlet />`, `SiteFooter`, error + 404 fallbacks. |
| `src/routes/index.tsx` | `/` | Home / landing: hero, stat strip, "why this exists", live snapshot, funding deadlines, take-action. |
| `src/routes/dashboard.tsx` | `/dashboard` | Live data dashboard: KPIs, charts, searchable tabbed feed of trials/papers. |
| `src/routes/knowledge.tsx` | `/knowledge` | Editorial reference page: sticky TOC, sourced articles on endometriosis. |

No hidden/utility routes, no `src/routes/api/*` endpoints, no auth-gated `_authenticated/*` routes, and no detail pages for individual records.

## 2. Data architecture

### Clinical trials
- **Source:** ClinicalTrials.gov API v2 (`https://clinicaltrials.gov/api/v2/studies`).
- **Module:** `src/lib/openendo.functions.ts`.
- **Queries:**
  - Worldwide recruiting: `query.cond=endometriosis&filter.overallStatus=RECRUITING&pageSize=200&countTotal=true`.
  - Denmark: `query.cond=endometriosis&query.locn=Denmark&pageSize=200&countTotal=true`.
- **Flow:** `createServerFn` → server fetch → Zod-less but hand-normalized mapping (`mapStudies`) → tallied by country / by status → returned to client.
- **Cache:** module-level in-memory cache, 30 min (`CACHE_MS`). Falls back to last good result if a source blips.

### Research / papers
- **Source:** PubMed E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils`).
- **Module:** `src/lib/openendo.functions.ts`.
- **Queries:**
  - Year total, last-7-days total, 25 most recent papers.
  - Monthly trend fetched separately via `getPaperMonthly` (10 windows, current month dropped).
- **Flow:** sequential, throttled calls (`wait` 450–900 ms, 3 retries with backoff) to avoid NCBI rate limits.
- **Cache:** separate 30 min module-level cache for monthly counts.

### Funding opportunities
- **Source:** hand-curated static TypeScript.
- **Module:** `src/content/data.ts` (`grantsEn` / `grantsDa`).
- **Flow:** imported directly; sorted and sliced on the home page.

### Knowledge / wiki content
- **Source:** hand-curated static TypeScript.
- **Module:** `src/content/data.ts` (`articlesEn` / `articlesDa`).
- **Flow:** imported directly; rendered as long-form articles with source links.

### Localization copy
- **Source:** static TypeScript.
- **Module:** `src/content/copy.ts` (`copy.en`, `copy.da`).
- **Flow:** `LanguageProvider` (`src/lib/i18n.tsx`) stores choice in `localStorage`; `useLang()` returns current copy. Default SSR language is `en`; `html lang` is updated client-side.

## 3. Key components & design system

### Layout components
- `src/components/SiteHeader.tsx` — sticky glass header, nav links, language toggle, mobile hamburger menu.
- `src/components/SiteFooter.tsx` — 4-column footer: tagline, data sources, project links, language switcher.
- `src/components/RibbonMark.tsx` — SVG yellow-ribbon mark used at nav size and as large hero watermark.

### Design tokens (`src/styles.css`)
- **Canvas:** near-white `oklch(0.988 0.004 95)`.
- **Ink:** near-black `oklch(0.19 0.008 90)`.
- **Ribbon yellow:** `oklch(0.87 0.176 96)`.
- **Ribbon soft:** `oklch(0.965 0.05 98)`.
- **Hairline:** `oklch(0.9 0.006 95)`.
- **Fonts:** Manrope (sans) via Google; Fraunces (serif) via Google.

### Utilities
- `.accent` — Fraunces italic, editorial emphasis (dark, not yellow).
- `.numeral` — Fraunces, tabular lining nums for stats and counts.
- `.marker` — yellow ribbon underline swipe behind key words.
- `.rise` — quiet entrance animation.

### Charts / visualization
- `recharts` in `src/routes/dashboard.tsx`:
  - Vertical bar chart: recruiting trials by country (top bar highlighted yellow).
  - Progress-bar list: Denmark trials by status.
  - Line chart: papers per month (grey line, yellow dots).
- Custom tooltip `Bubble` and `ChartBlock` wrapper.

### shadcn UI
- Full component library is installed under `src/components/ui/*` but **not currently imported by any app/route code**; only internal cross-dependencies within `src/components/ui`. The app uses plain Tailwind markup instead.

## 4. Content sections currently on the site

### Home (`/`)
- **Hero:** eyebrow, headline with serif accent phrase, one-sentence purpose, primary CTA to dashboard, GitHub link, trust badges.
- **Stats strip:** 4 big numerals (prevalence, diagnostic delay, funding share, diagnostic gold standard) with source notes.
- **Why this exists:** 4 numbered facts with citations.
- **Live snapshot:** 3 KPI tiles (recruiting worldwide, Denmark trials, papers last 7 days) + link to dashboard.
- **Funding deadlines:** next 4 grants with countdown / days-left.
- **Take action:** 3 CTAs (contribute, find a trial, share).

### Dashboard (`/dashboard`)
- **Ribbon header band:** yellow rule, eyebrow, serif-accent headline.
- **KPI grid:** 4 metrics (worldwide recruiting, Denmark trials, papers this year, papers last 7 days).
- **Charts:** country bar chart, Denmark status breakdown, monthly PubMed trend.
- **Feed:** tabbed searchable list — global trials, Denmark trials, recent papers. Mobile = stacked cards; desktop = fixed table.
- **Source timestamp:** ClinicalTrials.gov + PubMed attribution and last fetch time.

### Knowledge (`/knowledge`)
- **Hero:** headline with serif accent, lede.
- **Sticky TOC:** left sidebar on desktop, hash links to articles.
- **Articles:** what it is, symptoms, diagnosis, treatment, myths, glossary — each with sourced link.

## 5. Known gaps / TODOs

- **No detail views:** individual trials/papers only link out to ClinicalTrials.gov / PubMed.
- **No automated funding refresh:** grants are hard-coded and must be edited by hand.
- **No sitemap / RSS / about / contact pages.**
- **No `og:image`:** social cards have text metadata only.
- **Language is client-only:** `localStorage` persists choice, but SSR always emits `lang="en"` and search engines see English copy first.
- **In-memory cache is worker-local:** each Cloudflare Worker instance caches independently; no shared Redis/DB.
- **ClinicalTrials.gov pagination cap:** `pageSize=200`; more than 200 recruiting studies would be silently truncated.
- **PubMed monthly fallback is partial:** if a monthly request fails mid-sequence, only the successfully fetched months are returned; no full last-good-shape fallback like the main payload has.
- **shadcn UI is dead weight:** installed but unused; could be removed or adopted.
- **No per-route error boundaries:** only the root `errorComponent` and `notFoundComponent` exist.
