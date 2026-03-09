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

  const priorityClass = useMemo(() => {
    switch (result.priority) {
      case "High":
        return "bg-amber-100 text-amber-950";
      case "Moderate":
        return "bg-sky-100 text-sky-950";
      case "Low":
      default:
        return "bg-emerald-100 text-emerald-950";
    }
  }, [result.priority]);

  async function handleShare() {
    const title = `My TRT path: ${result.primaryPathway.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "See my ShotFreeTRT quiz result and take the TRT-focused assessment.",
          url: shareUrl
        });
        setShareMessage("Shared successfully.");
        return;
      } catch {
        // fall through to clipboard
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
      setEmailMessage(payload.message ?? "Thanks. Your TRT decision report is on the way.");
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
        <CardContent className="space-y-5 p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-800 uppercase">
            Your TRT-focused result
          </p>

          <div className="grid gap-4 md:grid-cols-[auto,1fr] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-700 bg-white text-center text-emerald-950">
              <strong className="text-3xl leading-none">{displayScore}</strong>
              <span className="text-xs">/100</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                {result.primaryPathway.title}
              </h2>
              <p className="text-sm text-muted-foreground">TRT candidacy signal score</p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityClass}`}>
                {result.priority} priority
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-emerald-950/90">{result.summary}</p>

          <div className="rounded-xl border border-emerald-200 bg-white/80 p-4">
            <p className="text-sm font-semibold text-foreground">Primary path</p>
            <p className="mt-1 text-sm text-muted-foreground">{result.primaryPathway.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground">
              {result.primaryPathway.why.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="font-semibold">Watchouts</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {result.primaryPathway.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

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
                <Link href="/quiz/healthspan/advanced">Unlock Advanced Lab Review</Link>
              </Button>
            ) : null}

            {showTakeQuizCta ? (
              <Button asChild>
                <Link href="/quiz/healthspan">Take the TRT Quiz</Link>
              </Button>
            ) : null}
          </div>

          {shareMessage ? <p className="text-sm font-medium text-emerald-800">{shareMessage}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-zinc-200 bg-zinc-50/70">
          <CardHeader>
            <CardTitle className="text-lg">Also worth considering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.secondaryPathways.map((pathway) => (
              <div key={pathway.key} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{pathway.title}</p>
                  <span className="text-xs font-semibold text-muted-foreground">Fit {pathway.fitScore}/100</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{pathway.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-zinc-50/70">
          <CardHeader>
            <CardTitle className="text-lg">Red flags to handle first</CardTitle>
          </CardHeader>
          <CardContent>
            {result.redFlags.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {result.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No giant stop-signs from the quiz, but you still need proper labs and clinician oversight.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-lg">What is helping</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {result.helpingFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/60">
          <CardHeader>
            <CardTitle className="text-lg">What is hurting</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {result.hurtingFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended next moves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.recommendations.map((recommendation) => (
            <Card key={recommendation.title} className="border-muted bg-muted/20">
              <CardContent className="space-y-2 p-4">
                <h4 className="font-semibold">{recommendation.title}</h4>
                <p className="text-sm text-muted-foreground">{recommendation.action}</p>
                <p className="text-sm font-semibold text-emerald-700">{recommendation.impact}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labs to request before locking a plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.labsToRequest.map((lab) => (
              <li key={lab}>{lab}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get your full TRT decision report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email and we will send the longer version with labs, pathway tradeoffs, and a tighter first-step plan.
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
          <CardTitle>Want the implementation playbook?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get the shot-free protocol pack with habit checklists, lab prep notes, and smart-escalation sequencing.
          </p>
        </CardHeader>
        <CardContent>
          <BuyButton label="Get the Shot-Free TRT Protocol Pack — $19" />
        </CardContent>
      </Card>
    </section>
  );
}
