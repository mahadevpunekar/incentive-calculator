import type {
  AccrualVarianceBucket,
  IncentivePayoutCurvePoint,
  KpiSummary,
} from "@/lib/mock-api/types";

export function deriveKpisForFilters(
  baseKpis: KpiSummary[],
  filteredBuckets: AccrualVarianceBucket[],
  allBuckets: AccrualVarianceBucket[],
  filteredCurve: IncentivePayoutCurvePoint[]
): KpiSummary[] {
  const sumEarned = (b: AccrualVarianceBucket[]) =>
    b.reduce((a, x) => a + x.earnedK, 0);
  const total = sumEarned(allBuckets);
  const part = sumEarned(filteredBuckets);
  const ratio =
    total <= 0 ? 1 : Math.max(0.12, Math.min(1.9, part / total));

  const avgAch =
    filteredCurve.length > 0
      ? filteredCurve.reduce((a, p) => a + p.achievementPct, 0) /
        filteredCurve.length
      : null;

  return baseKpis.map((k) => {
    if (k.id === "k1") {
      const base = 42180;
      return {
        ...k,
        value: `OMR ${Math.round(base * ratio).toLocaleString()}`,
        change: `${filteredBuckets.length}/${allBuckets.length} variance buckets in slice`,
      };
    }
    if (k.id === "k2" && avgAch != null) {
      return {
        ...k,
        value: `${Math.round(avgAch)}%`,
        change: "Avg achievement · filtered curve points",
      };
    }
    return k;
  });
}
