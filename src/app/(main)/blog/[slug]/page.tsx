import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclosureNotice } from "@/components/DisclosureNotice";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import GuidePromoBanner from "@/components/GuidePromoBanner";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { RelatedLinks } from "@/components/RelatedLinks";
import { articleHeroImages } from "@/data/articleHeroImages";
import { getAllArticles, getArticleBySlug, siteUrl } from "@/data/article-catalog";
import { getEvidenceGuide, evidenceSources } from "@/data/evidence-guides";
import "@/components/evidence-guides.css";

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
type PageProps = { params: Promise<{ slug: string }> };
const serialize = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export function generateStaticParams() { return getAllArticles().map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.title, description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article", title: article.title, description: article.description,
      url: `${siteUrl}/blog/${article.slug}`, publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt, authors: [article.author], tags: article.keywords,
      images: [{ url: "/og-shotfreetrt.png", width: 1024, height: 1024 }],
    },
    keywords: article.keywords,
  };
}
export default async function BlogPostPage({ params }: PageProps) {
  const article = getArticleBySlug((await params).slug);
  if (!article) notFound();
  const guide = getEvidenceGuide(article.slug);
  const heroImage = articleHeroImages[article.slug];
  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const plainText = article.content
    ? article.content.replace(/<[^>]*>/g, " ").replace(/&[a-zA-Z0-9#]+;/g, " ")
    : article.sections.flatMap((section) => section.paragraphs).join(" ");
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: article.title, description: article.description,
    datePublished: article.publishedAt, dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "ShotFreeTRT", url: siteUrl },
    mainEntityOfPage: articleUrl, keywords: article.keywords.join(", "),
    wordCount: plainText.trim().split(/\s+/).filter(Boolean).length,
    image: `${siteUrl}/og-shotfreetrt.png`,
    ...(guide ? { citation: guide.sourceIds.map((id) => evidenceSources[id].url) } : {}),
  };
  const faqJsonLd = article.faqItems?.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: article.faqItems.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  } : null;
  function renderParagraphWithLinks(paragraph: string, keyPrefix: string) {
    return <p>{paragraph.split(/(\/blog\/[a-z0-9-]+)/g).map((part, index) => /^\/blog\/[a-z0-9-]+$/.test(part)
      ? <Link key={`${keyPrefix}-link-${index}`} href={part}>{part}</Link>
      : <span key={`${keyPrefix}-text-${index}`}>{part}</span>)}</p>;
  }
  return <article className="mx-auto max-w-3xl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }} />
    {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(faqJsonLd) }} />}
    <div className="mb-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[article.category] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"}`}>{article.category}</span>
        <span className="text-sm text-zinc-500">{article.readTime}</span>
        <span className="text-sm text-zinc-500">Published <time dateTime={article.publishedAt}>{article.publishedAt}</time></span>
        {article.updatedAt && <span className="text-sm text-zinc-400">Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time></span>}
      </div>
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold leading-tight text-white md:text-4xl">{article.title}</h1>
      <p className="mt-3 text-base leading-7 text-zinc-400">{article.description}</p>
      <p className="mt-2 text-sm text-zinc-500">Preparing for a visit? Take the <Link href="/quiz/healthspan" className="text-blue-400 underline hover:text-blue-300">free decision quiz</Link> or use the <Link href="/decision-guide" className="text-blue-400 underline hover:text-blue-300">decision guide and quote calculator</Link>.</p>
    </div>
    {heroImage && <figure className="mb-8 overflow-hidden rounded-xl border border-[#222230]">
      <EditorialImageFrame src={heroImage.src} width={heroImage.width} height={heroImage.height} sizes="(min-width: 768px) 700px, 100vw" />
      <figcaption className="border-t border-[#222230] px-4 py-2 text-xs text-zinc-500">{heroImage.caption}</figcaption>
    </figure>}
    <div className="mb-8 flex flex-wrap gap-2" aria-label="Article topics">{article.keywords.map((keyword) => <span key={keyword} className="inline-block rounded-full border border-[#1E2A4A] bg-[#0F1530] px-2.5 py-0.5 text-xs text-zinc-400">{keyword}</span>)}</div>
    {article.content ? <section className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} /> : <section className="article-content">{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => /<[a-z][\s\S]*>/i.test(paragraph)
      ? <div key={`${section.heading}-${index}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
      : <div key={`${section.heading}-${index}`}>{renderParagraphWithLinks(paragraph, `${section.heading}-${index}`)}</div>)}</section>)}</section>}
    {!guide && <GuidePromoBanner compact />}
    <DisclosureNotice variant="medical" />
    <RelatedLinks slug={article.slug} />
    <NewsletterCTA title="Preparing to see a clinician?" description="Use the free decision guide for appointment questions and a written-quote comparison calculator before you commit." />
  </article>;
}
