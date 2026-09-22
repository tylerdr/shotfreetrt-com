import { NextResponse } from "next/server";
import {
  buildConfirmationEmail,
  buildSubscriberPayload,
  CLINIC_LEAD_SOURCE,
  CLINIC_RESOURCE_PATH,
  DEFAULT_QUIZ_PATH,
  DEFAULT_RESOURCE_PATH,
  getLeadCaptureConfig,
  isValidEmail,
  normalizeEmail,
  normalizeSource,
  normalizeSourceUrl,
  type LeadCaptureConfig,
  type SubscriberPayload
} from "@/lib/lead-capture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriberRecord = SubscriberPayload & { id?: string };

function resourceForSource(source: string) {
  if (source === CLINIC_LEAD_SOURCE) {
    return {
      clinic: CLINIC_RESOURCE_PATH,
      demo: DEFAULT_RESOURCE_PATH,
    };
  }

  return {
    guide: DEFAULT_RESOURCE_PATH,
    quiz: DEFAULT_QUIZ_PATH,
  };
}

function providerHeaders(config: LeadCaptureConfig, extra: Record<string, string> = {}): HeadersInit {
  return {
    apikey: config.supabaseServiceRoleKey,
    Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function subscriberUrl(config: LeadCaptureConfig, email: string): string {
  const params = new URLSearchParams({
    select: "id,tenant_id,email,source,source_url,subscribed_at",
    tenant_id: `eq.${config.tenantId}`,
    email: `eq.${email}`,
    limit: "1"
  });
  return `${config.supabaseUrl}/rest/v1/subscribers?${params.toString()}`;
}

async function findSubscriber(config: LeadCaptureConfig, email: string): Promise<SubscriberRecord | null> {
  const response = await fetch(subscriberUrl(config, email), {
    method: "GET",
    headers: providerHeaders(config),
    cache: "no-store"
  });
  if (!response.ok) throw new Error("subscriber_read_failed");
  const rows = (await response.json()) as SubscriberRecord[];
  return rows[0] ?? null;
}

async function saveSubscriber(config: LeadCaptureConfig, payload: SubscriberPayload): Promise<SubscriberRecord | null> {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/subscribers`, {
    method: "POST",
    headers: providerHeaders(config, { Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  if (response.status === 409) return findSubscriber(config, payload.email);
  if (!response.ok) throw new Error("subscriber_write_failed");
  const rows = (await response.json()) as SubscriberRecord[];
  return rows[0] ?? findSubscriber(config, payload.email);
}

type ConfirmationResult = {
  status: "sent" | "unavailable" | "failed";
  message: string;
};

async function sendConfirmation(config: LeadCaptureConfig, email: string, source: string): Promise<ConfirmationResult> {
  const clinicLead = source === CLINIC_LEAD_SOURCE;

  if (!config.resendApiKey || !config.resendFromEmail) {
    return {
      status: "unavailable",
      message: clinicLead
        ? "Your work email was saved. The clinic launch overview is available here now."
        : "Your email was saved. The guide is available now, and confirmation email delivery is waiting for verified sender configuration."
    };
  }

  const confirmation = buildConfirmationEmail(email, source);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": confirmation.headers["Idempotency-Key"]
    },
    body: JSON.stringify({
      from: config.resendFromEmail,
      to: confirmation.to,
      subject: confirmation.subject,
      text: confirmation.text,
      ...(config.resendReplyToEmail ? { reply_to: config.resendReplyToEmail } : {})
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      status: "failed",
      message: clinicLead
        ? "Your work email was saved. The clinic launch overview is available here now."
        : "Your email was saved, but confirmation delivery did not complete. Please try again later; the guide is available now."
    };
  }

  return {
    status: "sent",
    message: clinicLead
      ? "Check your inbox for the clinic launch overview. You can also walk the patient-facing demo now."
      : "Check your inbox for the guide and the next step. The guide is also available now."
  };
}

function responseBody(confirmation: ConfirmationResult, status: "saved" | "existing", source: string) {
  return {
    ok: true,
    status,
    confirmation_status: confirmation.status,
    message: confirmation.message,
    resource: resourceForSource(source)
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_payload", message: "Enter a valid email address." }, { status: 400 });
  }

  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, code: "invalid_email", message: "Enter a valid email address." }, { status: 400 });
  }
  if (input.consent !== true) {
    return NextResponse.json({ ok: false, code: "consent_required", message: "Please allow the requested resource and future updates before submitting." }, { status: 400 });
  }

  const config = getLeadCaptureConfig();
  if (!config) {
    return NextResponse.json({
      ok: false,
      code: "storage_unavailable",
      message: "We couldn't save your email yet. Please try again later.",
      href: DEFAULT_RESOURCE_PATH
    }, { status: 503 });
  }

  const source = normalizeSource(input.source);
  const payload = buildSubscriberPayload({
    config,
    email,
    source,
    sourceUrl: normalizeSourceUrl(input.source_url)
  });

  try {
    const existing = await findSubscriber(config, email);
    if (existing) {
      const confirmation = await sendConfirmation(config, email, source);
      return NextResponse.json(responseBody(confirmation, "existing", source));
    }

    const saved = await saveSubscriber(config, payload);
    if (!saved) {
      return NextResponse.json({ ok: false, code: "storage_unavailable", message: "We couldn't confirm the saved record. Please try again." }, { status: 502 });
    }
    const confirmation = await sendConfirmation(config, email, source);
    return NextResponse.json(responseBody(confirmation, "saved", source));
  } catch {
    return NextResponse.json({ ok: false, code: "storage_unavailable", message: "We couldn't save your email. Please try again later." }, { status: 502 });
  }
}
