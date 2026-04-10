"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { filterKeySet, getPageFilterPolicy } from "@/lib/filter-route-config";
import { useGlobalFilterStore } from "@/stores/global-filter-store";

/**
 * Current route filter policy + global filter values + active dimension set for data queries.
 */
export function usePageFilterContext() {
  const pathname = usePathname() ?? "";
  const policy = useMemo(() => getPageFilterPolicy(pathname), [pathname]);
  const activeKeys = useMemo(() => filterKeySet(policy), [policy]);
  const filters = useGlobalFilterStore((s) => s.filters);

  return {
    pathname,
    policy,
    /** `null` when bar hidden or no keys — consumers should not filter */
    activeKeys,
    filters,
  };
}

export type PageFilterContext = ReturnType<typeof usePageFilterContext>;
