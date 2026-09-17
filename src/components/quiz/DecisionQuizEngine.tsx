"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  buildDecisionBrief,
  isQuizComplete,
  QUIZ_QUESTIONS,
  type QuestionId,
  type QuizAnswers
} from "@/lib/quiz/decision-quiz";

// Answers live only in this component's state. They are never sent to a
// server, saved to localStorage/sessionStorage, or included in any
// analytics event. Refreshing the page clears everything.
export function DecisionQuizEngine() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[stepIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isLastQuestion = stepIndex === totalQuestions - 1;

  const brief = useMemo(() => buildDecisionBrief(answers), [answers]);

  function selectAnswer(questionId: QuestionId, optionId: string) {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  }

  function goBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    if (isLastQuestion) {
      if (isQuizComplete(answers)) {
        setShowResult(true);
      }
      return;
    }
    setStepIndex((index) => Math.min(totalQuestions - 1, index + 1));
  }

  function editAnswers() {
    setShowResult(false);
    setStepIndex(0);
  }

  function startOver() {
    setAnswers({});
    setStepIndex(0);
    setShowResult(false);
  }

  if (showResult && brief) {
    return (
      <section aria-labelledby="brief-heading" className="space-y-6">
        <div className="print:hidden">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Your TRT Decision Brief
          </p>
        </div>
        <h2 id="brief-heading" className="text-3xl font-bold">
          Your TRT Decision Brief
        </h2>
        <p className="text-sm text-muted-foreground">
          Built only from your answers below. This is not a diagnosis, an
          eligibility score, or a treatment recommendation.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your situation, in your own answers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              {brief.situationSummary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Questions to ask, in this order</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-3 pl-5">
              {brief.prioritizedQuestions.map((item) => (
                <li key={item.question}>
                  <p>{item.question}</p>
                  {item.reason ? (
                    <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Read next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brief.readingPaths.map((path) => (
              <div key={path.href}>
                <Link href={path.href} className="font-medium underline">
                  {path.title}
                </Link>
                <p className="text-sm text-muted-foreground">{path.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Button asChild size="lg">
            <Link href={brief.primaryAction.href}>{brief.primaryAction.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={brief.secondaryAction.href}>{brief.secondaryAction.label}</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Button type="button" variant="outline" onClick={() => window.print()}>
            Print or save as PDF
          </Button>
          <Button type="button" variant="ghost" onClick={editAnswers}>
            Edit my answers
          </Button>
          <Button type="button" variant="ghost" onClick={startOver}>
            Start over
          </Button>
        </div>

        <p className="text-sm text-muted-foreground print:hidden">
          Nothing you entered was sent anywhere. Refreshing this page clears it.
        </p>
      </section>
    );
  }

  if (!currentQuestion) return null;

  return (
    <section aria-labelledby="quiz-heading" className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span id="quiz-heading">
            Question {stepIndex + 1} of {totalQuestions}
          </span>
        </div>
        <Progress value={((stepIndex + 1) / totalQuestions) * 100} aria-hidden="true" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentQuestion.helpText}</p>
        </CardHeader>
        <CardContent>
          <fieldset>
            <legend className="sr-only">{currentQuestion.title}</legend>
            <RadioGroup
              value={currentAnswer ?? ""}
              onValueChange={(value) => selectAnswer(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50"
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`${currentQuestion.id}-${option.id}`}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`${currentQuestion.id}-${option.id}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          Back
        </Button>
        <Button type="button" onClick={goNext} disabled={!currentAnswer}>
          {isLastQuestion ? "See my decision brief" : "Next"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        No symptoms, lab values, or health details are collected. Your answers stay on this
        page and are never sent anywhere.
      </p>
    </section>
  );
}
