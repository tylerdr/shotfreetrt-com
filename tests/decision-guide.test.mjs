import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { estimateQuote, parseMoney, providerSnapshots, decisionFaqs } from "../src/lib/decision-guide.ts";

const quote = { plan: "100", cadence: "monthly", medication: "20", labs: "200", setup: "50" };
test("USD parser uses integer cents", () => { assert.equal(parseMoney(" 12.3 "), 1230); assert.equal(parseMoney("0"), 0); assert.equal(parseMoney("100000"), 10000000); });
for (const value of ["", " ", "-1", "1e3", "$99", "1,000", "1.234", "Infinity", "NaN", "100001"]) {
  test(`rejects unknown or malformed money: ${JSON.stringify(value)}`, () => assert.equal(parseMoney(value), null));
}
test("monthly estimate keeps one-time fees out of recurring run rate", () => assert.deepEqual(estimateQuote(quote), { annualBudgetCents: 169000, monthlyRunRateCents: 13667 }));
test("four-week charge annualizes over 365 days; does not silently use 12 bills", () => assert.deepEqual(estimateQuote({ plan: "199", cadence: "four-week", medication: "0", labs: "0", setup: "0" }), { annualBudgetCents: 259411, monthlyRunRateCents: 21618 }));
test("unknown cost blocks a total", () => assert.equal(estimateQuote({ ...quote, labs: "" }), null));
test("unrecognized cadence blocks a total", () => assert.equal(estimateQuote({ ...quote, cadence: "weekly" }), null));
test("known free costs remain zero", () => assert.deepEqual(estimateQuote({ plan: "0", cadence: "monthly", medication: "0", labs: "0", setup: "0" }), { annualBudgetCents: 0, monthlyRunRateCents: 0 }));
test("every snapshot and FAQ has an HTTPS primary source", () => {
  for (const row of providerSnapshots) assert.equal(new URL(row.url).protocol, "https:");
  for (const row of decisionFaqs) assert.equal(new URL(row.source).protocol, "https:");
});
test("calculator cannot upload or persist entered quotes", () => {
  const component = readFileSync(new URL("../src/components/QuotePlanner.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|sendBeacon|gtag\(|trackEvent|XMLHttpRequest/);
  assert.match(component, /clipboard.writeText\(`\$\{window.location.origin\}\/decision-guide`\)/);
});
test("pilot stays noindex and needs explicit activation", () => {
  const page = readFileSync(new URL("../src/app/for-clinics/page.tsx", import.meta.url), "utf8");
  assert.match(page, /index: false/);
  assert.match(page, /CLINIC_PILOT_ENROLLMENT_ENABLED !== "true"/);
  assert.match(page, /Pilot enrollment is not open yet/);
});
