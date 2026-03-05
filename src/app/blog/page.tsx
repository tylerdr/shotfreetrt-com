import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllArticles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read evidence-based longevity articles covering nutrition, training, recovery, biomarkers, and healthy aging.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogIndexPage() {
  const posts = getAllArticles();

  return (
    <>
      <h1 className="page-title">Longevity Blog</h1>
      <p className="page-subtitle">
        Explore high-intent guides for supplements, exercise, sleep, glucose
        control, and other healthspan priorities.
      </p>
      <p className="meta" style={{ marginTop: -10, marginBottom: 20 }}>
        New reader? Start with our <Link href="/start-here">7-day quickstart</Link>{" "}
        and browse vetted tools on <Link href="/resources">Resources</Link>.
      </p>

      <section className="article-list" aria-label="All longevity posts">
        {posts.map((post) => (
          <article key={post.slug} className="article-item">
            <h2 style={{ margin: "0 0 8px" }}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p style={{ margin: "0 0 8px", color: "#335645" }}>
              {post.description}
            </p>
            <p className="meta" style={{ margin: 0 }}>
              {post.publishedAt} · {post.readTime} · {post.category}
            </p>
          </article>
        ))}
      </section>

      <DisclosureNotice variant="medical" />
      <NewsletterSignup
        formId="blog-listing-email"
        buttonLabel="Get weekly protocols"
      />
    </>
  );
}
