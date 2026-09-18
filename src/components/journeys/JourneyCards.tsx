import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorialImageFrame } from "@/components/EditorialImageFrame";
import { journeys } from "@/lib/journeys";

export function JourneyCards() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {journeys.map((journey, index) => <Card key={journey.slug} className="overflow-hidden border-border shadow-none">
      <EditorialImageFrame src={journey.image} width={960} height={640} sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw" />
      <CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">0{index + 1} · {journey.label}</p><CardTitle className="text-xl leading-snug">{journey.title}</CardTitle></CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4"><p className="text-sm leading-relaxed text-muted-foreground">{journey.promise}</p><Button asChild variant="outline" className="mt-auto h-auto min-h-11 w-full whitespace-normal text-left"><Link href={`/topics/${journey.slug}`} prefetch={false}>Explore this question <ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link></Button></CardContent>
    </Card>)}
  </div>;
}
