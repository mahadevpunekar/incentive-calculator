"use client";

import * as React from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, FileText, FileWarning } from "lucide-react";

import { DataTable, type Column } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePageFilterContext } from "@/lib/page-filter-context";
import { filterDimensional } from "@/lib/apply-global-filters";
import type { ReportJob, ScheduledReportJob } from "@/lib/mock-api/types";

function downloadMock(name: string, format: string) {
  toast.success(`Preparing ${format.toUpperCase()} — "${name}"`, {
    description: "Connect to export worker to stream real files.",
  });
}

export function ReportsHub({
  reports,
  scheduled,
}: {
  reports: ReportJob[];
  scheduled: ScheduledReportJob[];
}) {
  const [open, setOpen] = React.useState(false);
  const [schName, setSchName] = React.useState("");
  const [schCadence, setSchCadence] = React.useState("Weekly · Mon 06:00");
  const [schEmail, setSchEmail] = React.useState("");
  const { activeKeys, filters } = usePageFilterContext();

  const filteredReports = useMemo(
    () => filterDimensional(reports, filters, activeKeys),
    [reports, filters, activeKeys]
  );
  const filteredScheduled = useMemo(
    () => filterDimensional(scheduled, filters, activeKeys),
    [scheduled, filters, activeKeys]
  );

  const columns: Column<ReportJob>[] = [
    { id: "name", header: "Report", cell: (r) => r.name },
    {
      id: "format",
      header: "Format",
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-xs">
          {r.format === "pdf" ? (
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="uppercase">{r.format}</span>
        </span>
      ),
    },
    { id: "lastRun", header: "Last run", cell: (r) => r.lastRun },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Badge
          variant={
            r.status === "ready"
              ? "success"
              : r.status === "failed"
                ? "destructive"
                : "secondary"
          }
          className="capitalize font-normal"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      id: "dl",
      header: "",
      className: "w-[120px]",
      cell: (r) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => downloadMock(r.name, r.format)}
          >
            <Download className="h-3.5 w-3.5" />
            Get
          </Button>
        </div>
      ),
    },
  ];

  const failed = filteredReports.filter((r) => r.status === "failed");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              Schedule report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule export</DialogTitle>
              <DialogDescription>
                Creates a recurring job (mock). Wire to NestJS cron + mail merge.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Report name</Label>
                <Input
                  value={schName}
                  onChange={(e) => setSchName(e.target.value)}
                  placeholder="e.g. Producer statements"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cadence</Label>
                <Input
                  value={schCadence}
                  onChange={(e) => setSchCadence(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Recipients</Label>
                <Input
                  value={schEmail}
                  onChange={(e) => setSchEmail(e.target.value)}
                  placeholder="email@domain.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Schedule saved (mock).");
                  setOpen(false);
                  setSchName("");
                  setSchEmail("");
                }}
              >
                Save schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button type="button" onClick={() => toast.message("Template studio (mock)")}>
          New template
        </Button>
      </div>

      {failed.length > 0 ? (
        <EmptyState
          icon={FileWarning}
          title="Some jobs need attention"
          description="Failed runs remain visible in the table below. Retry download after worker fix."
          className="rounded-xl border border-dashed bg-muted/10"
        />
      ) : null}

      <DataTable columns={columns} data={filteredReports} />

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-base">Scheduled reports</CardTitle>
          <CardDescription className="text-xs">
            Next runs and distribution lists. Toggle delivery in admin when API
            is live.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Format</TableHead>
                <TableHead className="text-xs">Cadence</TableHead>
                <TableHead className="text-xs">Next run</TableHead>
                <TableHead className="text-xs">Recipients</TableHead>
                <TableHead className="text-xs">Active</TableHead>
                <TableHead className="text-xs w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScheduled.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs font-medium">{s.name}</TableCell>
                  <TableCell className="text-xs uppercase">{s.format}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.cadence}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">{s.nextRun}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {s.recipients}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={s.enabled ? "success" : "secondary"}
                      className="font-normal"
                    >
                      {s.enabled ? "On" : "Off"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => downloadMock(s.name, s.format)}
                    >
                      Run now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
