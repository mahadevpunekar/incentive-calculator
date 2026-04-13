"use client";

import * as React from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GwpProductRow } from "@/lib/mock-api/gwp-types";
import { cn } from "@/lib/utils";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e", "#64748b"];

function CommCalcTooltip({ product, premium, taxRate = 5 }: { product: string; premium: number; taxRate?: number }) {
  const tax = premium * taxRate / 100;
  const net = premium - tax;
  const commPct = 6.0;
  const commission = net * commPct / 100;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{product} — Commission Calculation</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
        <span>Premium (GWP)</span><span className="text-right font-mono text-foreground">{premium.toLocaleString()}</span>
        <span>Tax ({taxRate}%)</span><span className="text-right font-mono text-red-500">−{tax.toLocaleString()}</span>
        <span>Net Premium</span><span className="text-right font-mono text-foreground">{net.toLocaleString()}</span>
        <span>Commission ({commPct}%)</span><span className="text-right font-mono text-emerald-600">{commission.toLocaleString()}</span>
      </div>
      <p className="pt-1 border-t border-border text-[10px] text-muted-foreground">
        Commission = (Premium − Tax) × {commPct}%
      </p>
    </div>
  );
}

export function CommissionAnalytics({ products }: { products: GwpProductRow[] }) {
  const barData = React.useMemo(
    () => products.map((p) => ({ name: p.product.split(" ")[0], commission: p.commissionEarned / 1000, gwp: p.cyGwp })),
    [products]
  );

  const pieData = React.useMemo(
    () => products.map((p, i) => ({
      name: p.product.split(" ")[0],
      value: p.commissionEarned,
      color: COLORS[i % COLORS.length],
    })),
    [products]
  );

  const channelData = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.channel] = (map[p.channel] || 0) + p.commissionEarned; });
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value: value / 1000,
      color: COLORS[i % COLORS.length],
    }));
  }, [products]);

  const [hoveredProduct, setHoveredProduct] = React.useState<GwpProductRow | null>(null);

  return (
    <Tabs defaultValue="product" className="w-full">
      <TabsList className="bg-muted border border-border">
        <TabsTrigger value="product" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400">
          Product-wise
        </TabsTrigger>
        <TabsTrigger value="channel" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
          Channel-wise
        </TabsTrigger>
        <TabsTrigger value="distribution" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400">
          Distribution
        </TabsTrigger>
      </TabsList>

      <TabsContent value="product" className="space-y-4 mt-4">
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight">Product Commission Breakdown</CardTitle>
            <CardDescription className="text-xs font-medium">Hover bars for calculation tooltips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="currentColor" className="text-border" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${v}k`} />
                  <Tooltip
                    cursor={{ fill: "currentColor", opacity: 0.05 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const p = payload[0].payload;
                      return <CommCalcTooltip product={p.name} premium={p.gwp * 1000} />;
                    }}
                  />
                  <Bar dataKey="commission" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Visual calculation cards */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-muted/40 p-3 space-y-1 cursor-pointer hover:border-orange-500/30 hover:bg-muted/60 transition-all duration-200"
                  onMouseEnter={() => setHoveredProduct(p)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight truncate">{p.product.split(" ")[0]}</span>
                  </div>
                  <p className="text-base font-black tabular-nums tracking-tighter" style={{ color: COLORS[i] }}>
                    {(p.commissionEarned / 1000).toFixed(0)}K
                  </p>
                  <p className={cn(
                    "text-[10px] font-bold",
                    p.growthPct > 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {p.growthPct > 0 ? "▲" : "▼"}{Math.abs(p.growthPct)}% YoY
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {hoveredProduct && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <CommCalcTooltip product={hoveredProduct.product} premium={hoveredProduct.cyGwp * 1000} />
          </div>
        )}
      </TabsContent>

      <TabsContent value="channel" className="mt-4">
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight">Channel Commission Split</CardTitle>
            <CardDescription className="text-xs font-medium">Distribution across channels (OMR K)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="currentColor" className="text-border" strokeOpacity={0.2} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} width={100} />
                  <Tooltip
                    cursor={{ fill: "currentColor", opacity: 0.05 }}
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    formatter={(v: number) => [`${v.toFixed(1)}K OMR`, "Commission"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
                    {channelData.map((d, i) => (
                      <Cell key={i} fill={d.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="distribution" className="mt-4">
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight">Commission Distribution</CardTitle>
            <CardDescription className="text-xs font-medium">Product share of total commission pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="h-[280px] w-[280px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                      formatter={(v: number) => [`OMR ${(v / 1000).toFixed(1)}K`, "Commission"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid gap-2 w-full">
                {pieData.map((d) => {
                  const total = pieData.reduce((s, p) => s + p.value, 0);
                  const pct = ((d.value / total) * 100).toFixed(1);
                  return (
                    <div key={d.name} className="flex items-center gap-4 rounded-xl px-4 py-2.5 bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border transition-all group">
                      <div className="h-4 w-4 rounded shadow-sm shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: d.color }} />
                      <span className="flex-1 text-xs font-black uppercase tracking-tight text-foreground/80">{d.name}</span>
                      <span className="text-xs tabular-nums font-bold text-muted-foreground">OMR {(d.value / 1000).toFixed(0)}K</span>
                      <div className="h-4 w-px bg-border" />
                      <span className="text-xs tabular-nums font-black w-12 text-right text-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
