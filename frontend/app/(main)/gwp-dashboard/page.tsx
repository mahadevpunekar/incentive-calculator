"use client";

import * as React from "react";
import {
  Home, MapPin, BarChart3, RefreshCw, 
  TrendingUp, DollarSign, Target, Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GwpKpiCard } from "@/components/dashboard/gwp-kpi-card";
import { CommissionAnalytics } from "@/components/dashboard/commission-analytics";
import { IncentiveSlabTable } from "@/components/dashboard/incentive-slab-table";
import { GwpDashboardTable } from "@/components/dashboard/gwp-dashboard-table";
import { OmanGeoMap } from "@/components/dashboard/oman-geo-map";
import { ExtrapolationSimulator } from "@/components/dashboard/extrapolation-simulator";
import { EnhancedWorkflowApproval } from "@/components/dashboard/enhanced-workflow";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import {
  mockGwpKpis,
  mockGwpProducts,
  mockRegionGwp,
  mockBranchGwp,
  mockIncentiveSlabs,
  mockAiInsights,
} from "@/lib/mock-api/gwp-data";
import { mockApprovalQueue } from "@/lib/mock-api/data";
import type { GwpViewTab, PeriodFilter } from "@/lib/mock-api/gwp-types";
import { 
  FILTER_BRANCHES, 
  FILTER_CHANNELS, 
  FILTER_MONTHS, 
  FILTER_PRODUCTS, 
  FILTER_REGIONS, 
  FILTER_STAFF 
} from "@/lib/mock-slices";
import { useGlobalFilterStore } from "@/stores/global-filter-store";

const VIEW_TABS: { key: GwpViewTab; label: string; color: string }[] = [
  { key: "overall", label: "OVERALL", color: "bg-green-600 dark:bg-green-500" },
  { key: "retail", label: "RETAIL", color: "bg-blue-600 dark:bg-blue-500" },
  { key: "commercial", label: "COMMERCIAL", color: "bg-violet-600 dark:bg-violet-500" },
  { key: "channel", label: "CHANNEL", color: "bg-amber-600 dark:bg-amber-500" },
  { key: "product", label: "PRODUCT", color: "bg-rose-600 dark:bg-rose-500" },
  { key: "region", label: "REGION", color: "bg-teal-600 dark:bg-teal-500" },
];

const PERIOD_FILTERS: { key: PeriodFilter; label: string }[] = [
  { key: "FTD", label: "FTD" },
  { key: "MTD", label: "MTD" },
  { key: "QTD", label: "QTD" },
  { key: "YTD", label: "YTD" },
];

const SECTION_NAV = [
  { id: "kpis", label: "KPIs", icon: TrendingUp },
  { id: "commission", label: "Commission", icon: DollarSign },
  { id: "incentive", label: "Incentive", icon: Target },
  { id: "gwp-table", label: "GWP Table", icon: BarChart3 },
  { id: "geography", label: "Geography", icon: MapPin },
  { id: "simulator", label: "Simulator", icon: BarChart3 },
  { id: "workflow", label: "Workflow", icon: Workflow },
];

function FilterDropdown({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: readonly string[]; 
  onChange: (v: string) => void 
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase mb-0.5 ml-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-input bg-background/50 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500/50 min-w-[120px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === "all" ? "All" : o}</option>
        ))}
      </select>
    </div>
  );
}

export default function GwpDashboardPage() {
  const [viewTab, setViewTab] = React.useState<GwpViewTab>("overall");
  const [period, setPeriod] = React.useState<PeriodFilter>("MTD");
  const [activeSection, setActiveSection] = React.useState("kpis");

  // Global filters from store
  const filters = useGlobalFilterStore((s) => s.filters);
  const setFilters = useGlobalFilterStore((s) => s.setFilters);

  // Filtered products with full dimensional reactivity
  const filteredProducts = React.useMemo(() => {
    return mockGwpProducts.filter(p => {
      const matchChannel = filters.channel.toLowerCase() === "all" || p.channel === filters.channel;
      const matchProduct = filters.product.toLowerCase() === "all" || p.product.startsWith(filters.product);
      const matchRegion = filters.region.toLowerCase() === "all" || p.slice.region === filters.region;
      const matchBranch = filters.branch.toLowerCase() === "all" || p.slice.branch === filters.branch;
      const matchStaff = filters.staff.toLowerCase() === "all" || p.slice.staff === filters.staff;
      const matchMonth = filters.month.toLowerCase() === "all" || p.slice.month === filters.month;
      
      return matchChannel && matchProduct && matchRegion && matchBranch && matchStaff && matchMonth;
    });
  }, [filters]);

  // Filtered KPIs based on view tab & global filters
  const filteredKpis = React.useMemo(() => {
    let kpis = mockGwpKpis;
    switch (viewTab) {
      case "retail": kpis = mockGwpKpis.filter((k) => ["gk-2", "gk-5", "gk-6"].includes(k.id)); break;
      case "commercial": kpis = mockGwpKpis.filter((k) => ["gk-3", "gk-4", "gk-6"].includes(k.id)); break;
    }
    
    // Simulate data change based on filtered volume
    const multiplier = filteredProducts.length / mockGwpProducts.length || 0.5;
    return kpis.map(k => ({
      ...k,
      value: k.value * multiplier,
      formattedValue: (k.value * multiplier > 1000000) 
        ? `${(k.value * multiplier / 1000000).toFixed(2)}M`
        : `${(k.value * multiplier / 1000).toFixed(1)}K`
    }));
  }, [viewTab, filteredProducts]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* ─── Top Navigation Bar ──────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-2xl shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6">
          {/* Row 1: Title + Context Info */}

          {/* Row 2: Global Filter Dropdowns */}
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4 py-4 border-t border-border">
            <FilterDropdown label="Sales Channel" value={filters.channel} options={FILTER_CHANNELS} onChange={(v) => setFilters({ channel: v })} />
            <FilterDropdown label="Region/Zone" value={filters.region} options={FILTER_REGIONS} onChange={(v) => setFilters({ region: v })} />
            <FilterDropdown label="Service Branch" value={filters.branch} options={FILTER_BRANCHES} onChange={(v) => setFilters({ branch: v })} />
            <FilterDropdown label="Focal Staff" value={filters.staff} options={FILTER_STAFF} onChange={(v) => setFilters({ staff: v })} />
            <FilterDropdown label="Product Line" value={filters.product} options={FILTER_PRODUCTS} onChange={(v) => setFilters({ product: v })} />
            <FilterDropdown label="Fiscal Month" value={filters.month} options={FILTER_MONTHS} onChange={(v) => setFilters({ month: v })} />
            
            <div className="flex-1" />
          </div>

          {/* Row 3: View Tabs & Section Navigation */}
          <div className="flex items-center gap-1.5 py-3 border-t border-border/50 overflow-x-auto no-scrollbar">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setViewTab(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                  viewTab === tab.key
                    ? `${tab.color} text-white shadow-lg scale-105`
                    : "text-muted-foreground hover:text-foreground bg-muted/40 border border-border"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="h-6 w-px bg-border mx-3 shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
              {SECTION_NAV.filter(s => s.id !== "workflow").map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                      activeSection === s.id
                        ? "bg-orange-600/15 text-orange-600 dark:text-orange-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                );
              })}
              <a
                href="/workflow"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Workflow className="h-3.5 w-3.5" /> Approved Workflow
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="mx-auto max-w-[1800px] px-4 py-8 space-y-12">

        {/* Section 1: KPI Cards */}
        <section id="kpis" className="scroll-mt-40 space-y-4">
          <div className="flex items-center justify-between border-l-4 border-orange-600 pl-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">
              Executive Highlights
            </h2>
            <div className="text-[10px] font-bold bg-muted px-2 py-1 rounded border border-border">
              {filters.month} · {period}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {filteredKpis.map((kpi) => (
              <GwpKpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>

        {/* Section 2: Commission Analytics */}
        <section id="commission" className="scroll-mt-40 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80 border-l-4 border-blue-600 pl-4">
            Commission Analytics
          </h2>
          <CommissionAnalytics products={filteredProducts.length > 0 ? filteredProducts : mockGwpProducts.slice(0, 4)} />
        </section>

        {/* Section 3: AI Insights + Incentive Slab Table */}
        <section id="incentive" className="scroll-mt-40 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80 border-l-4 border-amber-600 pl-4">
            Slab-Based Incentives
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <IncentiveSlabTable data={mockIncentiveSlabs} />
            </div>
            <div className="xl:col-span-1">
              <AiInsightsPanel insights={mockAiInsights} />
            </div>
          </div>
        </section>

        {/* Section 4: GWP Dashboard Table */}
        <section id="gwp-table" className="scroll-mt-40 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80 border-l-4 border-rose-600 pl-4">
            Premium Portfolio
          </h2>
          <GwpDashboardTable data={filteredProducts} />
        </section>

        {/* Section 5: Geographic Visualization */}
        <section id="geography" className="scroll-mt-40 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80 border-l-4 border-teal-600 pl-4">
            Regional Penetration
          </h2>
          <OmanGeoMap regions={mockRegionGwp} branches={mockBranchGwp} />
        </section>

        {/* Section 6: Extrapolation Simulator */}
        <section id="simulator" className="scroll-mt-40 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80 border-l-4 border-indigo-600 pl-4">
            Forecast Simulator
          </h2>
          <ExtrapolationSimulator />
        </section>
      </main>
    </div>
  );
}
