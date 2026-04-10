"use client";

import * as React from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, LifeBuoy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { usePageFilterContext } from "@/lib/page-filter-context";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { DataQualityIssue } from "@/lib/mock-api/types";

export function DataQualityModule({
  initial,
}: {
  initial: DataQualityIssue[];
}) {
  const [issues, setIssues] = React.useState(initial);
  const { activeKeys, filters } = usePageFilterContext();

  const visible = useMemo(
    () => filterDimensional(issues, filters, activeKeys),
    [issues, filters, activeKeys]
  );

  const counts = React.useMemo(() => {
    const err = visible.filter((i) => i.severity === "error").length;
    const warn = visible.filter((i) => i.severity === "warning").length;
    const open = visible.filter((i) => i.status !== "resolved").length;
    return { err, warn, open };
  }, [visible]);

  const raiseIt = (id: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "raised_it" as const,
              resolutionNote:
                i.resolutionNote ?? "IT ticket created (mock) · ITSD-XXXX",
            }
          : i
      )
    );
    toast.success("Issue raised to IT (mock). Reference logged.");
  };

  const resolve = (id: string, note: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "resolved" as const, resolutionNote: note }
          : i
      )
    );
    toast.success("Marked resolved (mock).");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Blocking errors
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-2xl font-semibold tabular-nums">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {counts.err}
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {counts.warn}
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Open / in progress
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {counts.open}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-base">Pre-computation checks</CardTitle>
          <CardDescription className="text-xs">
            Incentive runs should halt when errors exist. Warnings allow override
            with approval (policy TBD).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Severity</TableHead>
                <TableHead className="text-xs">Check</TableHead>
                <TableHead className="text-xs">Source</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs min-w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((i) => (
                <IssueRow
                  key={i.id}
                  issue={i}
                  onRaise={() => raiseIt(i.id)}
                  onResolve={(note) => resolve(i.id, note)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function IssueRow({
  issue,
  onRaise,
  onResolve,
}: {
  issue: DataQualityIssue;
  onRaise: () => void;
  onResolve: (note: string) => void;
}) {
  const [note, setNote] = React.useState(issue.resolutionNote ?? "");

  return (
    <TableRow>
      <TableCell>
        <Badge
          variant={
            issue.severity === "error"
              ? "destructive"
              : issue.severity === "warning"
                ? "warning"
                : "secondary"
          }
          className="capitalize font-normal"
        >
          {issue.severity}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[320px]">
        <p className="text-xs font-medium text-foreground">{issue.checkName}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {issue.description}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {issue.detectedAt.replace("T", " ")} · {issue.source}
        </p>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{issue.source}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal capitalize">
          {issue.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {issue.status === "open" ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-7 w-fit gap-1 text-xs"
              onClick={onRaise}
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Raise to IT
            </Button>
          ) : null}
          {issue.status !== "resolved" ? (
            <div className="space-y-1">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Resolution note…"
                className="min-h-[52px] text-[11px]"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-fit gap-1 text-xs"
                onClick={() => onResolve(note || "Resolved")}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark resolved
              </Button>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {issue.resolutionNote}
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
