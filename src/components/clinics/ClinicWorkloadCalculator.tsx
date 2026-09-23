"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estimateClinicWorkload } from "@/lib/clinic-growth";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const percent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "percent",
});

export function ClinicWorkloadCalculator() {
  const [inquiriesPerWeek, setInquiriesPerWeek] = useState(50);
  const [repeatedMinutesPerInquiry, setRepeatedMinutesPerInquiry] = useState(8);
  const [loadedHourlyCost, setLoadedHourlyCost] = useState(35);
  const [preVisitTargetPercent, setPreVisitTargetPercent] = useState(25);

  const estimate = useMemo(() => estimateClinicWorkload({
    inquiriesPerWeek,
    repeatedMinutesPerInquiry,
    loadedHourlyCost,
    preVisitTargetPercent,
  }), [inquiriesPerWeek, repeatedMinutesPerInquiry, loadedHourlyCost, preVisitTargetPercent]);

  return (
    <Card id="workload" className="scroll-mt-28">
      <CardHeader>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Use your clinic&apos;s numbers</p>
        <CardTitle className="text-2xl sm:text-3xl">How much staff capacity goes into repeating the same basics?</CardTitle>
        <CardDescription className="text-base">
          Start with the example, then replace it with your actual inquiry volume, repeat-question time, and loaded staff cost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="clinic-inquiries">New inquiries / week</Label>
            <Input
              id="clinic-inquiries"
              type="number"
              min={1}
              max={10000}
              inputMode="numeric"
              value={inquiriesPerWeek}
              onChange={(event) => setInquiriesPerWeek(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinic-repeat-minutes">Repeat-question minutes / inquiry</Label>
            <Input
              id="clinic-repeat-minutes"
              type="number"
              min={1}
              max={120}
              inputMode="numeric"
              value={repeatedMinutesPerInquiry}
              onChange={(event) => setRepeatedMinutesPerInquiry(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinic-hourly-cost">Loaded staff cost / hour</Label>
            <Input
              id="clinic-hourly-cost"
              type="number"
              min={1}
              max={500}
              inputMode="decimal"
              value={loadedHourlyCost}
              onChange={(event) => setLoadedHourlyCost(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinic-target">Pre-visit education target</Label>
            <div className="relative">
              <Input
                id="clinic-target"
                type="number"
                min={1}
                max={100}
                inputMode="numeric"
                value={preVisitTargetPercent}
                onChange={(event) => setPreVisitTargetPercent(Number(event.target.value))}
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {estimate ? (
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-4 rounded-xl bg-secondary/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly inquiries</p>
                <p className="text-2xl font-bold">{number.format(estimate.inquiriesPerMonth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff hours repeating basics</p>
                <p className="text-2xl font-bold">{number.format(estimate.repeatedHoursPerMonth)} hrs</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff capacity devoted</p>
                <p className="text-2xl font-bold">{currency.format(estimate.staffCapacityCostPerMonth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your pre-visit target</p>
                <p className="text-2xl font-bold">{number.format(estimate.targetHoursMovedPreVisit)} hrs / mo</p>
                <p className="text-xs text-muted-foreground">about {currency.format(estimate.targetCapacityValuePerMonth)} of staff capacity</p>
              </div>
            </div>

            <div className="grid gap-4 rounded-xl border p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-2">
                <p className="font-semibold">Put the $1,000 monthly fee next to your own operating baseline.</p>
                <p className="text-sm text-muted-foreground">
                  At {currency.format(loadedHourlyCost)}/hour, the monthly fee equals {number.format(estimate.recurringFeeBenchmarkHours)} hours of loaded staff capacity — {number.format(estimate.recurringFeeBenchmarkPercentOfRepeatedLoad)}% of the repeated-question workload above. Your current pre-visit target represents {percent.format(estimate.targetCapacityValueToRecurringFeeRatio)} of the monthly fee in staff-capacity terms.
                </p>
                <p className="text-xs text-muted-foreground">
                  This is purchase-decision arithmetic, not a savings forecast. Use it alongside booking readiness, patient experience, and conversion quality when deciding whether the launch earns its keep.
                </p>
              </div>
              <Button asChild>
                <Link href="#launch-request">Get the clinic launch overview</Link>
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground" role="status">
            Enter positive clinic numbers to calculate the workload baseline.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Use this baseline to measure the launch against something concrete: fewer repeated explanations before consults, cleaner pricing questions, and more staff time available for higher-value work.
        </p>
      </CardContent>
    </Card>
  );
}
