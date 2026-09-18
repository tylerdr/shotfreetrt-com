import { promises as fs } from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import {
  BLUEPRINT_ENTITLEMENT_COOKIE,
  verifyBlueprintEntitlementToken
} from "@/lib/entitlement";
import { recordBlueprintDownloadSuccess } from "@/lib/server-analytics";
import {
  privateNoStoreHeaders,
  verifyBlueprintCheckoutSession
} from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_PATH = path.join(
  process.cwd(),
  "public",
  "guides",
  "longevity-blueprint.pdf"
);

function deniedResponse() {
  return new NextResponse("Download unavailable.", {
    status: 403,
    headers: privateNoStoreHeaders("text/plain; charset=utf-8")
  });
}

export async function GET(request: NextRequest) {
  const entitlement = verifyBlueprintEntitlementToken(
    request.cookies.get(BLUEPRINT_ENTITLEMENT_COOKIE)?.value
  );
  const verification = await verifyBlueprintCheckoutSession(entitlement?.sessionId);

  if (!verification.ok) {
    return deniedResponse();
  }

  try {
    const file = await fs.readFile(PDF_PATH);
    const response = new NextResponse(file, {
      status: 200,
      headers: {
        ...privateNoStoreHeaders("application/pdf"),
        "Content-Disposition":
          'attachment; filename="shotfreetrt-longevity-blueprint-2026.pdf"',
        "Content-Length": String(file.byteLength),
        "Content-Security-Policy": "default-src 'none'"
      }
    });
    await recordBlueprintDownloadSuccess(verification.purchase);
    return response;
  } catch {
    return new NextResponse("Download unavailable.", {
      status: 503,
      headers: privateNoStoreHeaders("text/plain; charset=utf-8")
    });
  }
}
