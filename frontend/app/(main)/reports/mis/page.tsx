import Link from "next/link";

import { MisReportModule } from "@/components/modules/mis-report-module";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import { ArrowLeft } from "lucide-react";

export default async function MisReportPage() {
  const [rows, trend] = await Promise.all([
    api.getMisReportRows(),
    api.getMisTrend(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1680px] mx-auto w-full">
      <PageHeader
        title="MIS incentive report"
        description="Explainable management view: who sold what, against which target, and how much incentive was earned — plus book-level trends."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/reports" className="gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              Export hub
            </Link>
          </Button>
        }
      />
      <MisReportModule rows={rows} trend={trend} />
    </div>
  );
}
