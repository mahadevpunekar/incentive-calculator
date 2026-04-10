import {
  mockActivities,
  mockBreakdown,
  mockDashboardAlerts,
  mockIntegrations,
  mockAccrualVarianceBuckets,
  mockIncentivePayoutCurve,
  mockKpis,
  mockLeaderboard,
  mockMonthlyPerformance,
  mockReports,
  mockTargets,
  mockTopExposures,
  mockTrend,
  mockUser,
} from "./data";
import type {
  ActivityItem,
  BreakdownLine,
  DashboardAlert,
  Integration,
  AccrualVarianceBucket,
  IncentivePayoutCurvePoint,
  KpiSummary,
  LeaderboardRow,
  MonthlyPerformancePoint,
  ReportJob,
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
};
