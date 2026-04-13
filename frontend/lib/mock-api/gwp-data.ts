/** ──────────────────────────────────────────────
 *  Mock data for enterprise GWP dashboard
 *  ────────────────────────────────────────────── */

import { mockSliceAt } from "@/lib/mock-slices";
import type {
  AiInsight,
  BranchGwpRow,
  GwpKpi,
  GwpProductRow,
  IncentiveSlabRow,
  RegionGwpRow,
} from "./gwp-types";

/* ── GWP KPIs ──────────────────────────────── */
export const mockGwpKpis: GwpKpi[] = [
  {
    id: "gk-1",
    label: "Total GWP",
    value: 12850000,
    formattedValue: "12.85M",
    change: 13.6,
    trend: "up",
    sparkline: [9.2, 10.1, 10.8, 11.4, 12.0, 12.85],
    category: "gwp",
  },
  {
    id: "gk-2",
    label: "Retail GWP",
    value: 5420000,
    formattedValue: "5.42M",
    change: 8.3,
    trend: "up",
    sparkline: [4.1, 4.4, 4.7, 4.9, 5.1, 5.42],
    category: "gwp",
  },
  {
    id: "gk-3",
    label: "Commercial GWP",
    value: 7430000,
    formattedValue: "7.43M",
    change: 10.2,
    trend: "up",
    sparkline: [5.8, 6.1, 6.5, 6.8, 7.1, 7.43],
    category: "gwp",
  },
  {
    id: "gk-4",
    label: "Total Commission",
    value: 488500,
    formattedValue: "488.5K",
    change: 8.6,
    trend: "up",
    sparkline: [380, 395, 420, 445, 468, 488.5],
    category: "commission",
  },
  {
    id: "gk-5",
    label: "Incentive Payout",
    value: 142800,
    formattedValue: "142.8K",
    change: 12.4,
    trend: "up",
    sparkline: [96, 105, 115, 125, 135, 142.8],
    category: "incentive",
  },
  {
    id: "gk-6",
    label: "Forecasted Earnings",
    value: 15200000,
    formattedValue: "15.2M",
    change: 18.3,
    trend: "up",
    sparkline: [11.2, 12.0, 12.8, 13.6, 14.4, 15.2],
    category: "forecast",
  },
];

/* ── GWP Product Table ─────────────────────── */
export const mockGwpProducts: GwpProductRow[] = [
  {
    id: "gp-1", product: "Motor Comprehensive", cyGwp: 3250, pyGwp: 2860,
    growthPct: 13.6, cyLossRatio: 62.5, pyLossRatio: 65.0,
    lossRatioGrowthPct: -3.8, cyRenewals: 8450, pyRenewals: 7800,
    renewalGrowthPct: 8.3, commissionEarned: 195000, finalPayout: 48750,
    channel: "DST", slice: mockSliceAt(0),
  },
  {
    id: "gp-2", product: "Medical Group", cyGwp: 2180, pyGwp: 2012,
    growthPct: 8.3, cyLossRatio: 58.2, pyLossRatio: 60.0,
    lossRatioGrowthPct: -3.0, cyRenewals: 6720, pyRenewals: 6200,
    renewalGrowthPct: 8.4, commissionEarned: 130800, finalPayout: 32700,
    channel: "DST", slice: mockSliceAt(1),
  },
  {
    id: "gp-3", product: "Marine Hull", cyGwp: 1820, pyGwp: 1652,
    growthPct: 10.2, cyLossRatio: 66.8, pyLossRatio: 68.5,
    lossRatioGrowthPct: -2.5, cyRenewals: 9150, pyRenewals: 8600,
    renewalGrowthPct: 6.4, commissionEarned: 109200, finalPayout: 27300,
    channel: "Broker", slice: mockSliceAt(2),
  },
  {
    id: "gp-4", product: "Property All Risk", cyGwp: 1560, pyGwp: 1430,
    growthPct: 9.1, cyLossRatio: 55.4, pyLossRatio: 57.0,
    lossRatioGrowthPct: -2.8, cyRenewals: 5200, pyRenewals: 4900,
    renewalGrowthPct: 6.1, commissionEarned: 93600, finalPayout: 23400,
    channel: "DST", slice: mockSliceAt(3),
  },
  {
    id: "gp-5", product: "Engineering", cyGwp: 1420, pyGwp: 1286,
    growthPct: 10.4, cyLossRatio: 69.2, pyLossRatio: 71.5,
    lossRatioGrowthPct: -3.2, cyRenewals: 11400, pyRenewals: 10700,
    renewalGrowthPct: 6.5, commissionEarned: 85200, finalPayout: 21300,
    channel: "Broker", slice: mockSliceAt(4),
  },
  {
    id: "gp-6", product: "Liability", cyGwp: 980, pyGwp: 902,
    growthPct: 8.6, cyLossRatio: 61.0, pyLossRatio: 63.5,
    lossRatioGrowthPct: -3.9, cyRenewals: 7300, pyRenewals: 6850,
    renewalGrowthPct: 6.6, commissionEarned: 58800, finalPayout: 14700,
    channel: "DST", slice: mockSliceAt(5),
  },
  {
    id: "gp-7", product: "Travel", cyGwp: 850, pyGwp: 787,
    growthPct: 8.0, cyLossRatio: 59.6, pyLossRatio: 61.2,
    lossRatioGrowthPct: -2.6, cyRenewals: 6480, pyRenewals: 6050,
    renewalGrowthPct: 7.1, commissionEarned: 51000, finalPayout: 12750,
    channel: "Online", slice: mockSliceAt(6),
  },
  {
    id: "gp-8", product: "Cargo", cyGwp: 790, pyGwp: 733,
    growthPct: 7.8, cyLossRatio: 72.5, pyLossRatio: 74.0,
    lossRatioGrowthPct: -2.0, cyRenewals: 13250, pyRenewals: 12600,
    renewalGrowthPct: 5.2, commissionEarned: 47400, finalPayout: 11850,
    channel: "Broker", slice: mockSliceAt(7),
  },
];

/* ── Region-wise GWP ──────────────────────── */
export const mockRegionGwp: RegionGwpRow[] = [
  { region: "Al Buraimi", cyGwp: 125.0, growthPct: 13.6, cyLossRatio: 62.5, lossRatioGrowthPct: -3.6, cyRenewals: 8450, renewalGrowthPct: 8.3 },
  { region: "Al Batinah", cyGwp: 98.0, growthPct: 8.3, cyLossRatio: 58.2, lossRatioGrowthPct: -3.0, cyRenewals: 6720, renewalGrowthPct: 8.4 },
  { region: "Muscat", cyGwp: 145.5, growthPct: 10.2, cyLossRatio: 66.8, lossRatioGrowthPct: -2.5, cyRenewals: 9150, renewalGrowthPct: 6.4 },
  { region: "Al Wusta", cyGwp: 76.0, growthPct: 8.6, cyLossRatio: 55.4, lossRatioGrowthPct: -2.8, cyRenewals: 5200, renewalGrowthPct: 6.1 },
  { region: "Dhofar", cyGwp: 182.0, growthPct: 10.3, cyLossRatio: 69.2, lossRatioGrowthPct: -3.2, cyRenewals: 11400, renewalGrowthPct: 6.5 },
  { region: "Ad Dakhiliyah", cyGwp: 110.5, growthPct: 8.3, cyLossRatio: 61.0, lossRatioGrowthPct: -3.0, cyRenewals: 7300, renewalGrowthPct: 6.6 },
  { region: "Ash Sharqiyah", cyGwp: 92.0, growthPct: 7.8, cyLossRatio: 59.5, lossRatioGrowthPct: -2.6, cyRenewals: 6100, renewalGrowthPct: 7.0 },
  { region: "Musandam", cyGwp: 45.0, growthPct: 6.5, cyLossRatio: 54.0, lossRatioGrowthPct: -1.8, cyRenewals: 3200, renewalGrowthPct: 5.5 },
];

/* ── Branch-wise GWP ──────────────────────── */
export const mockBranchGwp: BranchGwpRow[] = [
  { branch: "Head Office", region: "Muscat", cyGwp: 125.0, growthPct: 13.6, cyLossRatio: 62.5, lossRatioGrowthPct: -3.8, cyRenewals: 8450, renewalGrowthPct: 8.3 },
  { branch: "Ruwi", region: "Muscat", cyGwp: 98.0, growthPct: 8.3, cyLossRatio: 58.2, lossRatioGrowthPct: -3.0, cyRenewals: 6720, renewalGrowthPct: 8.4 },
  { branch: "Sohar", region: "Al Batinah", cyGwp: 145.5, growthPct: 10.2, cyLossRatio: 66.8, lossRatioGrowthPct: -2.5, cyRenewals: 9150, renewalGrowthPct: 6.4 },
  { branch: "Salalah", region: "Dhofar", cyGwp: 76.0, growthPct: 8.6, cyLossRatio: 55.4, lossRatioGrowthPct: -2.8, cyRenewals: 5200, renewalGrowthPct: 6.1 },
  { branch: "Ibri", region: "Ad Dakhiliyah", cyGwp: 182.0, growthPct: 10.3, cyLossRatio: 69.2, lossRatioGrowthPct: -3.2, cyRenewals: 11400, renewalGrowthPct: 6.5 },
  { branch: "Sur", region: "Ash Sharqiyah", cyGwp: 110.5, growthPct: 8.3, cyLossRatio: 61.0, lossRatioGrowthPct: -3.0, cyRenewals: 7300, renewalGrowthPct: 6.6 },
];

/* ── Incentive Slab Staff ─────────────────── */
export const mockIncentiveSlabs: IncentiveSlabRow[] = [
  {
    id: "is-1", staffName: "Yousuf Al-Balushi", staffId: "ST-001",
    motorTarget: 400000, motorAchieved: 512000, motorAchievedPct: 128,
    nonMotorTarget: 300000, nonMotorAchieved: 348000, nonMotorAchievedPct: 116,
    overallAchievedPct: 122.9, appliedSlab: ">120%", incentivePct: 12,
    finalIncentiveOmr: 52800,
  },
  {
    id: "is-2", staffName: "Sara Al-Mansoori", staffId: "ST-002",
    motorTarget: 380000, motorAchieved: 425600, motorAchievedPct: 112,
    nonMotorTarget: 280000, nonMotorAchieved: 296800, nonMotorAchievedPct: 106,
    overallAchievedPct: 109.4, appliedSlab: "80-120%", incentivePct: 9,
    finalIncentiveOmr: 49200,
  },
  {
    id: "is-3", staffName: "Hamed Al-Saadi", staffId: "ST-003",
    motorTarget: 350000, motorAchieved: 385000, motorAchievedPct: 110,
    nonMotorTarget: 260000, nonMotorAchieved: 270400, nonMotorAchievedPct: 104,
    overallAchievedPct: 107.3, appliedSlab: "80-120%", incentivePct: 9,
    finalIncentiveOmr: 46100,
  },
  {
    id: "is-4", staffName: "Fatima Al-Rashidi", staffId: "ST-004",
    motorTarget: 320000, motorAchieved: 403200, motorAchievedPct: 126,
    nonMotorTarget: 240000, nonMotorAchieved: 292800, nonMotorAchievedPct: 122,
    overallAchievedPct: 124.3, appliedSlab: ">120%", incentivePct: 12,
    finalIncentiveOmr: 40200,
  },
  {
    id: "is-5", staffName: "Khalid Al-Harthy", staffId: "ST-005",
    motorTarget: 300000, motorAchieved: 276000, motorAchievedPct: 92,
    nonMotorTarget: 220000, nonMotorAchieved: 211200, nonMotorAchievedPct: 96,
    overallAchievedPct: 93.7, appliedSlab: "80-120%", incentivePct: 9,
    finalIncentiveOmr: 38100,
  },
  {
    id: "is-6", staffName: "Mohammed Al-Wahaibi", staffId: "ST-006",
    motorTarget: 280000, motorAchieved: 210000, motorAchievedPct: 75,
    nonMotorTarget: 200000, nonMotorAchieved: 148000, nonMotorAchievedPct: 74,
    overallAchievedPct: 74.6, appliedSlab: "<80%", incentivePct: 0,
    finalIncentiveOmr: 0,
  },
  {
    id: "is-7", staffName: "Layla Al-Balushi", staffId: "ST-007",
    motorTarget: 260000, motorAchieved: 338000, motorAchievedPct: 130,
    nonMotorTarget: 190000, nonMotorAchieved: 239400, nonMotorAchievedPct: 126,
    overallAchievedPct: 128.2, appliedSlab: ">120%", incentivePct: 12,
    finalIncentiveOmr: 34800,
  },
  {
    id: "is-8", staffName: "Omar Al-Siyabi", staffId: "ST-008",
    motorTarget: 240000, motorAchieved: 228000, motorAchievedPct: 95,
    nonMotorTarget: 180000, nonMotorAchieved: 172800, nonMotorAchievedPct: 96,
    overallAchievedPct: 95.4, appliedSlab: "80-120%", incentivePct: 9,
    finalIncentiveOmr: 28400,
  },
];

/* ── AI Insights ──────────────────────────── */
export const mockAiInsights: AiInsight[] = [
  {
    id: "ai-1", icon: "🚀", title: "Motor GWP Surge",
    description: "Motor comprehensive grew 13.6% YoY — highest in 3 years. DST channel drives 68% of motor volume.",
    severity: "positive",
  },
  {
    id: "ai-2", icon: "⚠️", title: "Loss Ratio Alert",
    description: "Cargo loss ratio at 72.5% — exceeds internal benchmark by 4.5pp. Review underwriting guidelines.",
    severity: "warning",
  },
  {
    id: "ai-3", icon: "🏆", title: "Top Performer",
    description: "Yousuf Al-Balushi achieved 128% motor target — qualifies for 12% accelerator incentive tier.",
    severity: "positive",
  },
  {
    id: "ai-4", icon: "📊", title: "Regional Opportunity",
    description: "Dhofar region shows strongest growth at 10.3%. Consider increasing targets for Q3 planning.",
    severity: "neutral",
  },
  {
    id: "ai-5", icon: "💡", title: "Commission Optimization",
    description: "Shifting 5% volume from Broker to Direct channel could save ~OMR 24K in commission FY26.",
    severity: "neutral",
  },
];
