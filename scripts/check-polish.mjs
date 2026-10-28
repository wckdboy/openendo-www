import assert from "node:assert/strict";
import test from "node:test";
import { plainHeadline } from "../src/lib/digest.ts";

const signals = [
  "No new guideline, Cochrane update, or regulatory decision this week. Nothing here changes a patient-facing recommendation.",
  "Comorbidity meta-analysis (PMID 42901254) is the broadest association paper: higher pooled estimates for several autoimmune, allergic, and pain conditions.",
  "Non-invasive diagnosis (PMID 42885805) repeats a limit that matters for reading a scan: a normal expert ultrasound or MRI does not exclude superficial disease, and no circulating or endometrial biomarker is described as ready.",
];

test("home research headlines stay complete", () => {
  assert.deepEqual(signals.map(plainHeadline), [
    "No new guideline, Cochrane update, or regulatory decision this week",
    "Comorbidity meta-analysis",
    "Non-invasive diagnosis",
  ]);
  for (const signal of signals) {
    const headline = plainHeadline(signal);
    assert.ok(headline.length > 0 && headline.length <= 110, headline);
    assert.doesNotMatch(headline, /\b(or|and|the|a|of|with|for|to)\s*$/i);
    assert.doesNotMatch(headline, /circulating or/);
  }
});
