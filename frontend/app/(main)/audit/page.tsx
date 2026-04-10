import { AuditTrailModule } from "@/components/modules/audit-trail-module";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function AuditPage() {
  const entries = await api.getAuditTrail();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Audit trail"
        description="Immutable log of rule changes, payout adjustments, approvals, and saved scenarios. Expand rows for before / after snapshots."
      />
      <AuditTrailModule entries={entries} />
    </div>
  );
}
