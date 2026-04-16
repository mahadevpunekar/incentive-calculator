"use client";

import * as React from "react";
import { Download, Filter, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { GwpProductRow } from "@/lib/mock-api/gwp-types";

function GrowthIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className={cn(
      "flex flex-col items-end gap-0",
      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
    )}>
      <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">
        {isPositive ? "Growth" : "Decline"}
      </span>
      <span className="flex items-center gap-0.5 text-xs font-black tabular-nums">
        {isPositive ? "↑" : "↓"}{Math.abs(value).toFixed(1)}%
      </span>
    </div>
  );
}

function AchievementBar({ current, target }: { current: number; target: number }) {
  const pct = (current / target) * 100;
  const status = pct < 80 ? "critical" : pct < 100 ? "warning" : "success";
  
  const barColor = {
    critical: "bg-rose-500",
    warning: "bg-amber-500",
    success: "bg-emerald-500"
  }[status];

  const textColor = {
    critical: "text-rose-600 dark:text-rose-400",
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-emerald-600 dark:text-emerald-400"
  }[status];

  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-[10px] font-black tabular-nums", textColor)}>
          {pct.toFixed(0)}%
        </span>
        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
          Achieved
        </span>
      </div>
      <Progress value={Math.min(pct, 100)} className="h-1" indicatorClassName={barColor} />
    </div>
  );
}

export function GwpDashboardTable({ data }: { data: GwpProductRow[] }) {
  const [filter, setFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const channels = React.useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.channel)))], [data]);

  const filtered = React.useMemo(() => {
    let rows = data;
    if (filter !== "All") rows = rows.filter((r) => r.channel === filter);
    if (search) rows = rows.filter((r) => r.product.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [data, filter, search]);

  const totals = React.useMemo(() => {
    const cyGwp = filtered.reduce((s, r) => s + r.cyGwp, 0);
    const pyGwp = filtered.reduce((s, r) => s + r.pyGwp, 0);
    const targetOmr = filtered.reduce((s, r) => s + r.targetOmr, 0);
    const commissionEarned = filtered.reduce((s, r) => s + r.commissionEarned, 0);
    
    return {
      cyGwp,
      pyGwp,
      targetOmr,
      commissionEarned,
    };
  }, [filtered]);

  const downloadCSV = () => {
    const headers = [
      "Product", 
      "Target (OMR)", 
      "Current GWP (OMR)", 
      "Previous GWP (OMR)", 
      "Achievement %", 
      "Growth %", 
      "Commission %", 
      "Commission Earned (OMR)", 
      "Portfolio Contribution %"
    ];
    const rows = filtered.map((r) => {
      const achievement = (r.cyGwp / r.targetOmr) * 100;
      const contribution = (r.cyGwp / totals.cyGwp) * 100;
      return [
        r.product, 
        r.targetOmr * 1000, 
        r.cyGwp * 1000, 
        r.pyGwp * 1000, 
        achievement.toFixed(1), 
        r.growthPct.toFixed(1), 
        r.commissionPct, 
        r.commissionEarned, 
        contribution.toFixed(1)
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gwp_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black tracking-tight flex items-center gap-2">
              <div className="h-4 w-1 bg-primary rounded-full" />
              Product Performance Matrix
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider pl-3">
              Incentive Tracking · Target vs Achievement · Portfolio Distribution
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-orange-600 transition-colors" />
              <input
                type="text"
                placeholder="Product lookup..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-44 rounded-lg border border-border bg-muted/30 pl-9 pr-3 text-xs font-bold transition-all focus:bg-background focus:ring-1 focus:ring-orange-500/50"
              />
            </div>

            {/* Channel filter */}
            <div className="flex items-center gap-2 px-2.5 h-9 rounded-lg border border-border bg-muted/30">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none"
              >
                {channels.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Channels" : c}</option>
                ))}
              </select>
            </div>

            {/* Download */}
            <Button variant="outline" size="sm" className="h-9 gap-1.5 px-4 font-bold text-xs" onClick={downloadCSV}>
              <Download className="h-3.5 w-3.5" />
              EXPORT
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Product Portfolio</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Target (OMR)</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Current GWP</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Prev. GWP</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Achievement %</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Growth %</th>
                  <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Comm. %</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Earnings (OMR)</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-orange-600 whitespace-nowrap">Portfolio %</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => {
                  const achievement = (row.cyGwp / row.targetOmr) * 100;
                  const contribution = (row.cyGwp / totals.cyGwp) * 100;
                  const diff = row.cyGwp - row.targetOmr;
                  const isExceeded = diff > 0;

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "group border-b border-border transition-all duration-200 hover:bg-muted/30",
                        i % 2 === 0 ? "bg-transparent" : "bg-muted/5 dark:bg-muted/5"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-blue-700 dark:text-blue-400 text-sm tracking-tight">{row.product}</span>
                          <span className="text-[10px] font-bold text-muted-foreground/60">{row.channel} Channel</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 tabular-nums text-right font-bold">{(row.targetOmr / 1000).toFixed(2)}M</td>
                      <td className="px-4 py-4 tabular-nums text-right font-black text-foreground">{(row.cyGwp / 1000).toFixed(2)}M</td>
                      <td className="px-4 py-4 tabular-nums text-right font-bold text-muted-foreground/50">{(row.pyGwp / 1000).toFixed(2)}M</td>
                      <td className="px-4 py-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <AchievementBar current={row.cyGwp} target={row.targetOmr} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover border-border p-3 shadow-xl">
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold">{row.product}</p>
                              <p className={cn(
                                "text-xs font-black",
                                isExceeded ? "text-emerald-500" : "text-rose-500"
                              )}>
                                {isExceeded 
                                  ? `Target exceeded by OMR ${(diff * 1000).toLocaleString()}`
                                  : `Shortfall of OMR ${(Math.abs(diff) * 1000).toLocaleString()}`
                                }
                              </p>
                              <p className="text-[10px] text-muted-foreground font-medium">
                                Target: OMR {(row.targetOmr * 1000).toLocaleString()}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4">
                        <GrowthIndicator value={row.growthPct} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-[10px] ring-1 ring-inset ring-blue-500/20">
                            {row.commissionPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 tabular-nums text-right font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {row.commissionEarned.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 tabular-nums text-right font-bold text-orange-600/80">
                        {contribution.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary/20 bg-primary/5 dark:bg-primary/5 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                  <td className="px-4 py-5 font-black text-primary uppercase tracking-widest text-[11px]">Aggregate Summary</td>
                  <td className="px-4 py-5 tabular-nums text-right font-black text-muted-foreground/70">{(totals.targetOmr / 1000).toFixed(2)}M</td>
                  <td className="px-4 py-5 tabular-nums text-right font-black text-primary">{(totals.cyGwp / 1000).toFixed(2)}M</td>
                  <td className="px-4 py-5 tabular-nums text-right font-bold text-muted-foreground/40">{(totals.pyGwp / 1000).toFixed(2)}M</td>
                  <td className="px-4 py-5">
                    <AchievementBar current={totals.cyGwp} target={totals.targetOmr} />
                  </td>
                  <td className="px-4 py-5">
                    <GrowthIndicator value={totals.pyGwp ? ((totals.cyGwp - totals.pyGwp) / totals.pyGwp) * 100 : 0} />
                  </td>
                  <td className="px-4 py-5" />
                  <td className="px-4 py-5 tabular-nums text-right font-black text-emerald-600 dark:text-emerald-400 text-base">
                    {totals.commissionEarned.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 tabular-nums text-right font-black text-orange-600">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
