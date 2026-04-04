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
    cue: "bg-blue-500/10 text-blue-300 border-blue-500/30"
  },
  {
    name: "SERM path (e.g., enclomiphene)",
    fertility: "Often preserved",
    speed: "Medium-fast",
    profile: "May support endogenous production for selected candidates",
    cue: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
  },
  {
    name: "Oral / topical testosterone",
    fertility: "Often reduced",
    speed: "Fast",
    profile: "Needle-free delivery but still exogenous testosterone",
    cue: "bg-amber-500/10 text-amber-300 border-amber-500/30"
  },
  {
    name: "Injectable TRT",
    fertility: "Often suppressed",
    speed: "Fast",
    profile: "Powerful option but outside this site's first-choice path",
    cue: "bg-rose-500/10 text-rose-300 border-rose-500/30"
  }
];

export default function HomePage() {
  const articles = getAllArticles();
  const latest = articles.slice(0, 3);

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

      {/* Hero */}
      <section className="py-8 sm:py-12">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-none">
            Evidence-based TRT information.<br />
            <span className="text-blue-400">No clinic bias.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Take the quick assessment, let AI build your 30-day game plan, then compare
            fertility-preserving vs. exogenous options with clear tradeoffs.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-blue-600 font-semibold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Link href="/quiz/healthspan/advanced">
                Start AI Testosterone Plan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border border-zinc-700 text-zinc-300 hover:border-zinc-500 bg-transparent">
              <Link href="/resources">Compare Needle-Free Options</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust/stats bar */}
      <section className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-[#222230] bg-[#12121A] px-6 py-4 text-sm font-medium text-zinc-400">
        <span><span className="text-lg font-bold text-blue-400">{articles.length}+</span> articles published</span>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <span>Evidence-based</span>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <span>No clinic bias</span>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <span>Every claim sourced</span>
      </section>

      {/* 4-block system */}
      <section className="mb-12 md:mb-14">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white md:text-3xl">
          The 4-block Shot Free TRT system
        </h2>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Start with root-cause optimization, personalize the protocol with AI,
          and only escalate after execution + objective data.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="border-[#222230] bg-[#12121A] shadow-none hover:border-blue-500/30 transition-all group">
                <CardHeader className="gap-0 p-6">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Icon className="size-5 text-blue-400" />
                  </span>
                  <CardTitle className="mb-2 text-base font-semibold text-white">{pillar.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{pillar.detail}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mb-12 md:mb-14">
        <Card className="border-[#222230] bg-[#12121A] shadow-none">
          <CardHeader className="space-y-3 pb-4">
            <CardTitle className="flex flex-wrap items-center gap-2 text-2xl leading-tight text-white">
              <Pill className="size-5 text-blue-400" />
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
                  <tr className="border-b border-[#1E2A4A] text-zinc-500">
                    <th className="py-3 pr-4 font-medium">Pathway</th>
                    <th className="py-3 pr-4 font-medium">Fertility impact</th>
                    <th className="py-3 pr-4 font-medium">Typical speed</th>
                    <th className="py-3 font-medium">Use case snapshot</th>
                  </tr>
                </thead>
                <tbody>
                  {modalities.map((modality) => (
                    <tr key={modality.name} className="border-b border-[#222230] align-top">
                      <td className="py-4 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${modality.cue}`}>
                          {modality.name}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-zinc-300">{modality.fertility}</td>
                      <td className="py-4 pr-4 text-zinc-300">{modality.speed}</td>
                      <td className="py-4 text-zinc-400">{modality.profile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <Syringe className="size-4" />
              <p>
                This site prioritizes non-injectable and fertility-aware decision paths first.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <GuidePromoBanner />

      {/* Editorial methodology */}
      <section className="mb-12 mt-12 rounded-xl border border-[#222230] bg-[#12121A] p-8 md:mb-14">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">
          How we evaluate and present TRT options
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
            <h3 className="mt-2 font-semibold text-white">Research review</h3>
            <p className="mt-1 text-sm text-zinc-400">Every article is grounded in peer-reviewed research and clinical guidelines.</p>
          </div>
          <div>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
            <h3 className="mt-2 font-semibold text-white">No rank manipulation</h3>
            <p className="mt-1 text-sm text-zinc-400">Clinic comparisons are not influenced by affiliate commissions or sponsorships.</p>
          </div>
          <div>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</span>
            <h3 className="mt-2 font-semibold text-white">Citations included</h3>
            <p className="mt-1 text-sm text-zinc-400">Key claims link to source studies so you can verify and go deeper.</p>
          </div>
          <div>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">4</span>
            <h3 className="mt-2 font-semibold text-white">Regular updates</h3>
            <p className="mt-1 text-sm text-zinc-400">Articles are revised as new evidence emerges or guidelines change.</p>
          </div>
        </div>
      </section>

      {/* Read next */}
      <section className="mb-12 md:mb-14">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">Read next</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {latest.map((article) => (
            <Card key={article.slug} className="h-full border-[#222230] bg-[#12121A] shadow-none hover:border-blue-500/40 transition-all">
              <CardHeader className="space-y-3">
                <CardTitle className="text-base leading-snug text-white">
                  <Link href={`/blog/${article.slug}`} className="hover:text-blue-300">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-zinc-400">{article.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center gap-2 text-xs text-zinc-500">
                <BadgeCheck className="size-4 text-blue-400" />
                {article.readTime} &middot; {article.category}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <DisclosureNotice variant="both" title="Disclosure" />
      <NewsletterSignup formId="home-newsletter-email" />
    </>
  );
}
