"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/mock-api/types";

const formatK = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

export function RevenueIncentiveBarChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[300px] w-full min-w-0 sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          barGap={4}
          barCategoryGap="18%"
        >
          <CartesianGrid
            strokeDasharray="3 6"
            stroke="hsl(var(--border))"
            strokeOpacity={0.35}
            vertical={false}
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatK}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatK}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--popover))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string) => [
              `OMR ${Number(value).toLocaleString()}`,
              name,
            ]}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue (OMR)"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            yAxisId="right"
            dataKey="incentive"
            name="Incentive (OMR)"
            fill="hsl(var(--brand-green))"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
