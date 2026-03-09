"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { QuizResult } from "@/components/quiz/QuizResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  getInitialQuestionValue,
  healthspanQuizQuestions,
  isQuestionAnswered,
  type GallerySelectQuestion,
  type IconSelectQuestion,
  type MultiSelectQuestion,
  type NumberInputField,
  type NumberInputQuestion,
  type QuizOption,
  type QuizQuestion,
  type SliderQuestion,
  type TextInputQuestion
} from "@/lib/quiz/healthspan-config";
import { encodeHealthspanSharePayload } from "@/lib/quiz/healthspan-share";
import {
  INTRO_ANSWERS_STORAGE_KEY,
  writeStoredAnswers,
  writeStoredResult
} from "@/lib/quiz/healthspan-storage";
import type {
  HealthspanResult,
  QuizAnswerValue,
  QuizAnswers,
  QuizMode
} from "@/lib/quiz/healthspan-types";

type QuizApiResponse = {
  error?: string;
  result?: HealthspanResult;
};

type NumberDraftState = Record<string, string>;
type FieldErrorState = Record<string, string>;

type BodyMetricDraft = {
  feet: string;
  inches: string;
  weightLbs: string;
};

function clampValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundToStep(value: number, step: number) {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) {
    return value;
  }

  const precision = step.toString().includes(".") ? step.toString().split(".")[1]?.length ?? 0 : 0;
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(precision));
}

function cmToFeetInches(heightCm: number) {
  const totalInches = heightCm / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return { feet, inches };
}

function feetInchesToCm(feet: number, inches: number) {
  return (feet * 12 + inches) * 2.54;
}

function lbsToKg(lbs: number) {
  return lbs * 0.45359237;
}

function kgToLbs(kg: number) {
  return kg / 0.45359237;
}

function makeFieldStateKey(questionId: string, fieldKey: string) {
  return `${questionId}:${fieldKey}`;
}

function getQuestionValue(
  answers: QuizAnswers,
  question: QuizQuestion
): QuizAnswerValue | undefined {
  if (question.id in answers) {
    return answers[question.id];
  }

  return getInitialQuestionValue(question);
}

function computeBmi(value: QuizAnswerValue | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const heightCm = typeof value.heightCm === "number" ? value.heightCm : null;
  const weightKg = typeof value.weightKg === "number" ? value.weightKg : null;

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightMeters = heightCm / 100;
  return weightKg / (heightMeters * heightMeters);
}

function getOptionFromValue(question: MultiSelectQuestion | IconSelectQuestion | GallerySelectQuestion, value: string) {
  return question.options.find((option) => option.value === value);
}

function toggleMultiValue(
  selectedValues: string[],
  question: MultiSelectQuestion | IconSelectQuestion | GallerySelectQuestion,
  optionValue: string
) {
  const option = getOptionFromValue(question, optionValue);
  if (!option) {
    return selectedValues;
  }

  const exclusiveOptions = new Set(
    question.options.filter((item) => item.exclusive).map((item) => item.value)
  );

  if (selectedValues.includes(optionValue)) {
    return selectedValues.filter((value) => value !== optionValue);
  }

  if (option.exclusive) {
    return [optionValue];
  }

  const withoutExclusive = selectedValues.filter((value) => !exclusiveOptions.has(value));
  return [...withoutExclusive, optionValue];
}

function optionCardClass(isSelected: boolean) {
  return [
    "border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors",
    isSelected ? "border-primary bg-primary/5" : ""
  ]
    .join(" ")
    .trim();
}

export function QuizEngine() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [mode, setMode] = useState<QuizMode>("serious");
  const [result, setResult] = useState<HealthspanResult | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberDrafts, setNumberDrafts] = useState<NumberDraftState>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrorState>({});
  const [bodyMetricsUnit, setBodyMetricsUnit] = useState<"imperial" | "metric">("imperial");
  const [imperialDraft, setImperialDraft] = useState<BodyMetricDraft>({
    feet: "5",
    inches: "8",
    weightLbs: ""
  });

  const currentQuestion = healthspanQuizQuestions[currentQuestionIndex];
  const currentValue = getQuestionValue(answers, currentQuestion);

  const progressPercent = useMemo(
    () => ((currentQuestionIndex + 1) / healthspanQuizQuestions.length) * 100,
    [currentQuestionIndex]
  );

  const hasCurrentQuestionErrors = useMemo(
    () =>
      Object.entries(fieldErrors).some(
        ([key, message]) => key.startsWith(`${currentQuestion.id}:`) && message.trim().length > 0
      ),
    [currentQuestion.id, fieldErrors]
  );

  const canAdvance =
    isQuestionAnswered(currentQuestion, currentValue) && !hasCurrentQuestionErrors;

  const bmi = useMemo(() => {
    if (currentQuestion.id !== "bodyMetrics") {
      return null;
    }

    return computeBmi(currentValue);
  }, [currentQuestion.id, currentValue]);

  useEffect(() => {
    if (currentQuestion.id !== "age") {
      return;
    }

    const key = makeFieldStateKey("age", "age");
    const draftValue = numberDrafts[key];

    if (!draftValue || draftValue.trim().length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      const parsed = Number(draftValue);
      if (!Number.isFinite(parsed)) {
        setFieldErrors((previous) => ({
          ...previous,
          [key]: "Enter a valid age."
        }));
        return;
      }

      if (parsed < 18 || parsed > 110) {
        setFieldErrors((previous) => ({
          ...previous,
          [key]: "Age should be between 18 and 110."
        }));
        return;
      }

      setFieldErrors((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentQuestion.id, numberDrafts]);

  useEffect(() => {
    if (currentQuestion.id !== "bodyMetrics") {
      return;
    }

    const raw = currentValue;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return;
    }

    const heightCm = typeof raw.heightCm === "number" ? raw.heightCm : null;
    const weightKg = typeof raw.weightKg === "number" ? raw.weightKg : null;

    if (heightCm !== null) {
      const converted = cmToFeetInches(heightCm);
      setImperialDraft((previous) => ({
        ...previous,
        feet: String(clampValue(converted.feet, 4, 7)),
        inches: String(clampValue(converted.inches, 0, 11))
      }));
    }

    if (weightKg !== null) {
      setImperialDraft((previous) => ({
        ...previous,
        weightLbs: String(roundToStep(kgToLbs(weightKg), 0.1))
      }));
    }
  }, [currentQuestion.id]);

  function setFieldError(questionId: string, fieldKey: string, message: string) {
    const stateKey = makeFieldStateKey(questionId, fieldKey);
    setFieldErrors((previous) => ({
      ...previous,
      [stateKey]: message
    }));
  }

  function clearFieldError(questionId: string, fieldKey: string) {
    const stateKey = makeFieldStateKey(questionId, fieldKey);
    setFieldErrors((previous) => {
      if (!(stateKey in previous)) {
        return previous;
      }

      const next = { ...previous };
      delete next[stateKey];
      return next;
    });
  }

  function getFieldError(questionId: string, fieldKey: string) {
    return fieldErrors[makeFieldStateKey(questionId, fieldKey)] ?? "";
  }

  function setDraftValue(questionId: string, fieldKey: string, value: string) {
    const stateKey = makeFieldStateKey(questionId, fieldKey);
    setNumberDrafts((previous) => ({
      ...previous,
      [stateKey]: value
    }));
  }

  function getDraftValue(questionId: string, fieldKey: string) {
    return numberDrafts[makeFieldStateKey(questionId, fieldKey)];
  }

  function updateAnswer(questionId: string, value: QuizAnswerValue) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value
    }));
    setError(null);
  }

  function updateNumberField(question: NumberInputQuestion, fieldKey: string, nextValue: number | "") {
    if (question.fields.length === 1) {
      updateAnswer(question.id, nextValue);
      return;
    }

    const currentFields =
      currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)
        ? currentValue
        : {};

    updateAnswer(question.id, {
      ...currentFields,
      [fieldKey]: nextValue
    });
  }

  function commitNumberField(question: NumberInputQuestion, field: NumberInputField, rawInput: string) {
    const stateKey = makeFieldStateKey(question.id, field.key);
    const trimmed = rawInput.trim();

    if (!trimmed) {
      updateNumberField(question, field.key, "");
      setFieldErrors((previous) => ({
        ...previous,
        [stateKey]: "This field is required."
      }));
      return;
    }

    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      setFieldErrors((previous) => ({
        ...previous,
        [stateKey]: "Enter a valid number."
      }));
      return;
    }

    let normalized = parsed;
    let message = "";

    if (parsed < field.min) {
      normalized = field.min;
      message = `Adjusted to minimum ${field.min}${field.unit ? ` ${field.unit}` : ""}.`;
    } else if (parsed > field.max) {
      normalized = field.max;
      message = `Adjusted to maximum ${field.max}${field.unit ? ` ${field.unit}` : ""}.`;
    }

    normalized = roundToStep(normalized, field.step ?? 1);
    updateNumberField(question, field.key, normalized);
    setDraftValue(question.id, field.key, String(normalized));

    if (message) {
      setFieldErrors((previous) => ({
        ...previous,
        [stateKey]: message
      }));
      return;
    }

    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[stateKey];
      return next;
    });
  }

  function setBodyMetricAnswer(nextPartial: { heightCm?: number; weightKg?: number | "" }) {
    const raw = answers.bodyMetrics;
    const currentBodyMetrics =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? raw
        : { heightCm: "", weightKg: "" };

    updateAnswer("bodyMetrics", {
      ...currentBodyMetrics,
      ...nextPartial
    });
  }

  function commitImperialHeight(feetValue: string, inchesValue: string) {
    const feet = Number(feetValue);
    const inches = Number(inchesValue);

    if (!Number.isFinite(feet) || !Number.isFinite(inches)) {
      return;
    }

    const heightField = (currentQuestion as NumberInputQuestion).fields.find((field) => field.key === "heightCm");
    if (!heightField) {
      return;
    }

    const computedHeight = feetInchesToCm(feet, inches);
    const normalizedHeight = roundToStep(
      clampValue(computedHeight, heightField.min, heightField.max),
      heightField.step ?? 1
    );

    setBodyMetricAnswer({ heightCm: normalizedHeight });
    clearFieldError("bodyMetrics", "heightCm");
  }

  function handleBodyMetricUnitChange(nextUnit: "imperial" | "metric") {
    if (nextUnit === bodyMetricsUnit) {
      return;
    }

    if (nextUnit === "imperial") {
      const raw = answers.bodyMetrics;
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const heightCm = typeof raw.heightCm === "number" ? raw.heightCm : null;
        const weightKg = typeof raw.weightKg === "number" ? raw.weightKg : null;

        if (heightCm !== null) {
          const converted = cmToFeetInches(heightCm);
          setImperialDraft((previous) => ({
            ...previous,
            feet: String(clampValue(converted.feet, 4, 7)),
            inches: String(clampValue(converted.inches, 0, 11))
          }));
        }

        if (weightKg !== null) {
          setImperialDraft((previous) => ({
            ...previous,
            weightLbs: String(roundToStep(kgToLbs(weightKg), 0.1))
          }));
        }
      }
    }

    setBodyMetricsUnit(nextUnit);
  }

  function handleAgeNudge(delta: number) {
    const ageQuestion = currentQuestion;
    if (ageQuestion.id !== "age" || ageQuestion.type !== "number-input") {
      return;
    }

    const ageField = ageQuestion.fields[0];
    const existing = getQuestionValue(answers, ageQuestion);
    const currentAge =
      typeof existing === "number"
        ? existing
        : typeof getDraftValue("age", "age") === "string" && getDraftValue("age", "age")?.trim()
          ? Number(getDraftValue("age", "age"))
          : ageField.min;

    const safeCurrent = Number.isFinite(currentAge) ? currentAge : ageField.min;
    const nextAge = clampValue(safeCurrent + delta, ageField.min, ageField.max);

    updateAnswer("age", nextAge);
    setDraftValue("age", "age", String(nextAge));
    clearFieldError("age", "age");
  }

  async function requestResult(targetMode: QuizMode) {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/quiz/healthspan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers, mode: targetMode, assessmentType: "intro" })
      });

      const payload = (await response.json()) as QuizApiResponse;

      if (!response.ok || !payload.result) {
        throw new Error(payload.error ?? "Unable to generate your result right now.");
      }

      const normalizedResult = {
        ...payload.result,
        mode: targetMode
      };

      setMode(targetMode);
      setResult(normalizedResult);

      writeStoredAnswers(INTRO_ANSWERS_STORAGE_KEY, answers);
      writeStoredResult(normalizedResult);

      const shareId = encodeHealthspanSharePayload({ v: 1, result: normalizedResult });
      setShareUrl(`${window.location.origin}/quiz/healthspan/result/${shareId}`);
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("Unable to generate your result right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (!canAdvance || isSubmitting) {
      return;
    }

    const isFinalQuestion = currentQuestionIndex === healthspanQuizQuestions.length - 1;

    if (isFinalQuestion) {
      requestResult(mode);
      return;
    }

    setCurrentQuestionIndex((previous) => previous + 1);
  }

  function handleBack() {
    if (currentQuestionIndex === 0 || isSubmitting) {
      return;
    }

    setCurrentQuestionIndex((previous) => previous - 1);
  }

  function handleRetake() {
    setResult(null);
    setCurrentQuestionIndex(0);
    setError(null);
  }

  function handleModeChange(nextMode: QuizMode) {
    requestResult(nextMode);
  }

  function renderQuestionCitations(question: QuizQuestion) {
    if (!question.citations || question.citations.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
        <p className="font-semibold">Evidence references</p>
        <ul className="mt-1 space-y-1">
          {question.citations.map((citation) => (
            <li key={citation.source}>
              {citation.href ? (
                <a href={citation.href} target="_blank" rel="noreferrer" className="underline">
                  {citation.source}
                </a>
              ) : (
                citation.source
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderSingleSelect(question: QuizQuestion, value: QuizAnswerValue | undefined) {
    if (question.type !== "single-select") {
      return null;
    }

    const selectedValue = typeof value === "string" ? value : "";

    return (
      <RadioGroup
        className="mt-5 gap-3"
        value={selectedValue}
        onValueChange={(nextValue) => {
          updateAnswer(question.id, nextValue);
        }}
      >
        {question.options.map((option) => {
          const itemId = `${question.id}-${option.value}`;
          return (
            <Label
              key={option.value}
              htmlFor={itemId}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/40"
            >
              <RadioGroupItem id={itemId} value={option.value} className="mt-0.5" />
              <span className="flex flex-col">
                <span className="font-medium text-foreground">{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                ) : null}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    );
  }

  function renderMultiSelect(question: MultiSelectQuestion, value: QuizAnswerValue | undefined) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const itemId = `${question.id}-${option.value}`;
          const isSelected = selectedValues.includes(option.value);

          return (
            <Label
              key={option.value}
              htmlFor={itemId}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/40"
            >
              <Checkbox
                id={itemId}
                checked={isSelected}
                onCheckedChange={() => {
                  const nextValues = toggleMultiValue(selectedValues, question, option.value);
                  updateAnswer(question.id, nextValues);
                }}
                className="mt-0.5"
              />
              <span className="flex flex-col">
                <span className="font-medium text-foreground">{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                ) : null}
              </span>
            </Label>
          );
        })}
      </div>
    );
  }

  function renderOptionTile(option: QuizOption) {
    return (
      <span className="flex flex-col items-center gap-1 text-center">
        {option.icon ? <span className="text-2xl leading-none">{option.icon}</span> : null}
        <span className="text-sm font-semibold">{option.label}</span>
        {option.description ? (
          <span className="text-xs font-normal text-muted-foreground">{option.description}</span>
        ) : null}
      </span>
    );
  }

  function renderIconSelect(question: IconSelectQuestion, value: QuizAnswerValue | undefined) {
    const selected = question.multiple
      ? Array.isArray(value)
        ? value
        : []
      : typeof value === "string"
        ? value
        : "";

    if (question.multiple) {
      const selectedValues = Array.isArray(selected) ? selected : [];

      return (
        <ToggleGroup
          type="multiple"
          className="mt-5 grid w-full grid-cols-2 gap-3 md:grid-cols-3"
          value={selectedValues}
          onValueChange={(nextValues) => {
            updateAnswer(question.id, nextValues);
          }}
        >
          {question.options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              variant="outline"
              className="h-auto w-full rounded-lg border p-3 data-[state=on]:border-primary data-[state=on]:bg-primary/10"
            >
              {renderOptionTile(option)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      );
    }

    const selectedValue = typeof selected === "string" ? selected : "";

    return (
      <ToggleGroup
        type="single"
        className="mt-5 grid w-full grid-cols-2 gap-3 md:grid-cols-3"
        value={selectedValue}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }
          updateAnswer(question.id, nextValue);
        }}
      >
        {question.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            variant="outline"
            className="h-auto w-full rounded-lg border p-3 data-[state=on]:border-primary data-[state=on]:bg-primary/10"
          >
            {renderOptionTile(option)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }

  function renderGallerySelect(question: GallerySelectQuestion, value: QuizAnswerValue | undefined) {
    if (question.multiple) {
      const selectedValues = Array.isArray(value) ? value : [];

      return (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <Card key={option.value} className={optionCardClass(isSelected)}>
                <CardContent className="p-0">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-full w-full justify-start whitespace-normal rounded-lg px-4 py-4 text-left"
                    onClick={() => {
                      const nextValues = toggleMultiValue(selectedValues, question, option.value);
                      updateAnswer(question.id, nextValues);
                    }}
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-2xl leading-none">{option.icon ?? "•"}</span>
                      <span className="flex flex-col">
                        <span className="font-semibold">{option.label}</span>
                        {option.description ? (
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        ) : null}
                      </span>
                    </span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    const selectedValue = typeof value === "string" ? value : "";

    return (
      <RadioGroup
        className="mt-5 grid gap-3 sm:grid-cols-2"
        value={selectedValue}
        onValueChange={(nextValue) => {
          updateAnswer(question.id, nextValue);
        }}
      >
        {question.options.map((option) => {
          const itemId = `${question.id}-${option.value}`;
          return (
            <Label key={option.value} htmlFor={itemId}>
              <Card className={optionCardClass(selectedValue === option.value)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem id={itemId} value={option.value} className="mt-1" />
                    <span className="flex flex-col">
                      <span className="text-2xl leading-none">{option.icon ?? "•"}</span>
                      <span className="mt-1 font-semibold">{option.label}</span>
                      {option.description ? (
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      ) : null}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    );
  }

  function renderSlider(question: SliderQuestion, value: QuizAnswerValue | undefined) {
    const fallback = Number(((question.min + question.max) / 2).toFixed(1));
    const currentSliderValue = typeof value === "number" ? value : fallback;

    return (
      <div className="mt-5 space-y-3">
        <p className="text-sm font-semibold text-primary">
          {currentSliderValue}
          {question.unit ? ` ${question.unit}` : ""}
        </p>
        <Slider
          min={question.min}
          max={question.max}
          step={question.step}
          value={[currentSliderValue]}
          onValueChange={(next) => {
            const nextValue = next[0];
            if (typeof nextValue === "number") {
              updateAnswer(question.id, nextValue);
            }
          }}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{question.minLabel ?? question.min}</span>
          <span>{question.maxLabel ?? question.max}</span>
        </div>
      </div>
    );
  }

  function renderMetricNumberFields(question: NumberInputQuestion, value: QuizAnswerValue | undefined) {
    const isAgeQuestion = question.id === "age";
    const isSingle = question.fields.length === 1;

    return (
      <div className="mt-5 grid gap-3">
        {question.fields.map((field) => {
          const rawValue =
            isSingle
              ? typeof value === "number"
                ? value
                : ""
              : value && typeof value === "object" && !Array.isArray(value)
                ? value[field.key]
                : "";

          const draftValue = getDraftValue(question.id, field.key);
          const inputValue = draftValue ?? (typeof rawValue === "number" ? String(rawValue) : "");
          const fieldError = getFieldError(question.id, field.key);

          if (isAgeQuestion && field.key === "age") {
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`${question.id}-${field.key}`}>{field.label}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleAgeNudge(-1)}
                    aria-label="Decrease age"
                  >
                    <Minus />
                  </Button>
                  <Input
                    id={`${question.id}-${field.key}`}
                    inputMode="numeric"
                    placeholder={field.placeholder}
                    value={inputValue}
                    onChange={(event) => {
                      setDraftValue(question.id, field.key, event.target.value);
                    }}
                    onBlur={(event) => {
                      commitNumberField(question, field, event.target.value);
                    }}
                    aria-invalid={fieldError ? "true" : "false"}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleAgeNudge(1)}
                    aria-label="Increase age"
                  >
                    <Plus />
                  </Button>
                </div>
                {fieldError ? <p className="text-xs font-medium text-red-700">{fieldError}</p> : null}
              </div>
            );
          }

          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`${question.id}-${field.key}`}>
                {field.label}
                {field.unit ? ` (${field.unit})` : ""}
              </Label>
              <Input
                id={`${question.id}-${field.key}`}
                type="number"
                inputMode="decimal"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                placeholder={field.placeholder}
                value={inputValue}
                onChange={(event) => {
                  setDraftValue(question.id, field.key, event.target.value);
                  clearFieldError(question.id, field.key);
                }}
                onBlur={(event) => {
                  commitNumberField(question, field, event.target.value);
                }}
                aria-invalid={fieldError ? "true" : "false"}
              />
              {fieldError ? <p className="text-xs font-medium text-red-700">{fieldError}</p> : null}
            </div>
          );
        })}

        {bmi ? <p className="text-sm font-semibold text-primary">Estimated BMI: {bmi.toFixed(1)}</p> : null}
      </div>
    );
  }

  function renderBodyMetricQuestion(question: NumberInputQuestion) {
    const rawBodyMetrics =
      currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)
        ? currentValue
        : { heightCm: "", weightKg: "" };

    const heightField = question.fields.find((field) => field.key === "heightCm");
    const weightField = question.fields.find((field) => field.key === "weightKg");

    if (!heightField || !weightField) {
      return renderMetricNumberFields(question, currentValue);
    }

    const feetOptions = [4, 5, 6, 7];
    const inchesOptions = Array.from({ length: 12 }, (_, value) => value);

    const weightLbsError = getFieldError("bodyMetrics", "weightLbs");

    return (
      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label>Units</Label>
          <ToggleGroup
            type="single"
            value={bodyMetricsUnit}
            onValueChange={(nextValue) => {
              if (nextValue === "imperial" || nextValue === "metric") {
                handleBodyMetricUnitChange(nextValue);
              }
            }}
          >
            <ToggleGroupItem value="imperial" variant="outline">
              Imperial (ft/in, lbs)
            </ToggleGroupItem>
            <ToggleGroupItem value="metric" variant="outline">
              Metric (cm, kg)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {bodyMetricsUnit === "imperial" ? (
          <div className="grid gap-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height-feet">Height (feet)</Label>
                <Select
                  value={imperialDraft.feet}
                  onValueChange={(nextFeet) => {
                    setImperialDraft((previous) => ({ ...previous, feet: nextFeet }));
                    commitImperialHeight(nextFeet, imperialDraft.inches);
                  }}
                >
                  <SelectTrigger id="height-feet" className="w-full">
                    <SelectValue placeholder="Feet" />
                  </SelectTrigger>
                  <SelectContent>
                    {feetOptions.map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value} ft
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height-inches">Height (inches)</Label>
                <Select
                  value={imperialDraft.inches}
                  onValueChange={(nextInches) => {
                    setImperialDraft((previous) => ({ ...previous, inches: nextInches }));
                    commitImperialHeight(imperialDraft.feet, nextInches);
                  }}
                >
                  <SelectTrigger id="height-inches" className="w-full">
                    <SelectValue placeholder="Inches" />
                  </SelectTrigger>
                  <SelectContent>
                    {inchesOptions.map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value} in
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight-lbs">Weight (lbs)</Label>
              <Input
                id="weight-lbs"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 180"
                value={imperialDraft.weightLbs}
                onChange={(event) => {
                  setImperialDraft((previous) => ({
                    ...previous,
                    weightLbs: event.target.value
                  }));
                  clearFieldError("bodyMetrics", "weightLbs");
                }}
                onBlur={(event) => {
                  const trimmed = event.target.value.trim();
                  if (!trimmed) {
                    setBodyMetricAnswer({ weightKg: "" });
                    setFieldError("bodyMetrics", "weightLbs", "Weight is required.");
                    return;
                  }

                  const parsed = Number(trimmed);
                  if (!Number.isFinite(parsed)) {
                    setFieldError("bodyMetrics", "weightLbs", "Enter a valid weight.");
                    return;
                  }

                  const minLbs = roundToStep(kgToLbs(weightField.min), 0.1);
                  const maxLbs = roundToStep(kgToLbs(weightField.max), 0.1);
                  let normalizedLbs = parsed;
                  let message = "";

                  if (parsed < minLbs) {
                    normalizedLbs = minLbs;
                    message = `Adjusted to minimum ${minLbs} lbs.`;
                  } else if (parsed > maxLbs) {
                    normalizedLbs = maxLbs;
                    message = `Adjusted to maximum ${maxLbs} lbs.`;
                  }

                  normalizedLbs = roundToStep(normalizedLbs, 0.1);
                  const normalizedKg = roundToStep(
                    clampValue(lbsToKg(normalizedLbs), weightField.min, weightField.max),
                    weightField.step ?? 0.1
                  );

                  setImperialDraft((previous) => ({
                    ...previous,
                    weightLbs: String(normalizedLbs)
                  }));
                  setBodyMetricAnswer({ weightKg: normalizedKg });

                  if (message) {
                    setFieldError("bodyMetrics", "weightLbs", message);
                    return;
                  }

                  clearFieldError("bodyMetrics", "weightLbs");
                }}
                aria-invalid={weightLbsError ? "true" : "false"}
              />
              {weightLbsError ? <p className="text-xs font-medium text-red-700">{weightLbsError}</p> : null}
            </div>

            <p className="text-xs text-muted-foreground">
              Stored internally as metric: {typeof rawBodyMetrics.heightCm === "number" ? `${rawBodyMetrics.heightCm.toFixed(1)} cm` : "--"}
              {" / "}
              {typeof rawBodyMetrics.weightKg === "number" ? `${rawBodyMetrics.weightKg.toFixed(1)} kg` : "--"}
            </p>
          </div>
        ) : (
          renderMetricNumberFields(question, currentValue)
        )}

        {bmi ? <p className="text-sm font-semibold text-primary">Estimated BMI: {bmi.toFixed(1)}</p> : null}
      </div>
    );
  }

  function renderNumberInputs(question: NumberInputQuestion, value: QuizAnswerValue | undefined) {
    if (question.id === "bodyMetrics") {
      return renderBodyMetricQuestion(question);
    }

    return renderMetricNumberFields(question, value);
  }

  function renderTextInput(question: TextInputQuestion, value: QuizAnswerValue | undefined) {
    const textValue = typeof value === "string" ? value : "";

    if (question.multiline) {
      return (
        <div className="mt-5 space-y-2">
          <Textarea
            value={textValue}
            maxLength={question.maxLength}
            placeholder={question.placeholder}
            onChange={(event) => {
              updateAnswer(question.id, event.target.value);
            }}
            rows={6}
          />
          {question.maxLength ? (
            <p className="text-xs text-muted-foreground">
              {textValue.length}/{question.maxLength}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="mt-5 space-y-2">
        <Input
          value={textValue}
          maxLength={question.maxLength}
          placeholder={question.placeholder}
          onChange={(event) => {
            updateAnswer(question.id, event.target.value);
          }}
        />
        {question.maxLength ? (
          <p className="text-xs text-muted-foreground">
            {textValue.length}/{question.maxLength}
          </p>
        ) : null}
      </div>
    );
  }

  if (result) {
    return (
      <QuizResult
        result={result}
        shareUrl={shareUrl}
        isModeSwitching={isSubmitting}
        onModeChange={handleModeChange}
        onRetake={handleRetake}
        showAdvancedCta
      />
    );
  }

  return (
    <section className="mt-6 space-y-4" aria-live="polite">
      <Progress
        value={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPercent)}
      />

      <p className="text-sm text-muted-foreground">
        TRT question {currentQuestionIndex + 1} of {healthspanQuizQuestions.length}
      </p>

      <Card key={currentQuestion.id} className="border-border bg-card">
        <CardContent className="space-y-1 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{currentQuestion.title}</h2>
          {currentQuestion.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{currentQuestion.description}</p>
          ) : null}

          {renderQuestionCitations(currentQuestion)}

          {currentQuestion.type === "single-select"
            ? renderSingleSelect(currentQuestion, currentValue)
            : null}

          {currentQuestion.type === "multi-select"
            ? renderMultiSelect(currentQuestion, currentValue)
            : null}

          {currentQuestion.type === "icon-select"
            ? renderIconSelect(currentQuestion, currentValue)
            : null}

          {currentQuestion.type === "gallery-select"
            ? renderGallerySelect(currentQuestion, currentValue)
            : null}

          {currentQuestion.type === "slider" ? renderSlider(currentQuestion, currentValue) : null}

          {currentQuestion.type === "number-input"
            ? renderNumberInputs(currentQuestion, currentValue)
            : null}

          {currentQuestion.type === "text-input"
            ? renderTextInput(currentQuestion, currentValue)
            : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance || isSubmitting}
        >
          {isSubmitting
            ? "Analyzing..."
            : currentQuestionIndex === healthspanQuizQuestions.length - 1
              ? "See My TRT Plan"
              : "Continue"}
        </Button>
      </div>

      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
    </section>
  );
}
