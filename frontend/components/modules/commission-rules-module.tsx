"use client";

import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CommissionRuleSet, CommissionSlabRow, RuleVersionMeta } from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

export function CommissionRulesModule({
  initialRules,
  versions,
}: {
  initialRules: CommissionRuleSet[];
  versions: RuleVersionMeta[];
}) {
  const [rules, setRules] = React.useState<CommissionRuleSet[]>(initialRules);
  const [selectedId, setSelectedId] = React.useState(initialRules[0]?.id ?? "");
  const selected = rules.find((r) => r.id === selectedId) ?? rules[0];

  const updateSlab = (slabId: string, patch: Partial<CommissionSlabRow>) => {
    if (!selected) return;
    setRules((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              slabs: r.slabs.map((s) =>
                s.id === slabId ? { ...s, ...patch } : s
              ),
            }
      )
    );
  };

  const addSlab = () => {
    if (!selected) return;
    const next: CommissionSlabRow = {
      id: `new-${Date.now()}`,
      minAchievementPct: 0,
      maxAchievementPct: 100,
      commissionPct: 5,
      payoutMultiplier: 1,
    };
    setRules((prev) =>
      prev.map((r) =>
        r.id !== selected.id ? r : { ...r, slabs: [...r.slabs, next] }
      )
    );
    toast.message("Tier added — save as draft to version.");
  };

  const saveDraft = () => {
    if (!selected) return;
    setRules((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              status: "draft",
              version: `${r.version.split("-")[0]}-draft`,
              updatedAt: new Date().toISOString().slice(0, 19),
              updatedBy: "Sara Al-Mansoori",
            }
      )
    );
    toast.success("Draft saved (mock). Version history will capture on publish.");
  };

  const publishVersion = () => {
    if (!selected) return;
    const v = `2026.${Math.floor(Math.random() * 9) + 2}`;
    setRules((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              status: "active",
              version: v,
              effectiveFrom: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 19),
              updatedBy: "Policy Admin",
            }
      )
    );
    toast.success(`Published as v${v} (mock).`);
  };

  if (!selected) {
    return (
      <p className="text-sm text-muted-foreground">No rule sets configured.</p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr]">
      <Card className="h-fit border-border/70 shadow-none lg:sticky lg:top-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Rule sets</CardTitle>
          <CardDescription className="text-xs">
            Select a pack to edit slabs and conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[280px] lg:h-[420px]">
            <div className="space-y-px p-2">
              {rules.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    "flex w-full flex-col items-start rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
                    r.id === selected.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-transparent hover:bg-muted/50"
                  )}
                >
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="mt-0.5 text-muted-foreground">
                    v{r.version}
                  </span>
                  <Badge
                    variant={
                      r.status === "active"
                        ? "success"
                        : r.status === "draft"
                          ? "warning"
                          : "secondary"
                    }
                    className="mt-1.5 font-normal capitalize"
                  >
                    {r.status}
                  </Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="text-base">{selected.name}</CardTitle>
              <CardDescription className="text-xs">
                Conditions scope payouts; slabs map achievement to commission % and
                multiplier.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={saveDraft}>
                Save draft
              </Button>
              <Button size="sm" onClick={publishVersion}>
                Publish version
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Product</Label>
                <Input readOnly value={selected.product} className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Region</Label>
                <Input readOnly value={selected.region} className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Input readOnly value={selected.roleScope} className="h-8 text-xs" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span>
                Effective <strong className="text-foreground">{selected.effectiveFrom}</strong>
              </span>
              <span>·</span>
              <span>
                Last edit {selected.updatedAt.replace("T", " ")} by{" "}
                {selected.updatedBy}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Slabs & tiers</CardTitle>
            <Button size="sm" variant="outline" onClick={addSlab}>
              Add tier
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Min %</TableHead>
                  <TableHead className="text-xs">Max %</TableHead>
                  <TableHead className="text-xs">Commission %</TableHead>
                  <TableHead className="text-xs">Multiplier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.slabs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="p-2">
                      <Input
                        className="h-8 w-20 text-xs tabular-nums"
                        type="number"
                        value={s.minAchievementPct}
                        onChange={(e) =>
                          updateSlab(s.id, {
                            minAchievementPct: Number(e.target.value),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        className="h-8 w-20 text-xs tabular-nums"
                        type="number"
                        value={s.maxAchievementPct}
                        onChange={(e) =>
                          updateSlab(s.id, {
                            maxAchievementPct: Number(e.target.value),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        className="h-8 w-24 text-xs tabular-nums"
                        type="number"
                        step="0.1"
                        value={s.commissionPct}
                        onChange={(e) =>
                          updateSlab(s.id, {
                            commissionPct: Number(e.target.value),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        className="h-8 w-24 text-xs tabular-nums"
                        type="number"
                        step="0.01"
                        value={s.payoutMultiplier}
                        onChange={(e) =>
                          updateSlab(s.id, {
                            payoutMultiplier: Number(e.target.value),
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Version history</CardTitle>
            <CardDescription className="text-xs">
              Published versions remain immutable; drafts supersede until publish.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs">
              {versions.map((v) => (
                <li
                  key={v.version}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2"
                >
                  <span className="font-medium">{v.label}</span>
                  <Badge
                    variant={
                      v.status === "active"
                        ? "success"
                        : v.status === "draft"
                          ? "warning"
                          : "secondary"
                    }
                    className="capitalize font-normal"
                  >
                    {v.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
