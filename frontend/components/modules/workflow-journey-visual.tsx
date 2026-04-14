"use client";

import * as React from "react";
import { ArrowRight, Check, Cog, Landmark, RefreshCw, UserCircle, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    key: "ops",
    label: "Operations",
    body: "First-level technical audit: validating raw data feeds, policy alignment, and basic eligibility gates.",
    Icon: Cog,
  },
  {
    key: "sales",
    label: "Sales",
    body: "Second-level business audit: confirming target achievements, sales performance multipliers, and RM sign-offs.",
    Icon: UserCircle,
  },
  {
    key: "finance",
    label: "Finance",
    body: "Compliance & Treasury: final accrual posting, reconciling against the ledger, and funding the payout batch.",
    Icon: Landmark,
  },
  {
    key: "payout",
    label: "Payout",
    body: "Settlement: Funds disbursed to internal wallets or payroll systems. Status set to settled for final closure.",
    Icon: Wallet,
  },
] as const;

export function WorkflowJourneyVisual() {
  const [activeKey, setActiveKey] = React.useState<string>(STEPS[0].key);

  const activeStep = STEPS.find(s => s.key === activeKey) || STEPS[0];

  const phaseIntel: Record<string, { checks: string[], actors: string, next: string }> = {
    ops: {
      checks: ["Data format integrity", "Policy number validation", "Duplicate entry detection"],
      actors: "Ops Specialist / Data Steward",
      next: "Escalates to Sales for business verification if technical gates pass."
    },
    sales: {
      checks: ["Target achievement verify", "Multiplier eligibility", "RM override justification"],
      actors: "Regional Manager / Sales VP",
      next: "Moves to Finance for accrual provisioning and tax assessment."
    },
    finance: {
      checks: ["Budget ceiling check", "Ledger reconciliation", "Tax withholding calc"],
      actors: "Finance Controller / Treasurer",
      next: "Final step before payout clearing and external bank file generation."
    },
    payout: {
      checks: ["Bank account verification", "AML/Compliance sweep", "Final disbursement lock"],
      actors: "Payroll Manager / Internal Treasury",
      next: "Workflow terminates. Ledger marked as 'Settled' and visible in historical audit."
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/70 shadow-xl bg-card/50 backdrop-blur-xl transition-all duration-500 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                Operational Logic Map
              </CardTitle>
              <CardDescription className="text-xs font-medium italic mt-1">
                Select a protocol phase below to examine internal logical gates and authorization requirements.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0 relative">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-stretch gap-0 min-w-0">
                <button
                  onClick={() => setActiveKey(s.key)}
                  className={cn(
                    "flex flex-1 flex-col rounded-2xl border p-4 shadow-sm transition-all duration-500 text-left relative group",
                    activeKey === s.key 
                      ? "bg-orange-600 border-orange-500 shadow-orange-500/20 shadow-2xl scale-[1.02] z-10" 
                      : "border-border/80 hover:border-orange-500/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                      activeKey === s.key ? "bg-white text-orange-600 shadow-inner" : "bg-orange-600/10 text-orange-600"
                    )}>
                      <s.Icon className="h-4 w-4 stroke-[2.5]" aria-hidden />
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      activeKey === s.key ? "text-white" : "text-foreground"
                    )}>
                      {i + 1}. {s.label}
                    </span>
                  </div>
                  <p className={cn(
                    "text-[11px] leading-snug font-medium transition-colors",
                    activeKey === s.key ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {s.body}
                  </p>
                  {activeKey === s.key && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-600 rotate-45 border-r border-b border-orange-500" />
                  )}
                </button>
                {i < STEPS.length - 1 ? (
                  <div className="hidden lg:flex items-center px-2 text-muted-foreground/30">
                    <ArrowRight className={cn(
                      "h-5 w-5 transition-colors",
                      activeKey === s.key || activeKey === STEPS[i+1].key ? "text-orange-500" : ""
                    )} aria-hidden />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Deep Dive Panel */}
          <div className="rounded-3xl border border-border bg-muted/20 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2">
                      <Check className="h-3 w-3" /> Technical Assertions
                   </h4>
                   <ul className="space-y-2">
                      {phaseIntel[activeKey].checks.map(c => (
                        <li key={c} className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                           <div className="h-1 w-1 rounded-full bg-border" />
                           {c}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                       <UserCircle className="h-3 w-3" /> Authorized Entities
                   </h4>
                   <p className="text-xs font-bold text-foreground/80 leading-relaxed">
                      {phaseIntel[activeKey].actors}
                   </p>
                   <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-600 italic">
                      &quot;Authorization restricted to regional tier-1 controllers only.&quot;
                   </div>
                </div>
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                       <RefreshCw className="h-3 w-3" /> State Transition
                   </h4>
                   <p className="text-xs font-bold text-foreground/80 leading-relaxed">
                      {phaseIntel[activeKey].next}
                   </p>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
          <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Completed Phase</span>
          <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-orange-500" /> Current Protocol</span>
          <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" /> Administrative Hold</span>
      </div>
    </div>
  );
}
