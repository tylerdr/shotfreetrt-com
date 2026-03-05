import type { Metadata } from "next";

import { NewsletterCTA } from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ShotFreeTRT and our mission to publish practical, evidence-first healthy aging guidance.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <>
      <h1 className="page-title">About ShotFreeTRT</h1>
      <p className="page-subtitle">
        ShotFreeTRT exists to make longevity research practical. We translate
        complex evidence into weekly actions readers can apply immediately.
      </p>

      <div className="card-grid">
        <article className="card">
          <h2>Editorial Philosophy</h2>
          <p>
            We prioritize interventions with human evidence, realistic adherence,
            and measurable outcomes. Trend-driven shortcuts are excluded.
          </p>
        </article>

        <article className="card">
          <h2>Who We Serve</h2>
          <p>
            Professionals, parents, and performance-focused adults who want to
            increase healthspan while balancing real-world schedules.
          </p>
        </article>

        <article className="card">
          <h2>How to Use This Site</h2>
          <p>
            Start with one article, implement one protocol for 4 to 8 weeks,
            then review progress using objective markers and daily quality of
            life.
          </p>
        </article>
      </div>

      <NewsletterCTA />
    </>
  );
}
