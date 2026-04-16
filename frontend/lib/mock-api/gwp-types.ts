/** ──────────────────────────────────────────────
 *  Enterprise GWP Dashboard types
 *  ────────────────────────────────────────────── */

import type { DataSliceDimensions } from "./types";

/* ── 1. Top-Level GWP KPIs ─────────────────── */
export type GwpKpi = {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  change: number; // % change
  trend: "up" | "down" | "neutral";
  sparkline: number[];
  category: "gwp" | "commission" | "incentive" | "forecast";
};

/* ── 2. GWP Product Row (main table) ───────── */
export type GwpProductRow = {
  id: string;
  product: string;
  cyGwp: number;
  pyGwp: number;
  growthPct: number;
  cyLossRatio: number;
  pyLossRatio: number;
  lossRatioGrowthPct: number;
  cyRenewals: number;
  pyRenewals: number;
  renewalGrowthPct: number;
  commissionEarned: number;
  finalPayout: number;
  channel: string;
  slice: DataSliceDimensions;
  monthlyTrend: { month: string; gwp: number }[];
};

/* ── 3. Region data for Oman map ───────────── */
export type OmanRegion =
  | "Muscat"
  | "Al Batinah"
  | "Ad Dakhiliyah"
  | "Ash Sharqiyah"
  | "Al Wusta"
  | "Dhofar"
  | "Al Buraimi"
  | "Musandam";

export type RegionGwpRow = {
  region: OmanRegion;
  target: number;
  cyGwp: number;
  growthPct: number;
};

export type BranchGwpRow = {
  branch: string;
  region: OmanRegion;
  target: number;
  cyGwp: number;
  growthPct: number;
  trend: number[]; // last 6 months GWP
};

export type StaffGwpRow = {
  id: string;
  staffName: string;
  staffId: string;
  branch: string;
  region: OmanRegion;
  target: number;
  cyGwp: number;
  growthPct: number;
  trend: number[]; // last 6 months GWP
};

/* ── 4. Incentive staff slabs ──────────────── */
export type IncentiveSlabRow = {
  id: string;
  staffName: string;
  staffId: string;
  motorTarget: number;
  motorAchieved: number;
  motorAchievedPct: number;
  nonMotorTarget: number;
  nonMotorAchieved: number;
  nonMotorAchievedPct: number;
  /** overall blended */
  overallAchievedPct: number;
  appliedSlab: string;
  incentivePct: number;
  finalIncentiveOmr: number;
};

/* ── 5. Extrapolation simulator ────────────── */
export type ExtrapolationInput = {
  commissionPct: number;
  growthPct: number;
  taxRate: number;
  currentGwp: number;
};

export type ExtrapolationOutput = {
  projectedGwp: number;
  projectedCommission: number;
  taxImpact: number;
  netPayout: number;
  yearEndLiability: number;
  monthlyProjection: { month: string; gwp: number; commission: number }[];
};

/* ── 6. Dashboard view tabs ────────────────── */
export type GwpViewTab = "overall" | "retail" | "commercial" | "channel" | "product" | "region";
export type PeriodFilter = "FTD" | "MTD" | "QTD" | "YTD";

/* ── 7. AI Insight ─────────────────────────── */
export type AiInsight = {
  id: string;
  icon: string;
  title: string;
  description: string;
  severity: "positive" | "warning" | "neutral";
};
