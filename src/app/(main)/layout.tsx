import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/analytics-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SiteChrome } from "@/components/SiteChrome";
import { inter, barlowCondensed } from "../fonts";
import { baseSiteMetadata } from "../site-metadata";
import "../globals.css";

export const metadata: Metadata = {
  ...baseSiteMetadata,
  title: { default: "ShotFreeTRT | Understand Your Options Before You Commit", template: "%s | ShotFreeTRT" },
  description: "Understand testosterone treatment options, compare clinic costs, and prepare questions for your clinician. Education, not prescriptions.",
  openGraph: { type: "website", title: "ShotFreeTRT", description: "Compare options. Understand costs. Prepare for your clinician visit.", url: "https://shotfreetrt.com", siteName: "ShotFreeTRT", images: [{ url: "/og-shotfreetrt.png", width: 1024, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "ShotFreeTRT | Compare Before You Commit", description: "Free decision guide and clinic-cost worksheet. Education, not prescriptions.", images: ["/og-shotfreetrt.png"] },
};

// This root layout covers every page EXCEPT /quiz and /decision-guide (see
// the (isolated) route group). Analytics — GoogleAnalytics (GA4) and the
// Supabase AnalyticsProvider — only ever render in this tree. Because this
// is a distinct root layout from (isolated)'s, Next.js performs a full
// document navigation (not a client-side transition) whenever a link
// crosses between the two, so GA's already-loaded script/dataLayer can
// never carry over into the quiz or decision guide — there is nothing to
// "unload" because the browser never loads it there in the first place.
export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
    <body className="min-h-screen bg-background text-foreground antialiased">
      <AnalyticsProvider>
        <SiteChrome>{children}</SiteChrome>
        <GoogleAnalytics />
      </AnalyticsProvider>
    </body>
  </html>;
}
