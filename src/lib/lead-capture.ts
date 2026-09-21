import { createHash } from "node:crypto";

export const DEFAULT_LEAD_SOURCE = "shotfreetrt-free-resource";
export const DEFAULT_RESOURCE_PATH = "/decision-guide";
export const DEFAULT_QUIZ_PATH = "/quiz/healthspan";

export type LeadCaptureConfig = {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  tenantId: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  resendReplyToEmail?: string;
};

export type SubscriberPayload = {
  tenant_id: string;
  email: string;
  source: string;
  source_url: string;
  subscribed_at: string;
};

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function normalizeSource(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_LEAD_SOURCE;
  const source = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return source || DEFAULT_LEAD_SOURCE;
}

export function normalizeSourceUrl(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return DEFAULT_RESOURCE_PATH;
  const sourceUrl = value.trim().slice(0, 300);
  return /^\/[a-zA-Z0-9/?=&._%#-]*$/.test(sourceUrl) ? sourceUrl : DEFAULT_RESOURCE_PATH;
}

export function getLeadCaptureConfig(env: NodeJS.ProcessEnv = process.env): LeadCaptureConfig | null {
  const supabaseUrl = env.SHOTFREETRT_SUPABASE_URL?.trim() ?? "";
  const supabaseServiceRoleKey = env.SHOTFREETRT_SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const tenantId = env.SHOTFREETRT_TENANT_ID?.trim() ?? "";
  if (!supabaseUrl || !supabaseServiceRoleKey || !tenantId) return null;

  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    supabaseServiceRoleKey,
    tenantId,
    resendApiKey: env.RESEND_API_KEY?.trim() || undefined,
    resendFromEmail: env.RESEND_FROM_EMAIL?.trim() || undefined,
    resendReplyToEmail: env.RESEND_REPLY_TO_EMAIL?.trim() || undefined
  };
}

export function buildSubscriberPayload({
  config,
  email,
  source,
  sourceUrl,
  subscribedAt = new Date().toISOString()
}: {
  config: Pick<LeadCaptureConfig, "tenantId">;
  email: string;
  source?: unknown;
  sourceUrl?: unknown;
  subscribedAt?: string;
}): SubscriberPayload {
  return {
    tenant_id: config.tenantId,
    email: normalizeEmail(email),
    source: normalizeSource(source),
    source_url: normalizeSourceUrl(sourceUrl),
    subscribed_at: subscribedAt
  };
}

export function buildConfirmationIdempotencyKey(email: string): string {
  return `shotfreetrt-resource-${createHash("sha256").update(normalizeEmail(email)).digest("hex")}`;
}

export function buildConfirmationMessage(): string {
  return `Your ShotFreeTRT decision resources are ready. Start with ${DEFAULT_RESOURCE_PATH}, then use the private quiz at ${DEFAULT_QUIZ_PATH}. These pages are educational and do not diagnose, prescribe, or assess treatment eligibility.`;
}

export function buildConfirmationEmail(email: string): {
  from: string;
  to: string[];
  subject: string;
  text: string;
  headers: Record<string, string>;
} {
  return {
    from: "ShotFreeTRT <resources@shotfreetrt.com>",
    to: [email],
    subject: "Your ShotFreeTRT decision resources",
    text: `${buildConfirmationMessage()}\n\nDecision guide: https://shotfreetrt.com${DEFAULT_RESOURCE_PATH}\nPrivate quiz: https://shotfreetrt.com${DEFAULT_QUIZ_PATH}`,
    headers: {
      "Idempotency-Key": buildConfirmationIdempotencyKey(email)
    }
  };
}
