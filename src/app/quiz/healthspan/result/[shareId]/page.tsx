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

  const title = decoded
    ? `My TRT path: ${decoded.result.primaryPathway.title}`
    : "See my ShotFreeTRT quiz result";
  const description = decoded
    ? `I scored ${decoded.result.score}/100 and my top path was ${decoded.result.primaryPathway.title} on the ShotFreeTRT quiz.`
    : "See my ShotFreeTRT quiz result and compare your own TRT-focused recommendation.";

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
        <h1>Shared TRT Quiz Result</h1>
        <p>
          This is a shared ShotFreeTRT result. Compare it to your own symptoms, lifestyle drag, and
          treatment-path fit.
        </p>
      </section>

      <QuizResult result={decoded.result} shareUrl={shareUrl} showTakeQuizCta />
    </>
  );
}
