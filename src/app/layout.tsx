import type { Metadata } from "next";
import Link from "next/link";

import { AnalyticsProvider } from "@/components/analytics-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Button } from "@/components/ui/button";
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
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AnalyticsProvider>
          <header className="sticky top-0 z-20 border-b border-border/70 bg-black/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-zinc-100">
                ShotFreeTRT
              </Link>
              <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
                {navItems.map((item) => (
                  <Button key={item.href} asChild variant="ghost" size="sm" className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>

          <footer className="border-t border-border/70 bg-black/40">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-zinc-400 sm:px-6">
              <p>© {new Date().getFullYear()} ShotFreeTRT — no injection-first bias.</p>
              <p>Educational content only. Always confirm treatment decisions with a licensed clinician.</p>
            </div>
          </footer>
          <GoogleAnalytics />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
