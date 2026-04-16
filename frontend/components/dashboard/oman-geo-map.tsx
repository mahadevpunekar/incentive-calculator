"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import type { RegionGwpRow, BranchGwpRow, StaffGwpRow, OmanRegion } from "@/lib/mock-api/gwp-types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, ChevronDown, Building2, User, MapPin } from "lucide-react";

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

const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

/* ── Sparkline Component ─────────────────────── */
function Sparkline({ data, color = "currentColor", width = 80, height = 24 }: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ].join(" ");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <svg width={width} height={height} className="cursor-help shrink-0" viewBox={`0 0 ${width} ${height}`}>
          {/* Area fill */}
          <polygon points={areaPoints} fill={color} opacity={0.08} />
          {/* Line */}
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* End dot */}
          {(() => {
            const lastPt = points[points.length - 1].split(",");
            return <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} />;
          })()}
        </svg>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[10px] font-bold">
        <div className="flex gap-2">
          {data.map((v, i) => (
            <span key={i} className="tabular-nums">{MONTH_LABELS[i]}: {v.toFixed(1)}</span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Growth Badge ────────────────────────────── */
function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-black tabular-nums bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded",
      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
    )}>
      {isPositive ? "▲" : "▼"}{Math.abs(value).toFixed(1)}%
    </span>
  );
}

/* ── Achievement % mini bar ──────────────────── */
function AchievementBar({ actual, target }: { actual: number; target: number }) {
  const pct = target > 0 ? (actual / target) * 100 : 0;
  const isAbove = pct >= 100;
  const barWidth = Math.min(pct, 100);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="space-y-0.5 cursor-help min-w-[60px]">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isAbove ? "bg-emerald-500" : pct >= 80 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className={cn(
            "text-[9px] font-black tabular-nums",
            isAbove ? "text-emerald-600 dark:text-emerald-400" : pct >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
          )}>
            {pct.toFixed(0)}%
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs font-bold">
        {actual.toFixed(1)} of {target.toFixed(1)} OMR ({pct.toFixed(1)}%)
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Main Component ──────────────────────────── */
export function OmanGeoMap({
  regions,
  branches,
  staff,
}: {
  regions: RegionGwpRow[];
  branches: BranchGwpRow[];
  staff: StaffGwpRow[];
}) {
  const [selectedRegion, setSelectedRegion] = React.useState<OmanRegion | null>(null);
  const [hoveredRegion, setHoveredRegion] = React.useState<OmanRegion | null>(null);
  const [tooltipContent, setTooltipContent] = React.useState<{ title: string; gwp: number } | null>(null);
  const [expandedRegions, setExpandedRegions] = React.useState<Set<OmanRegion>>(new Set());
  const [expandedBranches, setExpandedBranches] = React.useState<Set<string>>(new Set());

  const maxGwp = Math.max(...regions.map((r) => r.cyGwp));

  const toggleRegion = (region: OmanRegion) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
        // Collapse all branches in this region too
        setExpandedBranches((prevB) => {
          const nextB = new Set(prevB);
          branches.filter((b) => b.region === region).forEach((b) => nextB.delete(b.branch));
          return nextB;
        });
      } else {
        next.add(region);
      }
      return next;
    });
    setSelectedRegion(region);
  };

  const toggleBranch = (branchName: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchName)) next.delete(branchName);
      else next.add(branchName);
      return next;
    });
  };

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
                                        toggleRegion(mappedRegion);
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
          </CardContent>
        </Card>
      </div>

      {/* Hierarchical Drill-Down Table */}
      <div className="lg:col-span-3">
        <Card className="border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-2 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black tracking-tight">Governorate Performance</CardTitle>
                <CardDescription className="text-xs font-medium">
                  Click a region to drill down into branches and staff
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Region</span>
                <span className="text-border">→</span>
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Branch</span>
                <span className="text-border">→</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> Staff</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto no-scrollbar relative min-h-0 max-h-[600px]">
            <TooltipProvider delayDuration={100}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
                  <tr className="border-y border-border bg-muted/40">
                    {["Region", "Target", "CY GWP", "Growth"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 whitespace-nowrap">
                      Ach %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r, ri) => {
                    const isExpanded = expandedRegions.has(r.region);
                    const regionBranches = branches.filter((b) => b.region === r.region);

                    return (
                      <React.Fragment key={r.region}>
                        {/* ── Level 1: Region Row ──────────── */}
                        <tr
                          onClick={() => toggleRegion(r.region)}
                          className={cn(
                            "group border-b border-border cursor-pointer transition-all duration-200",
                            isExpanded
                              ? "bg-orange-500/[0.06] dark:bg-orange-500/10"
                              : "hover:bg-muted/30",
                            ri % 2 === 0 && !isExpanded ? "bg-transparent" : ""
                          )}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "transition-transform duration-200",
                                isExpanded ? "rotate-0" : "-rotate-90"
                              )}>
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              </span>
                              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: REGION_COLORS[r.region] }} />
                              <span className="font-black text-sm tracking-tight" style={{ color: REGION_COLORS[r.region] }}>
                                {r.region}
                              </span>
                              <span className="ml-1 text-[9px] font-bold text-muted-foreground/60 tabular-nums">
                                ({regionBranches.length} branches)
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 tabular-nums font-black text-sm">
                            {r.target.toFixed(1)}
                          </td>
                          <td className="px-5 py-3.5 tabular-nums font-bold">
                            {r.cyGwp.toFixed(1)}
                          </td>
                          <td className="px-5 py-3.5">
                            <GrowthBadge value={r.growthPct} />
                          </td>
                          <td className="px-5 py-3.5">
                            <AchievementBar actual={r.cyGwp} target={r.target} />
                          </td>
                        </tr>

                        {/* ── Level 2: Branch Rows ─────────── */}
                        {isExpanded && regionBranches.map((b, bi) => {
                          const isBranchExpanded = expandedBranches.has(b.branch);
                          const branchStaff = staff.filter((s) => s.branch === b.branch && s.region === b.region);

                          return (
                            <React.Fragment key={b.branch}>
                              <tr
                                onClick={(e) => { e.stopPropagation(); toggleBranch(b.branch); }}
                                className={cn(
                                  "border-b border-border/50 cursor-pointer transition-all duration-200",
                                  isBranchExpanded
                                    ? "bg-blue-500/[0.04] dark:bg-blue-500/[0.08]"
                                    : "hover:bg-muted/20",
                                  "animate-in slide-in-from-top-1 fade-in duration-300"
                                )}
                                style={{ animationDelay: `${bi * 30}ms`, animationFillMode: "backwards" }}
                              >
                                <td className="py-3 pr-5 pl-12">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "transition-transform duration-200",
                                      isBranchExpanded ? "rotate-0" : "-rotate-90"
                                    )}>
                                      <ChevronDown className="h-3 w-3 text-muted-foreground/60" />
                                    </span>
                                    <Building2 className="h-3.5 w-3.5 text-blue-500/70 shrink-0" />
                                    <span className="font-bold text-foreground/90 text-xs">{b.branch}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground/50 tabular-nums">
                                      ({branchStaff.length})
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-3 tabular-nums font-bold text-xs text-foreground/80">
                                  {b.target.toFixed(1)}
                                </td>
                                <td className="px-5 py-3 tabular-nums font-bold text-xs text-foreground/80">
                                  {b.cyGwp.toFixed(1)}
                                </td>
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <GrowthBadge value={b.growthPct} />
                                    <Sparkline data={b.trend} color={REGION_COLORS[b.region]} />
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  <AchievementBar actual={b.cyGwp} target={b.target} />
                                </td>
                              </tr>

                              {/* ── Level 3: Staff Rows ──────── */}
                              {isBranchExpanded && branchStaff.map((s, si) => (
                                <tr
                                  key={s.id}
                                  className={cn(
                                    "border-b border-border/30 transition-all duration-200 hover:bg-muted/10",
                                    "animate-in slide-in-from-top-1 fade-in duration-200"
                                  )}
                                  style={{ animationDelay: `${si * 20}ms`, animationFillMode: "backwards" }}
                                >
                                  <td className="py-2.5 pr-5 pl-20">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3 text-violet-500/60 shrink-0" />
                                      <div>
                                        <p className="font-bold text-xs text-foreground/80">{s.staffName}</p>
                                        <p className="text-[9px] text-muted-foreground font-mono font-bold">{s.staffId}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-2.5 tabular-nums font-bold text-[11px] text-foreground/70">
                                    {s.target.toFixed(1)}
                                  </td>
                                  <td className="px-5 py-2.5 tabular-nums font-bold text-[11px] text-foreground/70">
                                    {s.cyGwp.toFixed(1)}
                                  </td>
                                  <td className="px-5 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <GrowthBadge value={s.growthPct} />
                                      <Sparkline data={s.trend} color="#8b5cf6" width={60} height={18} />
                                    </div>
                                  </td>
                                  <td className="px-5 py-2.5">
                                    <AchievementBar actual={s.cyGwp} target={s.target} />
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
