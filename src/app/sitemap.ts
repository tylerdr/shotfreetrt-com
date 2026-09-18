import type { MetadataRoute } from "next";
import { getAllArticles, siteUrl } from "@/data/article-catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/start-here", "/resources", "/blog", "/pricing", "/decision-guide", "/quiz/healthspan", "/guides/longevity-blueprint", "/privacy", "/terms"];
  const revised = new Set(["", "/pricing", "/decision-guide", "/blog"]);
  const staticPages: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${siteUrl}${path}`, ...(revised.has(path) ? { lastModified: "2026-09-17" } : {}) }));
  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => {
    const date = new Date(article.updatedAt ?? article.publishedAt);
    return { url: `${siteUrl}/blog/${article.slug}`, ...(Number.isNaN(date.getTime()) ? {} : { lastModified: date }) };
  });
  return [...staticPages, ...articlePages];
}
