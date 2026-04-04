"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogArticle } from "@/data/articles";

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  TRT: "border-l-blue-500",
  Supplements: "border-l-amber-500",
  Recovery: "border-l-sky-500",
  Lifestyle: "border-l-emerald-500",
  Science: "border-l-purple-500",
  Nutrition: "border-l-orange-500",
  "Metabolic Health": "border-l-rose-500",
  Biomarkers: "border-l-indigo-500",
  Fitness: "border-l-cyan-500",
  "Natural Optimization": "border-l-lime-500",
  "Protocol & Management": "border-l-blue-400",
  "Women's Health": "border-l-pink-500",
  "Men's Health": "border-l-violet-500",
  Exercise: "border-l-teal-500",
  Skincare: "border-l-fuchsia-500",
  Testing: "border-l-yellow-500",
  Reviews: "border-l-slate-400",
  Resources: "border-l-zinc-400",
  Directory: "border-l-stone-400",
};

const CATEGORY_PILL_COLORS: Record<string, string> = {
  TRT: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  Supplements: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  Recovery: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  Lifestyle: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Science: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  Nutrition: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  "Metabolic Health": "bg-rose-500/10 text-rose-300 border-rose-500/30",
  Biomarkers: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  Fitness: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  "Natural Optimization": "bg-lime-500/10 text-lime-300 border-lime-500/30",
  "Protocol & Management": "bg-blue-500/10 text-blue-300 border-blue-500/30",
};

function getCategoryPill(category: string): string {
  return CATEGORY_PILL_COLORS[category] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
}

function getCategoryBorder(category: string): string {
  return CATEGORY_BORDER_COLORS[category] ?? "border-l-zinc-500";
}

const FEATURED_SLUGS = [
  "enclomiphene-vs-trt",
  "low-testosterone-symptoms",
  "testosterone-replacement-therapy-guide",
];

interface BlogContentProps {
  posts: BlogArticle[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const categories = [...new Set(posts.map((p) => p.category))];
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const featured = FEATURED_SLUGS.map((slug) =>
    posts.find((p) => p.slug === slug)
  ).filter(Boolean) as BlogArticle[];

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  // Group non-featured posts by category
  const featuredSlugs = new Set(FEATURED_SLUGS);
  const nonFeatured = filteredPosts.filter((p) => !featuredSlugs.has(p.slug));
  const grouped = nonFeatured.reduce<Record<string, BlogArticle[]>>(
    (acc, post) => {
      if (!acc[post.category]) acc[post.category] = [];
      acc[post.category].push(post);
      return acc;
    },
    {}
  );
  const sortedCategories = Object.entries(grouped).sort(
    ([, a], [, b]) => b.length - a.length
  );

  return (
    <>
      {/* Category filter tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory("All")}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === "All"
              ? "border-blue-500 bg-blue-500/15 text-blue-300"
              : "border-[#222230] bg-[#12121A] text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          All
          <span className="ml-1.5 opacity-60">{posts.length}</span>
        </button>
        {categories.map((cat) => {
          const count = posts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "border-blue-500 bg-blue-500/15 text-blue-300"
                  : "border-[#222230] bg-[#12121A] text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {cat}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Start Here — Featured row */}
      {activeCategory === "All" && featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Start Here
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-xl border border-[#222230] border-l-[3px] border-l-blue-500 bg-[#12121A] p-6 transition-all hover:scale-[1.01] hover:border-blue-500/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryPill(post.category)}`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-500">{post.readTime}</span>
                </div>
                <h3 className="mb-2 text-base font-bold leading-snug text-white group-hover:text-blue-200">
                  <Link href={`/blog/${post.slug}`} className="hover:no-underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {post.description}
                </p>
                <p className="mt-auto text-xs text-zinc-500">{post.publishedAt}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Category-grouped articles */}
      {sortedCategories.map(([category, categoryPosts]) => (
        <section key={category} className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {category}
            <span className="text-zinc-600">({categoryPosts.length})</span>
          </h2>
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={`${category} articles`}
          >
            {categoryPosts.map((post) => (
              <article
                key={post.slug}
                className={`group flex flex-col rounded-xl border border-[#222230] border-l-2 ${getCategoryBorder(post.category)} bg-[#12121A] p-6 transition-all hover:scale-[1.01] hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryPill(post.category)}`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-500">{post.readTime}</span>
                </div>
                <h2 className="mb-2 text-base font-bold leading-snug text-white group-hover:text-blue-200">
                  <Link href={`/blog/${post.slug}`} className="hover:no-underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {post.description}
                </p>
                <p className="mt-auto text-xs text-zinc-500">{post.publishedAt}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
