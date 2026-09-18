import Link from "next/link";
import { Button } from "@/components/ui/button";

// Shared header/nav/footer chrome for both root layouts ((main) and
// (isolated)). Rendering it identically in both keeps the quiz and decision
// guide visually consistent with the rest of the site even though they sit
// under a separate, analytics-free root layout.
const navItems = [
  { href: "/decision-guide", label: "Free Decision Guide" },
  { href: "/pricing", label: "Compare Costs" },
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
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
    </>
  );
}
