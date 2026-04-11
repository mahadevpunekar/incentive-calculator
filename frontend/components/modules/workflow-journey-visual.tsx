"use client";

import { ArrowRight, Cog, Landmark, UserCircle, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    key: "sales",
    label: "Sales",
    body: "Submit batch, confirm targets & eligibility against CRM / policy data.",
    Icon: UserCircle,
  },
  {
    key: "ops",
    label: "Operations",
    body: "Validate calculations, attachments, and pricing / underwriting alignment.",
    Icon: Cog,
  },
  {
    key: "finance",
    label: "Finance",
    body: "Approve accrual, reconcile to ledger, and authorize payout file.",
    Icon: Landmark,
  },
  {
    key: "payout",
    label: "Payout",
    body: "Payroll / bank release; status visible to sales ops for closure.",
    Icon: Wallet,
  },
] as const;

export function WorkflowJourneyVisual() {
  return (
    <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">End-to-end flow</CardTitle>
        <CardDescription className="text-xs max-w-3xl leading-relaxed">
          Every incentive batch moves through these four gates. The queue below
          shows where each item sits and who must act next. Nothing pays until{" "}
          <strong className="text-foreground">Payout</strong> is complete.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-stretch gap-0 min-w-0">
              <div
                className={cn(
                  "flex flex-1 flex-col rounded-lg border bg-card p-3 shadow-sm",
                  "border-border/80"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <s.Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {i + 1}. {s.label}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-muted-foreground flex-1">
                  {s.body}
                </p>
              </div>
              {i < STEPS.length - 1 ? (
                <div className="hidden lg:flex items-center px-1 text-muted-foreground/50">
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-brand-green mr-1.5 align-middle" />
            Complete
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/40 mr-1.5 align-middle" />
            Pending / waiting
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1.5 align-middle" />
            Rejected — returns to submitter
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
