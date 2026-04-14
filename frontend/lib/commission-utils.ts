import { CommissionRuleSet } from "./mock-api/types";

export interface CalculateCommissionParams {
  productionAmount: number;
  achievementPct: number;
  channel: string;
  rule: CommissionRuleSet;
}

export function calculateCommission({
  productionAmount,
  achievementPct,
  channel,
  rule,
}: CalculateCommissionParams) {
  // 1. If channel in rule.conditions.excludeChannels → return 0
  if (rule.conditions?.excludeChannels?.includes(channel)) {
    return 0;
  }

  // 2. Find slab where achievementPct is between min and max
  const slab = rule.slabs.find(
    (s) =>
      achievementPct >= s.minAchievementPct &&
      achievementPct <= s.maxAchievementPct
  );

  if (!slab) {
    return 0;
  }

  // 3. commission = productionAmount * (commissionPct / 100)
  const commission = productionAmount * (slab.commissionPct / 100);

  // 4. finalPayout = commission * payoutMultiplier
  const finalPayout = commission * slab.payoutMultiplier;

  return finalPayout;
}
