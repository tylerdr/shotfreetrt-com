"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { BuyButton } from "@/components/BuyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HealthspanResult, QuizMode } from "@/lib/quiz/healthspan-types";

type QuizResultProps = {
  result: HealthspanResult;
  shareUrl: string;
  isModeSwitching?: boolean;
  onModeChange?: (mode: QuizMode) => void;
  onRetake?: () => void;
  showTakeQuizCta?: boolean;
  showAdvancedCta?: boolean;
};

export function QuizResult({
  result,
  shareUrl,
  isModeSwitching = false,
  onModeChange,
  onRetake,
  showTakeQuizCta = false,
  showAdvancedCta = false
}: QuizResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, Math.round(result.score)));
    const duration = 900;
    const startTime = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(target * progress));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [result.score]);

  const gradeClass = useMemo(() => {
    if (result.grade === "A+" || result.grade === "A") {
      return "bg-emerald-100 text-emerald-900";
    }

    if (result.grade === "B" || result.grade === "C") {
      return "bg-sky-100 text-sky-900";
    }

    return "bg-rose-100 text-rose-900";
  }, [result.grade]);

  async function handleShare() {
    const title = `My Healthspan Score: ${Math.round(result.projectedHealthspan)} years`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "See my healthspan result and take the quiz.",
          url: shareUrl
        });
        setShareMessage("Shared successfully.");
        return;
      } catch {
        // Fallback to clipboard copy when native share is dismissed or unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Share link copied.");
    } catch {
      setShareMessage("Unable to copy link. Please copy from the address bar.");
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError(true);
      setEmailMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmittingEmail(true);
    setEmailMessage("");
    setEmailError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setEmailError(true);
        setEmailMessage(payload.message ?? "Unable to save your email right now.");
        return;
      }

      setEmail("");
      setEmailMessage(payload.message ?? "Thanks. Your personalized report is on the way.");
    } catch {
      setEmailError(true);
      setEmailMessage("Unable to save your email right now. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  }

  const nextMode: QuizMode = result.mode === "serious" ? "roast" : "serious";

  return (
    <section className="mt-6 grid gap-4" aria-live="polite">
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="space-y-4 p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-800 uppercase">
            Your Healthspan Score
          </p>

          <div className="grid gap-4 md:grid-cols-[auto,1fr] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-700 bg-white text-center text-emerald-950">
              <strong className="text-3xl leading-none">{displayScore}</strong>
              <span className="text-xs">/100</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Projected Healthspan: {Math.round(result.projectedHealthspan)} years
              </h2>
              <p className="text-sm text-muted-foreground">
                Projected lifespan: {Math.round(result.projectedLifespan)} years
              </p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${gradeClass}`}>
                Grade {result.grade}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-emerald-950/90">{result.summary}</p>

          <div className="flex flex-wrap gap-2">
            {onModeChange ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onModeChange(nextMode)}
                disabled={isModeSwitching}
              >
                {isModeSwitching
                  ? "Updating..."
                  : result.mode === "serious"
                    ? "Roast Me"
                    : "Back to Serious"}
              </Button>
            ) : null}

            <Button type="button" variant="outline" onClick={handleShare}>
              Copy Share Link
            </Button>

            {onRetake ? (
              <Button type="button" variant="outline" onClick={onRetake}>
                Edit Answers
              </Button>
            ) : null}

            {showAdvancedCta ? (
              <Button asChild>
                <Link href="/quiz/healthspan/advanced">Take Advanced Assessment</Link>
              </Button>
            ) : null}

            {showTakeQuizCta ? (
              <Button asChild>
                <Link href="/quiz/healthspan">Take the Quiz</Link>
              </Button>
            ) : null}
          </div>

          {shareMessage ? <p className="text-sm font-medium text-emerald-800">{shareMessage}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-lg">Top Helping Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {result.helpingFactors.slice(0, 3).map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/60">
          <CardHeader>
            <CardTitle className="text-lg">Top Hurting Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {result.hurtingFactors.slice(0, 3).map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>5 Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.recommendations.slice(0, 5).map((recommendation) => (
            <Card key={recommendation.title} className="border-muted bg-muted/20">
              <CardContent className="space-y-2 p-4">
                <h4 className="font-semibold">{recommendation.title}</h4>
                <p className="text-sm text-muted-foreground">{recommendation.action}</p>
                <p className="text-sm font-semibold text-emerald-700">
                  Estimated +{recommendation.yearsGained.toFixed(1)} healthy years
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get your full personalized report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email and we will send a longer action plan you can actually follow.
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleEmailSubmit} noValidate>
            <Label htmlFor="quiz-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="quiz-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmittingEmail}
              required
              className="sm:flex-1"
            />
            <Button type="submit" disabled={isSubmittingEmail}>
              {isSubmittingEmail ? "Submitting..." : "Send My Report"}
            </Button>
          </form>
          {emailMessage ? (
            <p className={`mt-2 text-sm font-medium ${emailError ? "text-red-700" : "text-emerald-700"}`}>
              {emailMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Want the complete implementation system?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get the Longevity Blueprint with protocols, checklists, and weekly execution templates.
          </p>
        </CardHeader>
        <CardContent>
          <BuyButton label="Get the Longevity Blueprint - $19" />
        </CardContent>
      </Card>
    </section>
  );
}
