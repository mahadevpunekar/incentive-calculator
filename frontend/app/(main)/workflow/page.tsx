import { PageHeader } from "@/components/page-header";
import { WorkflowJourneyVisual } from "@/components/modules/workflow-journey-visual";
import { WorkflowModule } from "@/components/modules/workflow-module";
import { api } from "@/lib/mock-api/client";

export default async function WorkflowPage() {
  const items = await api.getApprovalQueue();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Approval workflow"
        description="Visual pipeline from Sales through Operations, Finance, and Payout — then track each batch in the queue with stage status and audit comments (mock)."
      />
      <WorkflowJourneyVisual />
      <WorkflowModule initial={items} />
    </div>
  );
}
