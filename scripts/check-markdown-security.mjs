import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseDigest } from "../src/lib/digest.ts";
import { renderKnowledgeMarkdown } from "../src/lib/knowledge-markdown.ts";

const render = (markdown) => renderKnowledgeMarkdown(markdown, new Map());

test("knowledge markdown drops raw HTML and images", () => {
  for (const input of [
    "<script>alert(1)</script>",
    '<img src=x onerror="alert(1)">',
    '<svg onload="alert(1)"></svg>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    "![tracking pixel](https://example.com/pixel.png)",
  ]) {
    const html = render(input);
    assert.doesNotMatch(html, /<(?:script|img|svg|iframe)\b/i);
    assert.doesNotMatch(html, /\s(?:onerror|onload|srcdoc)\s*=/i);
  }
});

test("knowledge markdown does not create links with unsafe schemes", () => {
  for (const href of [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "javascript&#58;alert(1)",
    "java&#x09;script:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "//example.com/unapproved",
  ]) {
    assert.doesNotMatch(render(`[link](<${href}>)`), /<a\b/i, href);
  }
});

test("knowledge link attributes are escaped and external links isolate the opener", () => {
  const html = render('[source](https://example.com/?q=%22 "&quot; onmouseover=&quot;alert(1)")');
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /"\s+onmouseover=/i);
  assert.match(html, /title="&amp;quot; onmouseover=&amp;quot;alert\(1\)"/);
});

test("knowledge rendering preserves supported headings, emphasis, tables and citations", () => {
  const html = render(
    "## Findings\n\n**Strong** and *limited*.\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n^[https://example.com/study]\n\n[section](#findings)",
  );
  for (const expected of [
    "<h2>Findings</h2>",
    "<strong>Strong</strong>",
    "<em>limited</em>",
    "<table>",
    'href="https://example.com/study"',
    'href="#findings"',
  ]) {
    assert.ok(html.includes(expected), expected);
  }
});

test("digest parser keeps untrusted content as text and uses only a numeric PMID", () => {
  const payload = '<img src=x onerror="alert(1)">';
  const parsed = parseDigest(
    `# ${payload}\n\nMethod ${payload}\n\n## Notable clinical signals\n- A sufficiently long clinical signal ${payload}\n\n## Surgery\n- **${payload}** — Found ${payload} [PMID 12345](javascript:alert) — *why it matters:* Matters ${payload}`,
  );
  assert.equal(parsed.weekLabel, payload);
  assert.ok(parsed.method.includes(payload));
  assert.ok(parsed.signals[0].includes(payload));
  assert.equal(parsed.entries.length, 1);
  const entry = parsed.entries[0];
  assert.equal(entry.title, payload);
  assert.equal(entry.pmid, "12345");
  assert.ok(entry.found.includes(payload));
  assert.ok(entry.matters.includes(payload));
  assert.ok(entry.details.includes(payload));
  assert.equal("html" in entry, false);
  assert.equal("href" in entry, false);
});

test("Evidence retains its text-only rendering boundary", async () => {
  // This is a source guard, not a browser XSS test. React escapes these text
  // children; reintroducing an HTML sink requires an explicit security review.
  const source = await readFile(new URL("../src/pages/Evidence.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(
    source,
    /dangerouslySetInnerHTML|\binnerHTML\b|\bouterHTML\b|insertAdjacentHTML/,
  );
  assert.doesNotMatch(source, /\bmarked\b|renderKnowledgeMarkdown/);
  for (const expression of [
    "{parsed.weekLabel}",
    "{signal}",
    "{entry.title}",
    "{entry.found}",
    "{entry.matters}",
    "{entry.details}",
    "{parsed.method}",
  ]) {
    assert.ok(source.includes(expression), `Keep ${expression} as a React text child`);
  }
  assert.ok(source.includes("href={`https://pubmed.ncbi.nlm.nih.gov/${entry.pmid}/`}"));
});
