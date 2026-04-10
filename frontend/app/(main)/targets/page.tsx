import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatBadge } from "@/components/stat-badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import type { TargetRow } from "@/lib/mock-api/types";

export default async function TargetsPage() {
  const targets = await api.getTargets();

  const columns: Column<TargetRow>[] = [
    { id: "metric", header: "Metric", cell: (r) => r.metric },
    {
      id: "progress",
      header: "Progress",
      cell: (r) => {
        const pct = Math.min(100, Math.round((r.achieved / r.target) * 100));
        const trend =
          pct >= 95 ? "up" : pct >= 80 ? ("neutral" as const) : ("down" as const);
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {pct}%
            </span>
            <StatBadge
              label={pct >= 95 ? "On track" : pct >= 80 ? "Watch" : "At risk"}
              trend={trend}
            />
          </div>
        );
      },
    },
    {
      id: "achieved",
      header: "Achieved",
      cell: (r) => (
        <span className="tabular-nums">
          {r.unit === "OMR"
            ? `OMR ${r.achieved.toLocaleString()}`
            : r.unit === "%"
              ? `${r.achieved}%`
              : r.achieved}
        </span>
      ),
    },
    {
      id: "target",
      header: "Target",
      cell: (r) => (
        <span className="tabular-nums">
          {r.unit === "OMR"
            ? `OMR ${r.target.toLocaleString()}`
            : r.unit === "%"
              ? `${r.target}%`
              : r.target}
        </span>
      ),
    },
    { id: "owner", header: "Owner", cell: (r) => r.owner },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Targets & goals"
        description="Allocation, completion, and alert hooks for nearing or missed goals."
        actions={
          <>
            <Button variant="outline" type="button">
              Allocate targets
            </Button>
            <Button type="button">Adjust plan</Button>
          </>
        }
      />
      <DataTable columns={columns} data={targets} />
    </div>
  );
}
