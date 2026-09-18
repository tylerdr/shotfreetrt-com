import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { journeyForArticle, quizPath } from "@/lib/journeys";

export function JourneyArticleCTA({ slug }: { slug: string }) {
  const journey = journeyForArticle(slug);
  if (!journey) return null;
  return <Card className="mb-8 border-primary/30 print:hidden">
    <CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">Turn this reading into your next step</p><CardTitle className="text-xl">{journey.promise}</CardTitle></CardHeader>
    <CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Six questions. A printable decision brief. No diagnosis, email gate, or treatment score.</p><div className="flex flex-wrap gap-3"><Button asChild className="h-auto min-h-11 whitespace-normal text-left"><Link href={quizPath(journey)} prefetch={false}>Build my decision brief</Link></Button><Button asChild variant="outline"><Link href={`/topics/${journey.slug}`} prefetch={false}>Read the short explainer</Link></Button></div></CardContent>
  </Card>;
}
