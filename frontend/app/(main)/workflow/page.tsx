import { PageHeader } from "@/components/page-header";
import { WorkflowModule } from "@/components/modules/workflow-module";
import { api } from "@/lib/mock-api/client";

export default async function WorkflowPage() {
  const items = await api.getApprovalQueue();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Approval workflow"
        description="Multi-level sign-off: Sales → Operations → Finance. Queue shows pending / approved / rejected with full status tracking. Approve or reject with mandatory audit comments (mock persistence)."
      />
      <WorkflowModule initial={items} />
    </div>
  );
}
