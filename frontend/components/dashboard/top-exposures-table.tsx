"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TopExposureRow } from "@/lib/mock-api/types";

export function TopExposuresTable({ rows }: { rows: TopExposureRow[] }) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.exposure.toLowerCase().includes(s) ||
        r.segment.toLowerCase().includes(s) ||
        r.riskRating.toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter exposures…"
            className="h-8 pl-8 text-xs bg-muted/25 border-border/70"
          />
        </div>
        <p className="text-xs text-muted-foreground tabular-nums shrink-0">
          {filtered.length} row{filtered.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="rounded-md border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 text-[11px]">Exposure</TableHead>
              <TableHead className="h-9 text-[11px]">Segment</TableHead>
              <TableHead className="h-9 text-[11px]">Risk rating</TableHead>
              <TableHead className="h-9 text-[11px]">Maturity</TableHead>
              <TableHead className="h-9 text-right text-[11px]">
                Amount (OMR)
              </TableHead>
              <TableHead className="h-9 text-right text-[11px]">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="max-w-[220px] py-2 text-xs font-medium">
                  {r.exposure}
                </TableCell>
                <TableCell className="py-2 text-xs">{r.segment}</TableCell>
                <TableCell className="py-2 text-xs tabular-nums">
                  {r.riskRating}
                </TableCell>
                <TableCell className="py-2 text-xs text-muted-foreground">
                  {r.maturity}
                </TableCell>
                <TableCell className="py-2 text-right text-xs tabular-nums">
                  {r.amountOmr.toLocaleString()}
                </TableCell>
                <TableCell className="py-2 text-right text-xs tabular-nums">
                  {r.sharePct.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
