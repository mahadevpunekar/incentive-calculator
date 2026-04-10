import type { AccrualVarianceBucket } from "@/lib/mock-api/types";

export type AccrualVarianceWithCumulative = AccrualVarianceBucket & {
  cumulativeVarianceK: number;
};

/**
 * Running sum of period variance (earned − expected) — finance control series.
 */
export function withCumulativeVariance(
  buckets: AccrualVarianceBucket[]
): AccrualVarianceWithCumulative[] {
  let cum = 0;
  return buckets.map((b) => {
    cum += b.varianceK;
    return { ...b, cumulativeVarianceK: cum };
  });
}
