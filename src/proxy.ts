import { NextRequest, NextResponse } from "next/server";

const paidAssetPaths = new Set([
  "/longevity-blueprint.pdf",
  "/guides/longevity-blueprint.pdf"
]);

/**
 * This runs before public-file handling. The PDFs remain in the repository for
 * now, but neither legacy URL is allowed to reach Next's static-file handler.
 */
export function proxy(request: NextRequest) {
  if (paidAssetPaths.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL("/guides/longevity-blueprint", request.url),
      307
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/longevity-blueprint.pdf", "/guides/longevity-blueprint.pdf"]
};
