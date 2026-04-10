import Link from "next/link";

import { DataTable, type Column } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import type { Integration } from "@/lib/mock-api/types";
import { PlugZap } from "lucide-react";

export default async function IntegrationsPage() {
  const items = await api.getIntegrations();

  const columns: Column<Integration>[] = [
    { id: "name", header: "Integration", cell: (r) => r.name },
    { id: "provider", header: "Provider", cell: (r) => r.provider },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Badge
          variant={
            r.status === "connected"
              ? "success"
              : r.status === "error"
                ? "destructive"
                : "secondary"
          }
          className="capitalize font-normal"
        >
          {r.status}
        </Badge>
      ),
    },
    { id: "sync", header: "Last sync", cell: (r) => r.lastSync ?? "—" },
    {
      id: "actions",
      header: "",
      className: "w-[120px]",
      cell: (r) => (
        <Button variant="outline" size="sm" type="button">
          {r.status === "connected" ? "Configure" : "Connect"}
        </Button>
      ),
    },
  ];

  const disconnected = items.filter((i) => i.status !== "connected");

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Integrations"
        description="CRM connectors, file imports, and API sync. Validation and deduplication live in the integration service."
        actions={
          <Button type="button" variant="outline" asChild>
            <Link href="/integrations/logs">View sync logs</Link>
          </Button>
        }
      />

      {disconnected.length > 0 ? (
        <EmptyState
          icon={PlugZap}
          title="Finish connecting sources"
          description={`${disconnected.length} integration(s) are not fully connected. Complete setup to enable automated ingestion.`}
          action={{ label: "Open connection wizard" }}
          className="rounded-xl border border-dashed bg-muted/10"
        />
      ) : null}

      <DataTable columns={columns} data={items} />
    </div>
  );
}
