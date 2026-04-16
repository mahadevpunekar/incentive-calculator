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
  const prefix = index === 0 ? "" : `${c.combinator} `;
  const logic = `${prefix}${c.mode} ${DIM_LABEL[c.dimension]} [${vals}]`;
  const metrics = ` (Target: ${c.targetOmr >= 1000 ? (c.targetOmr / 1000).toFixed(0) + "K" : c.targetOmr} → +${(c.incentivePercent || 0).toFixed(2)}%)`;
  
  return (
    <div key={c.id} className="font-mono mb-0.5 last:mb-0">
      <span className="text-muted-foreground">{logic}</span>
      <span className="text-foreground font-medium">{metrics}</span>
    </div>
  );
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
        targetOmr: 500000,
        incentivePercent: 0.5,
      },
    ],
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
    const badValues = editing.conditions.some((c) => c.values.length === 0);
    if (badValues) {
      toast.error("Each condition needs at least one value.");
      return;
    }
    const badMetrics = editing.conditions.some((c) => c.targetOmr <= 0 || c.incentivePercent < 0);
    if (badMetrics) {
      toast.error("Ensure all conditions have a Target > 0 and Incentive % >= 0.");
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
    toast.success("Rule saved (mock). Condition-level incentives activated.");
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
      conditions: r.conditions.map((c) => ({ 
        ...c,
        targetOmr: c.targetOmr || 0,
        incentivePercent: c.incentivePercent || 0
      })),
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
          targetOmr: 250000,
          incentivePercent: 0.25,
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
                Condition-Level Incentive Engine
              </CardTitle>
              <ul className="list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
                <li>
                  Incentives are now defined <strong>per condition</strong>. This allows for stacking specific targets (e.g., Direct Channel goal + Motor Product goal).
                </li>
                <li>
                  Each condition block requires its own <strong>Target (OMR)</strong> and <strong>Incentive %</strong> boost.
                </li>
                <li>
                  Priority rules still apply when multiple rules apply during the payout run.
                </li>
              </ul>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="button" 
          size="sm" 
          onClick={openNew}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New rule
        </Button>
      </div>

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Saved rules</CardTitle>
          <CardDescription className="text-xs">
            Dynamic incentive stacking depends on active condition-level targets.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Pri</TableHead>
                <TableHead className="text-xs">Rule</TableHead>
                <TableHead className="text-xs">Logic & Stacking</TableHead>
                <TableHead className="text-xs">Total Incentive</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="w-[90px] text-xs" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...rules]
                .sort((a, b) => a.priority - b.priority)
                .map((r) => {
                  const totalIncentive = r.conditions.reduce((s, c) => s + (c.incentivePercent || 0), 0);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="tabular-nums text-xs">
                        {r.priority}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{r.name}</TableCell>
                      <TableCell className="max-w-[400px] text-[11px]">
                        {r.conditions.map((c, i) => formatConditionLine(c, i))}
                      </TableCell>
                      <TableCell className="tabular-nums text-xs font-medium">
                        +{totalIncentive.toFixed(2)}%
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
                  );
                })}
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
              Define condition-specific targets and cumulative payout multipliers.
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
              <div className="space-y-1.5">
                <Label className="text-xs">State</Label>
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
                  <Label className="text-xs font-medium underline">Condition builder</Label>
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
                    className="rounded-lg border border-border/70 bg-muted/15 p-3 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {idx > 0 && (
                          <select
                            className="h-7 rounded-md border border-input bg-background px-1 text-[10px]"
                            value={c.combinator}
                            onChange={(e) =>
                              updateCondition(c.id, {
                                combinator: e.target.value as RuleConditionCombinator,
                              })
                            }
                          >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                          </select>
                        )}
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">Segment {idx + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCondition(c.id)}
                        disabled={editing.conditions.length <= 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Dimension</Label>
                        <select
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          value={c.dimension}
                          onChange={(e) =>
                            updateCondition(c.id, {
                              dimension: e.target.value as RuleEngineCondition["dimension"],
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
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Scope</Label>
                        <select
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
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
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Target (OMR)</Label>
                        <Input 
                          type="number"
                          className="h-8 text-xs"
                          value={c.targetOmr}
                          onChange={(e) => updateCondition(c.id, { targetOmr: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Incentive %</Label>
                        <Input 
                          type="number"
                          step="0.05"
                          className="h-8 text-xs font-medium"
                          value={c.incentivePercent}
                          onChange={(e) => updateCondition(c.id, { incentivePercent: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {VALUE_OPTIONS[c.dimension].map((v) => (
                        <label
                          key={v}
                          className={cn(
                            "flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px]",
                            c.values.includes(v)
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/60"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={c.values.includes(v)}
                            className="h-3 w-3"
                            onChange={(e) => toggleValues(c, v, e.target.checked)}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Card className="border-dashed bg-muted/10 shadow-none">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">
                    Incentive Stack Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-1">
                    {editing.conditions.map((c, i) => (
                      <div key={c.id} className="font-mono text-[10px] flex items-center gap-2">
                        <span className="text-muted-foreground">{i > 0 ? c.combinator : "IF"}</span>
                        <span>{c.mode} {DIM_LABEL[c.dimension]} [{c.values.join(", ") || "…"}]</span>
                        <span className="text-primary font-bold">→ +{c.incentivePercent.toFixed(2)}%</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-muted-foreground">TOTAL BOOST</span>
                       <span className="text-sm font-bold text-primary">
                          +{editing.conditions.reduce((s, c) => s + (c.incentivePercent || 0), 0).toFixed(2)}%
                       </span>
                    </div>
                  </div>
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

const formatValue = (v: number) => {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v.toFixed(0)}`;
};
