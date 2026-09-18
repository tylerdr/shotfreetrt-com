import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: "1",
    title: "Take the free decision quiz",
    text: "Six quick questions about your situation, testing stage, fertility priorities, delivery preference, cost clarity, and timing. Get a personalized checklist and reading list in about 2 minutes.",
    href: "/quiz/healthspan",
    cta: "Take the quiz"
  },
  {
    step: "2",
    title: "Prepare for your appointment",
    text: "Use the same written appointment checklist and a two-quote cost calculator before you talk to a clinician or clinic.",
    href: "/decision-guide",
    cta: "Open the decision guide"
  },
  {
    step: "3",
    title: "See what clinics actually charge",
    text: "Compare dated, sourced provider price examples with billing periods, commitments, and exclusions spelled out.",
    href: "/pricing",
    cta: "Compare published prices"
  },
  {
    step: "4",
    title: "Read the specific question you have",
    text: "Browse the article library for symptoms, labs, delivery routes, side effects, and monitoring.",
    href: "/blog",
    cta: "Browse articles"
  }
];

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "New to ShotFreeTRT? Take the free decision quiz, prepare for your appointment, compare published prices, and find the right article for your question.",
  alternates: {
    canonical: "/start-here"
  }
};

export default function StartHerePage() {
  return (
    <>
      <h1 className="page-title">Start Here</h1>
      <p className="page-subtitle">
        New here? These four steps get you to a useful next action fast. None
        of them require an account, a lab upload, or a health disclosure.
      </p>

      <DisclosureNotice variant="medical" title="Medical Disclaimer" />

      <figure className="mt-6 overflow-hidden rounded-xl border border-border">
        <EditorialImageFrame
          src="/media/sft-web-batch3-02.webp"
          width={960}
          height={640}
          sizes="(min-width: 768px) 700px, 100vw"
        />
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Understanding what a testosterone test actually reports.</figcaption>
      </figure>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {steps.map((item) => (
          <Card key={item.step}>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Step {item.step}
              </p>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">{item.text}</p>
              <Button asChild variant="outline">
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Foundations while you investigate</h2>
        <p className="mt-2 text-muted-foreground">
          Sleep, training, and body composition affect symptoms and lab
          interpretation. See{" "}
          <Link href="/blog/testosterone-and-energy">testosterone and energy</Link>{" "}
          and{" "}
          <Link href="/blog/strength-training-after-40-longevity">
            strength training after 40
          </Link>{" "}
          on ShotFreeTRT. For broader healthspan foundations beyond
          testosterone specifically, AliveLongevity&apos;s{" "}
          <a href="https://alivelongevity.com/protocol" rel="noreferrer">
            minimum-effective longevity protocol
          </a>{" "}
          is related reading from another site in our network. It is not a
          ShotFreeTRT clinical recommendation.
        </p>
      </section>

      <NewsletterCTA />
    </>
  );
}
