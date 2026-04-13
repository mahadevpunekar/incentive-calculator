"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IncentiveSlabRow } from "@/lib/mock-api/gwp-types";

function getSlabColor(pct: number) {
  if (pct > 120) return { bg: "bg-emerald-600 dark:bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/30" };
  if (pct >= 80) return { bg: "bg-amber-600 dark:bg-amber-500", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/30" };
  return { bg: "bg-red-600 dark:bg-red-500", text: "text-red-600 dark:text-red-400", ring: "ring-red-500/30" };
}

function ProgressRing({ pct, size = 48, strokeWidth = 4 }: { pct: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(pct, 150);
  const offset = circumference - (clampedPct / 150) * circumference;
  const slabCfg = getSlabColor(pct);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" className="text-border" strokeWidth={strokeWidth} fill="none" strokeOpacity={0.2} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} stroke="currentColor"
          strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className={cn("transition-all duration-700 ease-out", slabCfg.text)}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-[10px] font-black tabular-nums", slabCfg.text)}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

function SlabBar({ pct, label }: { pct: number; label: string }) {
  const slabCfg = getSlabColor(pct);
  const widthPct = Math.min((pct / 150) * 100, 100);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="space-y-1 cursor-help group">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
            <span className={cn("tabular-nums", slabCfg.text)}>{pct.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", slabCfg.bg)}
              style={{ width: `${widthPct}%`, opacity: 0.8 }}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs font-bold">
        {label}: {pct.toFixed(1)}% achieved
      </TooltipContent>
    </Tooltip>
  );
}

export function IncentiveSlabTable({ data }: { data: IncentiveSlabRow[] }) {
  const [sortKey, setSortKey] = React.useState<"overall" | "motor" | "nonmotor" | "incentive">("overall");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const sorted = React.useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      let va: number, vb: number;
      switch (sortKey) {
        case "motor": va = a.motorAchievedPct; vb = b.motorAchievedPct; break;
        case "nonmotor": va = a.nonMotorAchievedPct; vb = b.nonMotorAchievedPct; break;
        case "incentive": va = a.finalIncentiveOmr; vb = b.finalIncentiveOmr; break;
        default: va = a.overallAchievedPct; vb = b.overallAchievedPct;
      }
      return sortDir === "desc" ? vb - va : va - vb;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHeader = ({ label, key }: { label: string; key: typeof sortKey }) => (
    <th
      className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 cursor-pointer hover:bg-orange-500/5 select-none transition-all"
      onClick={() => toggleSort(key)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {sortKey === key && <span className="text-[10px]">{sortDir === "desc" ? "▼" : "▲"}</span>}
      </span>
    </th>
  );

  return (
    <Card className="border-border bg-card/50 backdrop-blur shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black tracking-tight">Slab-Based Performance</CardTitle>
            <CardDescription className="text-xs font-medium">Real-time incentive calculation based on achieving motor & non-motor targets</CardDescription>
          </div>
          <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border border-border">
            {[
              { label: ">120%", color: "bg-emerald-500", pct: "12%" },
              { label: "80–120%", color: "bg-amber-500", pct: "9%" },
              { label: "<80%", color: "bg-red-500", pct: "0%" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                <div className={cn("h-2 w-2 rounded-full", s.color)} />
                <span>{s.label} → {s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Staff Agent</th>
                <SortHeader label="Motor" key="motor" />
                <SortHeader label="Non-Motor" key="nonmotor" />
                <SortHeader label="Execution" key="overall" />
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Yield Slab</th>
                <SortHeader label="Incentive" key="incentive" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const slabCfg = getSlabColor(row.overallAchievedPct);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "group border-b border-border transition-all duration-200 hover:bg-muted/30 hover:backdrop-blur-sm",
                      i % 2 === 0 ? "bg-transparent" : "bg-muted/10 dark:bg-muted/5"
                    )}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-black text-sm tracking-tight">{row.staffName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono font-bold">{row.staffId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-[120px]">
                      <SlabBar pct={row.motorAchievedPct} label="Motor" />
                    </td>
                    <td className="px-4 py-4 min-w-[120px]">
                      <SlabBar pct={row.nonMotorAchievedPct} label="Non-Motor" />
                    </td>
                    <td className="px-4 py-4">
                      <ProgressRing pct={row.overallAchievedPct} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-black tracking-tight border",
                        slabCfg.text, "border-current bg-background shadow-sm"
                      )}>
                        {row.appliedSlab} · {row.incentivePct}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className={cn("text-base font-black tabular-nums tracking-tighter", row.finalIncentiveOmr > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                        {row.finalIncentiveOmr > 0 ? `OMR ${row.finalIncentiveOmr.toLocaleString()}` : "NO PAYOUT"}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
