"use client";

import * as React from "react";

import {
  AccrualVarianceChart,
  type AccrualChartMode,
} from "@/components/charts/accrual-variance-chart";
import { ChartCard } from "@/components/chart-card";
import { Button } from "@/components/ui/button";
import type { AccrualVarianceBucket } from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

export function AccrualVarianceDashboardCard({
  data,
}: {
  data: AccrualVarianceBucket[];
}) {
  const [mode, setMode] = React.useState<AccrualChartMode>("both");

  const toggle = (
    <div className="inline-flex rounded-md border border-border/70 bg-muted/25 p-px">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 rounded-[5px] px-2 text-[11px] font-medium transition-all duration-150",
          mode === "both" && "bg-background text-foreground shadow-sm"
        )}
        onClick={() => setMode("both")}
      >
        Variance + cumulative
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 rounded-[5px] px-2 text-[11px] font-medium transition-all duration-150",
          mode === "cumulative" && "bg-background text-foreground shadow-sm"
        )}
        onClick={() => setMode("cumulative")}
      >
        Cumulative only
      </Button>
    </div>
  );

  return (
    <ChartCard
      title="Accrual vs earned variance"
      description="Period bars: earned − expected accrual. Line: cumulative Σ variance (derived from buckets)."
      action={toggle}
    >
      <AccrualVarianceChart data={data} mode={mode} />
    </ChartCard>
  );
}
