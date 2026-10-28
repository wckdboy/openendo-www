/**
 * Pull the canonical OpenEndo dataset into the build.
 * The site renders this snapshot immediately, then refetches the same URLs
 * in the browser. Funding calls are filtered by calendar date at render time.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { sitemapEntries, SITE_ORIGIN } from "../src/lib/site.ts";

const RAW = "https://raw.githubusercontent.com/wckdboy/openendo/main";
const ROOT = path.resolve(import.meta.dirname, "..");

async function get(url) {
  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, text/markdown, */*",
      "user-agent": "openendo-www-build",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

async function json(rel) {
  const res = await get(`${RAW}/${rel}`);
  return res.json();
}

async function text(rel) {
  const res = await get(`${RAW}/${rel}`);
  return res.text();
}

const [
  meta,
  funding,
  content,
  trialsGlobal,
  trialsDenmark,
  pubmedRecent,
  pubmedMonthly,
  latestFile,
  evidenceListing,
] = await Promise.all([
  json("docs/data/meta.json"),
  json("docs/data/funding.json"),
  json("docs/data/content.json"),
  json("docs/data/trials_global_recruiting.json"),
  json("docs/data/trials_denmark.json"),
  json("docs/data/pubmed_recent.json"),
  json("docs/data/pubmed_monthly.json"),
  text("docs/research/evidence/weekly/LATEST"),
  get("https://api.github.com/repos/wckdboy/openendo/contents/docs/research/evidence").then((res) =>
    res.json(),
  ),
]);

const date = latestFile.trim().replace(/\.json$/, "");
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error(`Unexpected LATEST contents: ${latestFile.trim()}`);
}

const markdown = await text(`docs/research/evidence/digest-${date}.md`);
if (!markdown.startsWith("#")) throw new Error("Latest digest did not look like markdown");

const digestIndex = (Array.isArray(evidenceListing) ? evidenceListing : [])
  .map((item) => item?.name)
  .filter((name) => typeof name === "string" && /^digest-\d{4}-\d{2}-\d{2}\.md$/.test(name))
  .map((name) => name.slice("digest-".length, -".md".length))
  .sort((a, b) => b.localeCompare(a));

if (!digestIndex.includes(date)) digestIndex.unshift(date);

const snapshot = {
  meta,
  funding,
  content,
  trialsGlobal,
  trialsDenmark,
  pubmedRecent,
  pubmedMonthly,
  latestDigest: { date, markdown },
  digestIndex,
};

const generatedDir = path.join(ROOT, "src/generated");
await mkdir(generatedDir, { recursive: true });
await writeFile(path.join(generatedDir, "snapshot.json"), `${JSON.stringify(snapshot)}\n`);

const urls = sitemapEntries()
  .map((entry) =>
    [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${entry.path === "/" ? "/" : entry.path}</loc>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>",
    ].join("\n"),
  )
  .join("\n");

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  urls,
  `</urlset>`,
  "",
].join("\n");

await writeFile(path.join(ROOT, "public/sitemap.xml"), xml);

const openMarked = Array.isArray(funding)
  ? funding.filter((entry) => entry?.open === true).length
  : 0;
console.log(
  `Synced OpenEndo snapshot ${meta?.updated ?? "?"} · digest ${date} · ${digestIndex.length} digests · ${openMarked} calls flagged open (render-time date filter still applies)`,
);
