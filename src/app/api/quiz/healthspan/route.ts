import { NextResponse } from "next/server";

import type {
  HealthspanAssessmentType,
  HealthspanPathway,
  HealthspanRecommendation,
  HealthspanResult,
  QuizAnswers,
  QuizMode,
  QuizPathwayKey,
  QuizPriority
} from "@/lib/quiz/healthspan-types";

export const runtime = "nodejs";

type QuizRequestBody = {
  answers?: QuizAnswers;
  introAnswers?: QuizAnswers;
  mode?: QuizMode;
  assessmentType?: HealthspanAssessmentType;
};

type AssessmentState = {
  candidateScore: number;
  symptomLoad: number;
  lifestyleDrag: number;
  helpingFactors: string[];
  hurtingFactors: string[];
  recommendations: HealthspanRecommendation[];
  labsToRequest: string[];
  redFlags: string[];
  pathways: Record<QuizPathwayKey, HealthspanPathway>;
};

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function getAge(answers: QuizAnswers): number {
  const raw = answers.age;

  if (typeof raw === "number") {
    return clampNumber(raw, 18, 80);
  }

  const rawObject = toObject(raw);
  if (rawObject) {
    const ageValue = toNumber(rawObject.age);
    if (ageValue !== null) {
      return clampNumber(ageValue, 18, 80);
    }
  }

  return 35;
}

function getBodyMetrics(answers: QuizAnswers) {
  const raw = toObject(answers.bodyMetrics);
  if (!raw) {
    return { heightCm: null, weightKg: null };
  }

  return {
    heightCm: toNumber(raw.heightCm),
    weightKg: toNumber(raw.weightKg)
  };
}

function calculateBmi(answers: QuizAnswers): number | null {
  const { heightCm, weightKg } = getBodyMetrics(answers);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightMeters = heightCm / 100;
  return weightKg / (heightMeters * heightMeters);
}

function pushUnique(items: string[], value: string) {
  if (!items.includes(value)) {
    items.push(value);
  }
}

function addRecommendation(
  recommendations: HealthspanRecommendation[],
  next: HealthspanRecommendation
) {
  if (recommendations.some((item) => item.title === next.title)) {
    return;
  }

  recommendations.push(next);
}

function addLab(labs: string[], value: string) {
  pushUnique(labs, value);
}

function addRedFlag(redFlags: string[], value: string) {
  pushUnique(redFlags, value);
}

function createPathway(key: QuizPathwayKey, title: string, summary: string): HealthspanPathway {
  return {
    key,
    title,
    fitScore: 20,
    summary,
    why: [],
    cautions: []
  };
}

function createState(): AssessmentState {
  return {
    candidateScore: 18,
    symptomLoad: 0,
    lifestyleDrag: 0,
    helpingFactors: [],
    hurtingFactors: [],
    recommendations: [],
    labsToRequest: [],
    redFlags: [],
    pathways: {
      "lifestyle-first": createPathway(
        "lifestyle-first",
        "Lifestyle-first reset",
        "Your quiz points toward fixing reversible sleep, body-composition, stress, and recovery issues before making medication the center of the plan."
      ),
      "serm-discussion": createPathway(
        "serm-discussion",
        "SERM / enclomiphene discussion",
        "Your answers look closer to a fertility-aware, endogenous-support conversation than straight exogenous testosterone."
      ),
      "oral-topical-trt-discussion": createPathway(
        "oral-topical-trt-discussion",
        "Needle-free TRT discussion (oral / topical)",
        "If low testosterone is confirmed on proper testing, your profile could justify a clinician conversation about non-injectable TRT routes."
      ),
      "needs-labs-workup": createPathway(
        "needs-labs-workup",
        "Labs + root-cause workup first",
        "There is too much unresolved signal here to jump straight to treatment selection without cleaning up the workup first."
      )
    }
  };
}

function addPathwayReason(state: AssessmentState, key: QuizPathwayKey, reason: string) {
  pushUnique(state.pathways[key].why, reason);
}

function addPathwayCaution(state: AssessmentState, key: QuizPathwayKey, caution: string) {
  pushUnique(state.pathways[key].cautions, caution);
}

function adjustPathway(state: AssessmentState, key: QuizPathwayKey, delta: number) {
  state.pathways[key].fitScore += delta;
}

function addDefaultLabs(state: AssessmentState, age: number, fertilityGoal: string | null) {
  addLab(state.labsToRequest, "Total testosterone (2 early-morning tests)");
  addLab(state.labsToRequest, "Free testosterone or SHBG");
  addLab(state.labsToRequest, "LH");
  addLab(state.labsToRequest, "FSH");
  addLab(state.labsToRequest, "Prolactin");
  addLab(state.labsToRequest, "TSH");
  addLab(state.labsToRequest, "HbA1c or fasting glucose");
  addLab(state.labsToRequest, "CBC / hematocrit");

  if (age >= 40) {
    addLab(state.labsToRequest, "PSA");
  }

  if (fertilityGoal === "yes" || fertilityGoal === "unsure") {
    addLab(state.labsToRequest, "Fertility-focused reproductive evaluation");
  }
}

function scoreIntroAnswers(answers: QuizAnswers, mode: QuizMode): AssessmentState {
  const state = createState();
  const age = getAge(answers);
  const sex = toStringValue(answers.sex);
  const bmi = calculateBmi(answers);
  const goals = toStringArray(answers.goals);
  const symptoms = toStringArray(answers.symptoms);
  const priorLabs = toStringValue(answers.priorLabs);
  const fertilityGoal = toStringValue(answers.fertilityGoal);
  const priorTherapies = toStringArray(answers.previousTherapies);
  const waistSize = toStringValue(answers.waistSize);
  const sleepHours = toNumber(answers.sleepHours);
  const sleepQuality = toStringValue(answers.sleepQuality);
  const apnea = toStringValue(answers.snoringOrApnea);
  const stress = toStringValue(answers.stressLevel);
  const lifting = toStringValue(answers.liftingFrequency);
  const activity = toStringValue(answers.stepsActivity);
  const diet = toStringValue(answers.dietQuality);
  const alcohol = toStringValue(answers.alcoholUse);
  const nicotine = toStringValue(answers.nicotineStatus);
  const medications = toStringArray(answers.medications);
  const conditions = toStringArray(answers.conditions);
  const routePreference = toStringValue(answers.routePreference);
  const symptomDuration = toStringValue(answers.symptomDuration);

  addDefaultLabs(state, age, fertilityGoal);

  if (sex !== "male") {
    adjustPathway(state, "needs-labs-workup", 80);
    addRedFlag(state.redFlags, "This TRT-focused quiz is intended for adult men; do not use this result as treatment guidance for women.");
    addPathwayCaution(state, "needs-labs-workup", "Reference ranges and treatment logic differ outside adult male TRT workflows.");
    state.candidateScore = 12;
  }

  if (goals.includes("fertility")) {
    adjustPathway(state, "serm-discussion", 8);
    addPathwayReason(state, "serm-discussion", "Preserving fertility is one of your stated goals.");
  }

  const symptomWeights: Record<string, number> = {
    "low-libido": 8,
    "erection-quality": 7,
    fatigue: 6,
    "brain-fog": 5,
    "strength-loss": 5,
    "fat-gain": 5,
    "low-mood": 4,
    "poor-recovery": 4
  };

  if (!symptoms.includes("none")) {
    symptoms.forEach((symptom) => {
      state.symptomLoad += symptomWeights[symptom] ?? 0;
    });
  }

  state.candidateScore += clampNumber(state.symptomLoad * 1.2, 0, 36);

  if (symptoms.includes("low-libido") || symptoms.includes("erection-quality")) {
    addPathwayReason(state, "oral-topical-trt-discussion", "Sexual symptoms are part of the picture.");
    addPathwayReason(state, "serm-discussion", "Sexual symptoms increase the value of a real hormone workup.");
  }

  if (symptoms.length <= 2 && !symptoms.includes("none")) {
    pushUnique(state.helpingFactors, "Symptom burden is present but not overwhelming, which leaves room for lifestyle cleanup to move the needle.");
  }

  if (symptoms.length >= 5) {
    pushUnique(state.hurtingFactors, "You reported a broad cluster of classic low-T symptoms, not just one isolated complaint.");
  }

  if (symptomDuration === "12m-plus") {
    state.candidateScore += 7;
    addPathwayReason(state, "oral-topical-trt-discussion", "Symptoms have been persistent for a long time.");
    addPathwayReason(state, "serm-discussion", "Symptoms have persisted long enough to justify deeper evaluation.");
  } else if (symptomDuration === "6-12m") {
    state.candidateScore += 4;
  }

  switch (priorLabs) {
    case "borderline":
      state.candidateScore += 8;
      adjustPathway(state, "serm-discussion", 10);
      adjustPathway(state, "oral-topical-trt-discussion", 6);
      addPathwayReason(state, "serm-discussion", "You already have borderline / low-normal labs.");
      addPathwayReason(state, "oral-topical-trt-discussion", "Lab signal is at least directionally supportive.");
      break;
    case "low-once":
      state.candidateScore += 14;
      adjustPathway(state, "serm-discussion", 14);
      adjustPathway(state, "oral-topical-trt-discussion", 14);
      adjustPathway(state, "needs-labs-workup", 10);
      addPathwayReason(state, "needs-labs-workup", "A single low result still needs proper confirmation.");
      addPathwayReason(state, "serm-discussion", "There is already one low-lab datapoint on the board.");
      addPathwayReason(state, "oral-topical-trt-discussion", "There is already one low-lab datapoint on the board.");
      break;
    case "low-twice":
      state.candidateScore += 24;
      adjustPathway(state, "serm-discussion", 18);
      adjustPathway(state, "oral-topical-trt-discussion", 24);
      adjustPathway(state, "lifestyle-first", -8);
      addPathwayReason(state, "oral-topical-trt-discussion", "You already report two low early-morning results.");
      addPathwayReason(state, "serm-discussion", "Confirmed low testosterone makes fertility-preserving options more relevant if fertility matters.");
      break;
    case "normal-not-explained":
      adjustPathway(state, "needs-labs-workup", 12);
      addPathwayReason(state, "needs-labs-workup", "Symptoms with normal prior labs increase the odds that a root-cause workup matters.");
      addPathwayCaution(state, "oral-topical-trt-discussion", "Normal prior labs reduce the case for reflexively blaming testosterone.");
      break;
    case "never-tested":
    default:
      adjustPathway(state, "needs-labs-workup", 12);
      addPathwayReason(state, "needs-labs-workup", "You do not have baseline hormone labs yet.");
      break;
  }

  switch (fertilityGoal) {
    case "yes":
      adjustPathway(state, "serm-discussion", 28);
      adjustPathway(state, "oral-topical-trt-discussion", -20);
      adjustPathway(state, "needs-labs-workup", 8);
      addRedFlag(state.redFlags, "Future fertility matters, so exogenous testosterone should not be treated like a casual first step.");
      addPathwayReason(state, "serm-discussion", "You want fertility preserved in the next 12-24 months.");
      addPathwayCaution(state, "oral-topical-trt-discussion", "Exogenous testosterone can suppress spermatogenesis.");
      break;
    case "unsure":
      adjustPathway(state, "serm-discussion", 18);
      adjustPathway(state, "oral-topical-trt-discussion", -10);
      addPathwayReason(state, "serm-discussion", "Uncertainty about fertility still argues for a fertility-aware path.");
      addPathwayCaution(state, "oral-topical-trt-discussion", "Sort fertility plans before committing to exogenous testosterone.");
      break;
    case "no":
      adjustPathway(state, "oral-topical-trt-discussion", 10);
      addPathwayReason(state, "oral-topical-trt-discussion", "Fertility preservation is not a major constraint for you.");
      break;
  }

  if (priorTherapies.includes("lifestyle")) {
    adjustPathway(state, "lifestyle-first", -6);
    addPathwayCaution(state, "lifestyle-first", "You’ve already done at least some basics, so the plan needs to be more targeted than generic advice.");
  } else {
    adjustPathway(state, "lifestyle-first", 8);
    addPathwayReason(state, "lifestyle-first", "You have not fully exhausted a targeted lifestyle pass yet.");
  }

  if (priorTherapies.includes("serm")) {
    addPathwayReason(state, "serm-discussion", "You already have SERM history, so response / side effects matter in the next decision.");
  }

  if (priorTherapies.includes("oral-t") || priorTherapies.includes("topical-t") || priorTherapies.includes("injectable-t")) {
    adjustPathway(state, "oral-topical-trt-discussion", 4);
    addPathwayReason(state, "oral-topical-trt-discussion", "You already have testosterone-treatment history to discuss with a clinician.");
  }

  if (bmi !== null) {
    if (bmi >= 30) {
      state.lifestyleDrag += 12;
      adjustPathway(state, "lifestyle-first", 18);
      pushUnique(state.hurtingFactors, "Body composition likely adds real testosterone drag, especially around insulin resistance and SHBG changes.");
      addPathwayReason(state, "lifestyle-first", "BMI suggests a meaningful body-composition lever.");
      addRecommendation(state.recommendations, {
        title: "Run a 12-week body-composition cut",
        action: "Pair high-protein eating with lifting and daily walking before assuming the answer is medication alone.",
        impact: "Often changes SHBG, energy, waist size, and symptom noise fast."
      });
    } else if (bmi >= 25) {
      state.lifestyleDrag += 6;
      adjustPathway(state, "lifestyle-first", 10);
      addPathwayReason(state, "lifestyle-first", "There is some body-composition cleanup available.");
    } else if (bmi >= 20 && bmi < 25) {
      pushUnique(state.helpingFactors, "Body composition is not obviously the main thing working against you.");
    }
  }

  switch (waistSize) {
    case "central-obesity":
      state.lifestyleDrag += 10;
      adjustPathway(state, "lifestyle-first", 14);
      pushUnique(state.hurtingFactors, "Waist-centered fat gain is one of the clearest modifiable signals in this quiz.");
      break;
    case "noticeable":
      state.lifestyleDrag += 6;
      adjustPathway(state, "lifestyle-first", 8);
      break;
    case "lean":
      pushUnique(state.helpingFactors, "Waist size suggests you are not carrying a huge visceral-fat burden.");
      break;
  }

  if (sleepHours !== null) {
    if (sleepHours < 6) {
      state.lifestyleDrag += 12;
      adjustPathway(state, "lifestyle-first", 18);
      adjustPathway(state, "needs-labs-workup", 6);
      pushUnique(state.hurtingFactors, "Sleep duration is poor enough to mimic or worsen low-T symptoms by itself.");
      addRecommendation(state.recommendations, {
        title: "Fix sleep before blaming hormones",
        action: "Build a hard 7-8 hour sleep window, protect wake time, and stop testing testosterone against chronic sleep debt.",
        impact: "Improves libido, recovery, mood, and morning energy without prescription risk."
      });
    } else if (sleepHours >= 7 && sleepHours <= 8.5) {
      pushUnique(state.helpingFactors, "Sleep duration is at least in a range where testosterone interpretation gets cleaner.");
    }
  }

  switch (sleepQuality) {
    case "poor":
      state.lifestyleDrag += 10;
      adjustPathway(state, "lifestyle-first", 14);
      break;
    case "fair":
      state.lifestyleDrag += 5;
      adjustPathway(state, "lifestyle-first", 7);
      break;
    case "good":
    case "excellent":
      pushUnique(state.helpingFactors, "Sleep quality is not obviously sabotaging the rest of the plan.");
      break;
  }

  switch (apnea) {
    case "snore":
    case "suspected-apnea":
      state.lifestyleDrag += 8;
      adjustPathway(state, "needs-labs-workup", 12);
      adjustPathway(state, "lifestyle-first", 10);
      addRedFlag(state.redFlags, "Possible sleep apnea should be addressed before overcommitting to a testosterone story.");
      addPathwayReason(state, "needs-labs-workup", "Sleep-apnea risk can distort both symptoms and treatment safety.");
      break;
    case "untreated-apnea":
      state.lifestyleDrag += 12;
      adjustPathway(state, "needs-labs-workup", 18);
      adjustPathway(state, "oral-topical-trt-discussion", -12);
      addRedFlag(state.redFlags, "Untreated sleep apnea is a major caution flag before TRT escalation.");
      addPathwayCaution(state, "oral-topical-trt-discussion", "Untreated apnea raises the stakes of jumping straight to TRT.");
      break;
    case "treated-apnea":
      pushUnique(state.helpingFactors, "Sleep apnea is already identified and treated, which makes the hormone picture cleaner.");
      break;
  }

  switch (stress) {
    case "high":
      state.lifestyleDrag += 5;
      adjustPathway(state, "lifestyle-first", 6);
      break;
    case "very-high":
      state.lifestyleDrag += 10;
      adjustPathway(state, "lifestyle-first", 12);
      pushUnique(state.hurtingFactors, "Stress load is high enough to blur what is hormones versus what is lifestyle debt.");
      addRecommendation(state.recommendations, {
        title: "Lower the cortisol chaos",
        action: "Protect sleep, lift with intent instead of redlining everything, and install one daily downshift habit you can actually keep.",
        impact: "Makes libido, mood, and energy data less noisy."
      });
      break;
  }

  switch (lifting) {
    case "none":
      state.lifestyleDrag += 8;
      adjustPathway(state, "lifestyle-first", 14);
      addRecommendation(state.recommendations, {
        title: "Start lifting twice a week",
        action: "Use a simple full-body plan with progressive overload before assuming you need a prescription to feel strong again.",
        impact: "Often improves body composition, recovery confidence, and symptom interpretation."
      });
      break;
    case "1":
      state.lifestyleDrag += 4;
      adjustPathway(state, "lifestyle-first", 6);
      break;
    case "2-3":
    case "4-plus":
      pushUnique(state.helpingFactors, "You already have at least some resistance training in place.");
      break;
  }

  switch (activity) {
    case "desk-mostly":
      state.lifestyleDrag += 6;
      adjustPathway(state, "lifestyle-first", 8);
      break;
    case "8k-plus":
    case "very-active":
      pushUnique(state.helpingFactors, "Daily activity outside the gym is a real asset here.");
      break;
  }

  switch (diet) {
    case "poor":
      state.lifestyleDrag += 8;
      adjustPathway(state, "lifestyle-first", 12);
      pushUnique(state.hurtingFactors, "Diet quality is leaving easy wins on the table.");
      addRecommendation(state.recommendations, {
        title: "Tighten protein and food quality",
        action: "Center meals on protein, mostly whole foods, and a calorie target that matches your waist-size goal.",
        impact: "Supports body composition, energy stability, and better hormone interpretation."
      });
      break;
    case "mixed":
      state.lifestyleDrag += 4;
      adjustPathway(state, "lifestyle-first", 6);
      break;
    case "excellent":
      pushUnique(state.helpingFactors, "Diet quality is already doing some of the heavy lifting.");
      break;
  }

  switch (alcohol) {
    case "moderate":
      state.lifestyleDrag += 4;
      adjustPathway(state, "lifestyle-first", 5);
      break;
    case "heavy":
      state.lifestyleDrag += 10;
      adjustPathway(state, "lifestyle-first", 12);
      pushUnique(state.hurtingFactors, "Alcohol intake is high enough to directly muddy sleep, recovery, libido, and labs.");
      addRecommendation(state.recommendations, {
        title: "Cut alcohol for 30 days",
        action: "Run a clean month and compare sleep, libido, and training recovery before making medication decisions from noisy data.",
        impact: "Quickest way to learn whether alcohol is a hidden testosterone drag."
      });
      break;
    case "none":
      pushUnique(state.helpingFactors, "Alcohol is not a major confounder here.");
      break;
  }

  switch (nicotine) {
    case "current":
      state.lifestyleDrag += 8;
      adjustPathway(state, "lifestyle-first", 6);
      addRedFlag(state.redFlags, "Current nicotine use can worsen the symptom picture and long-term risk profile.");
      break;
    case "former":
      pushUnique(state.helpingFactors, "You are no longer carrying a current nicotine habit.");
      break;
  }

  if (medications.includes("opioids")) {
    state.lifestyleDrag += 8;
    adjustPathway(state, "needs-labs-workup", 14);
    addRedFlag(state.redFlags, "Chronic opioids are a major root-cause flag for low testosterone.");
  }

  if (medications.includes("finasteride")) {
    state.lifestyleDrag += 3;
    adjustPathway(state, "needs-labs-workup", 6);
  }

  if (medications.includes("ssri")) {
    state.lifestyleDrag += 3;
    adjustPathway(state, "needs-labs-workup", 4);
  }

  if (medications.includes("steroids")) {
    adjustPathway(state, "needs-labs-workup", 18);
    addRedFlag(state.redFlags, "Recent anabolic steroid exposure changes the entire evaluation path.");
    addPathwayReason(state, "needs-labs-workup", "Past or recent steroid use can suppress the axis and confuse candidacy logic.");
  }

  if (conditions.includes("prediabetes") || conditions.includes("diabetes")) {
    state.lifestyleDrag += 8;
    adjustPathway(state, "lifestyle-first", 10);
    adjustPathway(state, "needs-labs-workup", 6);
    addLab(state.labsToRequest, "Metabolic panel / insulin resistance follow-up");
  }

  if (conditions.includes("thyroid")) {
    adjustPathway(state, "needs-labs-workup", 12);
    addRedFlag(state.redFlags, "Known thyroid issues can mimic a lot of " + "low-T symptoms.");
  }

  if (conditions.includes("pituitary")) {
    adjustPathway(state, "needs-labs-workup", 18);
    addRedFlag(state.redFlags, "Pituitary history pushes this out of simple online-quiz territory.");
  }

  if (conditions.includes("infertility-history")) {
    adjustPathway(state, "serm-discussion", 8);
    adjustPathway(state, "needs-labs-workup", 10);
    addRedFlag(state.redFlags, "History of infertility means fertility counseling should happen before treatment selection.");
  }

  switch (routePreference) {
    case "lifestyle-first":
      adjustPathway(state, "lifestyle-first", 10);
      addPathwayReason(state, "lifestyle-first", "You already prefer a non-prescription-first route.");
      break;
    case "fertility-oral":
      adjustPathway(state, "serm-discussion", 12);
      addPathwayReason(state, "serm-discussion", "You prefer a fertility-aware oral path if medication becomes relevant.");
      break;
    case "oral-t":
    case "topical-t":
      adjustPathway(state, "oral-topical-trt-discussion", 12);
      addPathwayReason(state, "oral-topical-trt-discussion", "You prefer a non-injectable testosterone route.");
      break;
  }

  if (age <= 45) {
    adjustPathway(state, "serm-discussion", 6);
  }

  if (age >= 35) {
    adjustPathway(state, "oral-topical-trt-discussion", 4);
  }

  if (state.lifestyleDrag >= 25) {
    addPathwayReason(state, "lifestyle-first", "You have multiple modifiable drivers that can lower testosterone or imitate low-T.");
  }

  state.candidateScore += clampNumber(state.lifestyleDrag * 0.35, 0, 20);
  state.candidateScore = clampNumber(Math.round(state.candidateScore), 12, 95);

  if (state.helpingFactors.length === 0) {
    pushUnique(state.helpingFactors, "There are still some reversible levers here — which is good news because they are cheaper and safer to address first.");
  }

  if (state.hurtingFactors.length === 0) {
    pushUnique(state.hurtingFactors, "The biggest gap is not one catastrophic issue — it is the combined effect of several smaller drags.");
  }

  if (mode === "roast") {
    addRecommendation(state.recommendations, {
      title: "Stop outsourcing your testosterone to chaos",
      action: "If sleep is trash, stress is high, and waist size is drifting up, don’t act shocked when you feel flat.",
      impact: "Clean up the obvious variables so the hormone story stops lying to you."
    });
  }

  return state;
}

function scoreAdvancedAnswers(
  introAnswers: QuizAnswers,
  advancedAnswers: QuizAnswers,
  mode: QuizMode
) {
  const state = scoreIntroAnswers(introAnswers, mode);
  const age = getAge(introAnswers);
  const fertilityGoal = toStringValue(introAnswers.fertilityGoal);
  const labMarkers = toStringArray(advancedAnswers.labMarkersKnown);
  const totalTRaw = toObject(advancedAnswers.totalTestosteroneValue);
  const totalT = totalTRaw ? toNumber(totalTRaw.totalT) : null;
  const freeTRaw = toObject(advancedAnswers.freeTestosteroneValue);
  const freeT = freeTRaw ? toNumber(freeTRaw.freeT) : null;
  const lhRaw = toObject(advancedAnswers.lhValue);
  const lh = lhRaw ? toNumber(lhRaw.lh) : null;
  const fshRaw = toObject(advancedAnswers.fshValue);
  const fsh = fshRaw ? toNumber(fshRaw.fsh) : null;
  const prolactinRaw = toObject(advancedAnswers.prolactinValue);
  const prolactin = prolactinRaw ? toNumber(prolactinRaw.prolactin) : null;
  const tshRaw = toObject(advancedAnswers.tshValue);
  const tsh = tshRaw ? toNumber(tshRaw.tsh) : null;
  const a1cRaw = toObject(advancedAnswers.a1cValue);
  const a1c = a1cRaw ? toNumber(a1cRaw.a1c) : null;
  const hematocritRaw = toObject(advancedAnswers.hematocritValue);
  const hematocrit = hematocritRaw ? toNumber(hematocritRaw.hematocrit) : null;
  const psaRaw = toObject(advancedAnswers.psaValue);
  const psa = psaRaw ? toNumber(psaRaw.psa) : null;
  const morningDrawn = toStringValue(advancedAnswers.morningDrawn);
  const repeatLowStatus = toStringValue(advancedAnswers.repeatLowStatus);
  const sleepFollowup = toStringValue(advancedAnswers.sleepFollowup);
  const caffeineTiming = toStringValue(advancedAnswers.caffeineTiming);
  const shiftWork = toStringValue(advancedAnswers.shiftWork);
  const weightTrend = toStringValue(advancedAnswers.weightTrend);

  if (labMarkers.includes("none")) {
    adjustPathway(state, "needs-labs-workup", 10);
  }

  if (totalT !== null) {
    if (totalT < 300) {
      state.candidateScore += 16;
      adjustPathway(state, "oral-topical-trt-discussion", 18);
      adjustPathway(state, "serm-discussion", 14);
      addPathwayReason(state, "oral-topical-trt-discussion", `Your reported total testosterone (${Math.round(totalT)} ng/dL) is clearly low.`);
      addPathwayReason(state, "serm-discussion", `Your reported total testosterone (${Math.round(totalT)} ng/dL) is clearly low.`);
    } else if (totalT < 400) {
      state.candidateScore += 8;
      adjustPathway(state, "serm-discussion", 8);
      adjustPathway(state, "oral-topical-trt-discussion", 6);
      addPathwayReason(state, "serm-discussion", `Your reported total testosterone (${Math.round(totalT)} ng/dL) is borderline.`);
    } else {
      adjustPathway(state, "needs-labs-workup", 8);
      addPathwayReason(state, "needs-labs-workup", "Reported total testosterone is not obviously low, so context matters more.");
    }
  }

  if (freeT !== null && freeT < 9) {
    state.candidateScore += 6;
    adjustPathway(state, "serm-discussion", 4);
    adjustPathway(state, "oral-topical-trt-discussion", 4);
  }

  if (repeatLowStatus === "two-low") {
    adjustPathway(state, "oral-topical-trt-discussion", 10);
    adjustPathway(state, "serm-discussion", 8);
  } else if (repeatLowStatus === "one-low") {
    adjustPathway(state, "needs-labs-workup", 8);
  }

  if (morningDrawn === "no" || morningDrawn === "unsure") {
    adjustPathway(state, "needs-labs-workup", 8);
    addPathwayReason(state, "needs-labs-workup", "Hormone timing is unclear, which makes interpretation softer.");
  }

  if (lh !== null) {
    if (lh <= 3 && fertilityGoal !== "no") {
      adjustPathway(state, "serm-discussion", 10);
      addPathwayReason(state, "serm-discussion", "LH is not elevated, which can fit a more secondary / signaling-side discussion.");
    }

    if (lh >= 9) {
      adjustPathway(state, "oral-topical-trt-discussion", 8);
      adjustPathway(state, "serm-discussion", -6);
      addPathwayCaution(state, "serm-discussion", "High LH can make the case for a pure signaling approach weaker.");
    }
  }

  if (fsh !== null && fsh >= 10) {
    adjustPathway(state, "oral-topical-trt-discussion", 6);
    adjustPathway(state, "serm-discussion", -4);
  }

  if (prolactin !== null && prolactin > 20) {
    adjustPathway(state, "needs-labs-workup", 18);
    adjustPathway(state, "oral-topical-trt-discussion", -8);
    addRedFlag(state.redFlags, "Elevated prolactin needs clinician review before treatment-path decisions.");
    addPathwayReason(state, "needs-labs-workup", "Prolactin is high enough to change the workup." );
  }

  if (tsh !== null && (tsh > 4.5 || tsh < 0.4)) {
    adjustPathway(state, "needs-labs-workup", 14);
    addRedFlag(state.redFlags, "Thyroid signal is off-range, which can imitate low-T symptoms.");
  }

  if (a1c !== null) {
    if (a1c >= 5.7) {
      state.lifestyleDrag += 6;
      adjustPathway(state, "lifestyle-first", 8);
      adjustPathway(state, "needs-labs-workup", 4);
    }

    if (a1c >= 6.5) {
      addRedFlag(state.redFlags, "HbA1c is diabetic-range or close enough that metabolic cleanup belongs in the core plan.");
    }
  }

  if (hematocrit !== null && hematocrit >= 50) {
    adjustPathway(state, "oral-topical-trt-discussion", -12);
    adjustPathway(state, "needs-labs-workup", 12);
    addRedFlag(state.redFlags, "Higher hematocrit needs attention before TRT escalation.");
    addPathwayCaution(state, "oral-topical-trt-discussion", "Higher hematocrit makes exogenous TRT discussions more cautious.");
  }

  if (psa !== null && age >= 40 && psa >= 4) {
    adjustPathway(state, "needs-labs-workup", 16);
    adjustPathway(state, "oral-topical-trt-discussion", -10);
    addRedFlag(state.redFlags, "PSA needs clinician review before TRT escalation.");
  }

  if (sleepFollowup === "not-addressed") {
    adjustPathway(state, "lifestyle-first", 8);
    adjustPathway(state, "needs-labs-workup", 6);
  }

  if (caffeineTiming === "late-afternoon") {
    state.lifestyleDrag += 3;
    adjustPathway(state, "lifestyle-first", 4);
  }

  if (shiftWork === "regular") {
    state.lifestyleDrag += 6;
    adjustPathway(state, "lifestyle-first", 6);
    adjustPathway(state, "needs-labs-workup", 4);
  }

  if (weightTrend === "up-clear") {
    state.lifestyleDrag += 6;
    adjustPathway(state, "lifestyle-first", 6);
  }

  state.candidateScore = clampNumber(Math.round(state.candidateScore), 12, 98);

  addLab(state.labsToRequest, "Repeat any abnormal hormone value on proper timing before locking a treatment plan");

  return state;
}

function getPriority(score: number, redFlags: string[]): QuizPriority {
  if (redFlags.length > 0 || score >= 75) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  return "Low";
}

function getDefaultPathwayWhy(pathway: HealthspanPathway) {
  switch (pathway.key) {
    case "lifestyle-first":
      return ["You have modifiable drivers that can lower testosterone or imitate low-T symptoms."];
    case "serm-discussion":
      return ["A fertility-aware route makes more sense than defaulting straight to exogenous TRT."];
    case "oral-topical-trt-discussion":
      return ["Your symptom + lab pattern is strong enough to justify a non-injectable TRT conversation."];
    case "needs-labs-workup":
    default:
      return ["There are unresolved variables that matter before treatment selection."];
  }
}

function getDefaultPathwayCautions(pathway: HealthspanPathway) {
  switch (pathway.key) {
    case "lifestyle-first":
      return ["Do not let generic wellness advice replace real lab work if symptoms are significant."];
    case "serm-discussion":
      return ["This still needs clinician supervision, proper labs, and fertility-aware counseling."];
    case "oral-topical-trt-discussion":
      return ["Needle-free does not mean consequence-free — fertility, hematocrit, and monitoring still matter."];
    case "needs-labs-workup":
    default:
      return ["Root-cause clarification matters more than rushing into a protocol."];
  }
}

function buildSummary(
  mode: QuizMode,
  primaryPathway: HealthspanPathway,
  priority: QuizPriority,
  score: number
) {
  const seriousMap: Record<QuizPathwayKey, string> = {
    "lifestyle-first": `Your TRT-candidacy signal is ${score}/100 (${priority.toLowerCase()} priority), but the bigger story is reversible lifestyle drag. Sleep, waist size, stress, and training consistency deserve a real pass before medication becomes the hero.` ,
    "serm-discussion": `Your TRT-candidacy signal is ${score}/100 (${priority.toLowerCase()} priority). Based on fertility intent, symptoms, and lab context, a SERM / enclomiphene-style discussion looks more aligned than jumping straight to exogenous TRT.`,
    "oral-topical-trt-discussion": `Your TRT-candidacy signal is ${score}/100 (${priority.toLowerCase()} priority). If proper testing confirms the picture, you look like a plausible candidate for a clinician discussion about oral or topical TRT rather than an injection-first path.`,
    "needs-labs-workup": `Your TRT-candidacy signal is ${score}/100 (${priority.toLowerCase()} priority), but the cleanest next move is not treatment selection — it is better workup. Labs, apnea risk, thyroid / prolactin context, or fertility planning need to be clarified first.`
  };

  const roastMap: Record<QuizPathwayKey, string> = {
    "lifestyle-first": `Score: ${score}/100. You might not need a prescription nearly as much as you need better sleep, less waist gain, and a plan that survives Tuesday night. Don’t medicate around obvious chaos.`,
    "serm-discussion": `Score: ${score}/100. You want the hormonal upside without lighting fertility on fire, so a SERM-style conversation makes more sense than speed-running to exogenous TRT.`,
    "oral-topical-trt-discussion": `Score: ${score}/100. This is not “bro science says hop on.” It is “you have enough real signal that a clinician discussion about oral/topical TRT is no longer crazy.”`,
    "needs-labs-workup": `Score: ${score}/100. Right now the main thing you qualify for is more clarity. Get the workup tighter before you cosplay certainty.`
  };

  return mode === "roast" ? roastMap[primaryPathway.key] : seriousMap[primaryPathway.key];
}

function finalizeResult(
  state: AssessmentState,
  mode: QuizMode,
  assessmentType: HealthspanAssessmentType
): HealthspanResult {
  const pathways = Object.values(state.pathways)
    .map((pathway) => ({
      ...pathway,
      fitScore: clampNumber(Math.round(pathway.fitScore), 0, 100),
      why: (pathway.why.length > 0 ? pathway.why : getDefaultPathwayWhy(pathway)).slice(0, 3),
      cautions: (pathway.cautions.length > 0 ? pathway.cautions : getDefaultPathwayCautions(pathway)).slice(0, 3)
    }))
    .sort((left, right) => right.fitScore - left.fitScore);

  const primaryPathway = pathways[0];
  const secondaryPathways = pathways.slice(1, 3);
  const priority = getPriority(state.candidateScore, state.redFlags);

  const recommendations = state.recommendations.slice(0, 5);
  if (recommendations.length < 5) {
    const fallback: HealthspanRecommendation[] = [
      {
        title: "Get the right lab panel",
        action: "Do not choose a TRT path from vibes alone — get proper morning labs with LH / FSH context.",
        impact: "Makes every later decision smarter."
      },
      {
        title: "Protect sleep and treat apnea if present",
        action: "If sleep is broken, fix that variable first so you are not reading hormone symptoms through recovery debt.",
        impact: "Reduces false positives and improves actual symptoms."
      },
      {
        title: "Lift consistently",
        action: "Use 2-4 weekly resistance sessions with progression instead of random exercise.",
        impact: "Improves body composition and symptom confidence."
      },
      {
        title: "Make the fertility call early",
        action: "If kids matter, treat that as a first-order constraint before choosing between SERM and TRT paths.",
        impact: "Prevents avoidable regret."
      },
      {
        title: "Review meds and root causes",
        action: "Check for opioid, thyroid, prolactin, steroid, and metabolic issues that can fake or worsen a low-T picture.",
        impact: "Keeps you from treating the wrong problem."
      }
    ];

    fallback.forEach((item) => addRecommendation(recommendations, item));
  }

  return {
    score: clampNumber(Math.round(state.candidateScore), 0, 100),
    priority,
    summary: buildSummary(mode, primaryPathway, priority, clampNumber(Math.round(state.candidateScore), 0, 100)),
    primaryPathway,
    secondaryPathways,
    helpingFactors: state.helpingFactors.slice(0, 3),
    hurtingFactors: state.hurtingFactors.slice(0, 3),
    recommendations: recommendations.slice(0, 5),
    labsToRequest: state.labsToRequest.slice(0, assessmentType === "advanced" ? 10 : 8),
    redFlags: state.redFlags.slice(0, 5),
    mode
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuizRequestBody;
    const answers = body.answers;
    const introAnswers = body.introAnswers;
    const mode: QuizMode = body.mode === "roast" ? "roast" : "serious";
    const assessmentType: HealthspanAssessmentType =
      body.assessmentType === "advanced" ? "advanced" : "intro";

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json({ error: "Quiz answers are required." }, { status: 400 });
    }

    if (assessmentType === "advanced") {
      if (!introAnswers || typeof introAnswers !== "object" || Array.isArray(introAnswers)) {
        return NextResponse.json(
          { error: "Intro quiz answers are required for advanced assessment." },
          { status: 400 }
        );
      }

      const result = finalizeResult(scoreAdvancedAnswers(introAnswers, answers, mode), mode, "advanced");
      return NextResponse.json({ result }, { status: 200 });
    }

    const result = finalizeResult(scoreIntroAnswers(answers, mode), mode, "intro");
    return NextResponse.json({ result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to process quiz request at the moment." },
      { status: 500 }
    );
  }
}
