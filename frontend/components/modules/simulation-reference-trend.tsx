"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/mock-api/client";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { TrendPoint } from "@/lib/mock-api/types";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";

/**
 * Read-only context from accrual trend — does not drive form state or projections.
 */
export function SimulationReferenceTrend() {
  const { activeKeys, filters } = usePageFilterContext();
  const [trend, setTrend] = React.useState<TrendPoint[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    void api.getRevenueIncentiveTrend().then((rows) => {
      if (!cancelled) setTrend(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(
    () => filterDimensional(trend, filters, activeKeys),
    [trend, filters, activeKeys]
  );

  const last = filtered[filtered.length - 1];

  return (
    <Card className="border-border/70 border-dashed bg-muted/5 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Reference — filtered book trend</CardTitle>
        <CardDescription className="text-xs">
          Latest period from the executive trend series (mock). Sliders and saved
          scenarios below are independent of this slice.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">
            No trend points for the current filters.
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 tabular-nums">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Period
              </p>
              <p className="font-medium text-foreground">{last?.period}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Revenue (mock)
              </p>
              <p className="font-medium text-foreground">
                OMR {last?.revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Incentive (mock)
              </p>
              <p className="font-medium text-foreground">
                OMR {last?.incentive.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
