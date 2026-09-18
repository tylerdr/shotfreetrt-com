// Lightweight analytics tracker for AI Ventures portfolio
const SUPABASE_URL = "https://mfzxaxzozqiehbwlfmcd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1menhheHpvenFpZWhid2xmbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1OTAyMzgsImV4cCI6MjA4ODE2NjIzOH0.aTrWd0kIxdU6d38A5gi28Ofq8OXiCZd-QrmS1Pm7Iyw";

export type AnalyticsEvent = {
  event_type: string;
  page_url?: string;
  referrer?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
};

export type Ga4EventParams = Record<string, string | number | boolean | object | undefined>;

type BrowserAnalyticsWindow = Window & {
  gtag?: (name: "event", eventName: string, params: Ga4EventParams) => void;
  __sftGa4Queue?: Array<{ eventName: string; params: Ga4EventParams }>;
};

function safeAnalyticsPath(value: string): string {
  if (!value) return "";

  try {
    const parsed = new URL(value, typeof window !== "undefined" ? window.location.origin : "https://shotfreetrt.com");
    return parsed.pathname.startsWith("/") ? parsed.pathname.slice(0, 240) : "";
  } catch {
    return value.startsWith("/") ? value.split(/[?#]/, 1)[0].slice(0, 240) : "";
  }
}

function sanitizeAnalyticsValue(value: unknown, key = ""): unknown {
  if (typeof value === "string") {
    if (key === "page_location") {
      try {
        const parsed = new URL(value);
        return `${parsed.origin}${parsed.pathname}`.slice(0, 300);
      } catch {
        return "";
      }
    }
    if (/^https?:\/\//i.test(value) || value.startsWith("//")) {
      return safeAnalyticsPath(value);
    }
    return value.includes("?") || value.includes("#")
      ? value.split(/[?#]/, 1)[0]
      : value;
  }
  if (Array.isArray(value)) return value.map((entry) => sanitizeAnalyticsValue(entry, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entry]) => [
        entryKey,
        sanitizeAnalyticsValue(entry, entryKey)
      ])
    );
  }
  return value;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("_av_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_av_sid", sid);
  }
  return sid;
}

function getContext(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  return {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    user_agent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function trackEvent(
  tenantId: string,
  event: AnalyticsEvent
): Promise<void> {
  try {
    const payload = {
      tenant_id: tenantId,
      event_type: event.event_type,
      page_url: safeAnalyticsPath(
        event.page_url || (typeof window !== "undefined" ? window.location.pathname : "")
      ),
      referrer: safeAnalyticsPath(
        event.referrer || (typeof document !== "undefined" ? document.referrer : "")
      ),
      session_id:
        event.session_id && !/^cs_/i.test(event.session_id)
          ? sanitizeAnalyticsValue(event.session_id)
          : getSessionId(),
      metadata: sanitizeAnalyticsValue({ ...getContext(), ...event.metadata }) as Record<
        string,
        unknown
      >,
    };

    await fetch(`${SUPABASE_URL}/rest/v1/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silent fail
  }
}

export function trackPageView(tenantId: string, metadata?: Record<string, unknown>) {
  return trackEvent(tenantId, { event_type: "page_view", metadata });
}

export function trackClick(tenantId: string, target: string, metadata?: Record<string, unknown>) {
  return trackEvent(tenantId, { event_type: "click", metadata: { target, ...metadata } });
}

export function trackCtaClick(
  tenantId: string,
  eventType: string,
  metadata?: Record<string, unknown>
) {
  return trackEvent(tenantId, { event_type: eventType, metadata });
}

export function trackImpression(tenantId: string, itemType: string, itemId: string, metadata?: Record<string, unknown>) {
  return trackEvent(tenantId, { event_type: "impression", metadata: { item_type: itemType, item_id: itemId, ...metadata } });
}

export function trackGa4Event(eventName: string, params: Ga4EventParams = {}) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as BrowserAnalyticsWindow;
  const gtag = analyticsWindow.gtag;
  const safeParams = sanitizeAnalyticsValue(params) as Ga4EventParams;

  if (typeof gtag === "function") {
    gtag("event", eventName, safeParams);
    return;
  }

  analyticsWindow.__sftGa4Queue ??= [];
  analyticsWindow.__sftGa4Queue.push({ eventName, params: safeParams });
}

export function flushGa4EventQueue() {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as BrowserAnalyticsWindow;
  const gtag = analyticsWindow.gtag;
  const queue = analyticsWindow.__sftGa4Queue;
  if (typeof gtag !== "function" || !queue?.length) return;

  analyticsWindow.__sftGa4Queue = [];
  for (const event of queue) {
    gtag("event", event.eventName, event.params);
  }
}
