"use client";

import * as React from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  PAYOUT_THRESHOLD_ACHIEVEMENT_PCT,
  TARGET_BAND_MAX_ACHIEVEMENT_PCT,
} from "@/lib/incentive-policy";
import type { IncentivePayoutCurvePoint } from "@/lib/mock-api/types";

const formatEarned = (v: number) => `${v.toFixed(1)}k`;
const formatMult = (v: number) => `×${v.toFixed(2)}`;

function PayoutTooltipBody({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: IncentivePayoutCurvePoint }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="pointer-events-none w-[180px] max-w-[min(180px,calc(100vw-2rem))] rounded-md border border-border/80 bg-popover/95 px-2 py-1.5 text-[10px] shadow-md backdrop-blur-sm">
      <p className="mb-1 border-b border-border/50 pb-1 font-semibold text-foreground">
        {d.label}
      </p>
      <dl className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Revenue</dt>
          <dd className="tabular-nums font-medium">{d.revenueK.toFixed(0)}k</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Achv. %</dt>
          <dd className="tabular-nums font-medium">{d.achievementPct}%</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Earned</dt>
          <dd className="tabular-nums font-semibold text-foreground">
            {d.incentiveEarnedK.toFixed(1)}k
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted-foreground">Mult.</dt>
          <dd className="tabular-nums font-medium text-brand-green">
            {formatMult(d.payoutMultiplier)}
          </dd>
        </div>
        <div className="border-t border-border/50 pt-1">
          <dt className="text-[9px] text-muted-foreground">Slab</dt>
          <dd className="mt-0.5 line-clamp-2 font-medium leading-tight text-foreground">
            {d.appliedSlab}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function IncentivePayoutCurveChart({
  data,
}: {
  data: IncentivePayoutCurvePoint[];
}) {
  const sorted = React.useMemo(
    () => [...data].sort((a, b) => a.achievementPct - b.achievementPct),
    [data]
  );

  const maxEarned = Math.max(...sorted.map((d) => d.incentiveEarnedK), 1);
  const leftMax = Math.ceil(maxEarned * 1.12);

  return (
    <div className="space-y-2">
      <div className="h-[260px] w-full min-w-0 sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={sorted}
            margin={{ top: 8, right: 10, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id="zone-below" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(215 16% 82%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(215 16% 82%)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="zone-target" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.14} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="zone-accel" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--brand-amber))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--brand-amber))" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <ReferenceArea
              x1={58}
              x2={PAYOUT_THRESHOLD_ACHIEVEMENT_PCT}
              yAxisId="earned"
              y1={0}
              y2={leftMax}
              fill="url(#zone-below)"
              strokeOpacity={0}
              ifOverflow="visible"
            />
            <ReferenceArea
              x1={PAYOUT_THRESHOLD_ACHIEVEMENT_PCT}
              x2={TARGET_BAND_MAX_ACHIEVEMENT_PCT}
              yAxisId="earned"
              y1={0}
              y2={leftMax}
              fill="url(#zone-target)"
              strokeOpacity={0}
              ifOverflow="visible"
            />
            <ReferenceArea
              x1={TARGET_BAND_MAX_ACHIEVEMENT_PCT}
              x2={118}
              yAxisId="earned"
              y1={0}
              y2={leftMax}
              fill="url(#zone-accel)"
              strokeOpacity={0}
              ifOverflow="visible"
            />

            <ReferenceLine
              x={PAYOUT_THRESHOLD_ACHIEVEMENT_PCT}
              yAxisId="earned"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: `Incentive floor ${PAYOUT_THRESHOLD_ACHIEVEMENT_PCT}%`,
                position: "top",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <ReferenceLine
              x={TARGET_BAND_MAX_ACHIEVEMENT_PCT}
              yAxisId="earned"
              stroke="hsl(var(--brand-amber))"
              strokeWidth={1.5}
              strokeDasharray="3 4"
              label={{
                value: `Accelerator ${TARGET_BAND_MAX_ACHIEVEMENT_PCT}%`,
                position: "top",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="hsl(var(--border))"
              strokeOpacity={0.35}
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="achievementPct"
              domain={[58, 118]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              label={{
                value: "Achievement % of target",
                position: "bottom",
                offset: 0,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="earned"
              tickFormatter={formatEarned}
              domain={[0, leftMax]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={44}
              label={{
                value: "Earned (OMR k)",
                angle: -90,
                position: "insideLeft",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="mult"
              orientation="right"
              tickFormatter={formatMult}
              domain={[0, 1.55]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={40}
              label={{
                value: "Multiplier",
                angle: 90,
                position: "insideRight",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />

            <Tooltip
              content={<PayoutTooltipBody />}
              cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.35 }}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              allowEscapeViewBox={{ x: true, y: true }}
            />

            <Legend
              verticalAlign="bottom"
              height={28}
              formatter={(value) =>
                value === "incentiveEarnedK"
                  ? "Incentive earned"
                  : value === "payoutMultiplier"
                    ? "Payout multiplier"
                    : value
              }
            />

            <Line
              yAxisId="earned"
              type="monotone"
              dataKey="incentiveEarnedK"
              name="incentiveEarnedK"
              stroke="hsl(var(--primary))"
              strokeWidth={2.75}
              dot={{ r: 3.5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              yAxisId="mult"
              type="monotone"
              dataKey="payoutMultiplier"
              name="payoutMultiplier"
              stroke="hsl(var(--brand-green))"
              strokeWidth={2.5}
              dot={{
                r: 3,
                fill: "hsl(var(--brand-green))",
                strokeWidth: 0,
              }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-[hsl(215_16%_82%/0.45)]" />
          Below threshold
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-primary/20" />
          Target band (80–100%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-[hsl(var(--brand-amber)/0.35)]" />
          Accelerator (&gt;100%)
        </span>
      </div>
    </div>
  );
}
