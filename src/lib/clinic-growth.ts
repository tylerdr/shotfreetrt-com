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
};

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

  return {
    inquiriesPerMonth,
    repeatedHoursPerMonth,
    staffCapacityCostPerMonth,
    targetHoursMovedPreVisit: repeatedHoursPerMonth * targetShare,
    targetCapacityValuePerMonth: staffCapacityCostPerMonth * targetShare,
  };
}
