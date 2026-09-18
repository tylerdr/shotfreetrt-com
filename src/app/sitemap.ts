import type { MetadataRoute } from "next";
import { getAllArticles, siteUrl } from "@/data/articles";
import { journeys, JOURNEY_UPDATED_AT } from "@/lib/journeys";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/start-here", "/resources", "/blog", "/pricing", "/decision-guide", "/quiz/healthspan", "/guides/longevity-blueprint", "/privacy", "/terms"];
  const staticPages: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${siteUrl}${path}`, ...(path === "" ? { lastModified: JOURNEY_UPDATED_AT } : {}) }));
  const topicPages: MetadataRoute.Sitemap = ["/topics", ...journeys.map(({ slug }) => `/topics/${slug}`)].map((path) => ({ url: `${siteUrl}${path}`, lastModified: JOURNEY_UPDATED_AT }));
  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => { const date = new Date(article.updatedAt ?? article.publishedAt); return { url: `${siteUrl}/blog/${article.slug}`, ...(Number.isNaN(date.getTime()) ? {} : { lastModified: date }) }; });
  // Quiz variants are deliberately noindex, not competing search landing pages.
  return [...staticPages, ...topicPages, ...articlePages];
}
