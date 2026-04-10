export type UserRole = "sales" | "manager" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  team?: string;
};

export type KpiSummary = {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type TrendPoint = { period: string; revenue: number; incentive: number };

/** Monthly achievement % (or composite performance index) for dashboard line chart */
export type MonthlyPerformancePoint = {
  month: string;
  achievementPct: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "deal" | "payout" | "alert";
};

export type LeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  team: string;
  revenue: number;
  incentive: number;
  kpiScore: number;
  delta?: number;
};

export type BreakdownLine = {
  id: string;
  component: string;
  amount: number;
  dealRef?: string;
  period: string;
};

export type ReportJob = {
  id: string;
  name: string;
  format: "pdf" | "xlsx" | "csv";
  lastRun: string;
  status: "ready" | "scheduled" | "failed";
};

export type TargetRow = {
  id: string;
  metric: string;
  target: number;
  achieved: number;
  unit: string;
  owner: string;
};

export type Integration = {
  id: string;
  name: string;
  provider: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
};

/**
 * Period-level accrual vs earned (mock). Variance = earned − expected (accrual).
 * Cumulative variance in charts is always Σ(variance) across buckets in order.
 */
export type AccrualVarianceBucket = {
  bucket: string;
  /** Incentive recognised as earned in the period (OMR k) */
  earnedK: number;
  /** Accrual / expected incentive for the same period (OMR k) */
  expectedK: number;
  /** earnedK − expectedK (OMR k) */
  varianceK: number;
};

/** One point on the achievement → payout curve (slab rules applied). */
export type IncentivePayoutCurvePoint = {
  /** Point label (e.g. week or snapshot) */
  label: string;
  /** GWP / revenue attributed to the measure (OMR k) */
  revenueK: number;
  /** Achievement % of sales target */
  achievementPct: number;
  /** Incentive earned after slab & multiplier (OMR k) */
  incentiveEarnedK: number;
  /** Effective multiplier vs base tier-1 rate (1.0 = on-target earn rate) */
  payoutMultiplier: number;
  /** Applied incentive slab / band */
  appliedSlab: string;
};

export type DashboardAlertSeverity = "critical" | "warning" | "info";

export type DashboardAlert = {
  id: string;
  severity: DashboardAlertSeverity;
  title: string;
  metric: string;
  detail: string;
};

export type TopExposureRow = {
  id: string;
  exposure: string;
  segment: string;
  riskRating: string;
  maturity: string;
  amountOmr: number;
  sharePct: number;
};
