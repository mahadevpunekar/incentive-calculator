import { RuleEngineModule } from "@/components/modules/rule-engine-module";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function RuleEnginePage() {
  const rules = await api.getRuleEngineRules();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Rule engine"
        description="Build explainable rules: channel, product, staff, region, and branch conditions with AND/OR logic, then set the incentive % added when a deal matches."
      />
      <RuleEngineModule initial={rules} />
    </div>
  );
}
