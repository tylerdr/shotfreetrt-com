import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuizResult } from "@/components/quiz/QuizResult";
import { siteUrl } from "@/data/articles";
import { decodeHealthspanSharePayload } from "@/lib/quiz/healthspan-share";

type PageProps = {
  params: Promise<{ shareId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const decoded = decodeHealthspanSharePayload(shareId);

  const scoreYears = decoded ? Math.round(decoded.result.projectedHealthspan) : "--";
  const title = `My Healthspan Score: ${scoreYears} years`;
  const description = decoded
    ? `I scored ${decoded.result.score}/100 with a ${decoded.result.grade} grade on the ShotFreeTRT Healthspan Quiz.`
    : "See my ShotFreeTRT Healthspan Quiz result and compare your own score.";

  return {
    title,
    description,
    alternates: {
      canonical: `/quiz/healthspan/result/${shareId}`
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/quiz/healthspan/result/${shareId}`,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function SharedHealthspanResultPage({ params }: PageProps) {
  const { shareId } = await params;
  const decoded = decodeHealthspanSharePayload(shareId);

  if (!decoded) {
    notFound();
  }

  const shareUrl = `${siteUrl}/quiz/healthspan/result/${shareId}`;

  return (
    <>
      <section className="hero">
        <h1>Shared Healthspan Result</h1>
        <p>
          This is a shared ShotFreeTRT quiz result. Compare it to your own profile and generate your personalized plan.
        </p>
      </section>

      <QuizResult result={decoded.result} shareUrl={shareUrl} showTakeQuizCta />
    </>
  );
}
