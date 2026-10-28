import assert from "node:assert/strict";
import test from "node:test";
import { countryBars, monthPoints, snapshotUpdateDue, statusBars } from "../src/lib/charts.ts";

test("country bars keep Denmark and group the rest", () => {
  const trials = [
    { countries: ["United States", "Denmark"] },
    { countries: ["United States"] },
    { countries: ["Germany"] },
    { countries: ["France"] },
    { countries: ["Spain"] },
    { countries: ["Italy"] },
    { countries: ["Japan"] },
    { countries: ["Canada"] },
    { countries: ["Australia"] },
    { countries: ["Sweden"] },
    { countries: ["Norway"] },
    { countries: ["Denmark"] },
  ];
  const rows = countryBars(trials, (count) => `Other countries (${count})`);
  assert.ok(rows.some((row) => row.denmark));
  assert.ok(rows.length <= 12);
  const other = rows.find((row) => row.label.startsWith("Other"));
  assert.ok(other);
  assert.equal(rows.filter((row) => row.tone !== "primary").length, 0);
});

test("status bars follow clinical order and colour", () => {
  const rows = statusBars(
    ["COMPLETED", "RECRUITING", "TERMINATED", "NOT_YET_RECRUITING"],
    (label) => label,
  );
  assert.deepEqual(
    rows.map((row) => row.label),
    ["Recruiting", "Not yet recruiting", "Completed", "Terminated"],
  );
  assert.equal(rows[0]?.tone, "primary");
  assert.equal(rows.at(-1)?.tone, "caution");
});

test("the newest month in the snapshot is marked incomplete", () => {
  const points = monthPoints(
    [
      { month: "2026-08", count: 4 },
      { month: "2026-09", count: 2 },
    ],
    "2026-09-30",
    "en",
  );
  assert.equal(points.at(-1)?.partial, true);
  assert.equal(points[0]?.partial, false);
});

test("a snapshot older than 10 days is due an update", () => {
  assert.equal(snapshotUpdateDue("2026-10-01", new Date("2026-10-28T00:00:00Z")), true);
  assert.equal(snapshotUpdateDue("2026-10-20", new Date("2026-10-28T00:00:00Z")), false);
});
