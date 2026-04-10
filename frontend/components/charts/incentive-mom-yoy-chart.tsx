"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import type { MonthlyPerformancePoint } from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

export function IncentiveMomYoyChart({
  data,
}: {
  data: MonthlyPerformancePoint[];
}) {
  const [mode, setMode] = React.useState<"mom" | "yoy">("mom");

  const chartData = React.useMemo(() => {
    if (mode === "yoy") {
      return data.map((d) => ({
        month: d.month,
        cy: d.incentiveK,
        py: d.incentivePriorYearK,
        yoyPct:
          d.incentivePriorYearK > 0
            ? ((d.incentiveK - d.incentivePriorYearK) /
                d.incentivePriorYearK) *
              100
            : 0,
      }));
    }
    return data.map((d, i) => {
      const prev = i > 0 ? data[i - 1].incentiveK : d.incentiveK;
      const momPct =
        prev > 0 ? ((d.incentiveK - prev) / prev) * 100 : 0;
      return {
        month: d.month,
        value: d.incentiveK,
        momPct,
      };
    });
  }, [data, mode]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-end gap-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "mom" ? "secondary" : "ghost"}
          className={cn("h-7 text-[11px]", mode === "mom" && "shadow-sm")}
          onClick={() => setMode("mom")}
        >
          MoM
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "yoy" ? "secondary" : "ghost"}
          className={cn("h-7 text-[11px]", mode === "yoy" && "shadow-sm")}
          onClick={() => setMode("yoy")}
        >
          YoY
        </Button>
      </div>
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="hsl(var(--border))"
              strokeOpacity={0.35}
              vertical={false}
            />
            <XAxis
              dataKey="month"
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
              width={44}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--popover))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            {mode === "yoy" ? (
              <>
                <Line
                  type="monotone"
                  dataKey="cy"
                  name="Current YTD (OMR k)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="py"
                  name="Prior year (OMR k)"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                name="Incentive (OMR k)"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-muted-foreground leading-snug">
        {mode === "mom"
          ? "Month-on-month incentive (k OMR); hover points for implied % move vs prior month."
          : "YoY compares current run-rate to prior-year incentive (mock series)."}
      </p>
    </div>
  );
}
