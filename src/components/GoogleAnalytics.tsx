"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { isAnalyticsExemptPath } from "@/lib/analytics";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (!GA_ID || typeof gtag !== "function") return;
    // This component is never rendered on /quiz or /decision-guide — they
    // sit under a separate root layout ((isolated)/layout.tsx) that never
    // mounts GoogleAnalytics at all, so GA's script never loads there in
    // the first place. This check is a defensive second layer in case a
    // future route is added under this layout without being added to
    // isAnalyticsExemptPath; it is not what keeps those two routes clean.
    if (isAnalyticsExemptPath(pathname)) return;
    gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
