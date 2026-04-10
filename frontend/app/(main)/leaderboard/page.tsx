import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatBadge } from "@/components/stat-badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import type { LeaderboardRow } from "@/lib/mock-api/types";

export default async function LeaderboardPage() {
  const rows = await api.getLeaderboard();

  const columns: Column<LeaderboardRow>[] = [
    { id: "rank", header: "Rank", cell: (r) => <span className="tabular-nums font-medium">{r.rank}</span> },
    { id: "name", header: "Name", cell: (r) => r.name },
    { id: "team", header: "Team", cell: (r) => r.team },
    {
      id: "revenue",
      header: "Revenue",
      cell: (r) => (
        <span className="tabular-nums">OMR {r.revenue.toLocaleString()}</span>
      ),
    },
    {
      id: "incentive",
      header: "Incentive",
      cell: (r) => (
        <span className="tabular-nums">OMR {r.incentive.toLocaleString()}</span>
      ),
    },
    {
      id: "kpi",
      header: "KPI",
      cell: (r) => <span className="tabular-nums">{r.kpiScore}</span>,
    },
    {
      id: "delta",
      header: "Move",
      cell: (r) => {
        if (r.delta === undefined) return "—";
        if (r.delta === 0) return <StatBadge label="Hold" trend="neutral" />;
        if (r.delta > 0) return <StatBadge label={`↑ ${r.delta}`} trend="up" />;
        return <StatBadge label={`↓ ${Math.abs(r.delta)}`} trend="down" />;
      },
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Leaderboard"
        description="Rankings by revenue, incentive, and KPI score with period and region filters (UI placeholders)."
        actions={
          <>
            <Button variant="outline" type="button">
              This quarter
            </Button>
            <Button type="button">Export</Button>
          </>
        }
      />
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
