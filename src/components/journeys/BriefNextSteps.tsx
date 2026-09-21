"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildBriefReminder } from "@/lib/brief-reminder";
import { SHARE_GUIDE_URL } from "@/lib/journeys";

/** Deliberately receives no quiz answers or topic identifiers. */
export function BriefNextSteps() {
  const [status, setStatus] = useState("");
  async function share() {
    try { await navigator.clipboard.writeText(SHARE_GUIDE_URL); setStatus("Site link copied. It contains no answers, selected topic or referral identifier."); }
    catch { setStatus(`Copy this generic address: ${SHARE_GUIDE_URL}`); }
  }
  function reminder() {
    try {
      const content = buildBriefReminder(new Date(), crypto.randomUUID());
      const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
      const link = document.createElement("a"); link.href = url; link.download = "checklist-reminder.ics"; document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("Reminder file downloaded for seven days from today. Importing it into your calendar is optional; it contains no quiz answers.");
    } catch { setStatus("The reminder file could not be created. You can add a generic checklist reminder to your calendar yourself."); }
  }
  return <Card className="print:hidden"><CardHeader><p className="text-xs font-semibold uppercase tracking-widest text-primary">Make the brief useful outside this tab</p><CardTitle className="text-xl">One next step. Not another saved article.</CardTitle></CardHeader><CardContent className="space-y-5">
    <ol className="grid gap-4 sm:grid-cols-3"><li><strong>1. Before your visit</strong><p className="mt-1 text-sm text-muted-foreground">Save your brief and choose the questions you most want answered.</p></li><li><strong>2. In the conversation</strong><p className="mt-1 text-sm text-muted-foreground">Ask for the answers and costs in writing. Keep unknowns visible.</p></li><li><strong>3. Before committing</strong><p className="mt-1 text-sm text-muted-foreground">Review what is still unresolved with the appropriate clinician or provider.</p></li></ol>
    <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" onClick={reminder}>Download a 7-day check-in reminder</Button><Button type="button" variant="ghost" className="h-auto min-h-11 whitespace-normal" onClick={share}>Share the site, not my answers</Button></div>
    <p className="text-xs leading-relaxed text-muted-foreground">The reminder is a generic, one-time calendar file, not medical advice or an appointment. Nothing is added to a calendar automatically. A saved brief contains your selected answers; choose where you keep or share it.</p><p role="status" className="break-words text-sm text-muted-foreground">{status}</p>
  </CardContent></Card>;
}
