import { LeaderboardView } from "@/components/modules/leaderboard-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/mock-api/client";

export default async function LeaderboardPage() {
  const rows = await api.getLeaderboard();

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Leaderboard"
        description="Rankings by revenue, incentive, and KPI score. The table respects global filters (region, branch, staff, period); export actions are unchanged by filters."
        actions={
          <>
            <Button variant="outline" type="button">
              This quarter
            </Button>
            <Button type="button">Export</Button>
          </>
        }
      />
      <LeaderboardView rows={rows} />
    </div>
  );
}
