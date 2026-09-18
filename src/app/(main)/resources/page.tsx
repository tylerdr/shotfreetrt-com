import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Pathway = {
  title: string;
  category: string;
  summary: string;
  href: string;
};

const pathways: Pathway[] = [
  {
    title: "Enclomiphene / SERM discussion",
    category: "Fertility-aware",
    summary:
      "A route some men discuss with a clinician when preserving fertility is a near-term goal.",
    href: "/blog/enclomiphene-vs-trt"
  },
  {
    title: "Oral or topical TRT",
    category: "Needle-free exogenous testosterone",
    summary:
      "Still replacement testosterone. Compare absorption, transfer risk, and monitoring against injections.",
    href: "/blog/testosterone-gel-vs-injections"
  },
  {
    title: "Other TRT alternatives",
    category: "Broader comparison",
    summary: "A wider look at options beyond a single delivery route.",
    href: "/blog/trt-alternatives"
  }
];

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Compare TRT pathways, understand what clinic quotes actually include, and get a personalized decision brief.",
  alternates: {
    canonical: "/resources"
  }
};

export default function ResourcesPage() {
  return (
    <>
      <h1 className="page-title">Resources: Compare Pathways, Then Decide</h1>
      <p className="page-subtitle">
        These are educational starting points, not a ranking or an
        endorsement. Confirm every clinical and pricing detail directly with
        a provider or clinician.
      </p>

      <DisclosureNotice variant="medical" title="Medical Notice" />

      <figure className="mt-8 overflow-hidden rounded-xl border border-border">
        <EditorialImageFrame
          src="/media/sft-web-batch3-07.webp"
          width={960}
          height={640}
          sizes="(min-width: 768px) 700px, 100vw"
        />
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Weighing the evidence behind each pathway before you compare providers.</figcaption>
      </figure>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Compare pathways</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {pathways.map((option) => (
            <Card key={option.title} className="h-full">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {option.category}
                </p>
                <CardTitle className="text-lg leading-snug">{option.title}</CardTitle>
                <CardDescription>{option.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={option.href}>Read the comparison</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Get your numbers right</h2>
        <p className="mt-2 text-muted-foreground">
          See <Link href="/pricing">dated provider price examples</Link> on
          ShotFreeTRT, or read PeakedLabs&apos; (another site in our network){" "}
          <a href="https://peakedlabs.com/blog/how-much-does-trt-cost" rel="noreferrer">
            TRT cost and hidden-fee breakdown
          </a>{" "}
          for a second look at what clinics typically charge.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Not sure which lane applies to you?</h2>
        <p className="mt-2 text-muted-foreground">
          Take the free decision quiz for a personalized checklist and
          reading list based on your situation, testing stage, fertility
          priorities, delivery preference, cost clarity, and timing. It is
          not a diagnosis or a treatment recommendation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quiz/healthspan">Take the decision quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/decision-guide">Open the decision guide</Link>
          </Button>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
