import Link from "next/link";

import GuidePromoBanner from "@/components/GuidePromoBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllArticles, siteUrl } from "@/data/articles";

export default function HomePage() {
  const latest = getAllArticles().slice(0, 6);

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

      <section className="hero">
        <h1>Raise testosterone naturally before you consider TRT shots.</h1>
        <p>
          ShotFreeTRT gives men a practical, lab-driven playbook to improve energy,
          strength, libido, and focus with sleep, training, nutrition, and stress
          protocols.
        </p>
      </section>

      <GuidePromoBanner />

      <section>
        <h2 className="page-title" style={{ marginTop: 30 }}>
          Start Here
        </h2>
        <p className="page-subtitle">
          Use the free self-check, run the 30-day protocol, and track changes before
          making hormone therapy decisions.
        </p>
        <div className="card-grid">
          <article className="card">
            <h3>
              <Link href="/quiz/healthspan">Natural TRT Readiness Quiz</Link>
            </h3>
            <p>
              Answer 19 questions to find your likely bottlenecks and your highest-
              leverage next action.
            </p>
            <p className="meta" style={{ marginTop: 10 }}>
              Interactive Quiz
            </p>
          </article>
          <article className="card">
            <h3>
              <Link href="/start-here">30-Day No-Shot Protocol</Link>
            </h3>
            <p>
              A week-by-week plan to improve sleep, body composition, and hormone
              inputs with zero fluff.
            </p>
            <p className="meta" style={{ marginTop: 10 }}>
              Conversion Page
            </p>
          </article>
          <article className="card">
            <h3>
              <Link href="/resources">Labs, supplements, and tools</Link>
            </h3>
            <p>
              Compare practical options, understand tradeoffs, and avoid expensive
              dead ends.
            </p>
            <p className="meta" style={{ marginTop: 10 }}>
              Monetization Page
            </p>
          </article>
          {latest.map((article) => (
            <article key={article.slug} className="card">
              <h3>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>
              <p>{article.description}</p>
              <p className="meta" style={{ marginTop: 10 }}>
                {article.readTime} · {article.category}
              </p>
            </article>
          ))}
        </div>
      </section>

      <NewsletterSignup formId="home-newsletter-email" />
    </>
  );
}
