"use client";

import * as React from "react";
import { toast } from "sonner";
import { Info, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  FILTER_BRANCHES,
  FILTER_CHANNELS,
  FILTER_PRODUCTS,
  FILTER_REGIONS,
  FILTER_STAFF,
} from "@/lib/mock-slices";
import type {
  RuleConditionCombinator,
  RuleEngineCondition,
  RuleEngineRule,
} from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

const DIMENSIONS: RuleEngineCondition["dimension"][] = [
  "channel",
  "product",
  "staff",
  "region",
  "branch",
];

const VALUE_OPTIONS: Record<
  RuleEngineCondition["dimension"],
  readonly string[]
> = {
  channel: FILTER_CHANNELS.filter((c) => c !== "All"),
  product: FILTER_PRODUCTS.filter((p) => p !== "All"),
  staff: FILTER_STAFF.filter((s) => s !== "All"),
  region: FILTER_REGIONS.filter((r) => r !== "All"),
  branch: FILTER_BRANCHES.filter((b) => b !== "All"),
};

const DIM_LABEL: Record<RuleEngineCondition["dimension"], string> = {
  channel: "Channel",
  product: "Product",
  staff: "Staff",
  region: "Region",
  branch: "Branch",
};

function formatConditionLine(c: RuleEngineCondition, index: number) {
  const vals = c.values.length ? c.values.join(", ") : "—";
  const prefix =
    index === 0 ? "" : `${c.combinator} `;
  return `${prefix}${c.mode} ${DIM_LABEL[c.dimension]} [${vals}]`;
}

function emptyRule(): RuleEngineRule {
  const t = Date.now();
  return {
    id: `re-new-${t}`,
    name: "New incentive rule",
    priority: 50,
    active: true,
    conditions: [
      {
        id: `c-${t}`,
        combinator: "AND",
        dimension: "channel",
        mode: "include",
        values: ["Direct"],
      },
    ],
    incentivePercent: 0.5,
    effectSummary: "Describe who this applies to…",
    updatedAt: new Date().toISOString().slice(0, 19),
    updatedBy: "You",
  };
}

export function RuleEngineModule({ initial }: { initial: RuleEngineRule[] }) {
  const [rules, setRules] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<RuleEngineRule | null>(null);

  const save = () => {
    if (!editing) return;
    if (editing.conditions.length === 0) {
      toast.error("Add at least one condition.");
      return;
    }
    const bad = editing.conditions.some((c) => c.values.length === 0);
    if (bad) {
      toast.error("Each condition needs at least one value.");
      return;
    }
    setRules((prev) => {
      const i = prev.findIndex((r) => r.id === editing.id);
      const next = {
        ...editing,
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = next;
        return copy;
      }
      return [next, ...prev];
    });
    toast.success("Rule saved (mock). Publish to activate in the accrual engine.");
    setOpen(false);
    setEditing(null);
  };

  const openNew = () => {
    setEditing(emptyRule());
    setOpen(true);
  };

  const openEdit = (r: RuleEngineRule) => {
    setEditing({
      ...r,
      conditions: r.conditions.map((c) => ({ ...c })),
    });
    setOpen(true);
  };

  const updateCondition = (
    id: string,
    patch: Partial<RuleEngineCondition>
  ) => {
    if (!editing) return;
    setEditing({
      ...editing,
      conditions: editing.conditions.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    });
  };

  const addCondition = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      conditions: [
        ...editing.conditions,
        {
          id: `c-${Date.now()}`,
          combinator: "AND",
          dimension: "product",
          mode: "include",
          values: ["Motor"],
        },
      ],
    });
  };

  const removeCondition = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      conditions: editing.conditions.filter((c) => c.id !== id),
    });
  };

  const toggleValues = (
    cond: RuleEngineCondition,
    v: string,
    on: boolean
  ) => {
    const set = new Set(cond.values);
    if (on) set.add(v);
    else set.delete(v);
    updateCondition(cond.id, { values: Array.from(set) });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/[0.04] shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <CardTitle className="text-base text-foreground">
                How the rule engine is meant to work
              </CardTitle>
              <ul className="list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
                <li>
                  Each <strong className="text-foreground">condition</strong>{" "}
                  checks one dimension (channel, product, staff, region, or
                  branch). <strong className="text-foreground">Include</strong>{" "}
                  means “any of the ticked values may match”;{" "}
                  <strong className="text-foreground">exclude</strong> blocks
                  those values.
                </li>
                <li>
                  From the second row onward, choose{" "}
                  <strong className="text-foreground">AND</strong> (all joined
                  parts must hold) or{" "}
                  <strong className="text-foreground">OR</strong> (either side
                  can satisfy the chain, evaluated left‑to‑right).
                </li>
                <li>
                  When the rule expression matches a producer or deal in the
                  batch, the engine adds the configured{" "}
                  <strong className="text-foreground">incentive %</strong> on
                  top of the base plan (mock — production stacks with caps and
                  audit).
                </li>
              </ul>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={openNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          New rule
        </Button>
      </div>

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Saved rules</CardTitle>
          <CardDescription className="text-xs">
            Lower priority number runs earlier when multiple rules apply (mock
            ordering).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Pri</TableHead>
                <TableHead className="text-xs">Rule</TableHead>
                <TableHead className="text-xs">Logic</TableHead>
                <TableHead className="text-xs">Incentive +</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="w-[90px] text-xs" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...rules]
                .sort((a, b) => a.priority - b.priority)
                .map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="tabular-nums text-xs">
                      {r.priority}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{r.name}</TableCell>
                    <TableCell className="max-w-[320px] text-[11px] text-muted-foreground">
                      {r.conditions.map((c, i) => (
                        <div key={c.id} className="mb-0.5 font-mono last:mb-0">
                          {formatConditionLine(c, i)}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs font-medium">
                      +{r.incentivePercent.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.active ? "success" : "secondary"}
                        className="font-normal"
                      >
                        {r.active ? "On" : "Off"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => openEdit(r)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id.startsWith("re-new") ? "Create rule" : "Edit rule"}
            </DialogTitle>
            <DialogDescription>
              Build conditions, combine them with AND/OR, and set the incentive
              rate this rule adds when it matches.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4 py-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Rule name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Priority (lower = earlier)</Label>
                  <Input
                    type="number"
                    value={editing.priority}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priority: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Incentive % (output)</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={editing.incentivePercent}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        incentivePercent: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Added to base commission when the rule matches.
                  </p>
                </div>
                <div className="flex items-end gap-2 pb-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editing.active}
                      onChange={(e) =>
                        setEditing({ ...editing, active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="active" className="text-xs font-normal">
                      Rule active
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Short description</Label>
                <Input
                  value={editing.effectSummary}
                  onChange={(e) =>
                    setEditing({ ...editing, effectSummary: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Condition builder</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={addCondition}
                  >
                    Add condition
                  </Button>
                </div>
                {editing.conditions.map((c, idx) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border/70 bg-muted/15 p-3 space-y-2"
                  >
                    {idx > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Combine with previous
                        </span>
                        <select
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                          value={c.combinator}
                          onChange={(e) =>
                            updateCondition(c.id, {
                              combinator: e.target
                                .value as RuleConditionCombinator,
                            })
                          }
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground">
                        First condition — no combinator.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={c.dimension}
                        onChange={(e) =>
                          updateCondition(c.id, {
                            dimension: e.target
                              .value as RuleEngineCondition["dimension"],
                            values: [],
                          })
                        }
                      >
                        {DIMENSIONS.map((d) => (
                          <option key={d} value={d}>
                            {DIM_LABEL[d]}
                          </option>
                        ))}
                      </select>
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={c.mode}
                        onChange={(e) =>
                          updateCondition(c.id, {
                            mode: e.target.value as "include" | "exclude",
                          })
                        }
                      >
                        <option value="include">Include</option>
                        <option value="exclude">Exclude</option>
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeCondition(c.id)}
                        disabled={editing.conditions.length <= 1}
                        aria-label="Remove condition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {VALUE_OPTIONS[c.dimension].map((v) => (
                        <label
                          key={v}
                          className={cn(
                            "flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px]",
                            c.values.includes(v)
                              ? "border-primary/50 bg-primary/10"
                              : "border-border/60"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={c.values.includes(v)}
                            onChange={(e) =>
                              toggleValues(c, v, e.target.checked)
                            }
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Card className="border-dashed bg-muted/20 shadow-none">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Readable expression (preview)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="font-mono text-[11px] leading-relaxed text-foreground">
                    {editing.conditions.map((c, i) => (
                      <span key={c.id}>
                        {i > 0 ? ` ${c.combinator} ` : ""}(
                        {c.mode} {DIM_LABEL[c.dimension]}:{" "}
                        {c.values.join(", ") || "…"})
                      </span>
                    ))}{" "}
                    → <strong>+{editing.incentivePercent}%</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
