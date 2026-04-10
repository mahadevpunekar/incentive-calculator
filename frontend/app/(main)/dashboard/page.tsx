import { ChartCard } from "@/components/chart-card";
import { IncentivePayoutCurveChart } from "@/components/charts/incentive-payout-curve-chart";
import { AccrualVarianceDashboardCard } from "@/components/dashboard/accrual-variance-dashboard-card";
import { DashboardAlertsPanel } from "@/components/dashboard/dashboard-alerts-panel";
import { TopExposuresTable } from "@/components/dashboard/top-exposures-table";
import { KpiCard } from "@/components/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/mock-api/client";

export default async function DashboardPage() {
  const [kpis, accrualBuckets, payoutCurve, alerts, exposures] =
    await Promise.all([
      api.getDashboardKpis(),
      api.getAccrualVarianceBuckets(),
      api.getIncentivePayoutCurve(),
      api.getDashboardAlerts(),
      api.getTopExposures(),
    ]);

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
          Consolidated incentive metrics and controls — mock data only, no
          backend.
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

      <section className="w-full">
        <DashboardAlertsPanel alerts={alerts} />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0">
          <AccrualVarianceDashboardCard data={accrualBuckets} />
        </div>
        <div className="min-w-0">
          <ChartCard
            className="h-full"
            title="Achievement vs payout & multiplier"
            description="Zones: below payout threshold, target band, accelerator. Lines link achievement % to OMR earned and effective multiplier."
          >
            <IncentivePayoutCurveChart data={payoutCurve} />
          </ChartCard>
        </div>
      </section>

      <Card className="rounded-lg border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-border hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
        <CardHeader className="space-y-0.5 p-4 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Top exposures
          </CardTitle>
          <CardDescription className="text-xs leading-snug">
            Largest premium / incentive-weighted positions (mock).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <TopExposuresTable rows={exposures} />
        </CardContent>
      </Card>
    </div>
  );
}
