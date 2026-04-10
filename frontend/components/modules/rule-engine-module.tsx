"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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
import type {
  RuleEngineCondition,
  RuleEngineRule,
} from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

const VALUE_OPTIONS: Record<RuleEngineCondition["dimension"], string[]> = {
  product: ["Motor", "Marine", "Medical", "Property", "Engineering"],
  role: ["Producer", "RM", "Branch Manager", "Team Lead"],
  channel: ["Direct", "Broker", "Bancassurance", "Online"],
};

function emptyRule(): RuleEngineRule {
  return {
    id: `re-new-${Date.now()}`,
    name: "New rule",
    priority: 50,
    active: true,
    conditions: [
      {
        id: `c-${Date.now()}`,
        dimension: "product",
        mode: "include",
        values: ["Motor"],
      },
    ],
    effectSummary: "Describe payout effect…",
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
    setRules((prev) => {
      const i = prev.findIndex((r) => r.id === editing.id);
      const next = { ...editing, updatedAt: new Date().toISOString().slice(0, 19) };
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = next;
        return copy;
      }
      return [next, ...prev];
    });
    toast.success("Rule saved (mock). Versioning hooks to policy service.");
    setOpen(false);
    setEditing(null);
  };

  const openNew = () => {
    setEditing(emptyRule());
    setOpen(true);
  };

  const openEdit = (r: RuleEngineRule) => {
    setEditing({ ...r, conditions: r.conditions.map((c) => ({ ...c })) });
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
          dimension: "channel",
          mode: "include",
          values: ["Direct"],
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={openNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add rule
        </Button>
      </div>

      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active rule stack</CardTitle>
          <CardDescription className="text-xs">
            Conditions combine with AND. Within a row, selected values are OR for
            include / exclude semantics (engine mock).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs">Rule</TableHead>
                <TableHead className="text-xs">Conditions</TableHead>
                <TableHead className="text-xs">Effect</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="w-[100px] text-xs" />
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
                    <TableCell className="text-xs font-medium">
                      {r.name}
                    </TableCell>
                    <TableCell className="max-w-[280px] text-[11px] text-muted-foreground">
                      {r.conditions.map((c) => (
                        <div key={c.id} className="mb-0.5 last:mb-0">
                          <span className="font-medium text-foreground">
                            {c.mode}
                          </span>{" "}
                          {c.dimension}: {c.values.join(", ")}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="max-w-[200px] text-xs">
                      {r.effectSummary}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.active ? "success" : "secondary"}
                        className="font-normal"
                      >
                        {r.active ? "Active" : "Off"}
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
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id.startsWith("re-new") ? "Create rule" : "Edit rule"}</DialogTitle>
            <DialogDescription>
              Target dimensions: product, role, channel. Inclusion keeps matches;
              exclusion removes them from the rule outcome path.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4 py-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Priority (lower runs first)</Label>
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
              <div className="space-y-1.5">
                <Label className="text-xs">Effect summary</Label>
                <Input
                  value={editing.effectSummary}
                  onChange={(e) =>
                    setEditing({ ...editing, effectSummary: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Conditions</Label>
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
                {editing.conditions.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border/70 bg-muted/20 p-3 space-y-2"
                  >
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
                        <option value="product">Product</option>
                        <option value="role">Role</option>
                        <option value="channel">Channel</option>
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
                            onChange={(e) => toggleValues(c, v, e.target.checked)}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
