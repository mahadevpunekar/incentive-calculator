import { ReportsHub } from "@/components/modules/reports-hub";
import { PageHeader } from "@/components/page-header";
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
      <ReportsHub reports={reports} scheduled={scheduled} />
    </div>
  );
}
