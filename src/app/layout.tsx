import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";

import { AnalyticsProvider } from "@/components/analytics-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
});

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
    siteName: "ShotFreeTRT",
    images: [{ url: "/og-shotfreetrt.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShotFreeTRT | Natural Testosterone Optimization",
    description:
      "Natural testosterone optimization with practical protocols, labs, and decision guides.",
    images: ["/og-shotfreetrt.png"]
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  alternates: {
    canonical: "/"
  }
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/quiz/healthspan/advanced", label: "AI Plan" },
  { href: "/start-here", label: "Start Here" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" }
];

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-[#0A0A0F] text-[#E0E7FF] antialiased">
        <AnalyticsProvider>
          <header className="sticky top-0 z-20 border-b border-[#222230] bg-black/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <Link href="/" className="font-[family-name:var(--font-barlow-condensed)] text-xl font-extrabold tracking-tight text-white">
                ShotFreeTRT
              </Link>
              <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
                {navItems.map((item) => (
                  <Button key={item.href} asChild variant="ghost" size="sm" className="text-zinc-400 hover:bg-zinc-800 hover:text-blue-400 transition-colors">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
            </div>
          </header>

          {/* Credibility strip */}
          <div className="border-b border-[#222230] bg-[#0F0F1F]/60">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 text-xs font-medium tracking-wide text-zinc-500 sm:px-6">
              <span>EVIDENCE-BASED</span>
              <span className="text-[#222230]">|</span>
              <span>NO CLINIC BIAS</span>
              <span className="text-[#222230]">|</span>
              <span>EVERY CLAIM SOURCED</span>
              <span className="text-[#222230]">|</span>
              <span>FERTILITY-FIRST APPROACH</span>
            </div>
          </div>

          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>

          <footer className="border-t border-[#222230] bg-[rgba(10,10,15,0.6)]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-zinc-500 sm:px-6">
              <p>&copy; {new Date().getFullYear()} ShotFreeTRT &mdash; no injection-first bias.</p>
              <p>Educational content only. Always confirm treatment decisions with a licensed clinician.</p>
            </div>
          </footer>
          <GoogleAnalytics />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
