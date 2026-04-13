"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RegionGwpRow, BranchGwpRow, OmanRegion } from "@/lib/mock-api/gwp-types";

/* SVG paths for Oman regions — simplified shapes */
const REGION_PATHS: Record<OmanRegion, string> = {
  "Musandam":    "M 260 30 L 285 25 L 300 45 L 290 70 L 265 65 Z",
  "Al Buraimi":  "M 150 80 L 195 70 L 210 100 L 200 130 L 160 125 L 145 105 Z",
  "Al Batinah":  "M 195 70 L 250 65 L 280 90 L 270 130 L 240 145 L 210 130 L 200 100 Z",
  "Muscat":      "M 270 130 L 310 120 L 330 145 L 320 175 L 290 180 L 270 165 L 260 145 Z",
  "Ash Sharqiyah": "M 290 180 L 330 175 L 350 210 L 340 250 L 300 260 L 275 235 L 270 200 Z",
  "Ad Dakhiliyah": "M 200 130 L 260 145 L 270 200 L 250 230 L 210 240 L 185 210 L 180 170 Z",
  "Al Wusta":    "M 175 240 L 250 230 L 275 270 L 260 340 L 220 370 L 175 360 L 160 300 Z",
  "Dhofar":      "M 80 360 L 175 340 L 220 370 L 230 420 L 200 460 L 140 470 L 80 440 L 60 400 Z",
};

const REGION_LABELS: Record<OmanRegion, { x: number; y: number }> = {
  "Musandam":     { x: 278, y: 48 },
  "Al Buraimi":   { x: 168, y: 102 },
  "Al Batinah":   { x: 232, y: 105 },
  "Muscat":       { x: 295, y: 152 },
  "Ash Sharqiyah": { x: 310, y: 218 },
  "Ad Dakhiliyah": { x: 220, y: 185 },
  "Al Wusta":     { x: 210, y: 300 },
  "Dhofar":       { x: 148, y: 415 },
};

const REGION_COLORS: Record<OmanRegion, string> = {
  "Musandam":     "#22c55e",
  "Al Buraimi":   "#f59e0b",
  "Al Batinah":   "#6366f1",
  "Muscat":       "#3b82f6",
  "Ash Sharqiyah": "#ec4899",
  "Ad Dakhiliyah": "#f97316",
  "Al Wusta":     "#14b8a6",
  "Dhofar":       "#ef4444",
};

function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-black tabular-nums",
      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
    )}>
      {isPositive ? "▲" : "▼"}{Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function OmanGeoMap({
  regions,
  branches,
}: {
  regions: RegionGwpRow[];
  branches: BranchGwpRow[];
}) {
  const [selectedRegion, setSelectedRegion] = React.useState<OmanRegion | null>(null);
  const [hoveredRegion, setHoveredRegion] = React.useState<OmanRegion | null>(null);

  const selectedRegionData = React.useMemo(
    () => regions.find((r) => r.region === selectedRegion) ?? null,
    [regions, selectedRegion]
  );

  const regionBranches = React.useMemo(
    () => (selectedRegion ? branches.filter((b) => b.region === selectedRegion) : []),
    [branches, selectedRegion]
  );

  const maxGwp = Math.max(...regions.map((r) => r.cyGwp));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-card shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black tracking-tight">Regional Allocation</CardTitle>
            <CardDescription className="text-xs font-medium">Heatmap of GWP across Oman's governorates</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <svg
              viewBox="30 10 340 480"
              className="w-full max-w-[360px] drop-shadow-xl"
            >
              {(Object.entries(REGION_PATHS) as [OmanRegion, string][]).map(([region, path]) => {
                const rd = regions.find((r) => r.region === region);
                const isSelected = selectedRegion === region;
                const isHovered = hoveredRegion === region;
                const opacity = rd ? 0.4 + (rd.cyGwp / maxGwp) * 0.55 : 0.3;

                return (
                  <g key={region} className="group/region">
                    <path
                      d={path}
                      fill={REGION_COLORS[region]}
                      fillOpacity={isSelected || isHovered ? 0.95 : opacity}
                      stroke={isSelected ? "white" : isHovered ? "white" : "currentColor"}
                      strokeOpacity={isSelected || isHovered ? 1 : 0.2}
                      className="text-foreground transition-all duration-300 cursor-pointer"
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                    <text
                      x={REGION_LABELS[region].x}
                      y={REGION_LABELS[region].y}
                      textAnchor="middle"
                      className="pointer-events-none select-none transition-all duration-300"
                      fill={isSelected || isHovered ? "white" : "currentColor"}
                      fontSize={isSelected ? 11 : 9}
                      fontWeight={isSelected ? 900 : 700}
                      opacity={isSelected || isHovered ? 1 : 0.6}
                    >
                      {region.replace("Ad ", "").replace("Al ", "").replace("Ash ", "")}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Heatmap legend */}
            <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border">
              <span>Low</span>
              <div className="flex rounded-sm overflow-hidden border border-border">
                {[0.3, 0.45, 0.6, 0.75, 0.9].map((op, i) => (
                  <div key={i} className="w-6 h-2.5 bg-emerald-600 dark:bg-emerald-500" style={{ opacity: op }} />
                ))}
              </div>
              <span>High</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region + Branch Tables */}
      <div className="lg:col-span-3 space-y-6">
        {/* Region summary */}
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black tracking-tight">Governorate Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/40">
                    {["Region", "CY GWP", "Growth", "Loss Ratio", "Renewals"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r, i) => (
                    <tr
                      key={r.region}
                      onClick={() => setSelectedRegion(selectedRegion === r.region ? null : r.region)}
                      className={cn(
                        "group border-b border-border cursor-pointer transition-all duration-200",
                        selectedRegion === r.region
                          ? "bg-orange-600/10 dark:bg-orange-500/10"
                          : "hover:bg-muted/30",
                        i % 2 === 0 ? "bg-transparent" : "bg-muted/10 dark:bg-muted/5"
                      )}
                    >
                      <td className="px-4 py-3 font-black text-sm tracking-tight" style={{ color: REGION_COLORS[r.region] }}>{r.region}</td>
                      <td className="px-4 py-3 tabular-nums font-bold">{r.cyGwp.toFixed(1)} <GrowthBadge value={r.growthPct} /></td>
                      <td className="px-4 py-3 tabular-nums font-bold">{r.cyLossRatio.toFixed(1)}% <GrowthBadge value={r.lossRatioGrowthPct} /></td>
                      <td className="px-4 py-3 tabular-nums font-bold">{r.cyRenewals.toLocaleString()} <GrowthBadge value={r.renewalGrowthPct} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Branch breakdown (shows when region selected) */}
        {selectedRegion && (
          <Card className="border-border bg-card shadow-md animate-in slide-in-from-top-4 fade-in duration-500 overflow-hidden ring-2 ring-orange-500/20">
            <CardHeader className="pb-2 bg-muted/20">
              <CardTitle className="text-sm font-black tracking-tight">
                Branch Analysis — <span style={{ color: REGION_COLORS[selectedRegion] }}>{selectedRegion}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {regionBranches.length === 0 ? (
                <div className="px-4 py-12 text-center text-xs font-black uppercase tracking-widest text-muted-foreground">No branch data active.</div>
              ) : (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {["Branch", "CY GWP", "Growth", "Loss Ratio", "Renewals"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {regionBranches.map((b, i) => (
                        <tr
                          key={b.branch}
                          className={cn(
                            "border-b border-border transition-all duration-200 hover:bg-muted/40",
                            i % 2 === 0 ? "bg-transparent" : "bg-muted/10 dark:bg-muted/5"
                          )}
                        >
                          <td className="px-4 py-3 font-bold text-foreground/80">{b.branch}</td>
                          <td className="px-4 py-3 tabular-nums font-bold text-xs">{b.cyGwp.toFixed(1)} <GrowthBadge value={b.growthPct} /></td>
                          <td className="px-4 py-3 tabular-nums font-bold text-xs">{b.cyLossRatio.toFixed(1)}% <GrowthBadge value={b.lossRatioGrowthPct} /></td>
                          <td className="px-4 py-3 tabular-nums font-bold text-xs">{b.cyRenewals.toLocaleString()} <GrowthBadge value={b.renewalGrowthPct} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
