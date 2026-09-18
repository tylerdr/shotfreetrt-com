import Link from "next/link";

import { Button } from "@/components/ui/button";

import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <title>Page not found | ShotFreeTRT</title>
        <meta name="robots" content="noindex" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              ShotFreeTRT
            </p>
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">404</p>
              <h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold tracking-tight sm:text-6xl">
                That page isn&apos;t here.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                The link may be outdated or the page may have moved. Start with
                a free decision guide or browse the articles.
              </p>
            </div>
            <nav aria-label="Helpful links" className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/">Go home</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/decision-guide">Open the free decision guide</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/blog">Browse articles</Link>
              </Button>
            </nav>
          </div>
        </main>
      </body>
    </html>
  );
}
