import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { StatBadge } from "@/components/stat-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformancePage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Performance"
        description="Individual and team metrics with weekly, monthly, and quarterly lenses — data wired via mock API."
        actions={<StatBadge label="+4.1% QoQ" trend="up" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Sales achieved"
          value="OMR 488k"
          change="vs target OMR 520k"
          trend="neutral"
        />
        <KpiCard
          label="Conversion rate"
          value="34%"
          change="+2.1 pts vs prior month"
          trend="up"
        />
        <KpiCard
          label="Deal velocity"
          value="18 days"
          change="Median cycle · retail book"
          trend="down"
        />
        <KpiCard
          label="Pipeline coverage"
          value="3.2x"
          change="Qualified opportunities / quota"
          trend="up"
        />
      </section>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Team vs individual</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drill-down to user → deal → KPI will map to nested routes in a later
            iteration.
          </p>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Connect this panel to `/api/performance/summary` once the NestJS
          service is available. The layout and spacing are ready for dense
          operational review on desktop.
        </CardContent>
      </Card>
    </div>
  );
}
