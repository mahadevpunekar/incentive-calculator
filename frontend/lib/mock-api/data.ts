import type {
  AccrualVarianceBucket,
  ActivityItem,
  BreakdownLine,
  DashboardAlert,
  IncentivePayoutCurvePoint,
  Integration,
  KpiSummary,
  LeaderboardRow,
  MonthlyPerformancePoint,
  ReportJob,
  TargetRow,
  TopExposureRow,
  TrendPoint,
  User,
} from "./types";

export const mockUser: User = {
  id: "u-1",
  name: "Sara Al-Mansoori",
  email: "sara.almansoori@example.com",
  role: "manager",
  team: "Commercial Lines — Muscat",
};

export const mockKpis: KpiSummary[] = [
  {
    id: "k1",
    label: "Total Incentive",
    value: "OMR 42,180",
    change: "+12.4% vs last quarter",
    trend: "up",
  },
  {
    id: "k2",
    label: "Achievement %",
    value: "85%",
    change: "Quarter-to-date · Tier 2 band",
    trend: "up",
  },
  {
    id: "k3",
    label: "Pending payout",
    value: "OMR 8,400",
    change: "Next settlement 15 Apr · YTD paid OMR 33,780",
    trend: "neutral",
  },
  {
    id: "k4",
    label: "Risk indicator",
    value: "Elevated",
    change: "2 open breaches · motor renewals under review",
    trend: "down",
  },
];

export const mockTrend: TrendPoint[] = [
  { period: "Jan", revenue: 280000, incentive: 11200 },
  { period: "Feb", revenue: 310000, incentive: 12800 },
  { period: "Mar", revenue: 355000, incentive: 14600 },
  { period: "Apr", revenue: 298000, incentive: 12100 },
  { period: "May", revenue: 332000, incentive: 13500 },
  { period: "Jun", revenue: 368000, incentive: 15180 },
];

/** Monthly achievement % for dashboard line chart */
export const mockMonthlyPerformance: MonthlyPerformancePoint[] = [
  { month: "Jan", achievementPct: 72 },
  { month: "Feb", achievementPct: 76 },
  { month: "Mar", achievementPct: 81 },
  { month: "Apr", achievementPct: 78 },
  { month: "May", achievementPct: 83 },
  { month: "Jun", achievementPct: 85 },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "a1",
    title: "Deal closed — Marine hull",
    description: "OMR 185,000 premium · Incentive accrual updated",
    time: "2h ago",
    type: "deal",
  },
  {
    id: "a2",
    title: "March payout released",
    description: "OMR 14,200 credited to wallet",
    time: "Yesterday",
    type: "payout",
  },
  {
    id: "a3",
    title: "KPI threshold reminder",
    description: "Motor renewals within 8% of accelerator band",
    time: "2d ago",
    type: "alert",
  },
  {
    id: "a4",
    title: "Target allocation updated",
    description: "Q2 goals published for Commercial — Muscat",
    time: "3d ago",
    type: "alert",
  },
  {
    id: "a5",
    title: "Deal closed — Fleet motor",
    description: "OMR 92,400 premium · NB multiplier applied",
    time: "4d ago",
    type: "deal",
  },
];

export const mockLeaderboard: LeaderboardRow[] = [
  {
    id: "lb-1",
    rank: 1,
    name: "Yousuf Al-Balushi",
    team: "Retail — Salalah",
    revenue: 512000,
    incentive: 52800,
    kpiScore: 94,
    delta: 1,
  },
  {
    id: "lb-2",
    rank: 2,
    name: "Sara Al-Mansoori",
    team: "Commercial — Muscat",
    revenue: 488000,
    incentive: 49200,
    kpiScore: 91,
    delta: -1,
  },
  {
    id: "lb-3",
    rank: 3,
    name: "Hamed Al-Saadi",
    team: "Corporate — Muscat",
    revenue: 465000,
    incentive: 46100,
    kpiScore: 88,
    delta: 0,
  },
  {
    id: "lb-4",
    rank: 4,
    name: "Fatima Al-Rashidi",
    team: "Retail — Sohar",
    revenue: 421000,
    incentive: 40200,
    kpiScore: 84,
    delta: 2,
  },
  {
    id: "lb-5",
    rank: 5,
    name: "Khalid Al-Harthy",
    team: "SME — Muscat",
    revenue: 398000,
    incentive: 38100,
    kpiScore: 81,
    delta: -1,
  },
];

export const mockBreakdown: BreakdownLine[] = [
  {
    id: "b1",
    component: "Base incentive (Tier 2 slab)",
    amount: 28400,
    dealRef: "Plan FY25 — Commercial",
    period: "Q1 2026",
  },
  {
    id: "b2",
    component: "Variable — new business multiplier",
    amount: 9200,
    dealRef: "NB x1.15",
    period: "Q1 2026",
  },
  {
    id: "b3",
    component: "Accelerator — overachievement",
    amount: 4580,
    dealRef: "Motor renewals > 92%",
    period: "Q1 2026",
  },
];

export const mockReports: ReportJob[] = [
  {
    id: "r1",
    name: "Executive incentive summary",
    format: "pdf",
    lastRun: "2026-04-01",
    status: "ready",
  },
  {
    id: "r2",
    name: "Deal-level breakdown",
    format: "xlsx",
    lastRun: "2026-03-28",
    status: "scheduled",
  },
  {
    id: "r3",
    name: "Leaderboard export",
    format: "csv",
    lastRun: "2026-03-15",
    status: "failed",
  },
];

export const mockTargets: TargetRow[] = [
  {
    id: "t1",
    metric: "Gross written premium",
    target: 1200000,
    achieved: 1020000,
    unit: "OMR",
    owner: "Commercial — Muscat",
  },
  {
    id: "t2",
    metric: "New policies (count)",
    target: 180,
    achieved: 156,
    unit: "count",
    owner: "Sara Al-Mansoori",
  },
  {
    id: "t3",
    metric: "Renewal retention",
    target: 92,
    achieved: 88.4,
    unit: "%",
    owner: "Team Retail",
  },
];

export const mockIntegrations: Integration[] = [
  {
    id: "i1",
    name: "Salesforce CRM",
    provider: "Salesforce",
    status: "connected",
    lastSync: "12 min ago",
  },
  {
    id: "i2",
    name: "HubSpot pipeline",
    provider: "HubSpot",
    status: "disconnected",
  },
  {
    id: "i3",
    name: "Finance ledger",
    provider: "Internal",
    status: "error",
    lastSync: "3h ago",
  },
];

/** Recognition buckets: variance = earned − expected (accrual). Chart cumulates Σ variance. */
export const mockAccrualVarianceBuckets: AccrualVarianceBucket[] = [
  { bucket: "W1", earnedK: 9.2, expectedK: 10.5, varianceK: -1.3 },
  { bucket: "W2", earnedK: 11.0, expectedK: 10.8, varianceK: 0.2 },
  { bucket: "W3", earnedK: 10.4, expectedK: 11.2, varianceK: -0.8 },
  { bucket: "W4", earnedK: 12.6, expectedK: 11.0, varianceK: 1.6 },
  { bucket: "W5", earnedK: 11.8, expectedK: 12.4, varianceK: -0.6 },
  { bucket: "W6", earnedK: 13.1, expectedK: 12.0, varianceK: 1.1 },
  { bucket: "W7", earnedK: 12.0, expectedK: 12.8, varianceK: -0.8 },
  { bucket: "W8", earnedK: 14.2, expectedK: 12.5, varianceK: 1.7 },
  { bucket: "W9", earnedK: 13.5, expectedK: 13.2, varianceK: 0.3 },
  { bucket: "W10", earnedK: 14.0, expectedK: 13.8, varianceK: 0.2 },
];

/**
 * Achievement % (X) vs payout: below 80% no earn; 80–100% target band; >100% accelerator.
 * Multiplier is effective vs base tier-1 earn rate at 100% achievement.
 */
export const mockIncentivePayoutCurve: IncentivePayoutCurvePoint[] = [
  {
    label: "W2",
    revenueK: 186,
    achievementPct: 64,
    incentiveEarnedK: 0,
    payoutMultiplier: 0,
    appliedSlab: "Below threshold (<80%)",
  },
  {
    label: "W4",
    revenueK: 205,
    achievementPct: 72,
    incentiveEarnedK: 0,
    payoutMultiplier: 0,
    appliedSlab: "Below threshold (<80%)",
  },
  {
    label: "W6",
    revenueK: 228,
    achievementPct: 79,
    incentiveEarnedK: 0.9,
    payoutMultiplier: 0.12,
    appliedSlab: "Threshold approach (ramp)",
  },
  {
    label: "W7",
    revenueK: 236,
    achievementPct: 82,
    incentiveEarnedK: 6.2,
    payoutMultiplier: 0.72,
    appliedSlab: "Target band (80–100%)",
  },
  {
    label: "W8",
    revenueK: 248,
    achievementPct: 88,
    incentiveEarnedK: 12.4,
    payoutMultiplier: 1.0,
    appliedSlab: "Target band (80–100%)",
  },
  {
    label: "W9",
    revenueK: 258,
    achievementPct: 94,
    incentiveEarnedK: 17.8,
    payoutMultiplier: 1.12,
    appliedSlab: "Target band (80–100%)",
  },
  {
    label: "W10",
    revenueK: 268,
    achievementPct: 99,
    incentiveEarnedK: 22.6,
    payoutMultiplier: 1.22,
    appliedSlab: "Target band (80–100%)",
  },
  {
    label: "W11",
    revenueK: 276,
    achievementPct: 103,
    incentiveEarnedK: 31.4,
    payoutMultiplier: 1.35,
    appliedSlab: "Accelerator (>100%)",
  },
  {
    label: "W12",
    revenueK: 284,
    achievementPct: 108,
    incentiveEarnedK: 38.2,
    payoutMultiplier: 1.42,
    appliedSlab: "Accelerator (>100%)",
  },
];

export const mockDashboardAlerts: DashboardAlert[] = [
  {
    id: "da-1",
    severity: "critical",
    title: "Accelerator band at risk",
    metric: "Motor renewals −8% vs run-rate",
    detail: "Commercial — Muscat · Review before 12 Apr cutoff",
  },
  {
    id: "da-2",
    severity: "warning",
    title: "Payout reconciliation lag",
    metric: "OMR 8.4k pending sign-off",
    detail: "Finance queue · SLA 48h",
  },
  {
    id: "da-3",
    severity: "warning",
    title: "Target drift",
    metric: "Q2 GWP trail −3.2%",
    detail: "Rolling 8-week forecast",
  },
  {
    id: "da-4",
    severity: "info",
    title: "Plans within tolerance",
    metric: "94% of LOBs on track",
    detail: "Last full refresh · mock data",
  },
];

export const mockTopExposures: TopExposureRow[] = [
  {
    id: "ex-1",
    exposure: "Fleet motor — Oman Cement",
    segment: "Commercial",
    riskRating: "A−",
    maturity: "Aug 2027",
    amountOmr: 420000,
    sharePct: 18.4,
  },
  {
    id: "ex-2",
    exposure: "Marine hull — Port Salalah",
    segment: "Marine",
    riskRating: "BBB+",
    maturity: "Jan 2026",
    amountOmr: 298000,
    sharePct: 12.1,
  },
  {
    id: "ex-3",
    exposure: "Property — Muscat Mall",
    segment: "Property",
    riskRating: "A",
    maturity: "Mar 2028",
    amountOmr: 256000,
    sharePct: 9.8,
  },
  {
    id: "ex-4",
    exposure: "Medical group — Govt scheme",
    segment: "Health",
    riskRating: "AA−",
    maturity: "Dec 2026",
    amountOmr: 198000,
    sharePct: 8.2,
  },
  {
    id: "ex-5",
    exposure: "Motor retail book (top decile)",
    segment: "Retail",
    riskRating: "B+",
    maturity: "Rolling",
    amountOmr: 142000,
    sharePct: 6.5,
  },
  {
    id: "ex-6",
    exposure: "Engineering — PDO bundle",
    segment: "Engineering",
    riskRating: "A",
    maturity: "Jun 2027",
    amountOmr: 118000,
    sharePct: 5.1,
  },
];
