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
        return "bg-amber-500/15 text-amber-300";
      case "Moderate":
        return "bg-sky-500/15 text-sky-300";
      case "Low":
      default:
        return "bg-blue-500/15 text-blue-300";
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
      <Card className="border-[#1E3A5F] bg-gradient-to-br from-[#0F1530] to-[#0F1F45]">
        <CardContent className="space-y-5 p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
            Your TRT-focused result
          </p>

          <div className="grid gap-4 md:grid-cols-[auto,1fr] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-blue-500 bg-[#0A0F1E] text-center text-blue-200">
              <strong className="text-3xl leading-none">{displayScore}</strong>
              <span className="text-xs">/100</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {result.primaryPathway.title}
              </h2>
              <p className="text-sm text-zinc-400">TRT candidacy signal score</p>
              <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityClass}`}>
                {result.priority} priority
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300">{result.summary}</p>

          <div className="rounded-xl border border-[#1E2A4A] bg-[#0F1530] p-4">
            <p className="text-sm font-semibold text-white">Primary path</p>
            <p className="mt-1 text-sm text-zinc-400">{result.primaryPathway.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {result.primaryPathway.why.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
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
                className="border-zinc-700 text-zinc-300 hover:border-zinc-500"
              >
                {isModeSwitching
                  ? "Updating..."
                  : result.mode === "serious"
                    ? "Roast Me"
                    : "Back to Serious"}
              </Button>
            ) : null}

            <Button type="button" variant="outline" onClick={handleShare} className="border-zinc-700 text-zinc-300 hover:border-zinc-500">
              Copy Share Link
            </Button>

            {onRetake ? (
              <Button type="button" variant="outline" onClick={onRetake} className="border-zinc-700 text-zinc-300 hover:border-zinc-500">
                Edit Answers
              </Button>
            ) : null}

            {showAdvancedCta ? (
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
                <Link href="/quiz/healthspan/advanced">Unlock Advanced Lab Review</Link>
              </Button>
            ) : null}

            {showTakeQuizCta ? (
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
                <Link href="/quiz/healthspan">Take the TRT Quiz</Link>
              </Button>
            ) : null}
          </div>

          {shareMessage ? <p className="text-sm font-medium text-blue-400">{shareMessage}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-[#222230] bg-[#12121A]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Also worth considering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.secondaryPathways.map((pathway) => (
              <div key={pathway.key} className="rounded-lg border border-[#1E2A4A] bg-[#0F1530] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-zinc-200">{pathway.title}</p>
                  <span className="text-xs font-semibold text-zinc-500">Fit {pathway.fitScore}/100</span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{pathway.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#222230] bg-[#12121A]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Red flags to handle first</CardTitle>
          </CardHeader>
          <CardContent>
            {result.redFlags.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
                {result.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">
                No giant stop-signs from the quiz, but you still need proper labs and clinician oversight.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-[#1E2A4A] bg-[#0F1530]">
          <CardHeader>
            <CardTitle className="text-lg text-blue-300">What is helping</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {result.helpingFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-lg text-rose-300">What is hurting</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {result.hurtingFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#222230] bg-[#12121A]">
        <CardHeader>
          <CardTitle className="text-white">Recommended next moves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.recommendations.map((recommendation) => (
            <Card key={recommendation.title} className="border-[#1E2A4A] bg-[#0F1530]">
              <CardContent className="space-y-2 p-4">
                <h4 className="font-semibold text-zinc-200">{recommendation.title}</h4>
                <p className="text-sm text-zinc-400">{recommendation.action}</p>
                <p className="text-sm font-semibold text-blue-400">{recommendation.impact}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[#222230] bg-[#12121A]">
        <CardHeader>
          <CardTitle className="text-white">Labs to request before locking a plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            {result.labsToRequest.map((lab) => (
              <li key={lab}>{lab}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-[#1E2A4A] bg-[#0F1530]">
        <CardHeader>
          <CardTitle className="text-white">Get your full TRT decision report</CardTitle>
          <p className="text-sm text-zinc-400">
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
              className="border-[#1E2A4A] bg-[#0A0F1E] text-[#E0E7FF] sm:flex-1"
            />
            <Button type="submit" disabled={isSubmittingEmail} className="bg-blue-600 text-white hover:bg-blue-500">
              {isSubmittingEmail ? "Submitting..." : "Send My Report"}
            </Button>
          </form>
          {emailMessage ? (
            <p className={`mt-2 text-sm font-medium ${emailError ? "text-red-400" : "text-blue-400"}`}>
              {emailMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-[#222230] bg-[#12121A]">
        <CardHeader>
          <CardTitle className="text-white">Want the implementation playbook?</CardTitle>
          <p className="text-sm text-zinc-400">
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
