"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DataTable, type Column } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";
import { filterDimensional } from "@/lib/apply-global-filters";
import type {
  BrokerPerformanceRow,
  ChannelEarningRow,
  ProductCommissionRow,
} from "@/lib/mock-api/types";

export function ProductChannelAnalytics({
  products,
  channels,
  brokers,
}: {
  products: ProductCommissionRow[];
  channels: ChannelEarningRow[];
  brokers: BrokerPerformanceRow[];
}) {
  const { activeKeys, filters } = usePageFilterContext();

  const fp = useMemo(
    () => filterDimensional(products, filters, activeKeys),
    [products, filters, activeKeys]
  );
  const fc = useMemo(
    () => filterDimensional(channels, filters, activeKeys),
    [channels, filters, activeKeys]
  );
  const fb = useMemo(
    () => filterDimensional(brokers, filters, activeKeys),
    [brokers, filters, activeKeys]
  );

  const brokerColumns: Column<BrokerPerformanceRow>[] = [
    { id: "rank", header: "#", cell: (r) => r.rank },
    { id: "broker", header: "Broker", cell: (r) => r.broker },
    { id: "ch", header: "Channel", cell: (r) => r.channel },
    {
      id: "gwp",
      header: "GWP (OMR)",
      cell: (r) => r.gwpOmr.toLocaleString(),
    },
    {
      id: "comm",
      header: "Commission (OMR)",
      cell: (r) => r.commissionOmr.toLocaleString(),
    },
  ];

  return (
    <Tabs defaultValue="product" className="w-full">
      <TabsList>
        <TabsTrigger value="product">Product commission</TabsTrigger>
        <TabsTrigger value="channel">Channel earnings</TabsTrigger>
        <TabsTrigger value="broker">Broker performance</TabsTrigger>
      </TabsList>

      <TabsContent value="product" className="space-y-4">
        <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle className="text-base">Product-wise commission</CardTitle>
            <CardDescription className="text-xs">
              OMR and share of filtered book. YoY delta is illustrative.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fp.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No rows match global filters.
              </p>
            ) : (
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fp.map((p) => ({
                      name: p.product,
                      omr: p.commissionOmr / 1000,
                    }))}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 6"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.35}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      tickFormatter={(v) => `${v}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--popover))",
                      }}
                      formatter={(v: number) => [`${v.toFixed(1)}k OMR`, "Commission"]}
                    />
                    <Bar
                      dataKey="omr"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {fp.length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {fp.map((p) => (
                  <li
                    key={p.product}
                    className="flex justify-between rounded-md border border-border/60 px-3 py-2 text-xs"
                  >
                    <span className="font-medium">{p.product}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {p.pctOfTotal.toFixed(1)}% · YoY{" "}
                      {p.yoyDeltaPct >= 0 ? "+" : ""}
                      {p.yoyDeltaPct.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="channel">
        <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle className="text-base">Channel-wise earnings</CardTitle>
            <CardDescription className="text-xs">
              Earnings and policy counts after global slice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fc.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No rows match global filters.
              </p>
            ) : (
              fc.map((c) => (
                <div
                  key={c.channel}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <span className="text-sm font-medium">{c.channel}</span>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    <span className="font-semibold text-foreground">
                      OMR {c.earningsOmr.toLocaleString()}
                    </span>
                    <span className="mx-2">·</span>
                    {c.policies.toLocaleString()} policies
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="broker">
        <DataTable columns={brokerColumns} data={fb} />
      </TabsContent>
    </Tabs>
  );
}
