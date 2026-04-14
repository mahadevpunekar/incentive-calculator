"use client";

import * as React from "react";
import { Download, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { GwpProductRow } from "@/lib/mock-api/gwp-types";

function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
      isPositive ? "text-emerald-400" : "text-red-400"
    )}>
      {isPositive ? "▲" : "▼"}{Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function GwpDashboardTable({ data }: { data: GwpProductRow[] }) {
  const [filter, setFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const channels = React.useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.channel)))], [data]);

  const filtered = React.useMemo(() => {
    let rows = data;
    if (filter !== "All") rows = rows.filter((r) => r.channel === filter);
    if (search) rows = rows.filter((r) => r.product.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [data, filter, search]);

  const totals = React.useMemo(() => ({
    cyGwp: filtered.reduce((s, r) => s + r.cyGwp, 0),
    pyGwp: filtered.reduce((s, r) => s + r.pyGwp, 0),
    commissionEarned: filtered.reduce((s, r) => s + r.commissionEarned, 0),
    finalPayout: filtered.reduce((s, r) => s + r.finalPayout, 0),
    cyRenewals: filtered.reduce((s, r) => s + r.cyRenewals, 0),
  }), [filtered]);

  const downloadCSV = () => {
    const headers = ["Channel", "Product", "CY GWP", "PY GWP", "% Growth", "CY Loss Ratio", "Commission", "Final Payout"];
    const rows = filtered.map((r) => [
      r.channel, r.product, r.cyGwp, r.pyGwp, r.growthPct, r.cyLossRatio, r.commissionEarned, r.finalPayout,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gwp_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black tracking-tight">Product Portfolio Matrix</CardTitle>
            <CardDescription className="text-xs font-medium">Detailed breakdown of GWP (Million OMR), Loss Ratios, and Renewals across product lines</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-orange-600 transition-colors" />
              <input
                type="text"
                placeholder="Product lookup..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-44 rounded-lg border border-border bg-muted/30 pl-9 pr-3 text-xs font-bold transition-all focus:bg-background focus:ring-1 focus:ring-orange-500/50"
              />
            </div>

            {/* Channel filter */}
            <div className="flex items-center gap-2 px-2.5 h-9 rounded-lg border border-border bg-muted/30">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none"
              >
                {channels.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Channels" : c}</option>
                ))}
              </select>
            </div>

            {/* Download */}
            <Button variant="outline" size="sm" className="h-9 gap-1.5 px-4 font-bold text-xs" onClick={downloadCSV}>
              <Download className="h-3.5 w-3.5" />
              EXPORT
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40">
                {["Products", "CY GWP", "PY GWP", "% Growth", "CY Loss Ratio", "PY Loss Ratio", "% Growth", "CY Renewals", "PY Renewals", "% Growth"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "group border-b border-border transition-all duration-200 hover:bg-muted/30",
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/10 dark:bg-muted/5"
                  )}
                >
                  <td className="px-4 py-4 font-black text-blue-700 dark:text-blue-400 whitespace-nowrap text-sm tracking-tight">{row.product}</td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold">{row.cyGwp.toFixed(1)}</td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold text-muted-foreground/60">{row.pyGwp.toFixed(1)}</td>
                  <td className="px-4 py-4 text-center"><GrowthBadge value={row.growthPct} /></td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold">{row.cyLossRatio.toFixed(1)}%</td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold text-muted-foreground/60">{row.pyLossRatio.toFixed(1)}%</td>
                  <td className="px-4 py-4 text-center"><GrowthBadge value={row.lossRatioGrowthPct} /></td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold">{row.cyRenewals.toLocaleString()}</td>
                  <td className="px-4 py-4 tabular-nums text-right font-bold text-muted-foreground/60">{row.pyRenewals.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center"><GrowthBadge value={row.renewalGrowthPct} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-orange-500/30 bg-orange-600/5 dark:bg-orange-500/5">
                <td className="px-4 py-3 font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest text-xs">Total Aggregate</td>
                <td className="px-4 py-3 tabular-nums text-right font-black text-foreground">{totals.cyGwp.toFixed(1)}</td>
                <td className="px-4 py-3 tabular-nums text-right font-black text-muted-foreground/60">{totals.pyGwp.toFixed(1)}</td>
                <td className="px-4 py-3 text-center">
                  <GrowthBadge value={totals.pyGwp ? ((totals.cyGwp - totals.pyGwp) / totals.pyGwp) * 100 : 0} />
                </td>
                <td colSpan={3} />
                <td className="px-4 py-3 tabular-nums text-right font-black text-foreground">{totals.cyRenewals.toLocaleString()}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
