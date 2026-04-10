import type { FilterDimension } from "@/lib/filter-route-config";
import { ALL_FILTER_DIMENSIONS } from "@/lib/filter-route-config";
import type { GlobalFilterState } from "@/stores/global-filter-store";
import type { DataSliceDimensions } from "@/lib/mock-api/types";

function dimensionMatches(
  key: FilterDimension,
  slice: DataSliceDimensions,
  f: GlobalFilterState
): boolean {
  switch (key) {
    case "channel":
      return f.channel === "All" || slice.channel === f.channel;
    case "region":
      return f.region === "All" || slice.region === f.region;
    case "branch":
      return f.branch === "All" || slice.branch === f.branch;
    case "staff":
      return f.staff === "All" || slice.staff === f.staff;
    case "product":
      return f.product === "All" || slice.product === f.product;
    case "month":
      return f.month === "all" || slice.month === f.month;
    default:
      return true;
  }
}

/**
 * @param activeKeys — dimensions to evaluate:
 *   - `undefined` (omit) = all dimensions (full filter).
 *   - `null` = do not filter (route has no filter bar — pass all rows).
 *   - `Set` = only those dimensions.
 */
export function sliceMatches(
  slice: DataSliceDimensions,
  f: GlobalFilterState,
  activeKeys?: ReadonlySet<FilterDimension> | null
): boolean {
  if (activeKeys === null) return true;
  const keys = activeKeys
    ? (ALL_FILTER_DIMENSIONS.filter((k) => activeKeys.has(k)) as FilterDimension[])
    : ALL_FILTER_DIMENSIONS;
  for (const key of keys) {
    if (!dimensionMatches(key, slice, f)) return false;
  }
  return true;
}

export function filterDimensional<T extends { slice?: DataSliceDimensions }>(
  rows: T[],
  f: GlobalFilterState,
  activeKeys?: ReadonlySet<FilterDimension> | null
): T[] {
  if (activeKeys === null) return rows;
  return rows.filter((r) => {
    if (r.slice == null) return false;
    return sliceMatches(r.slice, f, activeKeys);
  });
}
