import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Dumbbell,
  FlaskConical,
  MoonStar,
  Pill,
  ShieldCheck,
  Syringe
} from "lucide-react";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import GuidePromoBanner from "@/components/GuidePromoBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllArticles, siteUrl } from "@/data/articles";

const pillars = [
  {
    title: "Sleep + Recovery",
    detail: "Circadian timing, apnea risk, late-night stress, and recovery debt before any meds.",
    icon: MoonStar
  },
  {
    title: "Lift + Body Composition",
    detail: "Progressive overload, visceral fat reduction, and training adherence that actually moves labs.",
    icon: Dumbbell
  },
  {
    title: "Labs + Root Causes",
    detail: "Total/free T context, SHBG, LH/FSH, thyroid, insulin resistance, and lifestyle bottlenecks.",
    icon: FlaskConical
  },
  {
    title: "AI Personalization",
    detail: "Quick quiz + AI plan generator to create your highest-leverage 30-day protocol.",
    icon: Brain
  }
];

const modalities = [
  {
    name: "Lifestyle-first (no meds)",
    fertility: "Preserved",
    speed: "Medium",
    profile: "Best first move for most guys",
    cue: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
  },
  {
    name: "SERM path (e.g., enclomiphene)",
    fertility: "Often preserved",
    speed: "Medium-fast",
    profile: "May support endogenous production for selected candidates",
    cue: "bg-blue-500/15 text-blue-300 border-blue-400/40"
  },
  {
    name: "Oral / topical testosterone",
    fertility: "Often reduced",
    speed: "Fast",
    profile: "Needle-free delivery but still exogenous testosterone",
    cue: "bg-amber-500/15 text-amber-300 border-amber-400/40"
  },
  {
    name: "Injectable TRT",
    fertility: "Often suppressed",
    speed: "Fast",
    profile: "Powerful option but outside this site’s first-choice path",
    cue: "bg-rose-500/15 text-rose-300 border-rose-400/40"
  }
];

export default function HomePage() {
  const latest = getAllArticles().slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ShotFreeTRT",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [siteUrl]
      },
      {
        "@type": "WebSite",
        name: "ShotFreeTRT",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/blog?query={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl shadow-black/60 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-200">
            <ShieldCheck className="size-4" />
            Needle-free testosterone optimization
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-zinc-100 sm:text-5xl">
            Build an <span className="text-red-400">alpha-level protocol</span> before you touch a needle.
          </h1>
          <p className="max-w-2xl text-base text-zinc-300 sm:text-lg">
            Take the quick assessment, let AI build your 30-day game plan, then compare
            fertility-preserving vs. exogenous options with clear tradeoffs.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/quiz/healthspan/advanced">
                Start AI Testosterone Plan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-800">
              <Link href="/resources">Compare Needle-Free Options</Link>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 text-sm text-zinc-300 sm:grid-cols-3">
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">No fluff protocols</p>
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">Lab-context decision support</p>
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">Fertility-aware pathways</p>
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-14">
        <h2 className="text-2xl font-bold text-foreground">The 4-block Shot Free TRT system</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          This is the Sprinter-style path: start with root-cause optimization, personalize the
          protocol with AI, and only escalate after execution + objective data.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="border-zinc-800 bg-zinc-950/80 text-zinc-100">
                <CardHeader className="gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
                    <Icon className="size-5 text-red-300" />
                  </span>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{pillar.detail}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-12 md:mt-14">
        <Card className="border-zinc-800 bg-zinc-950/70 text-zinc-100">
          <CardHeader className="space-y-3 pb-4">
            <CardTitle className="flex flex-wrap items-center gap-2 text-2xl leading-tight">
              <Pill className="size-5 text-red-300" />
              Compare your options before committing
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Educational overview only. Discuss treatment choices with a licensed clinician.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-3 pr-4 font-medium">Pathway</th>
                    <th className="py-3 pr-4 font-medium">Fertility impact</th>
                    <th className="py-3 pr-4 font-medium">Typical speed</th>
                    <th className="py-3 font-medium">Use case snapshot</th>
                  </tr>
                </thead>
                <tbody>
                  {modalities.map((modality) => (
                    <tr key={modality.name} className="border-b border-zinc-900 align-top">
                      <td className="py-4 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${modality.cue}`}>
                          {modality.name}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-zinc-200">{modality.fertility}</td>
                      <td className="py-4 pr-4 text-zinc-200">{modality.speed}</td>
                      <td className="py-4 text-zinc-300">{modality.profile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <Syringe className="size-4" />
              <p>
                This site prioritizes non-injectable and fertility-aware decision paths first.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <GuidePromoBanner />

      <section className="mt-12 md:mt-14">
        <h2 className="text-2xl font-bold">How ShotFreeTRT monetizes (transparent)</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Card className="h-full">
            <CardHeader className="space-y-3">
              <CardTitle className="text-base">Affiliate partnerships</CardTitle>
              <CardDescription>
                Maximus-like telemed programs, labs, and supplements with clear disclosures.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-full">
            <CardHeader className="space-y-3">
              <CardTitle className="text-base">Educational products</CardTitle>
              <CardDescription>
                Premium protocol packs, checklists, and follow-up templates for men running
                natural optimization sprints.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-full">
            <CardHeader className="space-y-3">
              <CardTitle className="text-base">Selective ad slots</CardTitle>
              <CardDescription>
                Minimal and relevant sponsor placements so the user journey stays clean.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-12 md:mt-14">
        <h2 className="text-2xl font-bold">Read next</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {latest.map((article) => (
            <Card key={article.slug} className="h-full">
              <CardHeader className="space-y-3">
                <CardTitle className="text-base leading-snug">
                  <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                <BadgeCheck className="size-4" />
                {article.readTime} · {article.category}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <DisclosureNotice variant="both" title="Medical + Affiliate Disclosure" />
      <NewsletterSignup formId="home-newsletter-email" />
    </>
  );
}
