import Link from "next/link";

import { getRelatedArticles } from "@/data/articles";

type RelatedLinksProps = {
  slug: string;
};

export function RelatedLinks({ slug }: RelatedLinksProps) {
  const related = getRelatedArticles(slug);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-label="Related longevity articles">
      <h2>Related Articles</h2>
      <div className="card-grid">
        {related.map((article) => (
          <article key={article.slug} className="card">
            <h3>
              <Link href={`/blog/${article.slug}`}>{article.title}</Link>
            </h3>
            <p>{article.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
