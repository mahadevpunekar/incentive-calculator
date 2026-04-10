import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { api } from "@/lib/mock-api/client";

export default async function DashboardPage() {
  const [
    kpis,
    accrualBuckets,
    payoutCurve,
    alerts,
    exposures,
    trend,
    monthly,
  ] = await Promise.all([
    api.getDashboardKpis(),
    api.getAccrualVarianceBuckets(),
    api.getIncentivePayoutCurve(),
    api.getDashboardAlerts(),
    api.getTopExposures(),
    api.getRevenueIncentiveTrend(),
    api.getMonthlyPerformance(),
  ]);

  return (
    <DashboardShell
      kpis={kpis}
      accrualBuckets={accrualBuckets}
      payoutCurve={payoutCurve}
      alerts={alerts}
      exposures={exposures}
      trend={trend}
      monthly={monthly}
    />
  );
}
