import assert from "node:assert/strict";
import test from "node:test";
import { isOpenCall, openCalls } from "../src/lib/open-calls.ts";
import { basePathFromPathname, stripLocale } from "../src/lib/site.ts";

const TODAY = "2026-10-28";

test("a deadline that has passed is not open even when the flag says open", () => {
  assert.equal(isOpenCall({ open: true, deadline: "2026-10-27" }, TODAY), false);
  assert.equal(isOpenCall({ open: true, deadline: "2026-09-16" }, TODAY), false);
});

test("today and future deadlines stay open, and a missing deadline stays open", () => {
  assert.equal(isOpenCall({ open: true, deadline: "2026-10-28" }, TODAY), true);
  assert.equal(isOpenCall({ open: true, deadline: "2026-11-10" }, TODAY), true);
  assert.equal(isOpenCall({ open: true, deadline: null }, TODAY), true);
});

test("closed, unmarked, and malformed deadlines are not shown as open", () => {
  assert.equal(isOpenCall({ open: false, deadline: "2026-11-10" }, TODAY), false);
  assert.equal(isOpenCall({ open: false, deadline: null }, TODAY), false);
  assert.equal(isOpenCall({ deadline: "2026-12-01" }, TODAY), false);
  assert.equal(isOpenCall({ open: true, deadline: "October 2026" }, TODAY), false);
});

test("open calls sort by deadline and leave rolling calls last", () => {
  const calls = openCalls(
    [
      { id: "past", open: true, deadline: "2026-10-01" },
      { id: "rolling", open: true, deadline: null },
      { id: "later", open: true, deadline: "2026-11-10" },
      { id: "sooner", open: true, deadline: "2026-10-30" },
      { id: "closed", open: false, deadline: "2026-10-29" },
    ],
    TODAY,
  );
  assert.deepEqual(
    calls.map((call) => call.id),
    ["sooner", "later", "rolling"],
  );
});

test("Danish prefix stripping does not eat /dashboard", () => {
  assert.equal(stripLocale("/dashboard"), "/dashboard");
  assert.equal(stripLocale("/da"), "/");
  assert.equal(stripLocale("/da/dashboard"), "/dashboard");
  assert.equal(stripLocale("/da/learn/symptoms"), "/learn/symptoms");
  assert.equal(basePathFromPathname("/dashboard"), "/dashboard");
  assert.equal(basePathFromPathname("/da/learn/denmark"), "/learn/denmark");
  assert.equal(basePathFromPathname("/unknown"), "/");
});
