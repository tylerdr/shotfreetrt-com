import type { MetadataRoute } from "next";
import { getAllArticles, siteUrl } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not manufacture fresh modification times on every build. Only dates
  // backed by an actual content change are supplied. Pilot remains noindex.
  const paths = ["", "/about", "/start-here", "/resources", "/blog", "/pricing", "/decision-guide", "/quiz/healthspan", "/guides/longevity-blueprint", "/privacy", "/terms"];
  const revised = new Set(["", "/pricing", "/decision-guide"]);
  const staticPages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${siteUrl}${path}`,
    ...(revised.has(path) ? { lastModified: "2026-09-17" } : {}),
  }));
  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => {
    const rawDate = article.updatedAt ?? article.publishedAt;
    const date = new Date(rawDate);
    return { url: `${siteUrl}/blog/${article.slug}`, ...(Number.isNaN(date.getTime()) ? {} : { lastModified: date }) };
  });
  return [...staticPages, ...articlePages];
}
