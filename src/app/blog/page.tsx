import type { Metadata } from "next";
import Link from "next/link";

import BlogContent from "@/components/BlogContent";
import { DisclosureNotice } from "@/components/DisclosureNotice";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllArticles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read evidence-based articles covering TRT protocols, testosterone optimization, bloodwork, side effects, and healthy aging.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogIndexPage() {
  const posts = getAllArticles();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold text-white md:text-4xl">
          TRT &amp; Testosterone Blog
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
          {posts.length} evidence-based articles covering TRT protocols, testosterone optimization,
          bloodwork interpretation, and hormone health.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          New reader? Start with our{" "}
          <Link href="/start-here" className="text-blue-400 underline hover:text-blue-300">
            quickstart guide
          </Link>{" "}
          or browse{" "}
          <Link href="/resources" className="text-blue-400 underline hover:text-blue-300">
            vetted tools
          </Link>
          .
        </p>
      </div>

      <BlogContent posts={posts} />

      <DisclosureNotice variant="medical" />
      <NewsletterSignup
        formId="blog-listing-email"
        buttonLabel="Get weekly protocols"
      />
    </>
  );
}
