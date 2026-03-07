import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Option = {
  title: string;
  category: string;
  summary: string;
  fertility: string;
  route: string;
  caveat: string;
  href: string;
};

const pathways: Option[] = [
  {
    title: "Maximus-style enclomiphene programs",
    category: "SERM / fertility-aware",
    summary:
      "Telemed pathway often used by men who want to stimulate endogenous signaling before exogenous testosterone.",
    fertility: "Commonly positioned as fertility-preserving for selected patients",
    route: "Oral capsules",
    caveat:
      "Response variability is real. Requires clinician oversight and follow-up labs.",
    href: "/quiz/healthspan/advanced"
  },
  {
    title: "Needle-free topical testosterone clinics",
    category: "Exogenous testosterone",
    summary:
      "Gel/cream pathways for men avoiding injections but still choosing testosterone replacement.",
    fertility: "May suppress fertility; discuss preservation planning upfront",
    route: "Topical",
    caveat:
      "Transfer risk and dose consistency require strict protocol compliance.",
    href: "/start-here"
  },
  {
    title: "Oral testosterone providers",
    category: "Exogenous testosterone",
    summary:
      "Needle-free TRT option with fast symptom response for some men.",
    fertility: "Typically similar suppression concerns to other TRT forms",
    route: "Oral",
    caveat:
      "Lipid/liver and broader safety monitoring must be part of the plan.",
    href: "/about"
  }
];

const stack = [
  {
    name: "Creatine monohydrate",
    why: "Supports strength progression and lean mass retention during natural optimization phases.",
    href: "/start-here"
  },
  {
    name: "Magnesium glycinate",
    why: "Useful for sleep quality support when bedtime routine and caffeine timing are dialed.",
    href: "/start-here"
  },
  {
    name: "Omega-3",
    why: "May support cardiometabolic markers while body-composition and diet protocols are running.",
    href: "/start-here"
  }
];

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Compare fertility-preserving and needle-free testosterone pathways, telemed options, and practical stack recommendations.",
  alternates: {
    canonical: "/resources"
  }
};

export default function ResourcesPage() {
  return (
    <>
      <h1 className="page-title">Resource Stack: Natural First, Then Smart Escalation</h1>
      <p className="page-subtitle">
        Start with behavior + biomarkers. If you still need a bigger hormonal push, use this page to
        compare fertility-aware options, oral/topical TRT pathways, and practical support tools.
      </p>

      <DisclosureNotice variant="both" title="Medical + FTC Notice" />

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Telemed and therapy pathways</h2>
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
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Fertility:</strong> {option.fertility}
                </p>
                <p>
                  <strong className="text-foreground">Route:</strong> {option.route}
                </p>
                <p>
                  <strong className="text-foreground">Watchout:</strong> {option.caveat}
                </p>
                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link href={option.href} rel="sponsored noopener noreferrer" target="_blank">
                    Compare pathway
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Core support stack</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {stack.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription>{item.why}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="px-0">
                  <Link href={item.href} rel="sponsored noopener noreferrer" target="_blank">
                    Explore guidance →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Next step: AI-personalized protocol</h2>
        <p className="mt-2 text-muted-foreground">
          Don’t guess. Run the advanced quiz, get your AI action plan, then decide if lifestyle,
          enclomiphene-style support, or needle-free TRT deserves a clinician conversation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quiz/healthspan/advanced">Run Advanced Quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/start-here">Start 7-Day Protocol</Link>
          </Button>
        </div>
      </section>

      <NewsletterCTA
        title="Get weekly Shot-Free TRT updates"
        description="Every week: one actionable protocol, one lab lens, one smart escalation insight."
        buttonLabel="Join the weekly brief"
        formId="resources-newsletter-email"
      />
    </>
  );
}
