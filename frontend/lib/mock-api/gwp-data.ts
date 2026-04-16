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
  StaffGwpRow,
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
    targetOmr: 3000, commissionPct: 6,
    growthPct: 13.6, cyLossRatio: 62.5, pyLossRatio: 65.0,
    lossRatioGrowthPct: -3.8, cyRenewals: 8450, pyRenewals: 7800,
    renewalGrowthPct: 8.3, commissionEarned: 195000, finalPayout: 48750,
    channel: "DST", slice: mockSliceAt(0),
    monthlyTrend: [
      { month: "Oct", gwp: 2860 }, { month: "Nov", gwp: 2920 }, { month: "Dec", gwp: 3010 },
      { month: "Jan", gwp: 3080 }, { month: "Feb", gwp: 3150 }, { month: "Mar", gwp: 3250 }
    ]
  },
  {
    id: "gp-2", product: "Medical Group", cyGwp: 2180, pyGwp: 2012,
    targetOmr: 2500, commissionPct: 4,
    growthPct: 8.3, cyLossRatio: 58.2, pyLossRatio: 60.0,
    lossRatioGrowthPct: -3.0, cyRenewals: 6720, pyRenewals: 6200,
    renewalGrowthPct: 8.4, commissionEarned: 130800, finalPayout: 32700,
    channel: "DST", slice: mockSliceAt(1),
    monthlyTrend: [
      { month: "Oct", gwp: 2012 }, { month: "Nov", gwp: 2050 }, { month: "Dec", gwp: 2085 },
      { month: "Jan", gwp: 2120 }, { month: "Feb", gwp: 2155 }, { month: "Mar", gwp: 2180 }
    ]
  },
  {
    id: "gp-3", product: "Marine Hull", cyGwp: 1820, pyGwp: 1652,
    targetOmr: 1800, commissionPct: 8,
    growthPct: 10.2, cyLossRatio: 66.8, pyLossRatio: 68.5,
    lossRatioGrowthPct: -2.5, cyRenewals: 9150, pyRenewals: 8600,
    renewalGrowthPct: 6.4, commissionEarned: 109200, finalPayout: 27300,
    channel: "Broker", slice: mockSliceAt(2),
    monthlyTrend: [
      { month: "Oct", gwp: 1652 }, { month: "Nov", gwp: 1680 }, { month: "Dec", gwp: 1720 },
      { month: "Jan", gwp: 1765 }, { month: "Feb", gwp: 1790 }, { month: "Mar", gwp: 1820 }
    ]
  },
  {
    id: "gp-4", product: "Property All Risk", cyGwp: 1560, pyGwp: 1430,
    targetOmr: 1600, commissionPct: 5,
    growthPct: 9.1, cyLossRatio: 55.4, pyLossRatio: 57.0,
    lossRatioGrowthPct: -2.8, cyRenewals: 5200, pyRenewals: 4900,
    renewalGrowthPct: 6.1, commissionEarned: 93600, finalPayout: 23400,
    channel: "DST", slice: mockSliceAt(3),
    monthlyTrend: [
      { month: "Oct", gwp: 1430 }, { month: "Nov", gwp: 1455 }, { month: "Dec", gwp: 1480 },
      { month: "Jan", gwp: 1512 }, { month: "Feb", gwp: 1535 }, { month: "Mar", gwp: 1560 }
    ]
  },
  {
    id: "gp-5", product: "Engineering", cyGwp: 1420, pyGwp: 1286,
    targetOmr: 1500, commissionPct: 7,
    growthPct: 10.4, cyLossRatio: 69.2, pyLossRatio: 71.5,
    lossRatioGrowthPct: -3.2, cyRenewals: 11400, pyRenewals: 10700,
    renewalGrowthPct: 6.5, commissionEarned: 85200, finalPayout: 21300,
    channel: "Broker", slice: mockSliceAt(4),
    monthlyTrend: [
      { month: "Oct", gwp: 1286 }, { month: "Nov", gwp: 1315 }, { month: "Dec", gwp: 1350 },
      { month: "Jan", gwp: 1380 }, { month: "Feb", gwp: 1405 }, { month: "Mar", gwp: 1420 }
    ]
  },
  {
    id: "gp-6", product: "Liability", cyGwp: 980, pyGwp: 902,
    targetOmr: 1000, commissionPct: 5,
    growthPct: 8.6, cyLossRatio: 61.0, pyLossRatio: 63.5,
    lossRatioGrowthPct: -3.9, cyRenewals: 7300, pyRenewals: 6850,
    renewalGrowthPct: 6.6, commissionEarned: 58800, finalPayout: 14700,
    channel: "DST", slice: mockSliceAt(5),
    monthlyTrend: [
      { month: "Oct", gwp: 902 }, { month: "Nov", gwp: 920 }, { month: "Dec", gwp: 945 },
      { month: "Jan", gwp: 955 }, { month: "Feb", gwp: 970 }, { month: "Mar", gwp: 980 }
    ]
  },
  {
    id: "gp-7", product: "Travel", cyGwp: 850, pyGwp: 787,
    targetOmr: 800, commissionPct: 12,
    growthPct: 8.0, cyLossRatio: 59.6, pyLossRatio: 61.2,
    lossRatioGrowthPct: -2.6, cyRenewals: 6480, pyRenewals: 6050,
    renewalGrowthPct: 7.1, commissionEarned: 51000, finalPayout: 12750,
    channel: "Online", slice: mockSliceAt(6),
    monthlyTrend: [
      { month: "Oct", gwp: 787 }, { month: "Nov", gwp: 805 }, { month: "Dec", gwp: 820 },
      { month: "Jan", gwp: 835 }, { month: "Feb", gwp: 842 }, { month: "Mar", gwp: 850 }
    ]
  },
  {
    id: "gp-8", product: "Cargo", cyGwp: 790, pyGwp: 733,
    targetOmr: 1100, commissionPct: 10,
    growthPct: 7.8, cyLossRatio: 72.5, pyLossRatio: 74.0,
    lossRatioGrowthPct: -2.0, cyRenewals: 13250, pyRenewals: 12600,
    renewalGrowthPct: 5.2, commissionEarned: 47400, finalPayout: 11850,
    channel: "Broker", slice: mockSliceAt(7),
    monthlyTrend: [
      { month: "Oct", gwp: 733 }, { month: "Nov", gwp: 750 }, { month: "Dec", gwp: 765 },
      { month: "Jan", gwp: 775 }, { month: "Feb", gwp: 782 }, { month: "Mar", gwp: 790 }
    ]
  },
];

/* ── Region-wise GWP ──────────────────────── */
export const mockRegionGwp: RegionGwpRow[] = [
  { region: "Al Buraimi", target: 150.0, cyGwp: 125.0, growthPct: 13.6 },
  { region: "Al Batinah", target: 120.0, cyGwp: 98.0, growthPct: 8.3 },
  { region: "Muscat", target: 160.0, cyGwp: 145.5, growthPct: 10.2 },
  { region: "Al Wusta", target: 90.0, cyGwp: 76.0, growthPct: 8.6 },
  { region: "Dhofar", target: 200.0, cyGwp: 182.0, growthPct: 10.3 },
  { region: "Ad Dakhiliyah", target: 130.0, cyGwp: 110.5, growthPct: 8.3 },
  { region: "Ash Sharqiyah", target: 110.0, cyGwp: 92.0, growthPct: 7.8 },
  { region: "Musandam", target: 55.0, cyGwp: 45.0, growthPct: 6.5 },
];

/* ── Branch-wise GWP ──────────────────────── */
export const mockBranchGwp: BranchGwpRow[] = [
  { branch: "Head Office", region: "Muscat", target: 90.0, cyGwp: 85.0, growthPct: 13.6, trend: [68, 72, 75, 79, 82, 85] },
  { branch: "Ruwi", region: "Muscat", target: 70.0, cyGwp: 60.5, growthPct: 8.3, trend: [48, 50, 53, 56, 58, 60.5] },
  { branch: "Sohar", region: "Al Batinah", target: 65.0, cyGwp: 58.0, growthPct: 10.2, trend: [42, 45, 48, 52, 55, 58] },
  { branch: "Barka", region: "Al Batinah", target: 55.0, cyGwp: 40.0, growthPct: 6.8, trend: [30, 32, 34, 36, 38, 40] },
  { branch: "Salalah", region: "Dhofar", target: 110.0, cyGwp: 102.0, growthPct: 10.3, trend: [78, 82, 88, 92, 98, 102] },
  { branch: "Thumrait", region: "Dhofar", target: 90.0, cyGwp: 80.0, growthPct: 9.5, trend: [60, 64, 68, 72, 76, 80] },
  { branch: "Ibri", region: "Ad Dakhiliyah", target: 70.0, cyGwp: 62.0, growthPct: 8.3, trend: [46, 49, 52, 55, 58, 62] },
  { branch: "Nizwa", region: "Ad Dakhiliyah", target: 60.0, cyGwp: 48.5, growthPct: 7.1, trend: [36, 38, 40, 43, 46, 48.5] },
  { branch: "Sur", region: "Ash Sharqiyah", target: 60.0, cyGwp: 52.0, growthPct: 7.8, trend: [38, 40, 43, 46, 49, 52] },
  { branch: "Ibra", region: "Ash Sharqiyah", target: 50.0, cyGwp: 40.0, growthPct: 6.5, trend: [28, 30, 33, 35, 38, 40] },
  { branch: "Al Buraimi HQ", region: "Al Buraimi", target: 85.0, cyGwp: 72.0, growthPct: 13.6, trend: [50, 54, 58, 62, 68, 72] },
  { branch: "Mahdah", region: "Al Buraimi", target: 65.0, cyGwp: 53.0, growthPct: 11.2, trend: [36, 39, 42, 46, 50, 53] },
  { branch: "Haima", region: "Al Wusta", target: 50.0, cyGwp: 42.0, growthPct: 8.6, trend: [30, 32, 35, 37, 40, 42] },
  { branch: "Duqm", region: "Al Wusta", target: 40.0, cyGwp: 34.0, growthPct: 7.5, trend: [22, 24, 27, 29, 32, 34] },
  { branch: "Khasab", region: "Musandam", target: 35.0, cyGwp: 28.0, growthPct: 6.5, trend: [18, 20, 22, 24, 26, 28] },
  { branch: "Bukha", region: "Musandam", target: 20.0, cyGwp: 17.0, growthPct: 5.8, trend: [10, 11, 13, 14, 16, 17] },
];

/* ── Staff-wise GWP ──────────────────────── */
export const mockStaffGwp: StaffGwpRow[] = [
  // Muscat - Head Office
  { id: "sg-1", staffName: "Yousuf Al-Balushi", staffId: "ST-001", branch: "Head Office", region: "Muscat", target: 35.0, cyGwp: 32.0, growthPct: 14.2, trend: [22, 24, 26, 28, 30, 32] },
  { id: "sg-2", staffName: "Sara Al-Mansoori", staffId: "ST-002", branch: "Head Office", region: "Muscat", target: 30.0, cyGwp: 28.5, growthPct: 12.8, trend: [19, 21, 23, 25, 27, 28.5] },
  { id: "sg-3", staffName: "Hamed Al-Saadi", staffId: "ST-003", branch: "Head Office", region: "Muscat", target: 25.0, cyGwp: 24.5, growthPct: 11.5, trend: [16, 18, 20, 22, 23, 24.5] },
  // Muscat - Ruwi
  { id: "sg-4", staffName: "Fatima Al-Rashidi", staffId: "ST-004", branch: "Ruwi", region: "Muscat", target: 38.0, cyGwp: 34.0, growthPct: 9.8, trend: [24, 26, 28, 30, 32, 34] },
  { id: "sg-5", staffName: "Khalid Al-Harthy", staffId: "ST-005", branch: "Ruwi", region: "Muscat", target: 32.0, cyGwp: 26.5, growthPct: 6.2, trend: [18, 19, 21, 23, 25, 26.5] },
  // Al Batinah - Sohar
  { id: "sg-6", staffName: "Mohammed Al-Wahaibi", staffId: "ST-006", branch: "Sohar", region: "Al Batinah", target: 35.0, cyGwp: 30.0, growthPct: 10.5, trend: [20, 22, 24, 26, 28, 30] },
  { id: "sg-7", staffName: "Layla Al-Balushi", staffId: "ST-007", branch: "Sohar", region: "Al Batinah", target: 30.0, cyGwp: 28.0, growthPct: 9.8, trend: [18, 20, 22, 24, 26, 28] },
  // Al Batinah - Barka
  { id: "sg-8", staffName: "Omar Al-Siyabi", staffId: "ST-008", branch: "Barka", region: "Al Batinah", target: 28.0, cyGwp: 22.0, growthPct: 7.1, trend: [14, 16, 17, 19, 21, 22] },
  { id: "sg-9", staffName: "Aisha Al-Hinai", staffId: "ST-009", branch: "Barka", region: "Al Batinah", target: 27.0, cyGwp: 18.0, growthPct: 5.4, trend: [10, 12, 14, 15, 17, 18] },
  // Dhofar - Salalah
  { id: "sg-10", staffName: "Ahmed Al-Mashani", staffId: "ST-010", branch: "Salalah", region: "Dhofar", target: 40.0, cyGwp: 38.0, growthPct: 12.1, trend: [28, 30, 32, 34, 36, 38] },
  { id: "sg-11", staffName: "Maryam Al-Kathiri", staffId: "ST-011", branch: "Salalah", region: "Dhofar", target: 38.0, cyGwp: 35.0, growthPct: 10.5, trend: [24, 26, 28, 31, 33, 35] },
  { id: "sg-12", staffName: "Said Al-Shahri", staffId: "ST-012", branch: "Salalah", region: "Dhofar", target: 32.0, cyGwp: 29.0, growthPct: 8.4, trend: [20, 22, 24, 26, 28, 29] },
  // Dhofar - Thumrait
  { id: "sg-13", staffName: "Nasser Al-Amri", staffId: "ST-013", branch: "Thumrait", region: "Dhofar", target: 48.0, cyGwp: 44.0, growthPct: 10.8, trend: [32, 35, 37, 39, 42, 44] },
  { id: "sg-14", staffName: "Zainab Al-Rawahi", staffId: "ST-014", branch: "Thumrait", region: "Dhofar", target: 42.0, cyGwp: 36.0, growthPct: 8.2, trend: [24, 26, 29, 31, 34, 36] },
  // Ad Dakhiliyah - Ibri
  { id: "sg-15", staffName: "Ali Al-Abri", staffId: "ST-015", branch: "Ibri", region: "Ad Dakhiliyah", target: 38.0, cyGwp: 34.0, growthPct: 9.1, trend: [24, 26, 28, 30, 32, 34] },
  { id: "sg-16", staffName: "Salma Al-Busaidi", staffId: "ST-016", branch: "Ibri", region: "Ad Dakhiliyah", target: 32.0, cyGwp: 28.0, growthPct: 7.5, trend: [18, 20, 22, 24, 26, 28] },
  // Ad Dakhiliyah - Nizwa
  { id: "sg-17", staffName: "Hamad Al-Riyami", staffId: "ST-017", branch: "Nizwa", region: "Ad Dakhiliyah", target: 32.0, cyGwp: 26.5, growthPct: 7.6, trend: [17, 19, 21, 23, 25, 26.5] },
  { id: "sg-18", staffName: "Rahma Al-Jabri", staffId: "ST-018", branch: "Nizwa", region: "Ad Dakhiliyah", target: 28.0, cyGwp: 22.0, growthPct: 6.5, trend: [14, 16, 17, 19, 21, 22] },
  // Ash Sharqiyah - Sur
  { id: "sg-19", staffName: "Badr Al-Wahaibi", staffId: "ST-019", branch: "Sur", region: "Ash Sharqiyah", target: 32.0, cyGwp: 28.0, growthPct: 8.2, trend: [18, 20, 22, 24, 26, 28] },
  { id: "sg-20", staffName: "Noura Al-Mahrouqi", staffId: "ST-020", branch: "Sur", region: "Ash Sharqiyah", target: 28.0, cyGwp: 24.0, growthPct: 7.1, trend: [16, 18, 19, 21, 23, 24] },
  // Ash Sharqiyah - Ibra
  { id: "sg-21", staffName: "Saud Al-Harthi", staffId: "ST-021", branch: "Ibra", region: "Ash Sharqiyah", target: 26.0, cyGwp: 22.0, growthPct: 6.8, trend: [14, 16, 17, 19, 21, 22] },
  { id: "sg-22", staffName: "Wafa Al-Kindi", staffId: "ST-022", branch: "Ibra", region: "Ash Sharqiyah", target: 24.0, cyGwp: 18.0, growthPct: 5.9, trend: [10, 12, 14, 15, 17, 18] },
  // Al Buraimi
  { id: "sg-23", staffName: "Majid Al-Balushi", staffId: "ST-023", branch: "Al Buraimi HQ", region: "Al Buraimi", target: 45.0, cyGwp: 40.0, growthPct: 14.5, trend: [26, 29, 32, 35, 38, 40] },
  { id: "sg-24", staffName: "Huda Al-Shamsi", staffId: "ST-024", branch: "Al Buraimi HQ", region: "Al Buraimi", target: 40.0, cyGwp: 32.0, growthPct: 12.2, trend: [20, 22, 25, 28, 30, 32] },
  { id: "sg-25", staffName: "Tariq Al-Maskari", staffId: "ST-025", branch: "Mahdah", region: "Al Buraimi", target: 35.0, cyGwp: 30.0, growthPct: 11.8, trend: [18, 21, 23, 26, 28, 30] },
  { id: "sg-26", staffName: "Asma Al-Ghafri", staffId: "ST-026", branch: "Mahdah", region: "Al Buraimi", target: 30.0, cyGwp: 23.0, growthPct: 10.1, trend: [14, 16, 18, 20, 22, 23] },
  // Al Wusta
  { id: "sg-27", staffName: "Rashid Al-Maawali", staffId: "ST-027", branch: "Haima", region: "Al Wusta", target: 28.0, cyGwp: 24.0, growthPct: 9.2, trend: [16, 18, 19, 21, 23, 24] },
  { id: "sg-28", staffName: "Munira Al-Suleimani", staffId: "ST-028", branch: "Haima", region: "Al Wusta", target: 22.0, cyGwp: 18.0, growthPct: 7.8, trend: [10, 12, 14, 15, 17, 18] },
  { id: "sg-29", staffName: "Faisal Al-Zadjali", staffId: "ST-029", branch: "Duqm", region: "Al Wusta", target: 22.0, cyGwp: 19.0, growthPct: 8.1, trend: [12, 13, 15, 16, 18, 19] },
  { id: "sg-30", staffName: "Khadija Al-Hosni", staffId: "ST-030", branch: "Duqm", region: "Al Wusta", target: 18.0, cyGwp: 15.0, growthPct: 6.5, trend: [8, 10, 11, 13, 14, 15] },
  // Musandam
  { id: "sg-31", staffName: "Ibrahim Al-Shehhi", staffId: "ST-031", branch: "Khasab", region: "Musandam", target: 20.0, cyGwp: 16.0, growthPct: 7.2, trend: [10, 11, 12, 13, 15, 16] },
  { id: "sg-32", staffName: "Latifa Al-Kumzari", staffId: "ST-032", branch: "Khasab", region: "Musandam", target: 15.0, cyGwp: 12.0, growthPct: 5.5, trend: [7, 8, 9, 10, 11, 12] },
  { id: "sg-33", staffName: "Yaqoob Al-Dhaheri", staffId: "ST-033", branch: "Bukha", region: "Musandam", target: 12.0, cyGwp: 10.0, growthPct: 6.1, trend: [6, 7, 7.5, 8, 9, 10] },
  { id: "sg-34", staffName: "Mariam Al-Naqbi", staffId: "ST-034", branch: "Bukha", region: "Musandam", target: 8.0, cyGwp: 7.0, growthPct: 5.2, trend: [4, 4.5, 5, 5.5, 6, 7] },
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
