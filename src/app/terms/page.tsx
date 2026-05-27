import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use", description: "ShotFreeTRT educational terms and medical disclaimer." };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 py-10 text-zinc-300">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Terms</p>
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-extrabold text-white">Terms of Use</h1>
      <p>ShotFreeTRT is for education only. Use a licensed clinician for hormone labs, treatment decisions, fertility planning, and medication changes.</p>
      <h2 className="text-2xl font-bold text-white">No treatment relationship</h2>
      <p>Reading the site, using a quiz, or purchasing a guide does not create a clinician-patient relationship.</p>
      <h2 className="text-2xl font-bold text-white">Responsible use</h2>
      <p>You are responsible for confirming safety, legality, and medical fit before acting on any information.</p>
    </article>
  );
}
