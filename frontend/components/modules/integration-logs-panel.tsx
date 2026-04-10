"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { IntegrationLogEntry } from "@/lib/mock-api/types";
import { usePageFilterContext } from "@/hooks/use-page-filter-policy";

function levelVariant(
  level: IntegrationLogEntry["level"]
): "default" | "secondary" | "destructive" | "outline" {
  if (level === "error") return "destructive";
  if (level === "warn") return "secondary";
  return "outline";
}

export function IntegrationLogsPanel({
  entries,
}: {
  entries: IntegrationLogEntry[];
}) {
  const { activeKeys, filters } = usePageFilterContext();
  const filtered = useMemo(
    () => filterDimensional(entries, filters, activeKeys),
    [entries, filters, activeKeys]
  );

  return (
    <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader>
        <CardTitle className="text-base">Sync &amp; ingestion log</CardTitle>
        <CardDescription className="text-xs">
          Recent mock events. Period and channel filters apply; integration
          configuration is unchanged.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 sm:p-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 px-6 text-center">
            No log entries for this filter slice.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs w-[140px]">Time</TableHead>
                <TableHead className="text-xs w-[72px]">Level</TableHead>
                <TableHead className="text-xs">Integration</TableHead>
                <TableHead className="text-xs">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                    {e.at.replace("T", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={levelVariant(e.level)}
                      className="font-normal capitalize text-[10px]"
                    >
                      {e.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{e.integration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[420px]">
                    {e.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
