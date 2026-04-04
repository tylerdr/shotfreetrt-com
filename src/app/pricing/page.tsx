import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, ClipboardList, Microscope, Shield } from "lucide-react";

import { DisclosureNotice } from "@/components/DisclosureNotice";

export const metadata: Metadata = {
  title: "TRT Resources & Pricing | ShotFreeTRT",
  description:
    "Free tools, guides, and honest clinic comparisons to help you navigate testosterone replacement therapy. Start with our free TRT decision quiz.",
  alternates: {
    canonical: "/pricing"
  }
};

const freeResources = [
  {
    icon: ClipboardList,
    title: "TRT Decision Quiz",
    description:
      "Answer 6 questions and get a personalized recommendation: lifestyle-first, SERM path, or TRT — matched to your profile.",
    cta: "Take the Free Quiz",
    href: "/quiz",
    highlight: true
  },
  {
    icon: BookOpen,
    title: "Complete TRT Guide (2026)",
    description:
      "Everything you need to understand TRT — benefits, risks, delivery methods, cost, and how to start.",
    cta: "Read the Guide",
    href: "/blog/testosterone-replacement-therapy-guide"
  },
  {
    icon: Microscope,
    title: "TRT Bloodwork Panel",
    description:
      "The exact labs to request before starting TRT. What each number means. How to interpret them.",
    cta: "See the Panel",
    href: "/blog/trt-bloodwork-panel"
  },
  {
    icon: Shield,
    title: "TRT Side Effects: What's Real",
    description:
      "12 side effects reviewed honestly — which are real, which are overstated, and how to manage each one.",
    cta: "Read the Breakdown",
    href: "/blog/trt-side-effects"
  }
];

const clinicOptions = [
  {
    name: "Defy Medical",
    tagline: "Most comprehensive protocol management",
    price: "~$200–$350/mo",
    best: "Men who want close monitoring and protocol flexibility",
    details: [
      "Telemedicine + in-person options",
      "Patient portal with lab tracking",
      "HCG, enclomiphene, and ancillaries available",
      "Longer-term relationship model"
    ],
    affiliateNote: true
  },
  {
    name: "Fountain TRT",
    tagline: "Streamlined online-only TRT",
    price: "~$99–$149/mo",
    best: "Men who want fast setup with a simple protocol",
    details: [
      "100% telemedicine",
      "Quick onboarding (1–2 weeks to first dose)",
      "Testosterone cypionate injections focus",
      "Lower cost, less customization"
    ],
    affiliateNote: true
  },
  {
    name: "Maximus",
    tagline: "Oral TRT + metabolic focus",
    price: "~$129–$199/mo",
    best: "Men who want oral TRT (Kyzatrex) or Clomid-first approach",
    details: [
      "Kyzatrex (oral testosterone) primary option",
      "Enclomiphene available",
      "App-based management",
      "Good fit for fertility-preserving paths"
    ],
    affiliateNote: true
  },
  {
    name: "Hone Health",
    tagline: "Hormones + primary care hybrid",
    price: "~$149–$249/mo",
    best: "Men who want broader hormonal health coverage alongside TRT",
    details: [
      "Online physician visits",
      "Full hormone panel + thyroid included",
      "Injectable and topical options",
      "Access to compounding pharmacy"
    ],
    affiliateNote: true
  }
];

const comparisonRows = [
  { label: "Monthly cost", defy: "$200–$350", fountain: "$99–$149", maximus: "$129–$199", hone: "$149–$249" },
  { label: "Delivery methods", defy: "Inj, topical, oral", fountain: "Injections", maximus: "Oral, SERM", hone: "Inj, topical" },
  { label: "HCG / fertility support", defy: "✓", fountain: "Limited", maximus: "✓ (enclomiphene)", hone: "✓" },
  { label: "Lab monitoring included", defy: "✓", fountain: "✓ (basic)", maximus: "✓", hone: "✓" },
  { label: "Telemedicine", defy: "✓", fountain: "✓", maximus: "✓", hone: "✓" },
  { label: "In-person option", defy: "✓", fountain: "—", maximus: "—", hone: "—" },
  { label: "Compounding pharmacy", defy: "✓", fountain: "Limited", maximus: "✓", hone: "✓" }
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl py-8 sm:py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold text-white md:text-4xl">
          TRT Resources &amp; Clinic Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
          Free tools to help you decide, plus an honest look at what online TRT clinics
          actually cost — and who each one is best for.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Not sure where to start? Take the free quiz
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Free Resources */}
      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">Free Resources</h2>
        <p className="mt-2 mb-8 text-zinc-400">
          Start here before spending a dollar. These tools are free and will save you months of confusion.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {freeResources.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-3 rounded-xl border p-6 ${
                  item.highlight
                    ? "border-blue-500/40 bg-blue-500/5"
                    : "border-[#222230] bg-[#12121A]"
                }`}
              >
                <Icon size={24} className="text-blue-400" />
                <div>
                  <h3 className="mb-1 font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  {item.cta} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clinic Comparison */}
      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">
          Online TRT Clinic Pricing (2026)
        </h2>
        <p className="mt-2 mb-8 text-zinc-400">
          These are the four most commonly recommended online TRT clinics. Prices are monthly estimates
          including medication and provider fees. Exact costs vary by protocol and state.
        </p>

        {/* Cards */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2">
          {clinicOptions.map((clinic) => (
            <div
              key={clinic.name}
              className="rounded-xl border border-[#222230] bg-[#12121A] p-6"
            >
              <div className="mb-3">
                <h3 className="font-bold text-white">{clinic.name}</h3>
                <span className="text-sm text-zinc-500">{clinic.tagline}</span>
              </div>
              <p className="mb-4 mt-2 text-2xl font-bold text-blue-400">
                {clinic.price}<span className="text-sm font-normal text-zinc-500"> / month</span>
              </p>
              <p className="mb-3 text-sm text-zinc-400">
                <strong className="text-zinc-200">Best for:</strong> {clinic.best}
              </p>
              <ul className="m-0 list-none p-0">
                {clinic.details.map((d) => (
                  <li
                    key={d}
                    className="mb-1.5 flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <BadgeCheck size={14} className="mt-0.5 shrink-0 text-blue-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <h3 className="mb-4 font-semibold text-white">Side-by-Side Comparison</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1E2A4A] bg-[#0F1530]">
                <th className="py-3 pr-4 text-left font-semibold text-blue-300">Feature</th>
                {["Defy", "Fountain", "Maximus", "Hone"].map((h) => (
                  <th key={h} className="py-3 px-4 text-center font-semibold text-blue-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-[#222230] ${i % 2 === 1 ? "bg-[#0F0F1A]" : ""}`}
                >
                  <td className="py-3 pr-4 text-zinc-400">{row.label}</td>
                  {[row.defy, row.fountain, row.maximus, row.hone].map((val, ci) => (
                    <td
                      key={ci}
                      className={`py-3 px-4 text-center ${
                        val === "—" ? "text-zinc-600" : val.startsWith("✓") ? "text-blue-400" : "text-zinc-300"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          For a deeper breakdown:{" "}
          <Link href="/blog/best-online-trt-clinic" className="text-blue-400 underline hover:text-blue-300">
            Best Online TRT Clinics Compared (2026) &rarr;
          </Link>
        </p>
      </section>

      {/* Cost breakdown CTA */}
      <section className="mb-16 rounded-xl border border-[#222230] bg-[#12121A] p-8 text-center sm:p-10">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">
          What Does TRT Actually Cost Out-of-Pocket?
        </h2>
        <p className="mx-auto mt-3 mb-6 max-w-lg text-zinc-400">
          Monthly estimates vary $60–$500+ depending on delivery method, clinic model, and whether
          insurance covers any of it. See the full breakdown.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/blog/trt-cost-2026"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Full TRT Cost Breakdown <ArrowRight size={16} />
          </Link>
          <Link
            href="/blog/trt-insurance-coverage"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 font-medium text-zinc-300 hover:border-zinc-500"
          >
            Is TRT Covered by Insurance?
          </Link>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="rounded-2xl border border-[#222230] bg-[#12121A] p-8 text-center sm:p-10">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-white">
          Not sure which path is right for you?
        </h2>
        <p className="mx-auto mt-3 mb-6 max-w-md text-zinc-400">
          Take our free 6-question quiz. It evaluates your symptoms, fertility goals, and risk profile
          to recommend the best starting point — lifestyle, SERM, or TRT.
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-500"
        >
          Take the Free TRT Quiz <ArrowRight size={18} />
        </Link>
        <p className="mt-3 text-xs text-zinc-500">Free. No email required.</p>
      </section>

      <div className="mt-12">
        <DisclosureNotice />
      </div>
    </div>
  );
}
