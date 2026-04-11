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

/** Slice tags for global dashboard filters (mock). */
export type DataSliceDimensions = {
  channel: string;
  region: string;
  branch: string;
  staff: string;
  product: string;
  /** Short month label aligned with mock series */
  month: string;
};

export type TrendPoint = {
  period: string;
  revenue: number;
  incentive: number;
  slice: DataSliceDimensions;
};

/** Monthly achievement % (or composite performance index) for dashboard line chart */
export type MonthlyPerformancePoint = {
  month: string;
  achievementPct: number;
  incentiveK: number;
  incentivePriorYearK: number;
  slice: DataSliceDimensions;
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
  slice: DataSliceDimensions;
};

export type BreakdownLine = {
  id: string;
  component: string;
  amount: number;
  dealRef?: string;
  period: string;
  slice: DataSliceDimensions;
};

export type ReportJob = {
  id: string;
  name: string;
  format: "pdf" | "xlsx" | "csv";
  lastRun: string;
  status: "ready" | "scheduled" | "failed";
  slice: DataSliceDimensions;
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
  slice: DataSliceDimensions;
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
  slice: DataSliceDimensions;
};

export type DashboardAlertSeverity = "critical" | "warning" | "info";

export type DashboardAlert = {
  id: string;
  severity: DashboardAlertSeverity;
  title: string;
  metric: string;
  detail: string;
  slice: DataSliceDimensions;
};

export type TopExposureRow = {
  id: string;
  exposure: string;
  segment: string;
  riskRating: string;
  maturity: string;
  amountOmr: number;
  sharePct: number;
  slice: DataSliceDimensions;
};

/** How this row combines with the previous condition (first row ignores this). */
export type RuleConditionCombinator = "AND" | "OR";

/** Rule engine: inclusion / exclusion on book dimensions (mock). */
export type RuleEngineCondition = {
  id: string;
  /** Ignored for the first condition in the list */
  combinator: RuleConditionCombinator;
  dimension: "channel" | "product" | "staff" | "region" | "branch";
  mode: "include" | "exclude";
  values: string[];
};

export type RuleEngineRule = {
  id: string;
  name: string;
  priority: number;
  active: boolean;
  conditions: RuleEngineCondition[];
  /** Added to base commission when the rule matches (explainability demo). */
  incentivePercent: number;
  effectSummary: string;
  updatedAt: string;
  updatedBy: string;
};

export type DataQualityIssue = {
  id: string;
  severity: "error" | "warning" | "info";
  checkName: string;
  description: string;
  source: string;
  detectedAt: string;
  status: "open" | "raised_it" | "resolved";
  resolutionNote?: string;
  slice: DataSliceDimensions;
};

export type ProductCommissionRow = {
  product: string;
  commissionOmr: number;
  pctOfTotal: number;
  yoyDeltaPct: number;
  slice: DataSliceDimensions;
};

export type ChannelEarningRow = {
  channel: string;
  earningsOmr: number;
  policies: number;
  slice: DataSliceDimensions;
};

export type BrokerPerformanceRow = {
  id: string;
  broker: string;
  channel: string;
  gwpOmr: number;
  commissionOmr: number;
  rank: number;
  slice: DataSliceDimensions;
};

/* ——— Incentive system extensions (mock) ——— */

export type ApprovalStageKey = "sales" | "ops" | "finance" | "payout";

export type ApprovalQueueStatus = "pending" | "approved" | "rejected";

export type ApprovalStageState = {
  stage: ApprovalStageKey;
  label: string;
  status: "pending" | "complete" | "rejected";
  actor?: string;
  actedAt?: string;
  comment?: string;
};

export type ApprovalQueueItem = {
  id: string;
  title: string;
  detail: string;
  amountOmr: number;
  submitter: string;
  submittedAt: string;
  status: ApprovalQueueStatus;
  /** Next actor when status is pending */
  currentStage: ApprovalStageKey;
  stages: ApprovalStageState[];
};

/** MIS-style incentive book row (management reporting). */
export type MisReportRow = {
  id: string;
  region: string;
  branch: string;
  staff: string;
  product: string;
  gwpOmr: number;
  targetOmr: number;
  achievementPct: number;
  incentivePct: number;
  incentiveEarnedOmr: number;
};

export type MisTrendPoint = {
  period: string;
  gwpOmr: number;
  incentiveOmr: number;
};

export type CommissionSlabRow = {
  id: string;
  minAchievementPct: number;
  maxAchievementPct: number;
  commissionPct: number;
  payoutMultiplier: number;
};

export type CommissionRuleSet = {
  id: string;
  name: string;
  product: string;
  region: string;
  roleScope: string;
  version: string;
  status: "draft" | "active" | "archived";
  effectiveFrom: string;
  updatedAt: string;
  updatedBy: string;
  slabs: CommissionSlabRow[];
};

export type RuleVersionMeta = {
  version: string;
  label: string;
  effectiveFrom: string;
  status: "draft" | "active" | "archived";
};

export type AuditEntityType = "rule" | "payout" | "approval" | "scenario";

export type AuditTrailEntry = {
  id: string;
  entityType: AuditEntityType;
  entityLabel: string;
  action: string;
  actor: string;
  at: string;
  beforeSummary: string;
  afterSummary: string;
};

export type ScheduledReportJob = {
  id: string;
  name: string;
  format: "pdf" | "xlsx" | "csv";
  cadence: string;
  nextRun: string;
  recipients: string;
  enabled: boolean;
  slice: DataSliceDimensions;
};

/** Integration sync / ingest log lines (mock) */
export type IntegrationLogEntry = {
  id: string;
  at: string;
  level: "info" | "warn" | "error";
  integration: string;
  message: string;
  slice: DataSliceDimensions;
};

/** Performance summary signals for filterable operational view (mock) */
export type PerformanceSignalRow = {
  id: string;
  metric: string;
  value: string;
  context: string;
  slice: DataSliceDimensions;
};

export type NotificationChannelId = "email" | "sms" | "whatsapp";

export type NotificationAlertRule = {
  id: string;
  name: string;
  trigger: string;
  channels: NotificationChannelId[];
  enabled: boolean;
};

export type NotificationCampaignDraft = {
  id: string;
  name: string;
  audience: string;
  channel: NotificationChannelId;
  status: "draft" | "scheduled" | "sent";
  scheduledFor?: string;
};
