import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import GuidePromoBanner from "@/components/GuidePromoBanner";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { RelatedLinks } from "@/components/RelatedLinks";
import { getAllArticles, getArticleBySlug, siteUrl } from "@/data/articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {};
  }

  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/blog/${article.slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: articleUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author],
      tags: article.keywords
    },
    keywords: article.keywords
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const wordCount = article.content
    ? Math.ceil(article.content.length / 5)
    : article.sections.reduce(
        (sum, section) =>
          sum +
          section.paragraphs.reduce(
            (innerSum, paragraph) => innerSum + paragraph.trim().split(/\s+/).length,
            0
          ),
        0
      );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "ShotFreeTRT",
      url: siteUrl
    },
    mainEntityOfPage: articleUrl,
    keywords: article.keywords.join(", "),
    wordCount
  };
  const faqJsonLd = article.faqItems
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a }
        }))
      }
    : null;

  function renderParagraphWithLinks(paragraph: string, keyPrefix: string) {
    const parts = paragraph.split(/(\/blog\/[a-z0-9-]+)/g);

    return (
      <p>
        {parts.map((part, index) => {
          if (/^\/blog\/[a-z0-9-]+$/.test(part)) {
            return (
              <Link key={`${keyPrefix}-link-${index}`} href={part}>
                {part}
              </Link>
            );
          }
          return <span key={`${keyPrefix}-text-${index}`}>{part}</span>;
        })}
      </p>
    );
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <h1 className="page-title" style={{ marginBottom: 8 }}>
        {article.title}
      </h1>
      <p className="meta" style={{ marginTop: 0 }}>
        {article.publishedAt} · {article.readTime} · {article.author}
      </p>
      <p className="page-subtitle">{article.description}</p>
      <p className="meta" style={{ marginTop: -8, marginBottom: 16 }}>
        Estimate your baseline first with the{" "}
        <Link href="/quiz/healthspan">Healthspan Quiz</Link>.
      </p>

      <div className="badge-row" aria-label="Article topics">
        {article.keywords.map((keyword) => (
          <span key={keyword} className="badge">
            {keyword}
          </span>
        ))}
      </div>

      {article.content ? (
        <section
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <section className="article-content">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <div key={`${section.heading}-${index}`}>
                  {renderParagraphWithLinks(
                    paragraph,
                    `${section.heading}-${index}`
                  )}
                </div>
              ))}
            </section>
          ))}
        </section>
      )}

      <GuidePromoBanner compact />

      <DisclosureNotice variant="medical" />
      <RelatedLinks slug={article.slug} />
      <NewsletterCTA
        title="Want this level of detail every week?"
        description="Subscribe for actionable longevity briefs with safety notes and implementation checkpoints."
        buttonLabel="Send weekly brief"
        formId={`article-${article.slug}-email`}
      />
    </article>
  );
}
