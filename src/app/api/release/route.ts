const COPY_CONTRACT = "decision-first-v1";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return Response.json(
    {
      app: "shotfreetrt",
      release: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
      copyContract: COPY_CONTRACT,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
