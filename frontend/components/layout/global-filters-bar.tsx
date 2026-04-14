"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FILTER_BRANCHES,
  FILTER_CHANNELS,
  FILTER_MONTHS,
  FILTER_PRODUCTS,
  FILTER_REGIONS,
  FILTER_STAFF,
} from "@/lib/mock-slices";
import {
  FILTER_LABELS,
  type FilterDimension,
  getPageFilterPolicy,
} from "@/lib/filter-route-config";
import {
  useGlobalFilterStore,
  type GlobalFilterState,
} from "@/stores/global-filter-store";
import { cn } from "@/lib/utils";

import { DateRangePicker } from "@/components/ui/date-range-picker";

const OPTIONS: Record<
  FilterDimension,
  readonly string[]
> = {
  channel: FILTER_CHANNELS,
  region: FILTER_REGIONS,
  branch: FILTER_BRANCHES,
  staff: FILTER_STAFF,
  product: FILTER_PRODUCTS,
  month: FILTER_MONTHS,
};

const STATE_KEY: Record<FilterDimension, keyof GlobalFilterState> = {
  channel: "channel",
  region: "region",
  branch: "branch",
  staff: "staff",
  product: "product",
  month: "month",
};

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-[100px] flex-1 flex-col gap-0.5">
      <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <select
        className={cn(
          "h-8 rounded-md border border-input bg-background px-2 text-xs",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "All" : o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function GlobalFiltersBar() {
  const pathname = usePathname() ?? "";
  const policy = useMemo(() => getPageFilterPolicy(pathname), [pathname]);

  const filters = useGlobalFilterStore((s) => s.filters);
  const setFilters = useGlobalFilterStore((s) => s.setFilters);
  const reset = useGlobalFilterStore((s) => s.resetFilters);

  const patch = (key: keyof GlobalFilterState, v: any) =>
    setFilters({ [key]: v });

  if (!policy.showBar || policy.filterKeys.length === 0) {
    return null;
  }

  const isFull = policy.filterKeys.length >= 6;
  const scopeLabel = policy.filterKeys
    .map((k) => FILTER_LABELS[k])
    .join(" · ");

  return (
    <div className="shrink-0 border-b border-border/70 bg-card/90 px-3 py-2 backdrop-blur-sm dark:bg-card/80">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-2 lg:flex-row lg:items-end lg:gap-3">
        <div className="lg:mr-2 lg:w-[140px] lg:shrink-0">
          <p className="text-[10px] font-medium text-muted-foreground">
            {isFull ? "Global filters" : "Context filters"}
          </p>
          {!isFull ? (
            <p className="mt-0.5 text-[9px] leading-tight text-muted-foreground/90">
              {scopeLabel}
            </p>
          ) : null}
        </div>
        <div className="flex flex-1 flex-wrap gap-2 lg:gap-3">
          {policy.filterKeys.map((dim) => {
            if (dim === "month") {
              return (
                <div key={dim} className="flex min-w-[180px] flex-1 flex-col gap-0.5">
                  <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    {FILTER_LABELS[dim]}
                  </Label>
                  <DateRangePicker
                    date={filters.dateRange}
                    setDate={(range) => patch("dateRange", range)}
                  />
                </div>
              );
            }
            return (
              <SelectFilter
                key={dim}
                label={FILTER_LABELS[dim]}
                value={filters[STATE_KEY[dim]] as string}
                options={OPTIONS[dim] as unknown as string[]}
                onChange={(v) => patch(STATE_KEY[dim], v)}
              />
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 text-xs"
          onClick={reset}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
