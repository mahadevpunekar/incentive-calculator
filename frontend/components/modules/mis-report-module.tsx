"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MisReportRow, MisTrendPoint } from "@/lib/mock-api/types";

export function MisReportModule({
  rows,
  trend,
}: {
  rows: MisReportRow[];
  trend: MisTrendPoint[];
}) {
  const chartData = trend.map((t) => ({
    period: t.period,
    gwpK: Math.round(t.gwpOmr / 1000),
    incentiveK: Math.round(t.incentiveOmr / 1000),
  }));

  return (
    <div className="space-y-8">
      {/* <Card className="border-border/70 bg-muted/20 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">What this report is for</CardTitle>
          <CardDescription className="text-xs leading-relaxed max-w-3xl">
            Management Information System (MIS) view ties{" "}
            <strong className="text-foreground">book dimensions</strong> (region,
            branch, staff, product) to{" "}
            <strong className="text-foreground">GWP and targets</strong>, then
            shows how <strong className="text-foreground">achievement</strong>{" "}
            translates into <strong className="text-foreground">incentive %</strong>{" "}
            and <strong className="text-foreground">earned OMR</strong>. Use it
            to explain payouts to sales leadership and finance in one place.
          </CardDescription>
        </CardHeader>
      </Card> */}

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-base">Detail by slice</CardTitle>
          <CardDescription className="text-xs">
            One row per region · branch · staff · product. Achievement and
            incentive % are illustrative for stakeholder walkthroughs.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs whitespace-nowrap">Region</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Branch</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Staff</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Product</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Target</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Ach. %</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Incentive %</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Earned</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">GWP (OMR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">{r.region}</TableCell>
                  <TableCell className="text-xs">{r.branch}</TableCell>
                  <TableCell className="font-mono text-xs">{r.staff}</TableCell>
                  <TableCell className="text-xs">{r.product}</TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {r.targetOmr.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {r.achievementPct.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {r.incentivePct.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-medium">
                    {r.incentiveEarnedOmr.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {r.gwpOmr.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="GWP trend (mock)"
          description="Total GWP in scope by month (thousands OMR)."
        >
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `${v}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                  }}
                  formatter={(v: number) => [`${v}k OMR`, "GWP"]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="gwpK" name="GWP" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard
          title="Incentive earned trend (mock)"
          description="Aggregate incentive OMR recognised in the same periods (thousands)."
        >
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `${v}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                  }}
                  formatter={(v: number) => [`${v}k OMR`, "Incentive"]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="incentiveK"
                  name="Incentive"
                  stroke="hsl(152 55% 36%)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
