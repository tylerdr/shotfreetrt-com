"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { QuizResult } from "@/components/quiz/QuizResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getAdvancedQuestions } from "@/lib/quiz/healthspan-advanced-config";
import {
  getInitialQuestionValue,
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
  ADVANCED_ANSWERS_STORAGE_KEY,
  INTRO_ANSWERS_STORAGE_KEY,
  readStoredAnswers,
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

function estimateOneRepMax(weightKg: number, reps: number) {
  return weightKg * (1 + reps / 30);
}

export function AdvancedQuizEngine() {
  const [introAnswers, setIntroAnswers] = useState<QuizAnswers | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mode, setMode] = useState<QuizMode>("serious");
  const [result, setResult] = useState<HealthspanResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingIntro, setIsLoadingIntro] = useState(true);
  const [numberDrafts, setNumberDrafts] = useState<NumberDraftState>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrorState>({});

  useEffect(() => {
    const storedIntroAnswers = readStoredAnswers(INTRO_ANSWERS_STORAGE_KEY);
    const storedAdvancedAnswers = readStoredAnswers(ADVANCED_ANSWERS_STORAGE_KEY);

    setIntroAnswers(storedIntroAnswers);
    if (storedAdvancedAnswers) {
      setAnswers(storedAdvancedAnswers);
    }
    setIsLoadingIntro(false);
  }, []);

  const questions = useMemo(() => {
    if (!introAnswers) {
      return [];
    }

    return getAdvancedQuestions(introAnswers, answers);
  }, [answers, introAnswers]);

  useEffect(() => {
    if (currentQuestionIndex <= questions.length - 1) {
      return;
    }

    setCurrentQuestionIndex(Math.max(0, questions.length - 1));
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    writeStoredAnswers(ADVANCED_ANSWERS_STORAGE_KEY, answers);
  }, [answers]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentValue = currentQuestion ? getQuestionValue(answers, currentQuestion) : undefined;

  const hasCurrentQuestionErrors = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }

    return Object.entries(fieldErrors).some(
      ([key, message]) => key.startsWith(`${currentQuestion.id}:`) && message.trim().length > 0
    );
  }, [currentQuestion, fieldErrors]);

  const canAdvance =
    currentQuestion && isQuestionAnswered(currentQuestion, currentValue) && !hasCurrentQuestionErrors;

  const progressPercent =
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

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

  function updateNumberField(
    question: NumberInputQuestion,
    currentValueForQuestion: QuizAnswerValue | undefined,
    fieldKey: string,
    nextValue: number | ""
  ) {
    if (question.fields.length === 1) {
      updateAnswer(question.id, nextValue);
      return;
    }

    const currentFields =
      currentValueForQuestion &&
      typeof currentValueForQuestion === "object" &&
      !Array.isArray(currentValueForQuestion)
        ? currentValueForQuestion
        : {};

    updateAnswer(question.id, {
      ...currentFields,
      [fieldKey]: nextValue
    });
  }

  function commitNumberField(
    question: NumberInputQuestion,
    currentValueForQuestion: QuizAnswerValue | undefined,
    field: NumberInputField,
    rawInput: string
  ) {
    const stateKey = makeFieldStateKey(question.id, field.key);
    const trimmed = rawInput.trim();

    if (!trimmed) {
      updateNumberField(question, currentValueForQuestion, field.key, "");
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

    updateNumberField(question, currentValueForQuestion, field.key, normalized);
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

  async function requestResult(targetMode: QuizMode) {
    if (!introAnswers) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/quiz/healthspan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers,
          introAnswers,
          mode: targetMode,
          assessmentType: "advanced"
        })
      });

      const payload = (await response.json()) as QuizApiResponse;

      if (!response.ok || !payload.result) {
        throw new Error(payload.error ?? "Unable to generate your advanced result right now.");
      }

      const normalizedResult = {
        ...payload.result,
        mode: targetMode
      };

      setMode(targetMode);
      setResult(normalizedResult);
      writeStoredResult(normalizedResult);

      const shareId = encodeHealthspanSharePayload({ v: 1, result: normalizedResult });
      setShareUrl(`${window.location.origin}/quiz/healthspan/result/${shareId}`);
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("Unable to generate your advanced result right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetake() {
    setResult(null);
    setCurrentQuestionIndex(0);
  }

  function handleModeChange(nextMode: QuizMode) {
    requestResult(nextMode);
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

  function renderNumberInputs(question: NumberInputQuestion, value: QuizAnswerValue | undefined) {
    const isSingle = question.fields.length === 1;

    let oneRepMaxPreview: string | null = null;
    if (
      (question.id === "squatPerformance" ||
        question.id === "benchPerformance" ||
        question.id === "deadliftPerformance") &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const weight = typeof value.weightKg === "number" ? value.weightKg : null;
      const reps = typeof value.reps === "number" ? value.reps : null;

      if (weight !== null && reps !== null && reps > 0) {
        oneRepMaxPreview = `${estimateOneRepMax(weight, reps).toFixed(1)} kg`;
      }
    }

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
                  commitNumberField(question, value, field, event.target.value);
                }}
                aria-invalid={fieldError ? "true" : "false"}
              />
              {fieldError ? <p className="text-xs font-medium text-red-700">{fieldError}</p> : null}
            </div>
          );
        })}

        {oneRepMaxPreview ? (
          <p className="text-sm font-semibold text-primary">Estimated 1RM: {oneRepMaxPreview}</p>
        ) : null}
      </div>
    );
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
      />
    );
  }

  if (isLoadingIntro) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-sm text-muted-foreground">Loading intro quiz context...</CardContent>
      </Card>
    );
  }

  if (!introAnswers) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Intro quiz required first</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The advanced TRT assessment uses your intro answers for branching, so complete the intro quiz first.
          </p>
          <Button asChild>
            <Link href="/quiz/healthspan">Take Intro TRT Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Advanced questions unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We could not generate a valid advanced question set from your intro answers.
          </p>
        </CardContent>
      </Card>
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
        Advanced TRT question {currentQuestionIndex + 1} of {questions.length}
      </p>

      <Card key={currentQuestion.id} className="border-border bg-card">
        <CardContent className="space-y-1 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{currentQuestion.title}</h2>
          {currentQuestion.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{currentQuestion.description}</p>
          ) : null}

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
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex((previous) => previous - 1);
            }
          }}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (!canAdvance || isSubmitting) {
              return;
            }

            const isFinalQuestion = currentQuestionIndex === questions.length - 1;
            if (isFinalQuestion) {
              requestResult(mode);
              return;
            }

            setCurrentQuestionIndex((previous) => previous + 1);
          }}
          disabled={!canAdvance || isSubmitting}
        >
          {isSubmitting
            ? "Analyzing..."
            : currentQuestionIndex === questions.length - 1
              ? "See Advanced TRT Plan"
              : "Continue"}
        </Button>
      </div>

      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
    </section>
  );
}
