import { CalculatorForm } from "./calculator-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function CalculatorPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Incentive calculator"
        description="Walk through a single slice: pick channel, product, and staff, enter GWP and target, and see achievement %, incentive %, and OMR — with the slab logic spelled out beside the numbers."
        actions={
          <>
            <Button variant="outline" type="button">
              Load plan version
            </Button>
            <Button type="button">What-if history</Button>
          </>
        }
      />
      <CalculatorForm />
    </div>
  );
}
