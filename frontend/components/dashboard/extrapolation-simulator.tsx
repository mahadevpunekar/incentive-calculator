"use client";

import * as React from "react";
import {
  TrendingUp,
  Info,
  RotateCcw,
  Target,
  Zap,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Trophy,
  AlertCircle,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockGwpProducts } from "@/lib/mock-api/gwp-data";

// Helper for currency/units formatting
const formatValue = (v: number) => {
  if (v >= 1000) return `${(v / 1000).toFixed(2)}M`;
  return `${v.toFixed(0)}K`;
};

/* ── Sparkline Trend Component ──────────────── */
function MiniTrend({ data, color = "#f59e0b" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="opacity-60 group-hover:opacity-100 transition-opacity">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ── Control Input ──────────────────────────── */
function SimulationControl({
  label,
  value,
  onChange,
  icon: Icon,
  unit = "%",
  color = "orange",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: any;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5", `text-${color}-500`)} />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="relative group">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "h-9 w-full rounded-lg border border-border bg-muted/30 px-3 pr-8 text-xs font-black tabular-nums transition-all",
            "focus:bg-background focus:ring-1 focus:ring-orange-500/50"
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/30 uppercase">{unit}</span>
      </div>
    </div>
  );
}

/* ── Expanded Detail View ────────────────────── */
function ExpandedRowDetail({ row, totalCurrentGwp }: { row: any; totalCurrentGwp: number }) {
  const contributionPct = (row.cyGwp / totalCurrentGwp) * 100;
  const gapValue = row.projectedGwp - row.requiredGwp;
  const isSurplus = gapValue >= 0;

  const trendClassification = row.growthPct > 10 ? "Growing" : row.growthPct > 0 ? "Stable" : "Declining";

  return (
    <div className="p-6 bg-muted/5 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              6-Month Performance Trend
            </h4>
            <div className="flex items-center gap-4 text-[9px] font-bold">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Monthly GWP</span>
              </div>
            </div>
          </div>
          <div className="h-[220px] w-full bg-background/50 rounded-xl border border-border/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={row.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}M`}
                  width={35}
                />
                <ReTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--background))",
                    fontSize: "10px",
                    fontWeight: 800,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gwp"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Performance Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-1">
              <p className="text-[9px] font-black uppercase text-muted-foreground">Portfolio Contribution</p>
              <div className="flex items-end gap-2">
                <p className="text-lg font-black">{contributionPct.toFixed(1)}%</p>
                <div className="h-4 w-12 bg-muted rounded-full overflow-hidden mb-1">
                   <div className="h-full bg-muted-foreground/20" style={{ width: `${contributionPct}%` }} />
                </div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-1">
              <p className="text-[9px] font-black uppercase text-muted-foreground">Trend Status</p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                   trendClassification === "Growing" ? "bg-emerald-500/10 text-emerald-600" :
                   trendClassification === "Stable" ? "bg-blue-500/10 text-blue-600" : "bg-red-500/10 text-red-600"
                )}>
                  {trendClassification}
                </div>
              </div>
            </div>
          </div>

          {/* Gap Analysis Card */}
          <div className={cn(
            "rounded-xl p-5 border relative overflow-hidden",
            isSurplus ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
          )}>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                   <h5 className="text-[10px] font-black uppercase tracking-widest">Gap Analysis</h5>
                   {isSurplus ? (
                     <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>Surplus</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                        <ArrowDownRight className="h-3.5 w-3.5" />
                        <span>Shortfall</span>
                     </div>
                   )}
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-muted-foreground">Variance Amount</span>
                      <span className={isSurplus ? "text-emerald-600" : "text-amber-600"}>
                        OMR {formatValue(Math.abs(gapValue))}
                      </span>
                   </div>
                   {/* Progress Tracker toward required goal */}
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
                         <span>Achievement level</span>
                         <span>{((row.projectedGwp / row.requiredGwp) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                         <div 
                           className={cn("h-full transition-all duration-1000", isSurplus ? "bg-emerald-500" : "bg-amber-500")} 
                           style={{ width: `${Math.min((row.projectedGwp / row.requiredGwp) * 100, 100)}%` }} 
                         />
                      </div>
                   </div>
                </div>
             </div>
             {/* Background Icon Watermark */}
             <div className="absolute -right-4 -bottom-4 opacity-[0.03] transform scale-[4]">
                {isSurplus ? <Trophy /> : <AlertCircle />}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExtrapolationSimulator() {
  const [overallTarget, setOverallTarget] = React.useState(0);
  const [adjustmentFactor, setAdjustmentFactor] = React.useState(0);
  const [productOverrides, setProductOverrides] = React.useState<Record<string, number>>({});
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  // Memoized initial data processing
  const baseData = React.useMemo(() => {
    const totalPyGwp = mockGwpProducts.reduce((s, p) => s + p.pyGwp, 0);

    return mockGwpProducts.map((p) => {
      const commRate = (p.commissionEarned / (p.cyGwp * 1000)) * 100;
      const pyShare = p.pyGwp / totalPyGwp;
      return {
        ...p,
        commRate,
        pyShare,
      };
    });
  }, []);

  const totalCurrentGwp = React.useMemo(() => baseData.reduce((s, p) => s + p.cyGwp, 0), [baseData]);

  // Handle Reset
  const handleReset = () => {
    setOverallTarget(0);
    setAdjustmentFactor(0);
    setProductOverrides({});
    setExpandedRowId(null);
  };

  // Calculations for each row
  const rows = baseData.map((p) => {
    const isOverridden = productOverrides[p.id] !== undefined;

    // Required GWP to hit company goal (distributed by PY share)
    const companyGrowthValue = totalCurrentGwp * (overallTarget / 100);
    const requiredGwp = p.cyGwp + companyGrowthValue * p.pyShare;

    const distributedGrowthRate = ((requiredGwp / p.cyGwp) - 1) * 100;
    const activeGrowthRate = isOverridden ? productOverrides[p.id] : distributedGrowthRate;

    const projectedGwp = p.cyGwp * (1 + activeGrowthRate / 100);
    const estimatedCommission = (projectedGwp * 1000) * (p.commRate / 100) * (1 + adjustmentFactor / 100);

    const variancePct = ((projectedGwp - requiredGwp) / requiredGwp) * 100;

    return {
      ...p,
      activeGrowthRate,
      projectedGwp,
      estimatedCommission,
      requiredGwp,
      variancePct,
      isOverridden,
    };
  });

  const totalProjectedCommission = rows.reduce((s, r) => s + r.estimatedCommission, 0);
  const totalRequiredGwp = rows.reduce((s, r) => s + r.requiredGwp, 0);
  const totalProjectedGwp = rows.reduce((s, r) => s + r.projectedGwp, 0);

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader className="pb-4 border-b border-border bg-muted/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              Forecast Simulator
            </CardTitle>
            <CardDescription className="text-xs font-medium">Product-level growth simulation and commission projection</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Total Commission</span>
              <span className="text-lg font-black tabular-nums tracking-tighter text-emerald-600">
                OMR {totalProjectedCommission > 1000000 ? `${(totalProjectedCommission / 1000000).toFixed(2)}M` : `${(totalProjectedCommission / 1000).toFixed(0)}K`}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Controls Bar */}
        <div className="p-4 bg-muted/20 border-b border-border flex flex-wrap items-center gap-6">
          <SimulationControl
            label="Overall Growth Goal"
            value={overallTarget}
            onChange={setOverallTarget}
            icon={Target}
            color="orange"
          />
          <SimulationControl
            label="Comm. Adj. Factor"
            value={adjustmentFactor}
            onChange={setAdjustmentFactor}
            icon={Zap}
            unit="%"
            color="blue"
          />
          <div className="h-10 w-px bg-border hidden sm:block" />
          <div className="flex-1 grid grid-cols-2 gap-4">
             <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Target Base (FY25)</span>
                <p className="text-xs font-bold tabular-nums">OMR {formatValue(totalRequiredGwp)}</p>
             </div>
             <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Simulated Result</span>
                <p className={cn(
                  "text-xs font-black tabular-nums",
                  totalProjectedGwp >= totalRequiredGwp ? "text-emerald-600" : "text-amber-600"
                )}>
                  OMR {formatValue(totalProjectedGwp)}
                </p>
             </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-5 py-3 text-left font-black uppercase tracking-widest text-muted-foreground/60 w-[30%] text-nowrap">Product Name</th>
                <th className="px-3 py-3 text-right font-black uppercase tracking-widest text-muted-foreground/60">Comm %</th>
                <th className="px-3 py-3 text-right font-black uppercase tracking-widest text-muted-foreground/60">Current GWP</th>
                <th className="px-3 py-3 text-center font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Proj. Growth %</th>
                <th className="px-3 py-3 text-right font-black uppercase tracking-widest text-muted-foreground/60">Proj. GWP</th>
                <th className="px-3 py-3 text-right font-black uppercase tracking-widest text-emerald-600">Est. Commission</th>
                <th className="px-5 py-3 text-right font-black uppercase tracking-widest text-muted-foreground/60">Required (Goal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <React.Fragment key={r.id}>
                  <tr 
                    className={cn(
                      "group cursor-pointer transition-colors duration-200",
                      expandedRowId === r.id ? "bg-muted/30" : "hover:bg-muted/10"
                    )}
                    onClick={() => setExpandedRowId(expandedRowId === r.id ? null : r.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "transition-transform duration-300",
                          expandedRowId === r.id ? "rotate-180" : "rotate-0"
                        )}>
                          <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black uppercase tracking-tight text-foreground/90">{r.product}</span>
                          <span className="text-[9px] font-bold text-muted-foreground/40 italic">Trend Share: {(r.pyShare * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-bold text-muted-foreground/70 tabular-nums">
                      {r.commRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-4 text-right font-bold tabular-nums">
                      {formatValue(r.cyGwp)}
                    </td>
                    <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="relative group/input">
                            <input
                              type="number"
                              value={r.activeGrowthRate.toFixed(1)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setProductOverrides(prev => ({ ...prev, [r.id]: val }));
                              }}
                              className={cn(
                                "h-8 w-16 rounded border border-border bg-background px-2 text-center text-[11px] font-black tabular-nums transition-all",
                                r.isOverridden ? "border-orange-500 ring-1 ring-orange-500/20" : "border-border",
                                "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                              )}
                            />
                            {r.isOverridden && (
                              <button
                                onClick={() => {
                                  const next = { ...productOverrides };
                                  delete next[r.id];
                                  setProductOverrides(next);
                                }}
                                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors scale-75"
                                title="Clear override"
                              >
                                <RotateCcw className="h-2.5 w-2.5" />
                              </button>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right font-black tabular-nums tracking-tight">
                      {formatValue(r.projectedGwp)}
                      <div className={cn(
                        "text-[9px] font-bold",
                        r.variancePct >= 0 ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {r.variancePct >= 0 ? "+" : ""}{r.variancePct.toFixed(1)}% vs Goal
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right text-emerald-600">
                      <div className="flex flex-col items-end">
                        <span className="font-black tabular-nums tracking-tighter">OMR {(r.estimatedCommission / 1000).toFixed(1)}K</span>
                        <span className="text-[9px] font-bold text-muted-foreground/40">{(r.estimatedCommission / totalProjectedCommission * 100).toFixed(1)}% mix</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-muted-foreground/60 tabular-nums">
                      {formatValue(r.requiredGwp)}
                    </td>
                  </tr>
                  {expandedRowId === r.id && (
                    <tr>
                      <td colSpan={7} className="p-0">
                         <ExpandedRowDetail row={r} totalCurrentGwp={totalCurrentGwp} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/10 border-t border-border font-black">
                <td className="px-5 py-4 uppercase">Total Consolidated</td>
                <td className="px-3 py-4" />
                <td className="px-3 py-4 text-right tabular-nums">{formatValue(totalCurrentGwp)}</td>
                <td className="px-3 py-4 text-center text-orange-600">
                  {((totalProjectedGwp / totalCurrentGwp - 1) * 100).toFixed(1)}%
                </td>
                <td className="px-3 py-4 text-right tabular-nums">{formatValue(totalProjectedGwp)}</td>
                <td className="px-3 py-4 text-right text-emerald-600 tabular-nums">
                  OMR {(totalProjectedCommission / 1000).toFixed(0)}K
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-muted-foreground/60">{formatValue(totalRequiredGwp)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-muted/5 border-t border-border">
          <TooltipProvider>
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80 italic">
              <Info className="h-3 w-3" />
              <span>Simulation logic distributions are weighted by Previous Year (PY) GWP contribution shares to ensure realistic allocation across product lines.</span>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
