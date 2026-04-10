"use client";

import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { PerformanceSignalRow } from "@/lib/mock-api/types";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";

export function PerformanceSignalsCard({
  signals,
}: {
  signals: PerformanceSignalRow[];
}) {
  const { activeKeys, filters } = usePageFilterContext();
  const filtered = useMemo(
    () => filterDimensional(signals, filters, activeKeys),
    [signals, filters, activeKeys]
  );

  return (
    <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader>
        <CardTitle className="text-base">Operational signals</CardTitle>
        <CardDescription className="text-xs">
          Mock KPIs tied to dimensional slice — respects period, channel, and region
          filters only on this page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No signals match the current filters.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-border/60 px-3 py-2.5"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {s.metric}
                </p>
                <p className="text-lg font-semibold tabular-nums mt-0.5">
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {s.context}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
