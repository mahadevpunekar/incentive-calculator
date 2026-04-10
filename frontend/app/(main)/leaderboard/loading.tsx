import { PageHeader } from "@/components/page-header";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Leaderboard"
        description="Loading rankings…"
      />
      <TableSkeleton rows={8} />
    </div>
  );
}
