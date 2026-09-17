import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import { AnalyticsProvider } from "@/components/analytics-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-barlow-condensed" });

export const metadata: Metadata = {
  metadataBase: new URL("https://shotfreetrt.com"),
  title: { default: "ShotFreeTRT | Understand Your Options Before You Commit", template: "%s | ShotFreeTRT" },
  description: "Understand testosterone treatment options, compare clinic costs, and prepare questions for your clinician. Education, not prescriptions.",
  openGraph: { type: "website", title: "ShotFreeTRT", description: "Compare options. Understand costs. Prepare for your clinician visit.", url: "https://shotfreetrt.com", siteName: "ShotFreeTRT", images: [{ url: "/og-shotfreetrt.png", width: 1024, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "ShotFreeTRT | Compare Before You Commit", description: "Free decision guide and clinic-cost worksheet. Education, not prescriptions.", images: ["/og-shotfreetrt.png"] },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
  verification: { google: "eFS_GYPi2qp4xAw2BQ1BEaj0aA8-X5NpuY8rxCfKmpU" },
};
const navItems = [
  { href: "/decision-guide", label: "Free Decision Guide" },
  { href: "/pricing", label: "Compare Costs" },
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
];
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
    <body className="min-h-screen bg-background text-foreground antialiased">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3">Skip to content</a>
      <AnalyticsProvider>
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-xl print:hidden">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <Link href="/" className="font-[family-name:var(--font-barlow-condensed)] text-xl font-extrabold">ShotFreeTRT</Link>
            <nav className="flex flex-wrap gap-1" aria-label="Primary">{navItems.map((item) => <Button key={item.href} asChild variant="ghost" size="sm"><Link href={item.href}>{item.label}</Link></Button>)}</nav>
          </div>
        </header>
        <div className="border-b bg-card print:hidden"><p className="mx-auto max-w-6xl px-4 py-3 text-center text-xs font-medium tracking-wide text-muted-foreground">COMPARE OPTIONS · UNDERSTAND COSTS · PREPARE FOR CARE</p></div>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
        <footer className="border-t print:hidden"><div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <p>© {new Date().getFullYear()} ShotFreeTRT</p><p>Educational content only. Treatment decisions belong with a licensed clinician.</p>
          <p className="flex flex-wrap gap-4"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/pricing">Costs</Link><Link href="/for-clinics">For Clinics</Link></p>
        </div></footer>
        <GoogleAnalytics />
      </AnalyticsProvider>
    </body>
  </html>;
}
