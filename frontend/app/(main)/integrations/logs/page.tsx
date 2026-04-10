import Link from "next/link";

import { IntegrationLogsPanel } from "@/components/modules/integration-logs-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import { ArrowLeft } from "lucide-react";

export default async function IntegrationLogsPage() {
  const entries = await api.getIntegrationLogs();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Integration logs"
        description="Ingestion and sync events. Use global filters to narrow by period and channel; connector setup lives on the main integrations screen."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/integrations" className="gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to integrations
            </Link>
          </Button>
        }
      />
      <IntegrationLogsPanel entries={entries} />
    </div>
  );
}
