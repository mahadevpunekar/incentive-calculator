import { BreakdownView } from "@/components/modules/breakdown-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";

export default async function BreakdownPage() {
  const lines = await api.getBreakdown();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Incentive breakdown"
        description="Transparent payout components. Rows filter by product, channel, and period; export controls are independent."
        actions={
          <>
            <Button variant="outline" type="button">
              Export PDF
            </Button>
            <Button type="button">Export Excel</Button>
          </>
        }
      />
      <BreakdownView lines={lines} />
    </div>
  );
}
