import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";
import type { BreakdownLine } from "@/lib/mock-api/types";

export default async function BreakdownPage() {
  const lines = await api.getBreakdown();

  const columns: Column<BreakdownLine>[] = [
    { id: "component", header: "Component", cell: (r) => r.component },
    {
      id: "amount",
      header: "Amount",
      cell: (r) => (
        <span className="tabular-nums font-medium">
          OMR {r.amount.toLocaleString()}
        </span>
      ),
    },
    { id: "deal", header: "Reference", cell: (r) => r.dealRef ?? "—" },
    { id: "period", header: "Period", cell: (r) => r.period },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Incentive breakdown"
        description="Transparent payout components with audit trail hooks (logs and rule history will map to backend entities)."
        actions={
          <>
            <Button variant="outline" type="button">
              Export PDF
            </Button>
            <Button type="button">Export Excel</Button>
          </>
        }
      />
      <DataTable columns={columns} data={lines} />
    </div>
  );
}
