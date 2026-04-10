import { DataTable, type Column } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import type { ReportJob } from "@/lib/mock-api/types";
import { FileWarning } from "lucide-react";

export default async function ReportsPage() {
  const reports = await api.getReports();

  const columns: Column<ReportJob>[] = [
    { id: "name", header: "Report", cell: (r) => r.name },
    {
      id: "format",
      header: "Format",
      cell: (r) => <span className="uppercase text-xs">{r.format}</span>,
    },
    { id: "lastRun", header: "Last run", cell: (r) => r.lastRun },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Badge
          variant={
            r.status === "ready"
              ? "success"
              : r.status === "failed"
                ? "destructive"
                : "secondary"
          }
          className="capitalize font-normal"
        >
          {r.status}
        </Badge>
      ),
    },
  ];

  const failed = reports.filter((r) => r.status === "failed");

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Reporting"
        description="Scheduled exports and compliance-ready packs. Scheduling will connect to NestJS workers later."
        actions={
          <>
            <Button variant="outline" type="button">
              Schedule report
            </Button>
            <Button type="button">New template</Button>
          </>
        }
      />

      {failed.length > 0 ? (
        <EmptyState
          icon={FileWarning}
          title="Some jobs need attention"
          description="Failed runs remain visible in the table below with status badges. Wire alerts to email/in-app when the backend is ready."
          className="rounded-xl border border-dashed bg-muted/10"
        />
      ) : null}

      <DataTable columns={columns} data={reports} />
    </div>
  );
}
