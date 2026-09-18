import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "How ShotFreeTRT handles quiz, newsletter, and checkout information." };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 py-10 text-zinc-300">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Privacy</p>
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold text-white">Privacy Policy</h1>
      <p>ShotFreeTRT collects email and quiz information only to deliver educational plans, newsletters, and product updates.</p>
      <h2 className="text-2xl font-bold text-white">What we collect</h2>
      <ul className="list-disc space-y-2 pl-6"><li>Email submitted through newsletter or quiz forms.</li><li>Aggregate analytics about page and funnel performance, including GA4 and first-party events for checkout starts, verified purchases, and downloads.</li><li>Allowlisted first-touch source/medium labels, bounded landing paths, and selected referrer hostnames. Free-form campaign, term, and content values are discarded. Query strings, user-entered full URLs, and Stripe Checkout Session IDs are not sent to analytics; page locations are reduced to the approved origin and pathname.</li><li>Checkout metadata handled by payment providers when products are purchased. A short-lived, HttpOnly entitlement cookie may be used to release a verified digital purchase.</li></ul>
      <h2 className="text-2xl font-bold text-white">Medical disclaimer</h2>
      <p>This site is educational and does not provide diagnosis, treatment, or individualized medical advice.</p>
      <h2 className="text-2xl font-bold text-white">Affiliate disclosure</h2>
      <p>Some links may be affiliate links. We do not rank clinics or protocols by commission.</p>
    </article>
  );
}
