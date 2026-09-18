import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { inter, barlowCondensed } from "../fonts";
import { baseSiteMetadata } from "../site-metadata";
import "../globals.css";

export const metadata: Metadata = {
  ...baseSiteMetadata,
  title: { default: "ShotFreeTRT | Understand Your Options Before You Commit", template: "%s | ShotFreeTRT" },
  description: "Understand testosterone treatment options, compare clinic costs, and prepare questions for your clinician. Education, not prescriptions.",
};

// A deliberately separate root layout for /quiz and /decision-guide: no
// GoogleAnalytics, no AnalyticsProvider, no third-party script of any kind.
// Being a distinct root layout (its own <html>/<body>) from (main)'s means
// Next.js can't client-side-transition into or out of these routes — every
// crossing is a full document load, so a script loaded on a (main) page
// never persists into this tree. See (main)/layout.tsx for the other half
// of this split.
export default function IsolatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
    <body className="min-h-screen bg-background text-foreground antialiased">
      <SiteChrome>{children}</SiteChrome>
    </body>
  </html>;
}
