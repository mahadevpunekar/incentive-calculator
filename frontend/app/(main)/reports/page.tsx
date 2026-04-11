import Link from "next/link";

import { ReportsHub } from "@/components/modules/reports-hub";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/mock-api/client";

export default async function ReportsPage() {
  const [reports, scheduled] = await Promise.all([
    api.getReports(),
    api.getScheduledReports(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Reporting"
        description="On-demand exports (Excel / PDF / CSV) and scheduled distribution. Wire downloads to your document service when the API is ready."
      />
      <Card className="border-primary/20 bg-primary/[0.04] shadow-none">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
          <div className="space-y-1">
            <CardTitle className="text-base">MIS incentive report</CardTitle>
            <CardDescription className="text-xs max-w-xl">
              Table and trends that explain GWP, targets, achievement, and
              earned incentive by region, branch, staff, and product.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/reports/mis">Open MIS report</Link>
          </Button>
        </CardHeader>
      </Card>
      <ReportsHub reports={reports} scheduled={scheduled} />
    </div>
  );
}
