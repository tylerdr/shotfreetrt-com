import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import { NewsletterCTA } from "@/components/NewsletterCTA";

type ResourceItem = {
  name: string;
  reason: string;
  caution: string;
  href: string;
};

type ResourceCategory = {
  title: string;
  description: string;
  items: ResourceItem[];
};

const categories: ResourceCategory[] = [
  {
    title: "Foundational Supplements",
    description:
      "High-intent options with broad human safety data when used responsibly and personalized to labs and medication context.",
    items: [
      {
        name: "Third-Party Tested Omega-3",
        reason:
          "Useful for readers trying to improve cardiometabolic markers when diet quality is inconsistent.",
        caution:
          "Use caution if you take anticoagulants or have bleeding risk; review dose and interactions with your clinician.",
        href: "https://example.com/omega-3-placeholder?ref=alivelongevity"
      },
      {
        name: "Creatine Monohydrate",
        reason:
          "May support muscle retention, strength progression, and healthy aging training adherence.",
        caution:
          "Review kidney-related concerns and lab interpretation with a clinician before long-term use.",
        href: "https://example.com/creatine-placeholder?ref=alivelongevity"
      },
      {
        name: "Magnesium Glycinate",
        reason:
          "Often used to support sleep quality and recovery when routine, caffeine timing, and stress management are already addressed.",
        caution:
          "Start with conservative doses and monitor GI tolerance and medication interactions.",
        href: "https://example.com/magnesium-placeholder?ref=alivelongevity"
      }
    ]
  },
  {
    title: "Measurement Tools",
    description:
      "Simple, repeatable tools that improve adherence and help turn behavior changes into objective feedback loops.",
    items: [
      {
        name: "Validated Home Blood Pressure Cuff",
        reason:
          "Home averages are often more useful than occasional office readings for trend-based decisions.",
        caution:
          "Use standardized positioning and timing; do not self-adjust medications without supervision.",
        href: "https://example.com/bp-cuff-placeholder?ref=alivelongevity"
      },
      {
        name: "Step Tracking Wearable",
        reason:
          "Supports daily movement consistency and helps maintain non-exercise activity volume.",
        caution:
          "Use as a guidance tool, not as a medical diagnosis device.",
        href: "https://example.com/wearable-placeholder?ref=alivelongevity"
      },
      {
        name: "Food Scale + Protein Prep Kit",
        reason:
          "Improves accuracy for protein targets and meal consistency during high-workload weeks.",
        caution:
          "Avoid turning tracking into restrictive behavior; prioritize sustainability.",
        href: "https://example.com/food-scale-placeholder?ref=alivelongevity"
      }
    ]
  },
  {
    title: "Recovery and Sleep Support",
    description:
      "Tools that can reduce friction in evening routines and improve sleep opportunity when used with behavioral fundamentals.",
    items: [
      {
        name: "Blackout Sleep Kit",
        reason:
          "Environmental light control is a practical lever for improved sleep continuity.",
        caution:
          "Sleep disruption with daytime fatigue may still require sleep apnea screening.",
        href: "https://example.com/sleep-kit-placeholder?ref=alivelongevity"
      },
      {
        name: "Cooling Sleep Pad",
        reason:
          "Can help readers who struggle with heat-related awakenings and fragmented sleep.",
        caution:
          "Treat as supportive comfort tech, not a replacement for schedule and caffeine control.",
        href: "https://example.com/cooling-pad-placeholder?ref=alivelongevity"
      },
      {
        name: "Sauna Access Membership",
        reason:
          "Useful for readers implementing consistent heat exposure protocols with hydration and blood pressure awareness.",
        caution:
          "Avoid high-intensity protocols if you have cardiovascular symptoms without medical clearance.",
        href: "https://example.com/sauna-placeholder?ref=alivelongevity"
      }
    ]
  },
  {
    title: "Lab and Planning Utilities",
    description:
      "Resources that support evidence-first decision making for readers who want measurable progress instead of trend chasing.",
    items: [
      {
        name: "Quarterly Biomarker Tracker",
        reason:
          "Keeps ApoB, glucose, blood pressure, and adherence metrics in one review system.",
        caution:
          "Lab tracking should support clinical conversations, not self-diagnosis.",
        href: "https://example.com/biomarker-tracker-placeholder?ref=alivelongevity"
      },
      {
        name: "Meal Planning Template",
        reason:
          "Converts nutrition goals into repeatable weekly execution blocks for busy schedules.",
        caution:
          "Adjust portions and food choices for medical conditions and medication context.",
        href: "https://example.com/meal-template-placeholder?ref=alivelongevity"
      },
      {
        name: "Training Progress Dashboard",
        reason:
          "Helps connect strength and cardio progression with recovery quality and symptom trends.",
        caution:
          "Pain, dizziness, or persistent fatigue should trigger clinician evaluation before progression.",
        href: "https://example.com/training-dashboard-placeholder?ref=alivelongevity"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Curated longevity supplements and tools with evidence-oriented framing, placeholder affiliate links, and clear medical/FTC disclosure.",
  alternates: {
    canonical: "/resources"
  }
};

export default function ResourcesPage() {
  return (
    <>
      <h1 className="page-title">Longevity Resources</h1>
      <p className="page-subtitle">
        Use this library to find supplements and tools worth considering after
        your fundamentals are in place. Prioritize sleep, nutrition, strength,
        and cardiometabolic tracking before adding complexity.
      </p>

      <DisclosureNotice variant="both" title="FTC + Medical Notice" />

      <div className="resource-groups">
        {categories.map((category) => (
          <section key={category.title} className="resource-group">
            <h2>{category.title}</h2>
            <p>{category.description}</p>
            <div className="card-grid">
              {category.items.map((item) => (
                <article key={item.name} className="card resource-card">
                  <h3>{item.name}</h3>
                  <p>
                    <strong>Why it is here:</strong> {item.reason}
                  </p>
                  <p>
                    <strong>Caution:</strong> {item.caution}
                  </p>
                  <p>
                    <Link
                      href={item.href}
                      rel="sponsored noopener noreferrer"
                      target="_blank"
                      className="resource-link"
                    >
                      View recommendation
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <NewsletterCTA
        title="Want personalized longevity recommendations each week?"
        description="Get one evidence-oriented protocol, one metric target, and one implementation checklist every Friday."
        buttonLabel="Join the weekly brief"
        formId="resources-newsletter-email"
      />
    </>
  );
}
