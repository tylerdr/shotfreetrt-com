export type ClinicWorkloadInput = {
  inquiriesPerWeek: number;
  repeatedMinutesPerInquiry: number;
  loadedHourlyCost: number;
  preVisitTargetPercent: number;
};

export type ClinicWorkloadEstimate = {
  inquiriesPerMonth: number;
  repeatedHoursPerMonth: number;
  staffCapacityCostPerMonth: number;
  targetHoursMovedPreVisit: number;
  targetCapacityValuePerMonth: number;
  recurringFeeBenchmarkHours: number;
  recurringFeeBenchmarkPercentOfRepeatedLoad: number;
  targetCapacityValueToRecurringFeeRatio: number;
};

const CLINIC_MONTHLY_FEE = 1_000;

function isFiniteInRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function estimateClinicWorkload(input: ClinicWorkloadInput): ClinicWorkloadEstimate | null {
  if (!isFiniteInRange(input.inquiriesPerWeek, 1, 10_000)) return null;
  if (!isFiniteInRange(input.repeatedMinutesPerInquiry, 1, 120)) return null;
  if (!isFiniteInRange(input.loadedHourlyCost, 1, 500)) return null;
  if (!isFiniteInRange(input.preVisitTargetPercent, 1, 100)) return null;

  const inquiriesPerMonth = input.inquiriesPerWeek * 52 / 12;
  const repeatedHoursPerMonth = inquiriesPerMonth * input.repeatedMinutesPerInquiry / 60;
  const staffCapacityCostPerMonth = repeatedHoursPerMonth * input.loadedHourlyCost;
  const targetShare = input.preVisitTargetPercent / 100;
  const targetHoursMovedPreVisit = repeatedHoursPerMonth * targetShare;
  const targetCapacityValuePerMonth = staffCapacityCostPerMonth * targetShare;
  const recurringFeeBenchmarkHours = CLINIC_MONTHLY_FEE / input.loadedHourlyCost;

  return {
    inquiriesPerMonth,
    repeatedHoursPerMonth,
    staffCapacityCostPerMonth,
    targetHoursMovedPreVisit,
    targetCapacityValuePerMonth,
    recurringFeeBenchmarkHours,
    recurringFeeBenchmarkPercentOfRepeatedLoad: recurringFeeBenchmarkHours / repeatedHoursPerMonth * 100,
    targetCapacityValueToRecurringFeeRatio: targetCapacityValuePerMonth / CLINIC_MONTHLY_FEE,
  };
}


export function buildClinicDecisionBrief(
  input: ClinicWorkloadInput,
  estimate: ClinicWorkloadEstimate,
): string {
  const monthlyFee = CLINIC_MONTHLY_FEE.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const hours = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  const money = (value: number) => value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return [
    "ShotFreeTRT clinic launch decision brief",
    "",
    `Current inquiry load: ${input.inquiriesPerWeek}/week`,
    `Repeated basics: ${input.repeatedMinutesPerInquiry} minutes/inquiry`,
    `Loaded staff cost: ${money(input.loadedHourlyCost)}/hour`,
    `Estimated repeated-question workload: ${hours(estimate.repeatedHoursPerMonth)} staff hours/month`,
    `Estimated staff capacity devoted: ${money(estimate.staffCapacityCostPerMonth)}/month`,
    `Pre-visit education target: ${input.preVisitTargetPercent}% (${hours(estimate.targetHoursMovedPreVisit)} hours/month)`,
    "",
    `Offer to evaluate: $2,000 launch + ${monthlyFee}/month`,
    `Monthly fee benchmark: ${hours(estimate.recurringFeeBenchmarkHours)} loaded staff hours at the current rate`,
    "",
    "Decision test:",
    "1. Walk the patient-facing demo.",
    "2. List the three route/cost/testing questions staff repeats most often.",
    "3. Decide whether moving enough of those basics pre-visit would justify the monthly fee alongside booking readiness and patient experience.",
  ].join("\n");
}
