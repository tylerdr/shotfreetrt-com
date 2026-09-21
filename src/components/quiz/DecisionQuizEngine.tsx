"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BriefNextSteps } from "@/components/journeys/BriefNextSteps";
import type { Journey } from "@/lib/journeys";
import { buildDecisionBrief, isQuizComplete, QUIZ_QUESTIONS, type QuestionId, type QuizAnswers } from "@/lib/quiz/decision-quiz";

// Answers remain in component memory. Entry context changes question order,
// never answers, treatment eligibility, or the existing brief's clinical boundaries.
export function DecisionQuizEngine({ journey }: { journey?: Journey }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const headingRef = useRef<HTMLElement>(null);
  const setHeadingRef = (element: HTMLElement | null) => { headingRef.current = element; };
  const questions = useMemo(() => journey ? journey.questionOrder.map((id) => QUIZ_QUESTIONS.find((question) => question.id === id)!) : QUIZ_QUESTIONS, [journey]);
  const totalQuestions = questions.length;
  const currentQuestion = questions[stepIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const validCurrent = currentQuestion?.options.some((option) => option.id === currentAnswer) ?? false;
  const answeredCount = QUIZ_QUESTIONS.filter((question) => question.options.some((option) => option.id === answers[question.id])).length;
  const brief = useMemo(() => buildDecisionBrief(answers), [answers]);
  useEffect(() => { headingRef.current?.focus(); }, [stepIndex, showResult]);

  function selectAnswer(questionId: QuestionId, optionId: string) { setAnswers((previous) => ({ ...previous, [questionId]: optionId })); }
  function goNext() {
    if (!validCurrent) return;
    if (stepIndex === totalQuestions - 1) { if (isQuizComplete(answers)) setShowResult(true); return; }
    setStepIndex((index) => Math.min(totalQuestions - 1, index + 1));
  }
  function startOver() { setAnswers({}); setStepIndex(0); setShowResult(false); }

  if (showResult && brief) return <section aria-labelledby="brief-heading" className="space-y-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-primary print:hidden">Your next conversation, prepared</p>
    <h2 id="brief-heading" ref={setHeadingRef} tabIndex={-1} className="text-3xl font-bold outline-none">Your TRT Decision Brief</h2>
    <p className="text-sm text-muted-foreground">Built from your selected answers. This is not a diagnosis, an eligibility score, or a treatment recommendation.</p>
    <Card className="border-primary/30 print:hidden"><CardHeader><CardTitle className="text-xl">Your next useful step</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Resolve the questions and written costs before committing. No payment or email address is required to use these tools.</p><div className="flex flex-wrap gap-3"><Button asChild size="lg" className="h-auto min-h-12 whitespace-normal text-left"><Link href={brief.primaryAction.href} prefetch={false}>{brief.primaryAction.label}</Link></Button><Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal text-left"><Link href={brief.secondaryAction.href} prefetch={false}>{brief.secondaryAction.label}</Link></Button></div></CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Questions to ask, in this order</CardTitle></CardHeader><CardContent><ol className="list-decimal space-y-4 pl-5">{brief.prioritizedQuestions.map((item) => <li key={item.question}><p className="font-medium">{item.question}</p>{item.reason && <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>}</li>)}</ol></CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Your situation, in your own answers</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-2 pl-5">{brief.situationSummary.map((line) => <li key={line}>{line}</li>)}</ul></CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Read next</CardTitle></CardHeader><CardContent className="space-y-4">{brief.readingPaths.map((path) => <div key={path.href}><Link href={path.href} prefetch={false} className="font-medium underline">{path.title}</Link><p className="text-sm text-muted-foreground">{path.description}</p></div>)}</CardContent></Card>
    <div className="flex flex-wrap gap-3 print:hidden"><Button type="button" variant="outline" onClick={() => window.print()}>Print or save as PDF</Button><Button type="button" variant="ghost" onClick={() => { setShowResult(false); setStepIndex(0); }}>Edit my answers</Button><Button type="button" variant="ghost" onClick={startOver}>Start over</Button></div>
    <BriefNextSteps />
    <p className="text-sm text-muted-foreground print:hidden">Your answers have not been transmitted by this quiz. Refreshing clears the in-memory brief. Printing or saving it is your choice.</p>
  </section>;

  if (!currentQuestion) return null;
  return <section aria-labelledby="quiz-heading" className="space-y-6">
    <div><div className="mb-2 flex items-center justify-between gap-3 text-sm text-muted-foreground"><span id="quiz-heading">Question {stepIndex + 1} of {totalQuestions}</span><span>{answeredCount} answered</span></div><Progress value={(answeredCount / totalQuestions) * 100} aria-label="Questions answered" aria-valuetext={`${answeredCount} of ${totalQuestions} questions answered`} /></div>
    <Card><CardHeader><CardTitle ref={setHeadingRef} tabIndex={-1} className="text-2xl outline-none">{currentQuestion.title}</CardTitle><p className="text-sm text-muted-foreground">{currentQuestion.helpText}</p></CardHeader><CardContent><fieldset><legend className="sr-only">{currentQuestion.title}</legend><RadioGroup value={currentAnswer ?? ""} onValueChange={(value) => selectAnswer(currentQuestion.id, value)}>{currentQuestion.options.map((option) => <div key={option.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${currentAnswer === option.id ? "border-primary bg-primary/10" : "border-border hover:bg-accent/50"}`}><RadioGroupItem value={option.id} id={`${currentQuestion.id}-${option.id}`} /><Label htmlFor={`${currentQuestion.id}-${option.id}`} className="min-h-8 flex-1 cursor-pointer py-1 font-normal leading-relaxed">{option.label}</Label></div>)}</RadioGroup></fieldset></CardContent></Card>
    {stepIndex === 2 && <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">Your answers help organize questions—not select a treatment. You can go back and change any answer before saving your brief.</p>}
    <div className="flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={stepIndex === 0}>Back</Button><Button type="button" onClick={goNext} disabled={!validCurrent}>{stepIndex === totalQuestions - 1 ? "See my decision brief" : "Next"}</Button></div>
    <p className="text-xs leading-relaxed text-muted-foreground">Your answers—including anything about testing, symptoms, or fertility—are held only in this page&apos;s memory. They are never automatically
      sent to a server, saved to a file, or included in analytics. Refreshing clears them. You can choose to print or save your brief at the end.</p>
  </section>;
}
