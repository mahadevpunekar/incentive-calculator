import {
  mockActivities,
  mockApprovalQueue,
  mockAuditTrail,
  mockBreakdown,
  mockBrokerPerformance,
  mockChannelEarnings,
  mockCommissionRules,
  mockDashboardAlerts,
  mockDataQualityIssues,
  mockIntegrations,
  mockIntegrationLogs,
  mockAccrualVarianceBuckets,
  mockIncentivePayoutCurve,
  mockKpis,
  mockLeaderboard,
  mockMisReportRows,
  mockMisTrend,
  mockMonthlyPerformance,
  mockPerformanceSignals,
  mockNotificationCampaigns,
  mockNotificationRules,
  mockProductCommission,
  mockReports,
  mockRuleEngineRules,
  mockRuleVersions,
  mockScheduledReports,
  mockTargets,
  mockTopExposures,
  mockTrend,
  mockUser,
} from "./data";
import type {
  ActivityItem,
  ApprovalQueueItem,
  AuditTrailEntry,
  BreakdownLine,
  BrokerPerformanceRow,
  ChannelEarningRow,
  CommissionRuleSet,
  DashboardAlert,
  DataQualityIssue,
  Integration,
  IntegrationLogEntry,
  AccrualVarianceBucket,
  IncentivePayoutCurvePoint,
  KpiSummary,
  LeaderboardRow,
  MisReportRow,
  MisTrendPoint,
  MonthlyPerformancePoint,
  NotificationAlertRule,
  NotificationCampaignDraft,
  PerformanceSignalRow,
  ProductCommissionRow,
  ReportJob,
  RuleEngineRule,
  RuleVersionMeta,
  ScheduledReportJob,
  TargetRow,
  TopExposureRow,
  TrendPoint,
  User,
} from "./types";

const mockDelayMs = (() => {
  const n = Number(process.env.MOCK_API_DELAY_MS);
  return Number.isFinite(n) && n > 0 ? n : 0;
})();

const delay = (ms: number) =>
  ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();

/** Simulated API — in-memory only; swap for fetch() when a backend exists */
export const api = {
  async getCurrentUser(): Promise<User> {
    await delay(mockDelayMs);
    return { ...mockUser };
  },

  async getDashboardKpis(): Promise<KpiSummary[]> {
    await delay(mockDelayMs);
    return [...mockKpis];
  },

  async getRevenueIncentiveTrend(): Promise<TrendPoint[]> {
    await delay(mockDelayMs);
    return [...mockTrend];
  },

  async getMonthlyPerformance(): Promise<MonthlyPerformancePoint[]> {
    await delay(mockDelayMs);
    return [...mockMonthlyPerformance];
  },

  async getMisReportRows(): Promise<MisReportRow[]> {
    await delay(mockDelayMs);
    return [...mockMisReportRows];
  },

  async getMisTrend(): Promise<MisTrendPoint[]> {
    await delay(mockDelayMs);
    return [...mockMisTrend];
  },

  /** Top N for dashboard mini leaderboard */
  async getLeaderboardTop(n: number): Promise<LeaderboardRow[]> {
    await delay(mockDelayMs);
    return mockLeaderboard.slice(0, n);
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    await delay(mockDelayMs);
    return [...mockActivities];
  },

  async getLeaderboard(): Promise<LeaderboardRow[]> {
    await delay(mockDelayMs);
    return [...mockLeaderboard];
  },

  async getBreakdown(): Promise<BreakdownLine[]> {
    await delay(mockDelayMs);
    return [...mockBreakdown];
  },

  async getReports(): Promise<ReportJob[]> {
    await delay(mockDelayMs);
    return [...mockReports];
  },

  async getTargets(): Promise<TargetRow[]> {
    await delay(mockDelayMs);
    return [...mockTargets];
  },

  async getIntegrations(): Promise<Integration[]> {
    await delay(mockDelayMs);
    return [...mockIntegrations];
  },

  async getIntegrationLogs(): Promise<IntegrationLogEntry[]> {
    await delay(mockDelayMs);
    return [...mockIntegrationLogs];
  },

  async getPerformanceSignals(): Promise<PerformanceSignalRow[]> {
    await delay(mockDelayMs);
    return [...mockPerformanceSignals];
  },

  async getAccrualVarianceBuckets(): Promise<AccrualVarianceBucket[]> {
    await delay(mockDelayMs);
    return [...mockAccrualVarianceBuckets];
  },

  async getIncentivePayoutCurve(): Promise<IncentivePayoutCurvePoint[]> {
    await delay(mockDelayMs);
    return [...mockIncentivePayoutCurve];
  },

  async getDashboardAlerts(): Promise<DashboardAlert[]> {
    await delay(mockDelayMs);
    return [...mockDashboardAlerts];
  },

  async getTopExposures(): Promise<TopExposureRow[]> {
    await delay(mockDelayMs);
    return [...mockTopExposures];
  },

  async getApprovalQueue(): Promise<ApprovalQueueItem[]> {
    await delay(mockDelayMs);
    return [...mockApprovalQueue];
  },

  async getCommissionRules(): Promise<CommissionRuleSet[]> {
    await delay(mockDelayMs);
    return [...mockCommissionRules];
  },

  async getRuleVersions(): Promise<RuleVersionMeta[]> {
    await delay(mockDelayMs);
    return [...mockRuleVersions];
  },

  async getAuditTrail(): Promise<AuditTrailEntry[]> {
    await delay(mockDelayMs);
    return [...mockAuditTrail];
  },

  async getScheduledReports(): Promise<ScheduledReportJob[]> {
    await delay(mockDelayMs);
    return [...mockScheduledReports];
  },

  async getNotificationRules(): Promise<NotificationAlertRule[]> {
    await delay(mockDelayMs);
    return [...mockNotificationRules];
  },

  async getNotificationCampaigns(): Promise<NotificationCampaignDraft[]> {
    await delay(mockDelayMs);
    return [...mockNotificationCampaigns];
  },

  async getRuleEngineRules(): Promise<RuleEngineRule[]> {
    await delay(mockDelayMs);
    return [...mockRuleEngineRules];
  },

  async getDataQualityIssues(): Promise<DataQualityIssue[]> {
    await delay(mockDelayMs);
    return [...mockDataQualityIssues];
  },

  async getProductCommission(): Promise<ProductCommissionRow[]> {
    await delay(mockDelayMs);
    return [...mockProductCommission];
  },

  async getChannelEarnings(): Promise<ChannelEarningRow[]> {
    await delay(mockDelayMs);
    return [...mockChannelEarnings];
  },

  async getBrokerPerformance(): Promise<BrokerPerformanceRow[]> {
    await delay(mockDelayMs);
    return [...mockBrokerPerformance];
  },
};
