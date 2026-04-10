"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyPerformancePoint } from "@/lib/mock-api/types";

export function MonthlyPerformanceLineChart({
  data,
}: {
  data: MonthlyPerformancePoint[];
}) {
  const uid = React.useId().replace(/:/g, "");

  return (
    <div className="h-[300px] w-full min-w-0 sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.28}
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
            dataKey="month"
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[60, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--popover))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [`${value}%`, "Achievement"]}
          />
          <Area
            type="natural"
            dataKey="achievementPct"
            stroke="none"
            fill={`url(#${uid}-a)`}
            legendType="none"
          />
          <Line
            type="natural"
            dataKey="achievementPct"
            name="Achievement %"
            stroke="hsl(var(--primary))"
            strokeWidth={2.75}
            dot={{ r: 3.5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
