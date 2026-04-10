import { ProductChannelAnalytics } from "@/components/modules/product-channel-analytics";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function AnalyticsPage() {
  const [products, channels, brokers] = await Promise.all([
    api.getProductCommission(),
    api.getChannelEarnings(),
    api.getBrokerPerformance(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Product & channel analytics"
        description="Commission by product, earnings by channel, and broker leaderboard. Respects the same global filters as the dashboard."
      />
      <ProductChannelAnalytics
        products={products}
        channels={channels}
        brokers={brokers}
      />
    </div>
  );
}
