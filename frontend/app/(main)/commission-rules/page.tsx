import { CommissionRulesModule } from "@/components/modules/commission-rules-module";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function CommissionRulesPage() {
  const [rules, versions] = await Promise.all([
    api.getCommissionRules(),
    api.getRuleVersions(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Commission rule engine"
        description="Author slabs and tiers with product, region, and role conditions. Draft, version, and publish — audit trail captures every change."
      />
      <CommissionRulesModule initialRules={rules} versions={versions} />
    </div>
  );
}
