"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { estimateQuote, formatMoney, parseMoney, type QuoteInput } from "@/lib/decision-guide";

const emptyQuote: QuoteInput = { plan: "", cadence: "monthly", medication: "", labs: "", setup: "" };
const fields = [
  ["plan", "Plan charge per billing period"],
  ["medication", "Additional medication per calendar month"],
  ["labs", "Additional labs and visits per year"],
  ["setup", "One-time fees not counted above"],
] as const;

export default function QuotePlanner() {
  const [quotes, setQuotes] = useState<[QuoteInput, QuoteInput]>([{ ...emptyQuote }, { ...emptyQuote }]);
  const [shareStatus, setShareStatus] = useState("");
  const estimates = quotes.map(estimateQuote);
  function update(index: number, patch: Partial<QuoteInput>) {
    setQuotes((previous) => previous.map((quote, i) => i === index ? { ...quote, ...patch } : quote) as [QuoteInput, QuoteInput]);
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/decision-guide`);
      setShareStatus("Guide link copied. Your entries are not included.");
    } catch {
      setShareStatus("Copy the page address to share the guide. Your entries are not in the address.");
    }
  }
  return (
    <section className="space-y-6" aria-labelledby="quote-heading">
      <div>
        <h2 id="quote-heading" className="text-2xl font-bold">Compare two written quotes</h2>
        <p className="mt-2 text-muted-foreground">Enter USD amounts from the clinic. Blank means unknown; enter 0 only when an item is confirmed included or free. Do not double-count bundled medication, labs, or visits.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {quotes.map((quote, index) => (
          <Card key={index}>
            <CardHeader><CardTitle>Quote {index === 0 ? "A" : "B"}</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Billing period</legend>
                <RadioGroup value={quote.cadence} onValueChange={(value) => { if (value === "monthly" || value === "four-week") update(index, { cadence: value }); }}>
                  {(["monthly", "four-week"] as const).map((cadence) => (
                    <div key={cadence} className="flex items-center gap-2">
                      <RadioGroupItem value={cadence} id={`cadence-${index}-${cadence}`} />
                      <Label htmlFor={`cadence-${index}-${cadence}`}>{cadence === "monthly" ? "Calendar month" : "Every 4 weeks (28 days)"}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
              {fields.map(([key, label]) => {
                const invalid = quote[key] !== "" && parseMoney(quote[key]) === null;
                return <div key={key} className="space-y-2">
                  <Label htmlFor={`quote-${index}-${key}`}>{label}</Label>
                  <Input id={`quote-${index}-${key}`} type="text" inputMode="decimal" autoComplete="off" maxLength={12} placeholder="Unknown" value={quote[key]} onChange={(event) => update(index, { [key]: event.target.value })} aria-invalid={invalid} aria-describedby={invalid ? `error-${index}-${key}` : undefined} />
                  {invalid && <p id={`error-${index}-${key}`} className="text-sm text-destructive">Use 0–100000, with up to two decimal places. No currency symbols.</p>}
                </div>;
              })}
              <div className="rounded-lg border bg-secondary p-4" aria-live="polite" aria-atomic="true">
                {estimates[index] ? <>
                  <p className="text-sm text-muted-foreground">Annualized budget including one-time fees</p>
                  <p className="text-3xl font-bold">{formatMoney(estimates[index].annualBudgetCents)}</p>
                  <p className="mt-1 text-sm">Recurring monthly equivalent: {formatMoney(estimates[index].monthlyRunRateCents)}</p>
                </> : <p>Complete all four costs to see an estimate. Unknown costs are not treated as zero.</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {estimates[0] && estimates[1] && <p className="rounded-lg border p-4" role="status">Annualized budget difference: <strong>{formatMoney(Math.abs(estimates[0].annualBudgetCents - estimates[1].annualBudgetCents))}</strong>. A price difference does not mean the treatments, services, or suitability are equivalent.</p>}
      <p className="text-sm text-muted-foreground">Method: monthly charges × 12; 28-day charges × 365 ÷ 28; then add annual extras and one-time fees. This is an annualized budget, not the cash charged in a calendar year or at checkout. Prepayments, renewal dates, taxes, dose changes, and cancellations can change actual bills. Convert longer plans only using their exact written terms.</p>
      <p className="text-sm text-muted-foreground">This tool calculates entries in this tab; it does not submit them, save them, or include them in a share link. Refreshing clears entries. General site analytics may still record page visits; see the privacy policy. Do not enter identifying or medical information.</p>
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button type="button" onClick={() => window.print()}>Print my comparison and checklist</Button>
        <Button type="button" variant="outline" onClick={share}>Copy guide link</Button>
        <Button type="button" variant="ghost" onClick={() => { setQuotes([{ ...emptyQuote }, { ...emptyQuote }]); setShareStatus(""); }}>Clear entries</Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">{shareStatus}</p>
    </section>
  );
}
