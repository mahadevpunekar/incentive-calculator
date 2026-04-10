"use client";

import { useMemo } from "react";

import { IncentiveMomYoyChart } from "@/components/charts/incentive-mom-yoy-chart";
import { IncentivePayoutCurveChart } from "@/components/charts/incentive-payout-curve-chart";
import { RevenueIncentiveChart } from "@/components/charts/revenue-incentive-chart";
import { AccrualVarianceDashboardCard } from "@/components/dashboard/accrual-variance-dashboard-card";
import { DashboardAlertsPanel } from "@/components/dashboard/dashboard-alerts-panel";
import { TopExposuresTable } from "@/components/dashboard/top-exposures-table";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";
import { filterDimensional } from "@/lib/apply-global-filters";
import { deriveKpisForFilters } from "@/lib/dashboard-derive-kpis";
import type {
  AccrualVarianceBucket,
  DashboardAlert,
  IncentivePayoutCurvePoint,
  KpiSummary,
  MonthlyPerformancePoint,
  TopExposureRow,
  TrendPoint,
} from "@/lib/mock-api/types";

export type DashboardDataBundle = {
  kpis: KpiSummary[];
  accrualBuckets: AccrualVarianceBucket[];
  payoutCurve: IncentivePayoutCurvePoint[];
  alerts: DashboardAlert[];
  exposures: TopExposureRow[];
  trend: TrendPoint[];
  monthly: MonthlyPerformancePoint[];
};

function FilterEmpty({ label }: { label: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 text-center text-xs text-muted-foreground">
      No data for <span className="mx-1 font-medium text-foreground">{label}</span>{" "}
      with the current global filters. Reset filters or broaden the slice.
    </div>
  );
}

export function DashboardShell(props: DashboardDataBundle) {
  const { activeKeys, filters } = usePageFilterContext();

  const filtered = useMemo(
    () => ({
      accrual: filterDimensional(props.accrualBuckets, filters, activeKeys),
      curve: filterDimensional(props.payoutCurve, filters, activeKeys),
      alerts: filterDimensional(props.alerts, filters, activeKeys),
      exposures: filterDimensional(props.exposures, filters, activeKeys),
      trend: filterDimensional(props.trend, filters, activeKeys),
      monthly: filterDimensional(props.monthly, filters, activeKeys),
    }),
    [props, filters, activeKeys]
  );

  const kpis = useMemo(
    () =>
      deriveKpisForFilters(
        props.kpis,
        filtered.accrual,
        props.accrualBuckets,
        filtered.curve
      ),
    [props, filtered]
  );

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-4 p-4 lg:p-5">
      <div className="space-y-0.5 border-b border-border/50 pb-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Dashboard
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Executive overview
        </h1>
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Consolidated incentive metrics — charts and KPIs respect global filters
          (channel, region, branch, staff, product, period). Mock dimensional
          tags only.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            change={k.change}
            trend={k.trend}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard
          title="Revenue & incentive trend"
          description="Rolling periods in view — series narrow when filters exclude slice tags."
        >
          {filtered.trend.length === 0 ? (
            <FilterEmpty label="trend" />
          ) : (
            <RevenueIncentiveChart data={filtered.trend} />
          )}
        </ChartCard>
        <ChartCard
          title="Incentive comparison"
          description="Month-on-month path vs prior-year reference (k OMR)."
        >
          {filtered.monthly.length === 0 ? (
            <FilterEmpty label="monthly series" />
          ) : (
            <IncentiveMomYoyChart data={filtered.monthly} />
          )}
        </ChartCard>
      </section>

      <section className="w-full">
        <DashboardAlertsPanel alerts={filtered.alerts} />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0">
          {filtered.accrual.length === 0 ? (
            <Card className="h-full border-border/70">
              <CardHeader>
                <CardTitle className="text-sm">Accrual vs earned variance</CardTitle>
                <CardDescription className="text-xs">
                  No buckets in filter slice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterEmpty label="accrual buckets" />
              </CardContent>
            </Card>
          ) : (
            <AccrualVarianceDashboardCard data={filtered.accrual} />
          )}
        </div>
        <div className="min-w-0">
          <ChartCard
            className="h-full"
            title="Achievement vs payout & multiplier"
            description="Zones: below payout threshold, target band, accelerator."
          >
            {filtered.curve.length === 0 ? (
              <FilterEmpty label="curve" />
            ) : (
              <IncentivePayoutCurveChart data={filtered.curve} />
            )}
          </ChartCard>
        </div>
      </section>

      <Card className="rounded-lg border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-border hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
        <CardHeader className="space-y-0.5 p-4 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Top exposures
          </CardTitle>
          <CardDescription className="text-xs leading-snug">
            Filtered by the same dimensional slice as charts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {filtered.exposures.length === 0 ? (
            <FilterEmpty label="exposures" />
          ) : (
            <TopExposuresTable rows={filtered.exposures} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
