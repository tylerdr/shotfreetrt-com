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
    // The quiz and decision guide promise that nothing is sent off the
    // page, so they are exempt from every page-view event, including the
    // first load (send_page_view is disabled in the config script below;
    // this effect is the only source of page_view events).
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
