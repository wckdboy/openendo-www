import assert from "node:assert/strict";
import test from "node:test";
import { parseDigest, plainHeadline } from "../src/lib/digest.ts";
import snapshot from "../src/generated/snapshot.json" with { type: "json" };

const signals = parseDigest(snapshot.latestDigest.markdown).signals;

test("home research headlines stay complete", () => {
  assert.deepEqual(signals.slice(0, 3).map(plainHeadline), [
    "No new guideline, Cochrane update, or regulatory decision this week",
    "Comorbidity meta-analysis",
    "Non-invasive diagnosis",
  ]);
  for (const signal of signals) {
    const headline = plainHeadline(signal);
    assert.ok(headline.length > 0 && headline.length <= 110, headline);
    assert.doesNotMatch(headline, /\b(or|and|the|a|of|with|for|to)\s*$/i, headline);
    assert.doesNotMatch(headline, /circulating or/);
  }
});
