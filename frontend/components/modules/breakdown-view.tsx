"use client";

import { useMemo } from "react";

import { DataTable, type Column } from "@/components/data-table";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { BreakdownLine } from "@/lib/mock-api/types";
import { usePageFilterContext } from "@/lib/page-filter-context";

const columns: Column<BreakdownLine>[] = [
  { id: "component", header: "Component", cell: (r) => r.component },
  {
    id: "amount",
    header: "Amount",
    cell: (r) => (
      <span className="tabular-nums font-medium">
        OMR {r.amount.toLocaleString()}
      </span>
    ),
  },
  { id: "deal", header: "Reference", cell: (r) => r.dealRef ?? "—" },
  { id: "period", header: "Period", cell: (r) => r.period },
];

export function BreakdownView({ lines }: { lines: BreakdownLine[] }) {
  const { activeKeys, filters } = usePageFilterContext();
  const filtered = useMemo(
    () => filterDimensional(lines, filters, activeKeys),
    [lines, filters, activeKeys]
  );

  return <DataTable columns={columns} data={filtered} />;
}
