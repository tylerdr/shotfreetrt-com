import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import GuidePromoBanner from "@/components/GuidePromoBanner";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { RelatedLinks } from "@/components/RelatedLinks";
import { getAllArticles, getArticleBySlug, siteUrl } from "@/data/articles";

const CATEGORY_COLORS: Record<string, string> = {
  TRT: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  Supplements: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  Recovery: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  Lifestyle: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Science: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  Nutrition: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  "Metabolic Health": "bg-rose-500/10 text-rose-300 border-rose-500/30",
  Biomarkers: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
}

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
    <article className="mx-auto max-w-3xl">
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

      {/* Article header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <span className="text-sm text-zinc-500">{article.readTime}</span>
          <span className="text-sm text-zinc-500">{article.publishedAt}</span>
        </div>
        <h1 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold leading-tight text-white md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-400">{article.description}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Estimate your baseline first with the{" "}
          <Link href="/quiz/healthspan" className="text-blue-400 underline hover:text-blue-300">
            Healthspan Quiz
          </Link>
          .
        </p>
      </div>

      {/* Keyword badges */}
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Article topics">
        {article.keywords.map((keyword) => (
          <span
            key={keyword}
            className="inline-block rounded-full border border-[#1E2A4A] bg-[#0F1530] px-2.5 py-0.5 text-xs text-zinc-400"
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* Article body */}
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
              {section.paragraphs.map((paragraph, index) => {
                const hasHtml = /<[a-z][\s\S]*>/i.test(paragraph);
                if (hasHtml) {
                  return (
                    <div key={`${section.heading}-${index}`}
                      dangerouslySetInnerHTML={{ __html: paragraph }} />
                  );
                }
                return renderParagraphWithLinks(paragraph, `${section.heading}-${index}`);
              })}
            </section>
          ))}
        </section>
      )}

      <GuidePromoBanner compact />

      <DisclosureNotice variant="medical" />
      <RelatedLinks slug={article.slug} />
      <NewsletterCTA
        title="Want this level of detail every week?"
        description="Subscribe for actionable TRT and testosterone optimization briefs with safety notes and implementation checkpoints."
        buttonLabel="Send weekly brief"
        formId={`article-${article.slug}-email`}
      />
    </article>
  );
}
