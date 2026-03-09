export type QuizMode = "serious" | "roast";

export type QuizPriority = "Low" | "Moderate" | "High";

export type QuizPathwayKey =
  | "lifestyle-first"
  | "serm-discussion"
  | "oral-topical-trt-discussion"
  | "needs-labs-workup";

export type QuizObjectValue = Record<string, number | string | "">;

export type QuizAnswerValue = string | number | string[] | QuizObjectValue;

export type QuizAnswers = Record<string, QuizAnswerValue>;

export type HealthspanAssessmentType = "intro" | "advanced";

export type HealthspanRecommendation = {
  title: string;
  action: string;
  impact: string;
};

export type HealthspanPathway = {
  key: QuizPathwayKey;
  title: string;
  fitScore: number;
  summary: string;
  why: string[];
  cautions: string[];
};

export type HealthspanResult = {
  score: number;
  priority: QuizPriority;
  summary: string;
  primaryPathway: HealthspanPathway;
  secondaryPathways: HealthspanPathway[];
  helpingFactors: string[];
  hurtingFactors: string[];
  recommendations: HealthspanRecommendation[];
  labsToRequest: string[];
  redFlags: string[];
  mode: QuizMode;
};

export type HealthspanSharePayload = {
  v: 1;
  result: HealthspanResult;
};
