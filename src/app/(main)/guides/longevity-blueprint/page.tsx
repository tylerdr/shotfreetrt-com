import type { Metadata } from "next";

import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { Button } from "@/components/ui/button";

const tocItems = [
  "The Science of Longevity in 2026",
  "The Foundation: Exercise for Longevity",
  "Nutrition and Fasting Strategies",
  "Sleep, Stress, and Recovery",
  "Advanced Interventions",
  "Your Personal Longevity Dashboard"
];

const learnItems = [
  "How to prioritize longevity levers by effect size and evidence quality",
  "A practical Zone 2 + strength + VO2 training system for real schedules",
  "How to structure protein, Mediterranean-style nutrition, and TRE",
  "How to improve sleep architecture and use HRV trends for recovery decisions",
  "How to evaluate peptides, hormone therapies, and anti-aging compounds",
  "How to run a 90-day biomarker dashboard with action thresholds"
];

const audienceItems = [
  "Professionals who want a high-clarity, evidence-based healthspan plan",
  "Adults 30+ optimizing fitness, metabolic health, and long-term function",
  "Readers who want measurable implementation rather than trend chasing",
  "People preparing for a clinician-guided longevity strategy"
];

const faqs = [
  {
    question: "Is this guide medical advice?",
    answer:
      "No. It is educational and implementation-focused. Medication, hormone, and supplement decisions should be made with a qualified clinician."
  },
  {
    question: "How long is the guide?",
    answer:
      "The 2026 edition is a long-form manual with more than 8,000 words, including templates, checklists, and an implementation dashboard."
  },
  {
    question: "Who is this guide for?",
    answer:
      "It is for adults who want a practical, evidence-first longevity framework they can run in weekly and quarterly cycles."
  },
  {
    question: "Does it include advanced interventions?",
    answer:
      "Yes. It covers peptides, hormones, rapamycin, metformin, berberine, NAD+ strategies, and heat/cold therapy with risk-aware framing."
  }
];

export const metadata: Metadata = {
  title: "Longevity Blueprint Guide",
  description:
    "The Longevity Blueprint (2026 Edition): a free evidence-based guide on exercise, nutrition, sleep, recovery, advanced interventions, and biomarker dashboards.",
  alternates: {
    canonical: "/guides/longevity-blueprint"
  },
  openGraph: {
    title: "Longevity Blueprint (2026 Edition)",
    description:
      "Free longevity guide covering healthspan science, training, nutrition, sleep, advanced interventions, and biomarker systems.",
    type: "article",
    url: "https://shotfreetrt.com/guides/longevity-blueprint"
  }
};

export default function LongevityBlueprintPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero guide-hero">
        <p className="guide-badge-row">
          <span className="badge">Digital Guide</span>
          <span className="badge" style={{ background: "#166534", color: "#bbf7d0" }}>
            Free PDF
          </span>
        </p>
        <h1>The Longevity Blueprint (2026 Edition)</h1>
        <p>
          A professional, evidence-based roadmap for extending healthspan with
          practical systems across exercise, nutrition, sleep, biomarkers, and
          advanced interventions.
        </p>
        <Button asChild className="mt-4">
          <a href="/longevity-blueprint.pdf" target="_blank" rel="noopener noreferrer">
            Download the free PDF
          </a>
        </Button>
        <figure className="overflow-hidden rounded-xl border border-border" style={{ marginTop: 20 }}>
          <EditorialImageFrame
            src="/media/sft-web-batch3-09.webp"
            width={960}
            height={640}
            sizes="(min-width: 768px) 700px, 100vw"
          />
          <figcaption className="meta border-t border-border px-4 py-2">
            Planning out the Blueprint&apos;s day-to-day systems.
          </figcaption>
        </figure>
      </section>

      <section className="guide-grid" aria-label="Guide details" style={{ marginTop: 24 }}>
        <article className="card guide-card">
          <h2>Table of Contents</h2>
          <ol className="guide-ordered-list">
            {tocItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="meta" style={{ marginBottom: 0 }}>
            Includes research citations, implementation checklists, templates,
            and a 90-day execution model.
          </p>
        </article>

        <article className="card guide-card">
          <h2>What You Will Learn</h2>
          <ul className="checklist">
            {learnItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section style={{ marginTop: 24 }}>
        <article className="card guide-card">
          <h2>Who This Is For</h2>
          <ul className="checklist">
            {audienceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="meta" style={{ marginBottom: 0 }}>
            Not intended for emergency or acute medical decision-making.
          </p>
        </article>
      </section>

      <section style={{ marginTop: 24 }} aria-label="Frequently asked questions">
        <h2 className="page-title" style={{ marginBottom: 16 }}>
          FAQ
        </h2>
        <div className="article-list">
          {faqs.map((faq) => (
            <article key={faq.question} className="article-item">
              <h3 style={{ marginTop: 0 }}>{faq.question}</h3>
              <p style={{ marginBottom: 0, color: "#335645" }}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}
