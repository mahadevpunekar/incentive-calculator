/**
 * Page-level global filter policy: which routes show the bar and which
 * dimensions apply to data (subset = hybrid pages). State stays in Zustand;
 * inactive dimensions are ignored for matching on that page.
 */

export const FILTER_DIMENSIONS = [
  "channel",
  "region",
  "branch",
  "staff",
  "product",
  "month",
] as const;

export type FilterDimension = (typeof FILTER_DIMENSIONS)[number];

export const ALL_FILTER_DIMENSIONS: FilterDimension[] = [
  ...FILTER_DIMENSIONS,
];

/** UI labels (month = period / date slice in mock data) */
export const FILTER_LABELS: Record<FilterDimension, string> = {
  channel: "Channel",
  region: "Region",
  branch: "Branch",
  staff: "Staff",
  product: "Product",
  month: "Period",
};

type RouteRule = {
  match: (pathname: string) => boolean;
  /** When false, filter bar is hidden entirely */
  showBar: boolean;
  /** Dimensions shown in the bar and applied to `slice` matching */
  filterKeys: readonly FilterDimension[];
};

/**
 * First matching rule wins. Routes not listed hide the bar (admin-style pages).
 */
const ROUTE_RULES: RouteRule[] = [
  {
    match: (p) => p.startsWith("/profile") || p.startsWith("/settings"),
    showBar: false,
    filterKeys: [],
  },
  {
    match: (p) => p.startsWith("/admin"),
    showBar: false,
    filterKeys: [],
  },
  {
    match: (p) => p.startsWith("/integrations/logs"),
    showBar: true,
    filterKeys: ["month", "channel"],
  },
  {
    match: (p) => p.startsWith("/integrations"),
    showBar: false,
    filterKeys: [],
  },
  {
    match: (p) => p.startsWith("/dashboard"),
    showBar: true,
    filterKeys: ALL_FILTER_DIMENSIONS,
  },
  {
    match: (p) => p.startsWith("/analytics"),
    showBar: true,
    filterKeys: ALL_FILTER_DIMENSIONS,
  },
  {
    match: (p) => p.startsWith("/performance"),
    showBar: true,
    filterKeys: ["month", "channel", "region"],
  },
  {
    match: (p) => p.startsWith("/reports"),
    showBar: true,
    filterKeys: ["month", "channel", "region", "product"],
  },
  {
    match: (p) => p.startsWith("/leaderboard"),
    showBar: true,
    filterKeys: ["region", "branch", "staff", "month"],
  },
  {
    match: (p) => p.startsWith("/breakdown"),
    showBar: true,
    filterKeys: ["product", "channel", "month"],
  },
  {
    match: (p) => p.startsWith("/simulation"),
    showBar: true,
    filterKeys: ["month", "channel"],
  },
  {
    match: (p) => p.startsWith("/data-quality"),
    showBar: true,
    filterKeys: ["month", "region"],
  },
];

export type PageFilterPolicy = {
  showBar: boolean;
  filterKeys: readonly FilterDimension[];
};

export function getPageFilterPolicy(pathname: string): PageFilterPolicy {
  for (const rule of ROUTE_RULES) {
    if (rule.match(pathname)) {
      return {
        showBar: rule.showBar,
        filterKeys: rule.filterKeys,
      };
    }
  }
  return { showBar: false, filterKeys: [] };
}

export function filterKeySet(
  policy: PageFilterPolicy
): ReadonlySet<FilterDimension> | null {
  if (!policy.showBar || policy.filterKeys.length === 0) return null;
  return new Set(policy.filterKeys);
}
