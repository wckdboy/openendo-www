export type StudyType =
  | "Guideline"
  | "Systematic review"
  | "Randomised trial"
  | "Observational"
  | "Preclinical"
  | "Case report"
  | "Fact sheet";

export type DigestEntry = {
  id: string;
  title: string;
  topic: string;
  studyType: StudyType;
  certainty: "established" | "likely" | "uncertain" | "not yet shown";
  people: string | null;
  found: string;
  matters: string;
  pmid: string | null;
  details: string;
};

export type ParsedDigest = {
  weekLabel: string;
  signals: string[];
  entries: DigestEntry[];
  method: string;
};

const TOPIC: Record<string, string> = {
  "diagnostics and imaging": "Diagnosis",
  surgery: "Surgery",
  "mechanisms and biology": "Mechanisms",
  "epidemiology and burden": "Burden",
  "pharmacology and supportive care": "Treatment",
};

/** One plain sentence for the homepage. Drops study shorthand and parentheticals. */
export function plainHeadline(signal: string): string {
  const cleaned = signal
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\bPMID\s*\d+/gi, "")
    .replace(/\bGRADE\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.;,])/g, "$1")
    .trim();
  const sentence = cleaned.split(/(?<=\.)\s/)[0] ?? cleaned;
  return sentence.length > 180 ? `${sentence.slice(0, 177).replace(/\s+\S*$/, "")}` : sentence;
}

export function parseDigest(markdown: string): ParsedDigest {
  const heading = markdown.split("\n")[0] ?? "";
  const week = heading.match(/week\s+(\d{4}-\d{2}-\d{2})\.\.(\d{2}-\d{2})/i);
  const weekLabel = week ? formatWeek(week[1] ?? "", week[2] ?? "") : heading.replace(/^#\s*/, "");

  const chunks = markdown.split(/\n(?=## )/);
  const intro = chunks[0] ?? "";
  const method = intro.replace(/^#.*\n/, "").trim();
  const signals = sectionBody(markdown, "Notable clinical signals")
    .split(/\n(?=- )/)
    .map((item) =>
      item
        .replace(/^- \s*/, "")
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((item) => item.length > 40)
    .slice(0, 5);

  const entries: DigestEntry[] = [];
  for (const chunk of chunks.slice(1)) {
    const titleLine = chunk.match(/^##\s+(.+)/);
    const headingText = titleLine?.[1]?.trim() ?? "";
    const topic = TOPIC[headingText.toLowerCase()];
    if (!topic) continue;
    const body = chunk.replace(/^##.*\n/, "");
    for (const raw of body.split(/\n(?=- \*\*)/)) {
      const entry = parseEntry(raw, topic, entries.length);
      if (entry) entries.push(entry);
    }
  }

  return { weekLabel, signals, entries, method };
}

function sectionBody(markdown: string, name: string): string {
  const match = markdown.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`));
  return match?.[1] ?? "";
}

function parseEntry(raw: string, topic: string, index: number): DigestEntry | null {
  const text = raw.replace(/^- \s*/, "").trim();
  const match = text.match(
    /^\*\*(.+?)\*\*\s+[—–-]\s+([\s\S]*?)\[PMID\s+(\d+)\]\([^)]+\)\s+[—–-]\s+\*why it matters:\*\s+([\s\S]*)$/i,
  );
  if (!match) return null;
  const title = match[1]?.replace(/\s+/g, " ").trim() ?? "";
  const foundBody = (match[2] ?? "").replace(/\s+/g, " ").trim();
  const pmid = match[3] ?? null;
  const matters = (match[4] ?? "").replace(/\s+/g, " ").trim();
  const people = foundBody.match(
    /(\d[\d,]*)\s+(?:people|women|patients|readers|participants|cycles)/i,
  );
  return {
    id: `${topic}-${pmid ?? index}`,
    title,
    topic,
    studyType: studyType(foundBody),
    certainty: certainty(foundBody, matters),
    people: people?.[0] ?? null,
    found: firstSentence(foundBody),
    matters: firstSentence(matters),
    pmid,
    details: `${foundBody} ${matters}`.trim(),
  };
}

function studyType(text: string): StudyType {
  const value = text.toLowerCase();
  if (/randomi[sz]ed/.test(value)) return "Randomised trial";
  if (/meta-analysis|systematic review/.test(value)) return "Systematic review";
  if (/case report/.test(value)) return "Case report";
  if (/preclinical|in vitro|mouse|murine/.test(value)) return "Preclinical";
  if (/guideline/.test(value)) return "Guideline";
  return "Observational";
}

function certainty(found: string, matters: string): DigestEntry["certainty"] {
  const value = `${found} ${matters}`.toLowerCase();
  if (/low or very low|very low|not a new guideline|does not change|not shown|failed/.test(value)) {
    return "uncertain";
  }
  if (/not yet|pending|needs independent/.test(value)) return "not yet shown";
  if (/randomi[sz]ed/.test(value) && /increased|reduced|improved/.test(value)) return "likely";
  return "uncertain";
}

function firstSentence(text: string): string {
  const match = text.match(/^(.+?[.])(?:\s|$)/);
  return (match?.[1] ?? text).trim();
}

function formatWeek(start: string, end: string): string {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endYear = start.slice(0, 4);
  const endDate = new Date(`${endYear}-${end}T00:00:00Z`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return start;
  const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
  return `Week of ${startDate.getUTCDate()}–${endDate.getUTCDate()} ${month.format(endDate)} ${endDate.getUTCFullYear()}`;
}
