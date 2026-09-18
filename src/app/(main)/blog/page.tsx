import type { Metadata } from "next";
import Link from "next/link";
import BlogContent from "@/components/BlogContent";
import { DisclosureNotice } from "@/components/DisclosureNotice";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { getAllArticles, toArticleListing } from "@/data/article-catalog";
import { evidenceGuides, EVIDENCE_CHECKED_AT } from "@/data/evidence-guides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "TRT Decision Library: Options, Monitoring and Costs",
  description: "Start with three source-refreshed guides: enclomiphene versus TRT, oral testosterone monitoring, and the full cost of care. Then prepare your appointment questions.",
  alternates: { canonical: "/blog" },
};
export default function BlogIndexPage() {
  const posts = getAllArticles();
  return <>
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold text-white md:text-4xl">Make the next decision clearer.</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">Start with the difference between options, the routine a product requires, and the complete bill. These guides lead to questions—not an automated treatment recommendation.</p>
      <p className="mt-2 text-sm text-zinc-400">Build your appointment checklist with the <Link href="/quiz/healthspan" className="text-blue-400 underline">free decision quiz</Link>.</p>
    </div>
    <section className="mb-12" aria-labelledby="refreshed-guides">
      <h2 id="refreshed-guides" className="text-2xl font-bold">Three useful places to start</h2>
      <p className="mb-5 mt-2 text-sm text-muted-foreground">Sources checked {EVIDENCE_CHECKED_AT}. This marks these three guides, not a clinical review of the entire library.</p>
      <div className="grid gap-4 md:grid-cols-3">{evidenceGuides.map((guide, index) => <Card key={guide.slug}>
        <CardHeader><span className="text-sm font-semibold text-primary">0{index + 1} · {index === 0 ? "Understand the options" : index === 1 ? "Understand the routine" : "Understand the bill"}</span><CardTitle className="text-lg leading-snug"><Link href={`/blog/${guide.slug}`}>{guide.title}</Link></CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{guide.description}</p><Link className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold" href={`/blog/${guide.slug}`}>Read the sourced guide →</Link></CardContent>
      </Card>)}</div>
    </section>
    <h2 className="mb-3 text-2xl font-bold">Browse the full library</h2>
    <p className="mb-6 text-sm text-muted-foreground">{posts.length} articles. Review dates and sources vary; older articles have not all received the source refresh above.</p>
    <BlogContent posts={posts.map(toArticleListing)} />
    <DisclosureNotice variant="medical" /><NewsletterCTA />
  </>;
}
