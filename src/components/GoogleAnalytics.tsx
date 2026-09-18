"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { flushGa4EventQueue, trackGa4Event } from "@/lib/analytics";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID) return;
    // Auto pageviews are disabled below. Emit one explicit pathname-only view
    // for the initial render and every client-side route transition.
    trackGa4Event("page_view", {
      page_path: pathname,
      page_location: window.location.origin + pathname,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onReady={flushGa4EventQueue}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
          if (Array.isArray(window.__sftGa4Queue)) {
            window.__sftGa4Queue.forEach(function(item) {
              gtag('event', item.eventName, item.params);
            });
            window.__sftGa4Queue = [];
          }
        `}
      </Script>
    </>
  );
}
