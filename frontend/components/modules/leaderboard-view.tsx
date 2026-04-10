"use client";

import { useMemo } from "react";

import { DataTable, type Column } from "@/components/data-table";
import { StatBadge } from "@/components/stat-badge";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { LeaderboardRow } from "@/lib/mock-api/types";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";

const columns: Column<LeaderboardRow>[] = [
  {
    id: "rank",
    header: "Rank",
    cell: (r) => <span className="tabular-nums font-medium">{r.rank}</span>,
  },
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

export function LeaderboardView({ rows }: { rows: LeaderboardRow[] }) {
  const { activeKeys, filters } = usePageFilterContext();
  const filtered = useMemo(
    () => filterDimensional(rows, filters, activeKeys),
    [rows, filters, activeKeys]
  );

  return <DataTable columns={columns} data={filtered} />;
}
