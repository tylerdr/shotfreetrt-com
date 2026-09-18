/** One read boundary for routes, listing cards, related links and the sitemap.
 * Replaces three existing articles without editing the 1.9 MB legacy registry.
 */
import {
  getAllArticles as getLegacyArticles,
  getRelatedArticles as getLegacyRelated,
  siteUrl,
  type BlogArticle,
} from "./articles";
import { evidenceGuides, getEvidenceGuide, renderEvidenceGuide, EVIDENCE_CHECKED_AT } from "./evidence-guides";
export { siteUrl };
export type { BlogArticle };

function refresh(article: BlogArticle): BlogArticle {
  const guide = getEvidenceGuide(article.slug);
  if (!guide) return article;
  return {
    ...article,
    title: guide.title,
    description: guide.description,
    // Retain the original URL and first-publication history.
    publishedAt: article.publishedAt,
    updatedAt: EVIDENCE_CHECKED_AT,
    author: "ShotFreeTRT Editorial Team",
    category: "TRT",
    readTime: guide.readTime,
    keywords: guide.keywords,
    sections: [],
    content: renderEvidenceGuide(guide),
    faqItems: guide.faqItems.map(({ q, a }) => ({ q, a })),
  };
}
const articles = getLegacyArticles();
for (const guide of evidenceGuides) {
  if (articles.filter((article) => article.slug === guide.slug).length !== 1) {
    throw new Error(`Evidence refresh requires exactly one existing article: ${guide.slug}`);
  }
}
const catalog = articles.map(refresh);
const bySlug = new Map(catalog.map((article) => [article.slug, article]));

export function getAllArticles(): BlogArticle[] { return [...catalog]; }
export function getArticleBySlug(slug: string): BlogArticle | undefined { return bySlug.get(slug); }
export function getRelatedArticles(slug: string): BlogArticle[] {
  const preferred = getEvidenceGuide(slug) ? evidenceGuides.filter((guide) => guide.slug !== slug).map((guide) => bySlug.get(guide.slug)!) : [];
  const legacy = getLegacyRelated(slug).map((article) => bySlug.get(article.slug) ?? article);
  return [...new Map([...preferred, ...legacy].filter((article) => article.slug !== slug).map((article) => [article.slug, article])).values()].slice(0, 3);
}
/** The client-side category filter needs summaries, never the entire HTML library. */
export function toArticleListing(article: BlogArticle): BlogArticle {
  return { ...article, content: undefined, sections: [], faqItems: undefined };
}
