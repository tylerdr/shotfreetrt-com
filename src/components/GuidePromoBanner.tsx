import Link from "next/link";

import { ArrowRight, FileDown, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GuidePromoBannerProps = {
  compact?: boolean;
};

export default function GuidePromoBanner({
  compact = false
}: GuidePromoBannerProps) {
  return (
    <Card
      className={`mt-8 border-[#1E2A4A] bg-gradient-to-br from-[#0F1530] to-[#12121A] text-zinc-100 shadow-xl shadow-black/45 ${compact ? "p-1" : ""}`}
      aria-label="The Shot-Free TRT Blueprint promotion"
    >
      <CardHeader className="gap-3">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          <Flame className="size-4" />
          Free guide
        </p>
        <CardTitle className="text-2xl font-black text-white">The Shot-Free TRT Blueprint</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="max-w-3xl text-zinc-400">
          30 days of tactical protocols for sleep, lifting, body composition, stress, and lab prep.
          Built for guys who want results before they commit to full TRT.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
            <Link href="/guides/longevity-blueprint">
              Read the Blueprint
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-blue-500/40 bg-transparent text-blue-300 hover:bg-blue-500/10">
            <Link href="/guides/longevity-blueprint.pdf">
              Download PDF
              <FileDown className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
