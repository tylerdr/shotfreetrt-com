import type { QuizAnswerValue } from "@/lib/quiz/healthspan-types";

export type QuizCitation = {
  source: string;
  href?: string;
};

export type QuizOption = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  exclusive?: boolean;
};

export type NumberInputField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  placeholder?: string;
};

type BaseQuestion = {
  id: string;
  title: string;
  description?: string;
  citations?: QuizCitation[];
  optional?: boolean;
};

export type SingleSelectQuestion = BaseQuestion & {
  type: "single-select";
  options: QuizOption[];
};

export type MultiSelectQuestion = BaseQuestion & {
  type: "multi-select";
  options: QuizOption[];
};

export type IconSelectQuestion = BaseQuestion & {
  type: "icon-select";
  options: QuizOption[];
  multiple?: boolean;
};

export type GallerySelectQuestion = BaseQuestion & {
  type: "gallery-select";
  options: QuizOption[];
  multiple?: boolean;
};

export type SliderQuestion = BaseQuestion & {
  type: "slider";
  min: number;
  max: number;
  step: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
};

export type NumberInputQuestion = BaseQuestion & {
  type: "number-input";
  fields: NumberInputField[];
};

export type TextInputQuestion = BaseQuestion & {
  type: "text-input";
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
};

export type QuizQuestion =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | IconSelectQuestion
  | GallerySelectQuestion
  | SliderQuestion
  | NumberInputQuestion
  | TextInputQuestion;

export const healthspanQuizQuestions: QuizQuestion[] = [
  {
    id: "age",
    type: "number-input",
    title: "How old are you?",
    description: "Age is the strongest baseline predictor for healthspan trajectories.",
    fields: [
      {
        key: "age",
        label: "Age",
        min: 18,
        max: 110,
        step: 1,
        unit: "years",
        placeholder: "e.g. 42"
      }
    ]
  },
  {
    id: "sex",
    type: "single-select",
    title: "What is your sex?",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]
  },
  {
    id: "bodyMetrics",
    type: "number-input",
    title: "What are your height and weight?",
    description: "We convert to metric internally so scoring stays consistent.",
    fields: [
      {
        key: "heightCm",
        label: "Height",
        min: 120,
        max: 230,
        step: 1,
        unit: "cm",
        placeholder: "e.g. 178"
      },
      {
        key: "weightKg",
        label: "Weight",
        min: 35,
        max: 250,
        step: 0.1,
        unit: "kg",
        placeholder: "e.g. 74"
      }
    ]
  },
  {
    id: "sleepHours",
    type: "slider",
    title: "How many hours do you sleep per night?",
    description: "Adults sleeping around 7-8 hours have the lowest all-cause mortality.",
    citations: [{ source: "Cappuccio et al., Sleep (2010)" }],
    min: 3,
    max: 12,
    step: 0.5,
    unit: "hours",
    minLabel: "3h",
    maxLabel: "12h"
  },
  {
    id: "sleepQuality",
    type: "gallery-select",
    title: "How would you rate your sleep quality?",
    options: [
      { value: "poor", label: "Poor", icon: "😵", description: "Frequent wake-ups, unrested most mornings." },
      { value: "fair", label: "Fair", icon: "😐", description: "Inconsistent sleep depth and recovery." },
      { value: "good", label: "Good", icon: "🙂", description: "Mostly restorative sleep with occasional bad nights." },
      { value: "excellent", label: "Excellent", icon: "😴", description: "Deep, consistent sleep and refreshed mornings." }
    ]
  },
  {
    id: "exerciseFrequency",
    type: "single-select",
    title: "How often do you exercise each week?",
    description: "150+ minutes/week of moderate activity is strongly protective.",
    citations: [{ source: "Arem et al., JAMA Internal Medicine (2015)" }],
    options: [
      { value: "none", label: "None" },
      { value: "1-2", label: "1-2x per week" },
      { value: "3-4", label: "3-4x per week" },
      { value: "5+", label: "5+x per week" }
    ]
  },
  {
    id: "exerciseTypes",
    type: "icon-select",
    multiple: true,
    title: "What types of exercise do you do?",
    options: [
      { value: "walking", label: "Walking", icon: "🚶" },
      { value: "cardio", label: "Cardio", icon: "🏃" },
      { value: "strength", label: "Strength", icon: "💪" },
      { value: "hiit", label: "HIIT", icon: "⚡" },
      { value: "yoga", label: "Yoga", icon: "🧘" },
      { value: "zone2", label: "Zone 2", icon: "🫀" }
    ]
  },
  {
    id: "vo2Proxy",
    type: "single-select",
    title: "Can you hold a conversation while briskly walking uphill for 10 minutes?",
    description: "A simple proxy for aerobic fitness and VO2 reserve.",
    options: [
      { value: "yes-easy", label: "Yes, comfortably" },
      { value: "yes-hard", label: "Yes, but difficult" },
      { value: "not-sure", label: "Not sure" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "gripStrengthProxy",
    type: "single-select",
    title: "Can you open a tight jar lid without help?",
    description: "Grip strength is a strong predictor of morbidity and mortality risk.",
    citations: [{ source: "Leong et al., The Lancet (2015)" }],
    options: [
      { value: "easy", label: "Usually easy" },
      { value: "sometimes", label: "Sometimes difficult" },
      { value: "rarely", label: "Usually cannot" }
    ]
  },
  {
    id: "sittingHours",
    type: "single-select",
    title: "How many hours per day do you spend sitting?",
    description: "Sedentary time can independently increase risk even in active people.",
    citations: [{ source: "Ekelund et al., The Lancet (2016)" }],
    options: [
      { value: "lt4", label: "<4 hours" },
      { value: "4-6", label: "4-6 hours" },
      { value: "7-9", label: "7-9 hours" },
      { value: "10+", label: "10+ hours" }
    ]
  },
  {
    id: "dietPattern",
    type: "icon-select",
    title: "Which diet pattern best matches your current eating style?",
    options: [
      { value: "standard-american", label: "Standard American", icon: "🍔" },
      { value: "mediterranean", label: "Mediterranean", icon: "🫒" },
      { value: "keto", label: "Keto", icon: "🥑" },
      { value: "plant-based", label: "Plant-based", icon: "🥗" },
      { value: "whole-food", label: "Whole food", icon: "🥩" },
      { value: "other", label: "Other", icon: "🍽️" }
    ]
  },
  {
    id: "proteinMeals",
    type: "single-select",
    title: "How many protein-rich meals do you eat daily?",
    description: "Adequate protein supports muscle protein synthesis and healthy aging.",
    citations: [{ source: "Phillips et al., Applied Physiology, Nutrition, and Metabolism (2016)" }],
    options: [
      { value: "0-1", label: "0-1 meals" },
      { value: "2", label: "2 meals" },
      { value: "3", label: "3 meals" },
      { value: "4+", label: "4+ meals" }
    ]
  },
  {
    id: "processedFoodPct",
    type: "slider",
    title: "About what percentage of your diet is processed food?",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
    minLabel: "0%",
    maxLabel: "100%"
  },
  {
    id: "hydration",
    type: "single-select",
    title: "How much water do you drink daily?",
    options: [
      { value: "lt1l", label: "<1 L" },
      { value: "1-2l", label: "1-2 L" },
      { value: "2-3l", label: "2-3 L" },
      { value: "3l+", label: "3+ L" }
    ]
  },
  {
    id: "fastingGlucoseAwareness",
    type: "single-select",
    title: "Do you know your most recent fasting blood glucose?",
    options: [
      { value: "yes-normal", label: "Yes, in normal range" },
      { value: "yes-elevated", label: "Yes, elevated" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "alcoholUse",
    type: "single-select",
    title: "How would you describe your alcohol consumption?",
    options: [
      { value: "none", label: "None" },
      { value: "occasional", label: "Occasional" },
      { value: "moderate", label: "Moderate" },
      { value: "heavy", label: "Heavy" }
    ]
  },
  {
    id: "smokingStatus",
    type: "single-select",
    title: "What is your smoking status?",
    options: [
      { value: "never", label: "Never" },
      { value: "former", label: "Former" },
      { value: "current", label: "Current" }
    ]
  },
  {
    id: "stressLevel",
    type: "gallery-select",
    title: "What is your average stress level?",
    options: [
      { value: "low", label: "Low", icon: "😌", description: "Calm baseline, stress spikes are brief." },
      { value: "moderate", label: "Moderate", icon: "🙂", description: "Manageable stress with occasional overload." },
      { value: "high", label: "High", icon: "😟", description: "Persistent stress most days." },
      { value: "very-high", label: "Very high", icon: "😰", description: "Overwhelmed often, hard to recover." }
    ]
  },
  {
    id: "mentalHealth",
    type: "single-select",
    title: "How often do you feel anxious or depressed?",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "most-days", label: "Most days" }
    ]
  },
  {
    id: "socialConnections",
    type: "gallery-select",
    title: "How strong are your social connections?",
    description: "Social isolation can raise mortality risk similar to major lifestyle risks.",
    citations: [{ source: "Holt-Lunstad et al. (2015)" }],
    options: [
      { value: "isolated", label: "Isolated", icon: "🧍", description: "Limited regular contact or support." },
      { value: "few-close", label: "Few close ties", icon: "👥", description: "A small but meaningful support circle." },
      { value: "strong-network", label: "Strong network", icon: "🤝", description: "Regular social contact and support." },
      { value: "very-connected", label: "Deeply connected", icon: "🌐", description: "Consistent family/community integration." }
    ]
  },
  {
    id: "purpose",
    type: "single-select",
    title: "How strong is your day-to-day sense of purpose?",
    options: [
      { value: "none", label: "None" },
      { value: "searching", label: "Searching" },
      { value: "moderate", label: "Moderate" },
      { value: "strong", label: "Strong" }
    ]
  },
  {
    id: "temperatureExposure",
    type: "single-select",
    title: "Do you practice sauna, cold plunges, or deliberate temperature exposure?",
    options: [
      { value: "none", label: "No" },
      { value: "occasional", label: "Occasionally" },
      { value: "weekly", label: "Weekly" },
      { value: "frequent", label: "Multiple times/week" }
    ]
  },
  {
    id: "familyLongevity",
    type: "single-select",
    title: "How long have close family members typically lived?",
    options: [
      { value: "under-70", label: "<70" },
      { value: "70-80", label: "70-80" },
      { value: "80-90", label: "80-90" },
      { value: "90-plus", label: "90+" }
    ]
  },
  {
    id: "chronicConditions",
    type: "multi-select",
    title: "Do any chronic conditions currently apply to you?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "diabetes", label: "Diabetes" },
      { value: "heart-disease", label: "Heart disease" },
      { value: "cancer-history", label: "Cancer history" },
      { value: "autoimmune", label: "Autoimmune" },
      { value: "other", label: "Other" }
    ]
  },
  {
    id: "chronicConditionNotes",
    type: "text-input",
    optional: true,
    multiline: true,
    maxLength: 600,
    title: "Tell us more about your chronic conditions (optional)",
    placeholder: "Diagnosis details, symptom patterns, current treatment, or anything else you want considered."
  },
  {
    id: "supplements",
    type: "multi-select",
    title: "Which supplements do you currently use?",
    options: [
      { value: "none", label: "None", exclusive: true },
      { value: "vitamin-d", label: "Vitamin D" },
      { value: "omega-3", label: "Omega-3" },
      { value: "magnesium", label: "Magnesium" },
      { value: "creatine", label: "Creatine" },
      { value: "nmn", label: "NMN" },
      { value: "other", label: "Other" }
    ]
  },
  {
    id: "sunExposure",
    type: "single-select",
    title: "How much regular sun exposure do you get?",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "moderate", label: "Moderate" },
      { value: "regular", label: "Regular" }
    ]
  },
  {
    id: "preventiveCare",
    type: "single-select",
    title: "How consistent are you with preventive care?",
    options: [
      { value: "never", label: "Never" },
      { value: "occasionally", label: "Occasionally" },
      { value: "regular", label: "Regular checkups" },
      { value: "proactive", label: "Proactive" }
    ]
  },
  {
    id: "additionalHealthNotes",
    type: "text-input",
    optional: true,
    multiline: true,
    maxLength: 800,
    title: "Anything else about your health you would like to share?",
    placeholder: "Optional context for a richer analysis: injuries, medications, shift work, major stressors, goals, etc."
  }
];

export function getInitialQuestionValue(question: QuizQuestion): QuizAnswerValue | undefined {
  if (question.type === "slider") {
    return undefined;
  }

  if (question.type === "single-select") {
    return "";
  }

  if (question.type === "multi-select") {
    return [];
  }

  if (question.type === "icon-select") {
    return question.multiple ? [] : "";
  }

  if (question.type === "gallery-select") {
    return question.multiple ? [] : "";
  }

  if (question.type === "text-input") {
    return "";
  }

  if (question.fields.length === 1) {
    return "";
  }

  return question.fields.reduce<Record<string, number | "">>((accumulator, field) => {
    accumulator[field.key] = "";
    return accumulator;
  }, {});
}

export function isQuestionAnswered(question: QuizQuestion, value: QuizAnswerValue | undefined) {
  if (question.type === "single-select") {
    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "multi-select") {
    return Array.isArray(value) && value.length > 0;
  }

  if (question.type === "icon-select") {
    if (question.multiple) {
      return Array.isArray(value) && value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "gallery-select") {
    if (question.multiple) {
      return Array.isArray(value) && value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "slider") {
    return typeof value === "number";
  }

  if (question.type === "text-input") {
    if (question.optional) {
      return true;
    }

    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.fields.length === 1) {
    return typeof value === "number" && Number.isFinite(value);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return question.fields.every((field) => {
    const fieldValue = value[field.key];
    return typeof fieldValue === "number" && Number.isFinite(fieldValue);
  });
}
