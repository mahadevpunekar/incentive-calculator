"use client";

import * as React from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { withCumulativeVariance } from "@/lib/incentive-accrual";
import type { AccrualVarianceBucket } from "@/lib/mock-api/types";

export type AccrualVarianceChartRow = ReturnType<
  typeof withCumulativeVariance
>[number];

const formatAxisK = (v: number) => `${v.toFixed(1)}k`;

export type AccrualChartMode = "both" | "cumulative";

function AccrualTooltipBody({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: AccrualVarianceChartRow }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="pointer-events-none w-[168px] max-w-[min(168px,calc(100vw-2rem))] rounded-md border border-border/80 bg-popover/95 px-2 py-1.5 text-[10px] shadow-md backdrop-blur-sm">
      <p className="mb-1 border-b border-border/50 pb-1 font-semibold tabular-nums text-foreground">
        {label}
      </p>
      <dl className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Earned</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {row.earnedK.toFixed(1)}k
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Expected</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {row.expectedK.toFixed(1)}k
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2 border-t border-border/50 pt-1">
          <dt className="shrink-0 text-muted-foreground">Variance</dt>
          <dd
            className={
              row.varianceK >= 0
                ? "tabular-nums font-semibold text-foreground"
                : "tabular-nums font-semibold text-destructive"
            }
          >
            {row.varianceK >= 0 ? "+" : ""}
            {row.varianceK.toFixed(1)}k
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Σ Cum.</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {row.cumulativeVarianceK >= 0 ? "+" : ""}
            {row.cumulativeVarianceK.toFixed(1)}k
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function AccrualVarianceChart({
  data,
  mode,
}: {
  data: AccrualVarianceBucket[];
  mode: AccrualChartMode;
}) {
  const showBars = mode === "both";
  const gradId = React.useId().replace(/:/g, "");

  const chartData = React.useMemo(
    () => withCumulativeVariance(data),
    [data]
  );

  return (
    <div className="space-y-2">
      <div className="h-[260px] w-full min-w-0 sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient
                id={`${gradId}-cum`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="hsl(var(--border))"
              strokeOpacity={0.35}
              vertical={false}
            />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={52}
            />
            <YAxis
              yAxisId="variance"
              tickFormatter={formatAxisK}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={44}
              hide={!showBars}
            />
            <YAxis
              yAxisId="cumulative"
              orientation="right"
              tickFormatter={formatAxisK}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              content={<AccrualTooltipBody />}
              cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.35 }}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              allowEscapeViewBox={{ x: true, y: true }}
            />
            <Legend
              verticalAlign="bottom"
              height={28}
              formatter={(value) =>
                value === "varianceK"
                  ? "Period variance"
                  : value === "cumulativeVarianceK"
                    ? "Cumulative variance"
                    : value
              }
            />
            {showBars ? (
              <Bar
                yAxisId="variance"
                dataKey="varianceK"
                name="varianceK"
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={`v-${i}`}
                    fill={
                      entry.varianceK >= 0
                        ? "hsl(var(--primary))"
                        : "hsl(var(--destructive))"
                    }
                  />
                ))}
              </Bar>
            ) : null}
            <Area
              yAxisId="cumulative"
              type="monotone"
              dataKey="cumulativeVarianceK"
              name="cumulativeVarianceK-area"
              stroke="none"
              fill={`url(#${gradId}-cum)`}
              fillOpacity={1}
              legendType="none"
            />
            <Line
              yAxisId="cumulative"
              type="monotone"
              dataKey="cumulativeVarianceK"
              name="cumulativeVarianceK"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 3.5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] leading-snug text-muted-foreground">
        Period variance = earned incentive − expected accrual. The line shows
        cumulative Σ variance (derived from bucket values only).
      </p>
    </div>
  );
}
