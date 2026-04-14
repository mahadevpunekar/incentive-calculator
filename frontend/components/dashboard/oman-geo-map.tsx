"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import type { RegionGwpRow, BranchGwpRow, OmanRegion } from "@/lib/mock-api/gwp-types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Official Highcharts TopoJSON for Oman (11 governorates)
const OMAN_TOPO_JSON_URL = "https://code.highcharts.com/mapdata/countries/om/om-all.topo.json";

// Map the 11 actual governorates from the TopoJSON to the 8-region breakdown in our mock data
function mapMapNameToRegionName(mapName: string): OmanRegion | null {
  if (!mapName) return null;
  const name = mapName.toLowerCase();

  if (name.includes("muscat") || name.includes("masqat")) return "Muscat";
  if (name.includes("dhofar") || name.includes("zufar")) return "Dhofar";
  if (name.includes("musandam")) return "Musandam";
  if (name.includes("wusta")) return "Al Wusta";
  if (name.includes("buraymi") || name.includes("buraimi")) return "Al Buraimi";
  if (name.includes("batnah") || name.includes("batinah")) return "Al Batinah";
  if (name.includes("sharqiyah") || name.includes("sharqiya")) return "Ash Sharqiyah";
  if (name.includes("dakhliyah") || name.includes("dhahira") || name.includes("zahirah")) return "Ad Dakhiliyah";

  return null;
}

const REGION_COLORS: Record<OmanRegion, string> = {
  "Musandam": "#115e59",
  "Al Buraimi": "#ca8a04",
  "Al Batinah": "#4f46e5",
  "Muscat": "#2563eb",
  "Ash Sharqiyah": "#db2777",
  "Ad Dakhiliyah": "#ea580c",
  "Al Wusta": "#0d9488",
  "Dhofar": "#dc2626",
};

function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-black tabular-nums bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded",
      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
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
  const [tooltipContent, setTooltipContent] = React.useState<{ title: string; gwp: number } | null>(null);

  const regionBranches = React.useMemo(
    () => (selectedRegion ? branches.filter((b) => b.region === selectedRegion) : []),
    [branches, selectedRegion]
  );

  const maxGwp = Math.max(...regions.map((r) => r.cyGwp));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Map visualization */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-gradient-to-br from-card to-muted/20 shadow-sm h-full overflow-hidden flex flex-col relative">
          <CardHeader className="pb-2 relative z-10 shrink-0">
            <CardTitle className="text-sm font-black tracking-tight">Regional Allocation</CardTitle>
            <CardDescription className="text-xs font-medium">Interactive heatmap of GWP across Oman</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[400px] flex items-center justify-center p-0 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />

            <TooltipProvider delayDuration={0}>
              <Tooltip open={!!tooltipContent}>
                <TooltipTrigger asChild>
                  <div className="w-full h-full absolute inset-0 group">
                    {/* React Simple Maps components handling projections and D3 internally */}
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        scale: 2700,
                        center: [56, 21.5] // Oman spans lat ~16.6–26.4, lon ~52–60
                      }}
                      width={500}
                      height={500}
                      className="w-full h-auto mx-auto"
                      style={{ maxHeight: "100%" }}
                    >
                      <ZoomableGroup zoom={1} maxZoom={4}>
                        <Geographies geography={OMAN_TOPO_JSON_URL}>
                          {({ geographies }) => (
                            <>
                              {geographies.map((geo) => {
                                const rawName: string = geo.properties.name || "";
                                const mappedRegion = mapMapNameToRegionName(rawName);
                                const rd = mappedRegion ? regions.find((r) => r.region === mappedRegion) : null;

                                const isSelected = mappedRegion && selectedRegion === mappedRegion;
                                const isHovered = mappedRegion && hoveredRegion === mappedRegion;
                                const isFaded = (selectedRegion || hoveredRegion) && !isSelected && !isHovered;

                                const baseOpacity = rd && maxGwp > 0 ? 0.35 + (rd.cyGwp / maxGwp) * 0.65 : 0.2;
                                const color = mappedRegion ? REGION_COLORS[mappedRegion] : "#cbd5e1";

                                return (
                                  <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={color}
                                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.8 : isFaded ? 0.2 : baseOpacity}
                                    stroke={isSelected ? "#fff" : "rgba(255, 255, 255, 0.4)"}
                                    strokeWidth={isSelected ? 1.5 : 0.5}
                                    style={{
                                      default: { outline: "none", transition: "all 0.3s ease" },
                                      hover: { outline: "none", filter: "brightness(1.1)", cursor: "pointer", transition: "all 0.1s ease" },
                                      pressed: { outline: "none" },
                                    }}
                                    onClick={() => {
                                      if (mappedRegion) {
                                        setSelectedRegion(selectedRegion === mappedRegion ? null : mappedRegion);
                                      }
                                    }}
                                    onMouseEnter={() => {
                                      if (mappedRegion && rd) {
                                        setHoveredRegion(mappedRegion);
                                        setTooltipContent({
                                          title: rawName,
                                          gwp: rd.cyGwp
                                        });
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredRegion(null);
                                      setTooltipContent(null);
                                    }}
                                  />
                                );
                              })}
                              {/* Overlay Labels */}
                              {(() => {
                                const labeledRegions = new Set<string>();
                                return geographies.map((geo) => {
                                  const rawName: string = geo.properties.name || "";
                                  const mappedRegion = mapMapNameToRegionName(rawName);
                                  if (!mappedRegion || labeledRegions.has(mappedRegion)) return null;

                                  // Skip labels for small islands/exclaves if desired, or just deduplicate
                                  labeledRegions.add(mappedRegion);
                                  const centroid = geoCentroid(geo);

                                  return (
                                    <Marker key={`${geo.rsmKey}-label`} coordinates={centroid}>
                                      <text
                                        textAnchor="middle"
                                        fill="#fff"
                                        fontSize={11}
                                        fontWeight="900"
                                        style={{ pointerEvents: "none", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                                      >
                                        {mappedRegion}
                                      </text>
                                    </Marker>
                                  );
                                });
                              })()}
                            </>
                          )}
                        </Geographies>
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-background/95 backdrop-blur-md border border-border shadow-lg p-3" sideOffset={10}>
                  {tooltipContent && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{tooltipContent.title}</span>
                      <span className="font-bold tabular-nums">{tooltipContent.gwp.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">OMR</span></span>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Premium Heatmap Legend */}
            {/* <div className="absolute bottom-6 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm pointer-events-none">
              <span>Low</span>
              <div className="flex h-2 rounded-full overflow-hidden w-24">
                <div className="h-full flex-1 bg-primary/20"></div>
                <div className="h-full flex-1 bg-primary/40"></div>
                <div className="h-full flex-1 bg-primary/60"></div>
                <div className="h-full flex-1 bg-primary/80"></div>
                <div className="h-full flex-1 bg-primary"></div>
              </div>
              <span>High GWP</span>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Region + Branch Tables */}
      <div className="lg:col-span-3 space-y-6">
        {/* Region summary */}
        <Card className="border-border bg-card shadow-sm overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="text-sm font-black tracking-tight">Governorate Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto no-scrollbar relative min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
                <tr className="border-y border-border bg-muted/40">
                  {["Region", "CY GWP", "Growth", "Loss Ratio", "Renewals"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 whitespace-nowrap">
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
                        ? "bg-orange-500/10 dark:bg-orange-500/15 relative"
                        : "hover:bg-muted/30",
                      i % 2 === 0 && !selectedRegion ? "bg-transparent" : "bg-muted/5"
                    )}
                  >
                    {selectedRegion === r.region && (
                      <td className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md"></td>
                    )}
                    <td className="px-5 py-3.5 font-black text-sm tracking-tight flex items-center gap-2" style={{ color: REGION_COLORS[r.region] }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_COLORS[r.region] }}></div>
                      {r.region}
                    </td>
                    <td className="px-5 py-3.5 tabular-nums font-bold">
                      {r.cyGwp.toFixed(1)} <span className="ml-1"><GrowthBadge value={r.growthPct} /></span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums font-bold">
                      {r.cyLossRatio.toFixed(1)}% <span className="ml-1"><GrowthBadge value={r.lossRatioGrowthPct} /></span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums font-bold">
                      {r.cyRenewals.toLocaleString()} <span className="ml-1"><GrowthBadge value={r.renewalGrowthPct} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Branch breakdown (shows when region selected) */}
        {selectedRegion && (
          <Card className="border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-500 overflow-hidden ring-1 ring-orange-500/10">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-black tracking-tight flex items-center gap-2">
                Branch Analysis
                <span className="text-muted-foreground font-normal">in</span>
                <span style={{ color: REGION_COLORS[selectedRegion] }} className="bg-background px-2 py-0.5 rounded-md border border-border shadow-sm">
                  {selectedRegion}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {regionBranches.length === 0 ? (
                <div className="px-4 py-12 text-center text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/10">
                  No active branch data for {selectedRegion}.
                </div>
              ) : (
                <div className="overflow-x-auto no-scrollbar max-h-[300px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-card">
                      <tr className="bg-muted/10 border-b border-border">
                        {["Branch", "CY GWP", "Growth", "Loss Ratio", "Renewals"].map((h) => (
                          <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 whitespace-nowrap">
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
                            i % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                          )}
                        >
                          <td className="px-5 py-4 font-bold text-foreground/90">{b.branch}</td>
                          <td className="px-5 py-4 tabular-nums font-bold text-xs">{b.cyGwp.toFixed(1)} <span className="ml-1"><GrowthBadge value={b.growthPct} /></span></td>
                          <td className="px-5 py-4 tabular-nums font-bold text-xs">{b.cyLossRatio.toFixed(1)}% <span className="ml-1"><GrowthBadge value={b.lossRatioGrowthPct} /></span></td>
                          <td className="px-5 py-4 tabular-nums font-bold text-xs">{b.cyRenewals.toLocaleString()} <span className="ml-1"><GrowthBadge value={b.renewalGrowthPct} /></span></td>
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
