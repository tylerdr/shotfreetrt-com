import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";

import type {
  HealthspanAssessmentType,
  HealthspanRecommendation,
  HealthspanResult,
  QuizAnswers,
  QuizGrade,
  QuizMode
} from "@/lib/quiz/healthspan-types";

export const runtime = "nodejs";

type QuizRequestBody = {
  answers?: QuizAnswers;
  introAnswers?: QuizAnswers;
  mode?: QuizMode;
  assessmentType?: HealthspanAssessmentType;
};

const gradeThresholds: Array<{ min: number; grade: QuizGrade }> = [
  { min: 92, grade: "A+" },
  { min: 85, grade: "A" },
  { min: 75, grade: "B" },
  { min: 63, grade: "C" },
  { min: 50, grade: "D" },
  { min: 0, grade: "F" }
];

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

function getGrade(score: number): QuizGrade {
  const found = gradeThresholds.find((threshold) => score >= threshold.min);
  return found ? found.grade : "F";
}

function getAge(answers: QuizAnswers): number {
  const raw = answers.age;

  if (typeof raw === "number") {
    return clampNumber(raw, 18, 110);
  }

  const rawObject = toObject(raw);
  if (rawObject) {
    const ageValue = toNumber(rawObject.age);
    if (ageValue !== null) {
      return clampNumber(ageValue, 18, 110);
    }
  }

  return 45;
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

function estimateOneRepMax(weightKg: number, reps: number) {
  return weightKg * (1 + reps / 30);
}

function getOneRepMaxFromAnswer(value: unknown): number | null {
  const raw = toObject(value);
  if (!raw) {
    return null;
  }

  const weight = toNumber(raw.weightKg);
  const reps = toNumber(raw.reps);

  if (weight === null || reps === null || weight <= 0 || reps <= 0) {
    return null;
  }

  return estimateOneRepMax(weight, reps);
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

function finalizeResult(
  score: number,
  age: number,
  mode: QuizMode,
  assessmentType: HealthspanAssessmentType,
  helpingFactors: string[],
  hurtingFactors: string[],
  recommendations: HealthspanRecommendation[]
): HealthspanResult {
  const normalizedScore = clampNumber(Math.round(score), 18, 98);
  const grade = getGrade(normalizedScore);

  const projectedHealthspan =
    assessmentType === "advanced"
      ? clampNumber(
          Math.round(age + 16 + (normalizedScore - 50) * 0.62),
          Math.round(age + 3),
          103
        )
      : clampNumber(
          Math.round(age + 14 + (normalizedScore - 50) * 0.55),
          Math.round(age + 2),
          100
        );

  const projectedLifespan =
    assessmentType === "advanced"
      ? clampNumber(
          Math.round(age + 34 + (normalizedScore - 50) * 0.68),
          Math.round(projectedHealthspan + 2),
          114
        )
      : clampNumber(
          Math.round(age + 31 + (normalizedScore - 50) * 0.62),
          Math.round(projectedHealthspan + 2),
          110
        );

  const defaultHelping =
    assessmentType === "advanced"
      ? [
          "You provided high-resolution training and biomarker data for deeper analysis.",
          "Your advanced profile identifies leverage points beyond the intro estimate.",
          "Detailed inputs improve recommendation precision and execution planning."
        ]
      : [
          "You already have multiple habits that support healthier aging.",
          "Your current routine includes at least one strong protective behavior.",
          "You have enough consistency to improve quickly with targeted tweaks."
        ];

  const defaultHurting =
    assessmentType === "advanced"
      ? [
          "A few high-impact habits still reduce your upside despite better data.",
          "Consistency gaps remain in recovery, monitoring, or progressive training.",
          "Advanced metrics indicate opportunities for tighter execution."
        ]
      : [
          "A few high-impact habits are reducing your projected trajectory.",
          "Execution consistency is lower than what your goals require.",
          "Preventive and recovery habits are not yet fully optimized."
        ];

  const defaultRecommendations: HealthspanRecommendation[] =
    assessmentType === "advanced"
      ? [
          {
            title: "Run a 12-week progression block",
            action: "Track key lifts and aerobic sessions weekly with objective progression targets.",
            yearsGained: 2.0
          },
          {
            title: "Tighten sleep hygiene levers",
            action: "Set caffeine cutoff, screen curfew, and cool sleep environment for 30 days.",
            yearsGained: 1.8
          },
          {
            title: "Monitor body composition quarterly",
            action: "Use DEXA or consistent waist/body fat checks with resistance training and protein targets.",
            yearsGained: 1.7
          },
          {
            title: "Track biomarker trends",
            action: "Review HbA1c, lipids, hsCRP, and thyroid trends with your clinician.",
            yearsGained: 1.6
          },
          {
            title: "Strengthen social and mental recovery",
            action: "Schedule recurring social support and structured stress regulation sessions weekly.",
            yearsGained: 1.3
          }
        ]
      : [
          {
            title: "Lock in sleep regularity",
            action: "Use a fixed wake time and pre-bed routine for 14 straight days.",
            yearsGained: 1.6
          },
          {
            title: "Hit 150+ minutes Zone 2",
            action: "Spread cardio across 3-4 sessions at conversational pace.",
            yearsGained: 1.5
          },
          {
            title: "Strength train twice weekly",
            action: "Use full-body sessions with progressive overload and recovery days.",
            yearsGained: 2.1
          },
          {
            title: "Reduce processed foods",
            action: "Replace one processed meal per day with a protein + fiber based meal.",
            yearsGained: 1.4
          },
          {
            title: "Track key biomarkers",
            action: "Review blood pressure, fasting glucose, and lipids quarterly.",
            yearsGained: 1.2
          }
        ];

  const summary =
    mode === "roast"
      ? assessmentType === "advanced"
        ? `Advanced score: ${normalizedScore}/100. You gave us better data, so now there is nowhere to hide. Tighten the highest-leverage gaps and you can shift this fast.`
        : `Your score is ${normalizedScore}/100. Not catastrophic, but your habits are leaving healthy years on the table. Tighten execution and this changes fast.`
      : assessmentType === "advanced"
        ? `Your advanced score is ${normalizedScore}/100. Detailed training, body composition, and biomarker inputs improved estimate precision and highlighted your highest-value next interventions.`
        : `Your score is ${normalizedScore}/100. You have a solid baseline with clear opportunities to increase both projected healthspan and lifespan through targeted habit upgrades.`;

  return {
    score: normalizedScore,
    projectedHealthspan,
    projectedLifespan,
    grade,
    summary,
    helpingFactors: [...helpingFactors, ...defaultHelping].slice(0, 3),
    hurtingFactors: [...hurtingFactors, ...defaultHurting].slice(0, 3),
    recommendations: [...recommendations, ...defaultRecommendations].slice(0, 5),
    mode
  };
}

function buildIntroFallbackResult(answers: QuizAnswers, mode: QuizMode): HealthspanResult {
  const age = getAge(answers);
  const bmi = calculateBmi(answers);

  let score = 56;

  const helpingFactors: string[] = [];
  const hurtingFactors: string[] = [];
  const recommendations: HealthspanRecommendation[] = [];

  const sleepHours = toNumber(answers.sleepHours);
  if (sleepHours !== null) {
    const distanceFromIdeal = Math.abs(sleepHours - 7.5);
    const delta = clampNumber(8 - distanceFromIdeal * 4.2, -10, 8);
    score += delta;

    if (delta >= 3) {
      pushUnique(helpingFactors, "Sleep duration is close to the 7-8 hour target range.");
    } else if (delta <= -3) {
      pushUnique(hurtingFactors, "Sleep duration is outside the lowest-risk 7-8 hour window.");
      addRecommendation(recommendations, {
        title: "Stabilize sleep duration",
        action: "Anchor wake time and target 7-8 hours nightly with a consistent wind-down.",
        yearsGained: 2.1
      });
    }
  }

  const sleepQuality = toStringValue(answers.sleepQuality);
  const sleepQualityScore: Record<string, number> = {
    poor: -8,
    fair: -2,
    good: 4,
    excellent: 7
  };
  if (sleepQuality) {
    score += sleepQualityScore[sleepQuality] ?? 0;

    if (sleepQuality === "good" || sleepQuality === "excellent") {
      pushUnique(helpingFactors, "Sleep quality supports recovery and metabolic resilience.");
    }

    if (sleepQuality === "poor") {
      pushUnique(hurtingFactors, "Low sleep quality is a major drag on recovery and long-term risk.");
      addRecommendation(recommendations, {
        title: "Upgrade sleep quality",
        action: "Cut late caffeine/alcohol and use a dark, cool sleep environment for 14 days.",
        yearsGained: 1.9
      });
    }
  }

  const exerciseFrequency = toStringValue(answers.exerciseFrequency);
  const exerciseFrequencyScore: Record<string, number> = {
    none: -12,
    "1-2": -1,
    "3-4": 7,
    "5+": 10
  };
  if (exerciseFrequency) {
    score += exerciseFrequencyScore[exerciseFrequency] ?? 0;

    if (exerciseFrequency === "3-4" || exerciseFrequency === "5+") {
      pushUnique(helpingFactors, "Weekly exercise frequency is strongly protective.");
    }

    if (exerciseFrequency === "none") {
      pushUnique(hurtingFactors, "No regular exercise creates one of the largest preventable risks.");
      addRecommendation(recommendations, {
        title: "Start a minimum viable training plan",
        action: "Do 3 weekly sessions: 2 strength sessions and 1 Zone 2 session.",
        yearsGained: 3.0
      });
    }
  }

  const exerciseTypes = toStringArray(answers.exerciseTypes);
  if (exerciseTypes.includes("strength")) {
    score += 4;
    pushUnique(helpingFactors, "Strength training supports muscle and metabolic health.");
  } else {
    addRecommendation(recommendations, {
      title: "Add strength training",
      action: "Schedule two full-body strength sessions weekly and progress loads gradually.",
      yearsGained: 2.4
    });
  }

  if (exerciseTypes.includes("zone2")) {
    score += 3;
    pushUnique(helpingFactors, "Zone 2 work improves cardiorespiratory reserve.");
  }

  const vo2Proxy = toStringValue(answers.vo2Proxy);
  const vo2Scores: Record<string, number> = {
    "yes-easy": 5,
    "yes-hard": 2,
    "not-sure": 0,
    no: -4
  };
  if (vo2Proxy) {
    score += vo2Scores[vo2Proxy] ?? 0;
    if (vo2Proxy === "no") {
      pushUnique(hurtingFactors, "Cardiorespiratory fitness proxy suggests low aerobic reserve.");
      addRecommendation(recommendations, {
        title: "Build aerobic capacity",
        action: "Add 2-3 weekly conversational-pace sessions and progress volume gradually.",
        yearsGained: 2.0
      });
    }
  }

  const gripProxy = toStringValue(answers.gripStrengthProxy);
  const gripScores: Record<string, number> = {
    easy: 3,
    sometimes: 0,
    rarely: -4
  };
  if (gripProxy) {
    score += gripScores[gripProxy] ?? 0;
  }

  const sittingHours = toStringValue(answers.sittingHours);
  const sittingScores: Record<string, number> = {
    lt4: 3,
    "4-6": 1,
    "7-9": -3,
    "10+": -7
  };
  if (sittingHours) {
    score += sittingScores[sittingHours] ?? 0;

    if (sittingHours === "10+" || sittingHours === "7-9") {
      pushUnique(hurtingFactors, "Sedentary time is likely offsetting some training benefit.");
      addRecommendation(recommendations, {
        title: "Break up sitting time",
        action: "Stand or walk for 2-3 minutes at least once each hour.",
        yearsGained: 1.3
      });
    }
  }

  const dietPattern = toStringValue(answers.dietPattern);
  const dietPatternScore: Record<string, number> = {
    "standard-american": -8,
    mediterranean: 7,
    keto: 2,
    "plant-based": 5,
    "whole-food": 8,
    other: 0
  };
  if (dietPattern) {
    score += dietPatternScore[dietPattern] ?? 0;

    if (dietPattern === "standard-american") {
      pushUnique(hurtingFactors, "Diet pattern raises long-term cardiometabolic risk.");
      addRecommendation(recommendations, {
        title: "Shift toward whole foods",
        action: "Build meals around protein, fiber, and minimally processed ingredients.",
        yearsGained: 2.3
      });
    }

    if (dietPattern === "mediterranean" || dietPattern === "whole-food" || dietPattern === "plant-based") {
      pushUnique(helpingFactors, "Diet quality pattern aligns with healthier aging data.");
    }
  }

  const proteinMeals = toStringValue(answers.proteinMeals);
  const proteinScores: Record<string, number> = {
    "0-1": -4,
    "2": 0,
    "3": 3,
    "4+": 2
  };
  if (proteinMeals) {
    score += proteinScores[proteinMeals] ?? 0;

    if (proteinMeals === "0-1") {
      addRecommendation(recommendations, {
        title: "Increase protein distribution",
        action: "Target 2-3 protein-rich meals daily to support lean mass.",
        yearsGained: 1.4
      });
    }
  }

  const processedFoodPct = toNumber(answers.processedFoodPct);
  if (processedFoodPct !== null) {
    const processedPenalty = clampNumber(processedFoodPct / 7.5, 0, 13);
    score -= processedPenalty;

    if (processedFoodPct >= 50) {
      pushUnique(hurtingFactors, "High processed food intake likely increases inflammation and metabolic strain.");
      addRecommendation(recommendations, {
        title: "Reduce processed intake",
        action: "Reduce processed foods by 20% and replace with repeatable whole-food meals.",
        yearsGained: 1.8
      });
    }
  }

  const hydration = toStringValue(answers.hydration);
  const hydrationScores: Record<string, number> = {
    lt1l: -3,
    "1-2l": 0,
    "2-3l": 2,
    "3l+": 2
  };
  if (hydration) {
    score += hydrationScores[hydration] ?? 0;
  }

  const fastingAwareness = toStringValue(answers.fastingGlucoseAwareness);
  const fastingScores: Record<string, number> = {
    "yes-normal": 3,
    "yes-elevated": -2,
    no: -1
  };
  if (fastingAwareness) {
    score += fastingScores[fastingAwareness] ?? 0;
    if (fastingAwareness === "yes-elevated" || fastingAwareness === "no") {
      addRecommendation(recommendations, {
        title: "Track metabolic markers",
        action: "Check fasting glucose and HbA1c trends and review with your clinician.",
        yearsGained: 1.6
      });
    }
  }

  const alcoholUse = toStringValue(answers.alcoholUse);
  const alcoholScores: Record<string, number> = {
    none: 4,
    occasional: 1,
    moderate: -3,
    heavy: -10
  };
  if (alcoholUse) {
    score += alcoholScores[alcoholUse] ?? 0;

    if (alcoholUse === "heavy") {
      pushUnique(hurtingFactors, "Heavy alcohol intake materially worsens healthspan trajectory.");
      addRecommendation(recommendations, {
        title: "Lower alcohol dose",
        action: "Cap intake and avoid alcohol close to bedtime for 30 days.",
        yearsGained: 1.7
      });
    }
  }

  const smokingStatus = toStringValue(answers.smokingStatus);
  const smokingScores: Record<string, number> = {
    never: 10,
    former: 2,
    current: -18
  };
  if (smokingStatus) {
    score += smokingScores[smokingStatus] ?? 0;

    if (smokingStatus === "current") {
      pushUnique(hurtingFactors, "Current smoking is the single largest modifiable longevity risk here.");
      addRecommendation(recommendations, {
        title: "Start smoking cessation support",
        action: "Use medical cessation support and a weekly trigger-management plan.",
        yearsGained: 4.0
      });
    }
  }

  const stressLevel = toStringValue(answers.stressLevel);
  const stressScores: Record<string, number> = {
    low: 4,
    moderate: 1,
    high: -4,
    "very-high": -8
  };
  if (stressLevel) {
    score += stressScores[stressLevel] ?? 0;

    if (stressLevel === "high" || stressLevel === "very-high") {
      pushUnique(hurtingFactors, "Chronic high stress can meaningfully reduce recovery capacity.");
      addRecommendation(recommendations, {
        title: "Install daily stress regulation",
        action: "Use a 10-minute daily breathing or mindfulness block and protect recovery windows.",
        yearsGained: 1.4
      });
    }
  }

  const mentalHealth = toStringValue(answers.mentalHealth);
  const mentalHealthScores: Record<string, number> = {
    rarely: 3,
    sometimes: 0,
    often: -4,
    "most-days": -8
  };
  if (mentalHealth) {
    score += mentalHealthScores[mentalHealth] ?? 0;

    if (mentalHealth === "often" || mentalHealth === "most-days") {
      addRecommendation(recommendations, {
        title: "Address mental health load",
        action: "Discuss persistent anxiety/depressive symptoms with a licensed professional.",
        yearsGained: 1.6
      });
    }
  }

  const socialConnections = toStringValue(answers.socialConnections);
  const socialScores: Record<string, number> = {
    isolated: -8,
    "few-close": -2,
    "strong-network": 4,
    "very-connected": 6
  };
  if (socialConnections) {
    score += socialScores[socialConnections] ?? 0;

    if (socialConnections === "isolated") {
      pushUnique(hurtingFactors, "Social isolation is linked to higher morbidity and mortality risk.");
      addRecommendation(recommendations, {
        title: "Increase social connection",
        action: "Add two recurring social touchpoints weekly with friends, family, or community groups.",
        yearsGained: 1.6
      });
    }
  }

  const purpose = toStringValue(answers.purpose);
  const purposeScores: Record<string, number> = {
    none: -6,
    searching: -1,
    moderate: 3,
    strong: 6
  };
  if (purpose) {
    score += purposeScores[purpose] ?? 0;

    if (purpose === "strong") {
      pushUnique(helpingFactors, "Strong sense of purpose supports behavior consistency and resilience.");
    }

    if (purpose === "none") {
      addRecommendation(recommendations, {
        title: "Define a purpose anchor",
        action: "Set one meaningful long-term goal and align weekly habits to it.",
        yearsGained: 1.2
      });
    }
  }

  const temperatureExposure = toStringValue(answers.temperatureExposure);
  const tempScores: Record<string, number> = {
    none: 0,
    occasional: 1,
    weekly: 2,
    frequent: 3
  };
  if (temperatureExposure) {
    score += tempScores[temperatureExposure] ?? 0;
  }

  const familyLongevity = toStringValue(answers.familyLongevity);
  const familyScores: Record<string, number> = {
    "under-70": -4,
    "70-80": -1,
    "80-90": 2,
    "90-plus": 5
  };
  if (familyLongevity) {
    score += familyScores[familyLongevity] ?? 0;
  }

  const chronicConditions = toStringArray(answers.chronicConditions);
  if (!chronicConditions.includes("none") && chronicConditions.length > 0) {
    score -= clampNumber(chronicConditions.length * 6, 0, 20);
    pushUnique(hurtingFactors, "Existing chronic conditions increase baseline risk load.");
    addRecommendation(recommendations, {
      title: "Tighten condition-specific monitoring",
      action: "Track condition markers with your clinician and review intervention adherence monthly.",
      yearsGained: 1.8
    });
  }

  const chronicNotes = toStringValue(answers.chronicConditionNotes);
  if (chronicNotes && chronicNotes.length >= 30) {
    score += 0.5;
  }

  const supplements = toStringArray(answers.supplements);
  if (supplements.includes("vitamin-d")) {
    score += 1;
  }
  if (supplements.includes("omega-3")) {
    score += 1;
  }
  if (supplements.includes("magnesium")) {
    score += 1;
  }
  if (supplements.includes("creatine")) {
    score += 1;
  }
  if (supplements.includes("nmn")) {
    score += 0.5;
  }

  const sunExposure = toStringValue(answers.sunExposure);
  const sunScores: Record<string, number> = {
    minimal: -2,
    moderate: 2,
    regular: 3
  };
  if (sunExposure) {
    score += sunScores[sunExposure] ?? 0;
  }

  const preventiveCare = toStringValue(answers.preventiveCare);
  const preventiveScores: Record<string, number> = {
    never: -8,
    occasionally: -2,
    regular: 4,
    proactive: 7
  };
  if (preventiveCare) {
    score += preventiveScores[preventiveCare] ?? 0;

    if (preventiveCare === "proactive" || preventiveCare === "regular") {
      pushUnique(helpingFactors, "Preventive care adherence improves early detection and intervention speed.");
    }

    if (preventiveCare === "never") {
      addRecommendation(recommendations, {
        title: "Schedule preventive checkups",
        action: "Book annual labs and checkups, then track trends quarterly.",
        yearsGained: 1.5
      });
    }
  }

  if (bmi !== null) {
    if (bmi < 18.5) {
      score -= 3;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      score += 4;
      pushUnique(helpingFactors, "Body composition markers are currently in a lower-risk range.");
    } else if (bmi >= 30) {
      score -= 8;
      pushUnique(hurtingFactors, "Current BMI range may elevate cardiometabolic risk.");
      addRecommendation(recommendations, {
        title: "Improve body composition",
        action: "Use a mild calorie deficit with high protein and resistance training consistency.",
        yearsGained: 2.0
      });
    } else {
      score -= 2;
    }
  }

  const extraNotes = toStringValue(answers.additionalHealthNotes);
  if (extraNotes && extraNotes.length >= 40) {
    score += 0.5;
  }

  const agePenalty = clampNumber((age - 40) * 0.18, 0, 8);
  score -= agePenalty;

  return finalizeResult(score, age, mode, "intro", helpingFactors, hurtingFactors, recommendations);
}

function deriveVisualBodyFatPercent(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const map: Record<string, number> = {
    "male-8-10": 9,
    "male-12-15": 13.5,
    "male-18-20": 19,
    "male-25-plus": 27,
    "female-15-18": 16.5,
    "female-20-25": 22.5,
    "female-28-32": 30,
    "female-35-plus": 37
  };

  return map[value] ?? null;
}

function scoreBodyFatPercent(percent: number, sex: string | null) {
  const isFemale = sex === "female";

  const idealMin = isFemale ? 18 : 10;
  const idealMax = isFemale ? 30 : 20;

  if (percent >= idealMin && percent <= idealMax) {
    return { delta: 6, label: "Body fat estimate is currently in a lower-risk range." };
  }

  if (percent > idealMax + 8) {
    return { delta: -8, label: "Body fat estimate suggests elevated cardiometabolic load." };
  }

  if (percent > idealMax) {
    return { delta: -4, label: "Body fat estimate is moderately above optimal range." };
  }

  if (percent < idealMin - 3) {
    return { delta: -3, label: "Very low body fat can reduce resilience and hormonal stability." };
  }

  return { delta: 0, label: "Body fat estimate is near a neutral range." };
}

function buildAdvancedFallbackResult(
  introAnswers: QuizAnswers,
  advancedAnswers: QuizAnswers,
  mode: QuizMode
): HealthspanResult {
  const introBaseline = buildIntroFallbackResult(introAnswers, mode);
  const age = getAge(introAnswers);
  const sex = toStringValue(introAnswers.sex);

  let score = introBaseline.score;

  const helpingFactors = [...introBaseline.helpingFactors];
  const hurtingFactors = [...introBaseline.hurtingFactors];
  const recommendations = [...introBaseline.recommendations];

  const weeklyTrainingDays = toStringValue(advancedAnswers.weeklyTrainingDays);
  const trainingDaysScores: Record<string, number> = {
    "2-3": 1,
    "4-5": 3,
    "6+": 2
  };
  if (weeklyTrainingDays) {
    score += trainingDaysScores[weeklyTrainingDays] ?? 0;
  }

  const progressiveOverload = toStringValue(advancedAnswers.progressiveOverload);
  const overloadScores: Record<string, number> = {
    "yes-systematic": 5,
    sometimes: 1,
    no: -4
  };
  if (progressiveOverload) {
    score += overloadScores[progressiveOverload] ?? 0;

    if (progressiveOverload === "yes-systematic") {
      pushUnique(helpingFactors, "Progressive overload tracking supports long-term strength and function.");
    }

    if (progressiveOverload === "no") {
      addRecommendation(recommendations, {
        title: "Track progressive overload",
        action: "Log load, reps, or volume each week and progress at least one variable.",
        yearsGained: 1.8
      });
    }
  }

  const strengthSplit = toStringValue(advancedAnswers.strengthTrainingSplit);
  const splitScores: Record<string, number> = {
    "full-body": 2,
    "upper-lower": 2,
    "push-pull-legs": 2,
    "body-part": 1,
    none: -2
  };
  if (strengthSplit) {
    score += splitScores[strengthSplit] ?? 0;
  }

  const yearsTraining = toStringValue(advancedAnswers.yearsStrengthTraining);
  const yearsScores: Record<string, number> = {
    lt1: -1,
    "1-3": 1,
    "4-7": 2,
    "8+": 3
  };
  if (yearsTraining) {
    score += yearsScores[yearsTraining] ?? 0;
  }

  const { weightKg: bodyWeightKg } = getBodyMetrics(introAnswers);

  const squat1Rm = getOneRepMaxFromAnswer(advancedAnswers.squatPerformance);
  if (squat1Rm !== null && bodyWeightKg) {
    const ratio = squat1Rm / bodyWeightKg;
    if (ratio >= 1.25) {
      score += 6;
      pushUnique(helpingFactors, "Squat strength-to-bodyweight ratio supports functional reserve.");
    } else if (ratio >= 1) {
      score += 3;
    } else if (ratio < 0.7) {
      score -= 3;
      addRecommendation(recommendations, {
        title: "Build lower-body strength",
        action: "Run a structured squat progression with progressive overload and recovery.",
        yearsGained: 1.7
      });
    }
  }

  const bench1Rm = getOneRepMaxFromAnswer(advancedAnswers.benchPerformance);
  if (bench1Rm !== null && bodyWeightKg) {
    const ratio = bench1Rm / bodyWeightKg;
    if (ratio >= 1) {
      score += 5;
    } else if (ratio >= 0.8) {
      score += 2;
    } else if (ratio < 0.6) {
      score -= 2;
    }
  }

  const deadlift1Rm = getOneRepMaxFromAnswer(advancedAnswers.deadliftPerformance);
  if (deadlift1Rm !== null && bodyWeightKg) {
    const ratio = deadlift1Rm / bodyWeightKg;
    if (ratio >= 1.6) {
      score += 6;
      pushUnique(helpingFactors, "Deadlift strength indicates strong posterior-chain capacity.");
    } else if (ratio >= 1.2) {
      score += 3;
    } else if (ratio < 1) {
      score -= 2;
    }
  }

  const conditionAdherence = toStringValue(advancedAnswers.conditionAdherence);
  const adherenceScores: Record<string, number> = {
    high: 4,
    moderate: 1,
    low: -5
  };
  if (conditionAdherence) {
    score += adherenceScores[conditionAdherence] ?? 0;

    if (conditionAdherence === "low") {
      addRecommendation(recommendations, {
        title: "Increase condition-plan adherence",
        action: "Use weekly tracking and clinician check-ins to improve plan consistency.",
        yearsGained: 1.8
      });
    }
  }

  const caffeineTiming = toStringValue(advancedAnswers.sleepCaffeineTiming);
  const caffeineScores: Record<string, number> = {
    "before-noon": 2,
    "early-afternoon": 1,
    "late-afternoon-evening": -3
  };
  if (caffeineTiming) {
    score += caffeineScores[caffeineTiming] ?? 0;
  }

  const screenTiming = toStringValue(advancedAnswers.sleepScreenTiming);
  const screenScores: Record<string, number> = {
    none: 2,
    "60plus": 1,
    "30-60": -1,
    lt30: -3
  };
  if (screenTiming) {
    score += screenScores[screenTiming] ?? 0;
  }

  const roomTemp = toStringValue(advancedAnswers.sleepRoomTemp);
  const roomTempScores: Record<string, number> = {
    "cool-16-19": 2,
    "moderate-20-22": 0,
    "warm-23plus": -2,
    unknown: -1
  };
  if (roomTemp) {
    score += roomTempScores[roomTemp] ?? 0;
  }

  const dexaScan = toStringValue(advancedAnswers.dexaScan);
  const directBodyFat = toObject(advancedAnswers.bodyFatPct);
  const dexaBodyFatPct = directBodyFat ? toNumber(directBodyFat.bodyFatPct) : null;

  let resolvedBodyFat = dexaBodyFatPct;
  if (resolvedBodyFat === null && dexaScan === "no") {
    resolvedBodyFat = deriveVisualBodyFatPercent(toStringValue(advancedAnswers.bodyFatVisual));
  }

  if (resolvedBodyFat !== null) {
    const bodyFatEffect = scoreBodyFatPercent(resolvedBodyFat, sex);
    score += bodyFatEffect.delta;

    if (bodyFatEffect.delta >= 4) {
      pushUnique(helpingFactors, bodyFatEffect.label);
    } else if (bodyFatEffect.delta <= -4) {
      pushUnique(hurtingFactors, bodyFatEffect.label);
      addRecommendation(recommendations, {
        title: "Improve body composition precision",
        action: "Pair resistance training with protein targets and quarterly body-fat trend checks.",
        yearsGained: 2.1
      });
    }
  }

  const biomarkersTracked = toStringArray(advancedAnswers.biomarkersTracked);
  if (biomarkersTracked.length > 0 && !biomarkersTracked.includes("none")) {
    score += clampNumber(biomarkersTracked.length * 1.5, 0, 6);
    pushUnique(helpingFactors, "You track biomarkers that improve decision quality and intervention timing.");
  } else {
    score -= 4;
    addRecommendation(recommendations, {
      title: "Start biomarker tracking",
      action: "Track at least HbA1c, lipids, and hsCRP every 3-6 months.",
      yearsGained: 1.7
    });
  }

  const hba1cRaw = toObject(advancedAnswers.hba1cValue);
  const hba1c = hba1cRaw ? toNumber(hba1cRaw.hba1c) : null;
  if (hba1c !== null) {
    if (hba1c < 5.7) {
      score += 4;
    } else if (hba1c < 6.5) {
      score -= 2;
    } else {
      score -= 8;
      pushUnique(hurtingFactors, "HbA1c range indicates elevated glycemic risk.");
      addRecommendation(recommendations, {
        title: "Prioritize glucose control",
        action: "Review nutrition, activity timing, and medication strategy with your clinician.",
        yearsGained: 2.4
      });
    }
  }

  const lipidRaw = toObject(advancedAnswers.lipidValues);
  if (lipidRaw) {
    const ldl = toNumber(lipidRaw.ldl);
    const hdl = toNumber(lipidRaw.hdl);
    const triglycerides = toNumber(lipidRaw.triglycerides);

    if (ldl !== null) {
      if (ldl < 100) {
        score += 3;
      } else if (ldl > 130) {
        score -= 4;
      }
    }

    if (hdl !== null) {
      if (hdl >= 50) {
        score += 2;
      } else if (hdl < 40) {
        score -= 1;
      }
    }

    if (triglycerides !== null) {
      if (triglycerides < 150) {
        score += 2;
      } else {
        score -= 3;
      }
    }
  }

  const hscrpRaw = toObject(advancedAnswers.hscrpValue);
  const hscrp = hscrpRaw ? toNumber(hscrpRaw.hscrp) : null;
  if (hscrp !== null) {
    if (hscrp <= 1) {
      score += 3;
    } else if (hscrp <= 3) {
      score += 0;
    } else {
      score -= 4;
    }
  }

  const tshRaw = toObject(advancedAnswers.thyroidValue);
  const tsh = tshRaw ? toNumber(tshRaw.tsh) : null;
  if (tsh !== null) {
    if (tsh >= 0.5 && tsh <= 2.5) {
      score += 2;
    } else {
      score -= 1;
    }
  }

  const advancedNotes = toStringValue(advancedAnswers.advancedNotes);
  if (advancedNotes && advancedNotes.length >= 40) {
    score += 0.5;
  }

  return finalizeResult(score, age, mode, "advanced", helpingFactors, hurtingFactors, recommendations);
}

function summarizeAnswersForPrompt(
  answers: QuizAnswers,
  assessmentType: HealthspanAssessmentType,
  introAnswers?: QuizAnswers
) {
  const sourceAnswers = assessmentType === "advanced" ? introAnswers ?? {} : answers;
  const age = getAge(sourceAnswers);
  const bmi = calculateBmi(sourceAnswers);

  const detailLines: string[] = [];

  if (assessmentType === "advanced") {
    const squat1Rm = getOneRepMaxFromAnswer(answers.squatPerformance);
    const bench1Rm = getOneRepMaxFromAnswer(answers.benchPerformance);
    const deadlift1Rm = getOneRepMaxFromAnswer(answers.deadliftPerformance);

    if (squat1Rm !== null) {
      detailLines.push(`Estimated squat 1RM: ${squat1Rm.toFixed(1)} kg`);
    }
    if (bench1Rm !== null) {
      detailLines.push(`Estimated bench 1RM: ${bench1Rm.toFixed(1)} kg`);
    }
    if (deadlift1Rm !== null) {
      detailLines.push(`Estimated deadlift 1RM: ${deadlift1Rm.toFixed(1)} kg`);
    }
  }

  return [
    `Assessment type: ${assessmentType}`,
    `Age: ${age}`,
    bmi ? `Estimated BMI: ${bmi.toFixed(1)}` : "Estimated BMI: unavailable",
    ...detailLines,
    assessmentType === "advanced" && introAnswers
      ? `Intro answers JSON: ${JSON.stringify(introAnswers)}`
      : null,
    `Submitted answers JSON: ${JSON.stringify(answers)}`
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeRecommendation(value: unknown, fallback: HealthspanRecommendation): HealthspanRecommendation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  const title = toStringValue(record.title) ?? fallback.title;
  const action = toStringValue(record.action) ?? fallback.action;
  const years = toNumber(record.yearsGained);

  return {
    title,
    action,
    yearsGained: years !== null ? clampNumber(years, 0.5, 5) : fallback.yearsGained
  };
}

function normalizeResult(raw: unknown, fallback: HealthspanResult, mode: QuizMode): HealthspanResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return fallback;
  }

  const record = raw as Record<string, unknown>;

  const score = toNumber(record.score);
  const projectedHealthspan = toNumber(record.projectedHealthspan);
  const projectedLifespan = toNumber(record.projectedLifespan);
  const gradeRaw = toStringValue(record.grade);
  const summary = toStringValue(record.summary);

  const grade = ["A+", "A", "B", "C", "D", "F"].includes(gradeRaw ?? "")
    ? (gradeRaw as QuizGrade)
    : getGrade(score !== null ? score : fallback.score);

  const helpingFactors = toStringArray(record.helpingFactors);
  const hurtingFactors = toStringArray(record.hurtingFactors);
  const recommendations = Array.isArray(record.recommendations)
    ? record.recommendations
        .slice(0, 5)
        .map((item: unknown, index: number) =>
          normalizeRecommendation(item, fallback.recommendations[index])
        )
    : fallback.recommendations;

  return {
    score: score !== null ? clampNumber(Math.round(score), 0, 100) : fallback.score,
    projectedHealthspan:
      projectedHealthspan !== null
        ? clampNumber(Math.round(projectedHealthspan), 20, 115)
        : fallback.projectedHealthspan,
    projectedLifespan:
      projectedLifespan !== null
        ? clampNumber(Math.round(projectedLifespan), 30, 125)
        : fallback.projectedLifespan,
    grade,
    summary: summary ?? fallback.summary,
    helpingFactors: (helpingFactors.length > 0 ? helpingFactors : fallback.helpingFactors).slice(0, 3),
    hurtingFactors: (hurtingFactors.length > 0 ? hurtingFactors : fallback.hurtingFactors).slice(0, 3),
    recommendations,
    mode
  };
}

function getSystemPrompt(mode: QuizMode, assessmentType: HealthspanAssessmentType) {
  const toneInstruction =
    mode === "roast"
      ? "Tone: witty, blunt, and playful (light roast), but never insulting or shaming."
      : "Tone: clinical, clear, and supportive.";

  const scopeInstruction =
    assessmentType === "advanced"
      ? "Weight advanced markers (1RM estimates, body fat estimate/DEXA, biomarker values, adherence details) more heavily than intro-level proxies."
      : "Use intro-level proxies and behavior data to generate realistic estimates and recommendations.";

  return `You are a longevity clinician and healthspan analyst.
Use evidence-aligned reasoning based on sleep, exercise, nutrition, smoking, stress, social connection, mental health, and preventive care.
For exercise and social claims, align with these references when giving rationale: Arem et al. JAMA Intern Med 2015; Cappuccio et al. Sleep 2010; Holt-Lunstad et al. 2015; Leong et al. Lancet 2015; Ekelund et al. Lancet 2016.
Inputs may include single-select, multi-select, icon-select, gallery-select, slider, number-input, and free-form text notes.
${scopeInstruction}
${toneInstruction}
Return only structured JSON matching this shape:
{
  "score": number (0-100),
  "projectedHealthspan": number,
  "projectedLifespan": number,
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "summary": string,
  "helpingFactors": string[3],
  "hurtingFactors": string[3],
  "recommendations": [
    {
      "title": string,
      "action": string,
      "yearsGained": number (0.5 to 5)
    }
  ]
}
Requirements:
- Exactly 3 helping factors.
- Exactly 3 hurting factors.
- Exactly 5 recommendations.
- Be realistic: do not claim impossible year gains.
- Use submitted free-form notes when relevant.`;
}

async function generateAiResult(
  answers: QuizAnswers,
  mode: QuizMode,
  fallback: HealthspanResult,
  assessmentType: HealthspanAssessmentType,
  introAnswers?: QuizAnswers
): Promise<HealthspanResult> {
  const missingProviderKey =
    (mode === "serious" && !process.env.ANTHROPIC_API_KEY) ||
    (mode === "roast" && !process.env.XAI_API_KEY);

  if (missingProviderKey) {
    return fallback;
  }

  const model = mode === "serious" ? anthropic("claude-sonnet-4-5") : xai("grok-3-latest");

  const aiResult = await generateText({
    model,
    system: getSystemPrompt(mode, assessmentType),
    prompt: `Analyze this healthspan quiz submission and return structured JSON.\n${summarizeAnswersForPrompt(answers, assessmentType, introAnswers)}`,
    output: Output.json({
      name: "healthspan_assessment",
      description: "Structured healthspan quiz assessment"
    }),
    maxOutputTokens: 1400,
    temperature: mode === "serious" ? 0.35 : 0.75
  });

  return normalizeResult(aiResult.output, fallback, mode);
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
    }

    const fallback =
      assessmentType === "advanced" && introAnswers
        ? buildAdvancedFallbackResult(introAnswers, answers, mode)
        : buildIntroFallbackResult(answers, mode);

    try {
      const result = await generateAiResult(
        answers,
        mode,
        fallback,
        assessmentType,
        assessmentType === "advanced" ? introAnswers : undefined
      );
      return NextResponse.json({ result }, { status: 200 });
    } catch {
      return NextResponse.json({ result: fallback }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to process quiz request at the moment." },
      { status: 500 }
    );
  }
}
