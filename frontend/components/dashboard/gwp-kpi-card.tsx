"use client";

import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, DollarSign, Award, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import type { GwpKpi } from "@/lib/mock-api/gwp-types";

const categoryConfig = {
  gwp: { 
    icon: TrendingUp, 
    gradient: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5", 
    accent: "#10b981", 
    border: "border-emerald-500/20 dark:border-emerald-500/30" 
  },
  commission: { 
    icon: DollarSign, 
    gradient: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5", 
    accent: "#3b82f6", 
    border: "border-blue-500/20 dark:border-blue-500/30" 
  },
  incentive: { 
    icon: Award, 
    gradient: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5", 
    accent: "#f59e0b", 
    border: "border-amber-500/20 dark:border-amber-500/30" 
  },
  forecast: { 
    icon: BarChart3, 
    gradient: "from-violet-500/10 to-violet-500/5 dark:from-violet-500/20 dark:to-violet-500/5", 
    accent: "#8b5cf6", 
    border: "border-violet-500/20 dark:border-violet-500/30" 
  },
};

export function GwpKpiCard({ kpi }: { kpi: GwpKpi }) {
  const cfg = categoryConfig[kpi.category];
  const Icon = cfg.icon;
  const TrendIcon = kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300",
        "hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 shadow-sm",
        cfg.border
      )}
    >
      {/* Gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 dark:opacity-60 transition-opacity group-hover:opacity-100", cfg.gradient)} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            "bg-background/90 shadow-sm border border-border"
          )}>
            <Icon className="h-5 w-5 stroke-[2.5]" style={{ color: cfg.accent }} />
          </div>
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
              kpi.trend === "up" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
              kpi.trend === "down" && "bg-red-500/15 text-red-700 dark:text-red-400",
              kpi.trend === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            <TrendIcon className="h-3 w-3 stroke-[3]" />
            {kpi.change > 0 ? "+" : ""}{kpi.change.toFixed(1)}%
          </div>
        </div>

        {/* Value */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">
            {kpi.label}
          </p>
          <p className="text-3xl font-black tabular-nums tracking-tighter text-foreground drop-shadow-sm">
            <span className="text-sm font-bold text-muted-foreground/40 mr-1.5 uppercase tracking-normal">OMR</span>
            {kpi.formattedValue}
          </p>
        </div>

        {/* Sparkline */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex-1 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
             <MiniSparkline data={kpi.sparkline} color={cfg.accent} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-right leading-tight truncate">
            6-Month<br/>Variance
          </span>
        </div>
      </div>
    </div>
  );
}
