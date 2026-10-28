import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { allClaims, mechanismEdges, sourceIdsUsed } from "../src/content/explainers/diagrams.ts";
import { SOURCES } from "../src/content/explainers/sources.ts";

const BANNED =
  /\b(fight|fights|fighting|suffer|suffers|suffered|suffering|sufferer|sufferers|warrior|warriors|battle|battles|battling|dismissed|dismisses)\b/i;

test("every explainer citation id resolves to a source with a URL", () => {
  const used = new Set(sourceIdsUsed());
  for (const claim of allClaims()) {
    assert.ok(claim.sources.length > 0, `${claim.id} has no source`);
    for (const id of claim.sources) {
      const source = SOURCES[id];
      assert.ok(source, `${claim.id} cites missing source ${id}`);
      assert.match(source.url, /^https:\/\//, `${id} url`);
      assert.ok(source.section.length > 0, `${id} section`);
      assert.equal(source.accessed, "2026-10-28");
      used.add(id);
    }
  }
  for (const edge of mechanismEdges()) {
    assert.ok(edge.strength, `${edge.from}->${edge.to} has no strength`);
    assert.ok(
      edge.sources?.length,
      `${edge.from}->${edge.to} has strength ${edge.strength} but no citation`,
    );
    for (const id of edge.sources) {
      const source = SOURCES[id];
      assert.ok(source, `${edge.from}->${edge.to} cites missing source ${id}`);
      assert.match(source.url, /^https:\/\//, `${id} url`);
      used.add(id);
    }
  }
  assert.ok(used.size > 0);
});

test("guide and explainer copy avoids banned words", async () => {
  const roots = ["src/content", "src/pages", "src/components/explainers"];
  const hits = [];
  for (const root of roots) {
    await walk(root, hits);
  }
  assert.deepEqual(hits, []);
});

async function walk(dir, hits) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, hits);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    const text = await readFile(full, "utf8");
    if (BANNED.test(text)) hits.push(full);
  }
}
