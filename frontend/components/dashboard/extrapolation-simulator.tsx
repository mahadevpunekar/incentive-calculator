"use client";

import * as React from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip as ReTooltip, XAxis, YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { ExtrapolationOutput } from "@/lib/mock-api/gwp-types";

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function computeExtrapolation(
  commPct: number,
  growthPct: number,
  taxRate: number,
  currentGwp: number
): ExtrapolationOutput {
  const projectedGwp = currentGwp * (1 + growthPct / 100);
  const grossComm = projectedGwp * commPct / 100;
  const taxImpact = grossComm * taxRate / 100;
  const netPayout = grossComm - taxImpact;
  const yearEndLiab = netPayout * 0.15; // 15% accrual reserve

  const monthlyProjection = MONTHS.map((m, i) => {
    const factor = 1 + (growthPct / 100) * ((i + 1) / 12);
    const mGwp = (currentGwp / 12) * factor;
    return {
      month: m,
      gwp: Math.round(mGwp),
      commission: Math.round(mGwp * commPct / 100 * (1 - taxRate / 100)),
    };
  });

  return {
    projectedGwp: Math.round(projectedGwp),
    projectedCommission: Math.round(grossComm),
    taxImpact: Math.round(taxImpact),
    netPayout: Math.round(netPayout),
    yearEndLiability: Math.round(yearEndLiab),
    monthlyProjection,
  };
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  tooltip,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  tooltip: string;
  color: string;
}) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-orange-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px] font-bold max-w-[200px]">{tooltip}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-8 w-24 rounded-lg border border-border bg-muted/30 px-3 text-right text-xs font-black tabular-nums transition-all focus:bg-background focus:ring-1 focus:ring-orange-500/50"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-[10px] font-black text-muted-foreground/50 w-6 uppercase">{unit}</span>
        </div>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted transition-all",
            "accent-orange-600 dark:accent-orange-400"
          )}
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-black text-muted-foreground/40 tabular-nums uppercase tracking-tighter">
        <span>Min: {min}{unit}</span>
        <span>Max: {max}{unit}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, color, tooltip }: { label: string; value: string; color: string; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "rounded-xl border border-border bg-muted/20 p-4 space-y-1",
          "hover:border-opacity-100 hover:bg-muted/40 transition-all duration-300 cursor-help group shadow-sm"
        )} style={{ borderColor: `${color}30` }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{label}</p>
          <p className="text-xl font-black tabular-nums tracking-tighter" style={{ color }}>{value}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[10px] font-bold max-w-[220px]">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function ExtrapolationSimulator() {
  const [commPct, setCommPct] = React.useState(6.0);
  const [growthPct, setGrowthPct] = React.useState(10.0);
  const [taxRate, setTaxRate] = React.useState(5.0);
  const [currentGwp, setCurrentGwp] = React.useState(12850000);

  const output = React.useMemo(
    () => computeExtrapolation(commPct, growthPct, taxRate, currentGwp),
    [commPct, growthPct, taxRate, currentGwp]
  );

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3 border-b border-border bg-muted/10">
        <CardTitle className="text-sm font-black tracking-tight uppercase">Economic Forecasting Module</CardTitle>
        <CardDescription className="text-xs font-medium italic">Execute hypothetical growth scenarios to determine liability reserves and commission payout structures</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-6 bg-muted/10 p-5 rounded-2xl border border-border">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-2">Simulation Parameters</h3>
            <SliderInput
              label="Commission Yield" value={commPct} onChange={setCommPct}
              min={1} max={15} step={0.5} unit="%" color="#f59e0b"
              tooltip="Base commission percentage applied to net premium after tax deduction."
            />
            <SliderInput
              label="YoY Growth Alpha" value={growthPct} onChange={setGrowthPct}
              min={-20} max={50} step={1} unit="%" color="#10b981"
              tooltip="Expected year-on-year GWP growth rate for projection."
            />
            <SliderInput
              label="Fiscal Tax Rate" value={taxRate} onChange={setTaxRate}
              min={0} max={15} step={0.5} unit="%" color="#ef4444"
              tooltip="Tax deduction rate applied to gross premium before commission calculation."
            />
            <SliderInput
              label="Primary GWP Base" value={currentGwp / 1000000} onChange={(v) => setCurrentGwp(v * 1000000)}
              min={1} max={50} step={0.5} unit="M" color="#3b82f6"
              tooltip="Current year gross written premium as base for projection."
            />
          </div>

          {/* Results */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">Forecasted Outcomes</h3>
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Target GWP"
                value={`OMR ${(output.projectedGwp / 1000000).toFixed(2)}M`}
                color="#10b981"
                tooltip={`Current Base × (1 + ${growthPct}% Δ) = OMR ${(output.projectedGwp / 1000000).toFixed(2)}M`}
              />
              <ResultCard
                label="Yield (Gross)"
                value={`OMR ${(output.projectedCommission / 1000).toFixed(0)}K`}
                color="#3b82f6"
                tooltip={`Target Focus × ${commPct}% Baseline = OMR ${(output.projectedCommission / 1000).toFixed(0)}K`}
              />
              <ResultCard
                label="Tax Leakage"
                value={`−OMR ${(output.taxImpact / 1000).toFixed(0)}K`}
                color="#ef4444"
                tooltip={`Gross Yield × ${taxRate}% Fiscal Rate = OMR ${(output.taxImpact / 1000).toFixed(0)}K Leakage`}
              />
              <ResultCard
                label="Liquid Payout"
                value={`OMR ${(output.netPayout / 1000).toFixed(0)}K`}
                color="#f59e0b"
                tooltip="Gross Yield after leakage stabilization — Liquid capital."
              />
            </div>
            <ResultCard
              label="Reserve Liability (15% Accrual)"
              value={`OMR ${(output.yearEndLiability / 1000).toFixed(0)}K`}
              color="#8b5cf6"
              tooltip="Allocated 15% accrual reserve for year-end audit provisionings."
            />
          </div>
        </div>

        {/* Projection chart */}
        <div className="h-[240px] w-full pt-4 border-t border-border">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={output.monthlyProjection} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gwpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="currentColor" className="text-border" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} width={45} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: 10, fontWeight: 800 }}
                formatter={(v: number, name: string) => [`OMR ${(v / 1000).toFixed(0)}K`, name === "gwp" ? "GWP PROJECTION" : "COMMISSION PROJECTED"]}
              />
              <Area type="monotone" dataKey="gwp" stroke="#10b981" fill="url(#gwpGrad)" strokeWidth={3} />
              <Area type="monotone" dataKey="commission" stroke="#3b82f6" fill="url(#commGrad)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
