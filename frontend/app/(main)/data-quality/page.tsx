import { DataQualityModule } from "@/components/modules/data-quality-module";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function DataQualityPage() {
  const issues = await api.getDataQualityIssues();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Data validation"
        description="Quality gates before incentive computation. Block on errors, escalate warnings to IT, and track resolution."
      />
      <DataQualityModule initial={issues} />
    </div>
  );
}
