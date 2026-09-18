import { NextResponse } from "next/server";

export const runtime = "nodejs";

// There is no durable, verified email-delivery backend for this site. This
// endpoint intentionally fails closed: it never writes a submitted address
// anywhere (no filesystem/database persistence) and never reports success.
// The UI should point readers to a real, working resource (the free
// decision guide) instead of calling this endpoint. It is kept only so that
// any lingering client-side call gets an honest failure, not silent data
// collection or a fabricated confirmation.
export async function POST() {
  return NextResponse.json(
    {
      message: "Email signup isn't available yet. Use the free decision guide instead.",
      href: "/decision-guide"
    },
    { status: 503 }
  );
}
