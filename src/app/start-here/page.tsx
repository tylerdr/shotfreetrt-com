import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNotice } from "@/components/DisclosureNotice";
import { NewsletterCTA } from "@/components/NewsletterCTA";

const quickstart = [
  {
    day: "Day 1",
    title: "Set Your Baseline",
    actions: [
      "Record body weight, waist circumference, resting heart rate, and blood pressure if available.",
      "Define one primary 12-week goal: glucose control, blood pressure, sleep quality, or body-composition trend.",
      "Create a simple tracking note for sleep hours, daily steps, and training completion."
    ]
  },
  {
    day: "Day 2",
    title: "Anchor Sleep and Light",
    actions: [
      "Choose a consistent wake time for the next 7 days.",
      "Get morning outdoor light exposure within the first hour after waking.",
      "Set a caffeine cutoff at least 8 hours before bedtime."
    ]
  },
  {
    day: "Day 3",
    title: "Fix Meal Structure",
    actions: [
      "Build each meal around protein + fiber before adding refined carbs.",
      "Pre-plan two repeatable breakfasts and two workday lunches.",
      "Take a 10-minute walk after your largest meal."
    ]
  },
  {
    day: "Day 4",
    title: "Install Strength Training",
    actions: [
      "Complete a 30-40 minute full-body session: squat, hinge, push, pull, carry.",
      "Use moderate loads and leave 1-3 reps in reserve to manage recovery.",
      "Schedule your second and third weekly sessions now."
    ]
  },
  {
    day: "Day 5",
    title: "Add Zone 2 Cardio",
    actions: [
      "Perform 30-45 minutes of Zone 2 cardio at conversational effort.",
      "Track duration and perceived effort, not perfection.",
      "Plan at least one additional Zone 2 session for this week."
    ]
  },
  {
    day: "Day 6",
    title: "Build Recovery Systems",
    actions: [
      "Create a 10-minute evening shutdown routine with low light and no work notifications.",
      "Limit alcohol near bedtime and keep the bedroom cool and dark.",
      "Use a two-minute breathing reset during high-stress periods."
    ]
  },
  {
    day: "Day 7",
    title: "Review and Lock the Next 30 Days",
    actions: [
      "Review your week: adherence, sleep trend, training completion, and energy quality.",
      "Keep what worked, remove one friction point, and set calendar blocks for next week.",
      "Pick one article from the blog to deepen your next protocol."
    ]
  }
];

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "Follow this 7-day longevity quickstart to install high-return sleep, nutrition, training, and recovery habits with a simple evidence-oriented system.",
  alternates: {
    canonical: "/start-here"
  }
};

export default function StartHerePage() {
  return (
    <>
      <h1 className="page-title">Start Here: 7-Day Longevity Quickstart</h1>
      <p className="page-subtitle">
        If you want better energy, stronger biomarkers, and a plan you can
        sustain, use this 7-day setup week. Keep it simple, track objective
        signals, and avoid stacking too many variables at once.
      </p>

      <DisclosureNotice variant="medical" title="Medical Disclaimer" />

      <div className="quickstart-grid">
        {quickstart.map((item) => (
          <article key={item.day} className="card day-card">
            <p className="meta" style={{ margin: "0 0 6px" }}>
              {item.day}
            </p>
            <h2 style={{ margin: "0 0 10px" }}>{item.title}</h2>
            <ul className="checklist">
              {item.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="page-subtitle" style={{ marginTop: 24 }}>
        Continue with the <Link href="/resources">Resources</Link> page for
        tools and supplement options, or go to the <Link href="/blog">Blog</Link>{" "}
        for detailed deep-dives.
      </p>

      <NewsletterCTA
        title="Get the 30-day Longevity Starter Plan"
        description="Join the email list for a printable checklist, biomarker dashboard, and weekly implementation prompts."
        buttonLabel="Send my starter plan"
        formId="start-here-newsletter-email"
      />
    </>
  );
}
