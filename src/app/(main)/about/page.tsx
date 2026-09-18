import type { Metadata } from "next";
import Link from "next/link";

import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { NewsletterCTA } from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "ShotFreeTRT helps adults compare testosterone-treatment options, understand clinic costs, and prepare for a licensed clinician visit. Education, not prescriptions.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <>
      <h1 className="page-title">About ShotFreeTRT</h1>
      <p className="page-subtitle">
        ShotFreeTRT helps adults move from a symptom, lab result, or treatment
        question to a safer next question. We publish education and
        comparison tools; we do not diagnose, score treatment eligibility, or
        recommend an individual medicine or dose.
      </p>

      <figure className="mt-6 overflow-hidden rounded-xl border border-border">
        <EditorialImageFrame
          src="/media/sft-web-batch3-03.webp"
          width={960}
          height={640}
          sizes="(min-width: 768px) 700px, 100vw"
        />
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Preparing the questions worth asking before you commit.</figcaption>
      </figure>

      <div className="card-grid">
        <article className="card">
          <h2>Editorial Philosophy</h2>
          <p>
            We label the evidence boundary explicitly: established,
            associated, plausible, or uncertain. We cite primary sources
            (Endocrine Society, AUA, FDA, NIH/PubMed) for clinical claims and
            never treat a secondary article as medical proof.
          </p>
        </article>

        <article className="card">
          <h2>Who We Serve</h2>
          <p>
            Adults roughly 35&ndash;55 who are comparing treatment providers or
            preparing an appointment, often with questions about costs,
            product differences, or fertility plans.
          </p>
        </article>

        <article className="card">
          <h2>How to Use This Site</h2>
          <p>
            Take the free <Link href="/quiz/healthspan">decision quiz</Link>{" "}
            for a personalized checklist, or go straight to the{" "}
            <Link href="/decision-guide">decision guide</Link> to prepare
            appointment questions and compare written clinic quotes. Then
            browse the <Link href="/blog">articles</Link> for the specific
            question you have.
          </p>
        </article>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Beyond testosterone</h2>
        <p className="mt-2 text-muted-foreground">
          ShotFreeTRT&apos;s scope is testosterone treatment decisions. For
          broader healthspan questions &mdash; biomarker tracking, sleep, and
          training &mdash; AliveLongevity&apos;s{" "}
          <a href="https://alivelongevity.com/protocol" rel="noreferrer">
            minimum-effective longevity protocol
          </a>{" "}
          is related reading from another site in our network. It is not a
          ShotFreeTRT clinical recommendation, and it does not cover
          testosterone treatment specifically.
        </p>
      </section>

      <NewsletterCTA />
    </>
  );
}
