import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { estimateClinicWorkload } from "../src/lib/clinic-growth.ts";
import {
  buildConfirmationEmail,
  buildConfirmationIdempotencyKey,
  CLINIC_LEAD_SOURCE,
} from "../src/lib/lead-capture.ts";

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("clinic workload preview turns real operating inputs into a monthly baseline", () => {
  const estimate = estimateClinicWorkload({
    inquiriesPerWeek: 50,
    repeatedMinutesPerInquiry: 8,
    loadedHourlyCost: 35,
    preVisitTargetPercent: 25,
  });

  assert.ok(estimate);
  assert.ok(Math.abs(estimate.inquiriesPerMonth - 216.6667) < 0.001);
  assert.ok(Math.abs(estimate.repeatedHoursPerMonth - 28.8889) < 0.001);
  assert.ok(Math.abs(estimate.staffCapacityCostPerMonth - 1011.1111) < 0.001);
  assert.ok(Math.abs(estimate.targetHoursMovedPreVisit - 7.2222) < 0.001);
  assert.ok(Math.abs(estimate.targetCapacityValuePerMonth - 252.7778) < 0.001);
  assert.ok(Math.abs(estimate.recurringFeeBenchmarkHours - 28.5714) < 0.001);
  assert.ok(Math.abs(estimate.recurringFeeBenchmarkPercentOfRepeatedLoad - 98.9011) < 0.001);
  assert.ok(Math.abs(estimate.targetCapacityValueToRecurringFeeRatio - 0.2528) < 0.001);
});

test("clinic workload preview rejects impossible inputs", () => {
  assert.equal(estimateClinicWorkload({
    inquiriesPerWeek: 0,
    repeatedMinutesPerInquiry: 8,
    loadedHourlyCost: 35,
    preVisitTargetPercent: 25,
  }), null);
  assert.equal(estimateClinicWorkload({
    inquiriesPerWeek: 50,
    repeatedMinutesPerInquiry: 8,
    loadedHourlyCost: 35,
    preVisitTargetPercent: 101,
  }), null);
});

test("clinic lead intent receives its own useful confirmation journey", () => {
  const email = "operator@example.com";
  const consumerKey = buildConfirmationIdempotencyKey(email);
  const clinicKey = buildConfirmationIdempotencyKey(email, CLINIC_LEAD_SOURCE);
  assert.notEqual(consumerKey, clinicKey);

  const confirmation = buildConfirmationEmail(email, CLINIC_LEAD_SOURCE);
  assert.match(confirmation.subject, /clinic launch overview/i);
  assert.match(confirmation.text, /\/for-clinics/);
  assert.match(confirmation.text, /\/decision-guide/);
  assert.doesNotMatch(confirmation.text, /\/quiz\/healthspan/);
});

test("clinic page provides value before capture and preserves a working next step", () => {
  const page = read("../src/app/(main)/for-clinics/page.tsx");
  const form = read("../src/components/clinics/ClinicInterestForm.tsx");
  const calculator = read("../src/components/clinics/ClinicWorkloadCalculator.tsx");
  const route = read("../src/app/api/newsletter/route.ts");

  assert.match(page, /ClinicWorkloadCalculator/);
  assert.match(page, /ClinicInterestForm/);
  assert.match(page, /\$2,000 launch \+ \$1,000\/month/);
  assert.match(page, /id="launch-request"/);
  assert.match(page, /robots:\s*\{ index: true, follow: true \}/);
  assert.doesNotMatch(page, /Pilot enrollment is not open yet/);

  assert.match(calculator, /recurringFeeBenchmarkHours/);
  assert.match(calculator, /purchase-decision arithmetic/i);
  assert.match(calculator, /href="#launch-request"/);

  assert.match(form, /shotfreetrt-clinic-interest/);
  assert.match(form, /fetch\("\/api\/newsletter"/);
  assert.match(form, /href="\/decision-guide"/);
  assert.match(form, /work email/i);

  assert.match(route, /CLINIC_LEAD_SOURCE/);
  assert.match(route, /resourceForSource/);
  assert.match(route, /sendConfirmation\(config, email, source\)/);
});
