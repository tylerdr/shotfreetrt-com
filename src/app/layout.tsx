import type { Metadata } from "next";
import Link from "next/link";

import { AnalyticsProvider } from "@/components/analytics-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shotfreetrt.com"),
  title: {
    default: "ShotFreeTRT | Natural Testosterone Optimization",
    template: "%s | ShotFreeTRT"
  },
  description:
    "Practical, evidence-based protocols to improve testosterone naturally before TRT injections.",
  openGraph: {
    type: "website",
    title: "ShotFreeTRT",
    description:
      "Natural testosterone optimization with practical protocols, labs, and decision guides.",
    url: "https://shotfreetrt.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShotFreeTRT | Natural Testosterone Optimization",
    description:
      "Natural testosterone optimization with practical protocols, labs, and decision guides.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <header className="site-header">
            <div className="container nav-wrap">
              <Link href="/" className="brand">
                ShotFreeTRT
              </Link>
              <nav className="nav-links" aria-label="Primary">
                <Link href="/">Home</Link>
                <Link href="/start-here">Start Here</Link>
                <Link href="/resources">Resources</Link>
                <Link href="/about">About</Link>
                <Link href="/blog">Blog</Link>
              </nav>
            </div>
          </header>
          <main>
            <div className="container">{children}</div>
          </main>
          <footer>
            <div className="container">
              © {new Date().getFullYear()} ShotFreeTRT. Natural testosterone
              optimization without injection-first bias.
            </div>
          </footer>
          <GoogleAnalytics />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
