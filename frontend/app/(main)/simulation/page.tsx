"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
import { SimulationReferenceTrend } from "@/components/modules/simulation-reference-trend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const LS_KEY = "ic-simulation-scenarios";

const slabSchema = z.object({
  label: z.string(),
  minPct: z.coerce.number(),
  maxPct: z.coerce.number(),
  commissionPct: z.coerce.number(),
  multiplier: z.coerce.number(),
});

const schema = z.object({
  baseIncentiveOmr: z.coerce.number().min(0),
  globalCommissionPct: z.coerce.number().min(0).max(100),
  acceleratorMultiplier: z.coerce.number().min(0).max(3),
  extraDeals: z.coerce.number().int().min(0).max(50),
  upliftPercent: z.coerce.number().min(-20).max(40),
  slab1: slabSchema,
  slab2: slabSchema,
  slab3: slabSchema,
});

type Values = z.infer<typeof schema>;

type SavedScenario = {
  id: string;
  name: string;
  savedAt: string;
  values: Values;
  projectedOmr: number;
};

const defaultValues: Values = {
  baseIncentiveOmr: 42180,
  globalCommissionPct: 7.2,
  acceleratorMultiplier: 1.35,
  extraDeals: 2,
  upliftPercent: 5,
  slab1: {
    label: "Below target",
    minPct: 0,
    maxPct: 79,
    commissionPct: 4.5,
    multiplier: 0.35,
  },
  slab2: {
    label: "On target",
    minPct: 80,
    maxPct: 100,
    commissionPct: 7.2,
    multiplier: 1.0,
  },
  slab3: {
    label: "Accelerator",
    minPct: 101,
    maxPct: 130,
    commissionPct: 9.0,
    multiplier: 1.35,
  },
};

function loadScenarios(): SavedScenario[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedScenario[];
  } catch {
    return [];
  }
}

/** `watch()` / DOM inputs often yield strings; `+` must not concatenate. */
function num(x: unknown, fallback = 0): number {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function project(v: Values) {
  const base = num(v.baseIncentiveOmr);
  const extraDeals = num(v.extraDeals);
  const upliftPercent = num(v.upliftPercent);
  const globalCommissionPct = num(v.globalCommissionPct);
  const acceleratorMultiplier = num(v.acceleratorMultiplier);
  const slabAvgMult =
    (num(v.slab1.multiplier) + num(v.slab2.multiplier) + num(v.slab3.multiplier)) /
    3;

  const dealLift = extraDeals * 950;
  const pctLift = base * (upliftPercent / 100);
  const commissionAdj = base * ((globalCommissionPct - 7.2) / 100) * 0.4;
  const accelAdj =
    base * (acceleratorMultiplier - 1.35) * 0.08 * slabAvgMult;
  const total = base + dealLift + pctLift + commissionAdj + accelAdj;
  return Math.round(Number.isFinite(total) ? total : base);
}

export default function SimulationPage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const v = form.watch();
  const projected = React.useMemo(() => project(v), [v]);

  const [scenarios, setScenarios] = React.useState<SavedScenario[]>([]);
  const [compareId, setCompareId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setScenarios(loadScenarios());
  }, []);

  const persist = (next: SavedScenario[]) => {
    setScenarios(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const saveScenario = () => {
    const values = form.getValues();
    const name = `Scenario ${new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`;
    const item: SavedScenario = {
      id: `sc-${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      values: { ...values },
      projectedOmr: project(values),
    };
    persist([item, ...scenarios]);
    toast.success("Scenario saved locally.");
  };

  const loadScenario = (s: SavedScenario) => {
    form.reset(s.values);
    toast.message(`Loaded "${s.name}"`);
  };

  const compare = scenarios.find((s) => s.id === compareId);

  return (
    <Form {...form}>
      <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <PageHeader
          title="Scenario simulation"
          description="Tune commission %, slab tiers, and multipliers; save scenarios and compare outcomes. Illustrative math for stakeholder review."
        />

        <SimulationReferenceTrend />

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <CardHeader>
                <CardTitle className="text-base">Drivers</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Global commission rate and accelerator multiplier apply on top of
                  baseline accrual (simplified model).
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="baseIncentiveOmr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Baseline incentive (OMR)</FormLabel>
                        <FormControl>
                          <Input inputMode="decimal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="globalCommissionPct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Global commission %</FormLabel>
                        <FormControl>
                          <Input inputMode="decimal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acceleratorMultiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accelerator multiplier (×)</FormLabel>
                        <FormControl>
                          <Input inputMode="decimal" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="extraDeals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional deals closed</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="upliftPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue uplift (%)</FormLabel>
                        <FormControl>
                          <Input inputMode="decimal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => form.reset(defaultValues)}
                    >
                      Reset defaults
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <CardHeader>
                <CardTitle className="text-base">Slab & tier matrix</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Achievement bands drive effective commission % and payout
                  multiplier (policy-aligned structure).
                </p>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs w-[120px]">Band</TableHead>
                      <TableHead className="text-xs">Min %</TableHead>
                      <TableHead className="text-xs">Max %</TableHead>
                      <TableHead className="text-xs">Comm. %</TableHead>
                      <TableHead className="text-xs">Mult. (×)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(["slab1", "slab2", "slab3"] as const).map((key) => (
                      <TableRow key={key}>
                        <TableCell className="p-2 align-top">
                          <FormField
                            control={form.control}
                            name={`${key}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input className="h-8 text-xs" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <FormField
                            control={form.control}
                            name={`${key}.minPct`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="h-8 w-16 text-xs tabular-nums"
                                    type="number"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <FormField
                            control={form.control}
                            name={`${key}.maxPct`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="h-8 w-16 text-xs tabular-nums"
                                    type="number"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <FormField
                            control={form.control}
                            name={`${key}.commissionPct`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="h-8 w-20 text-xs tabular-nums"
                                    type="number"
                                    step="0.1"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <FormField
                            control={form.control}
                            name={`${key}.multiplier`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="h-8 w-20 text-xs tabular-nums"
                                    type="number"
                                    step="0.01"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">Comparison</CardTitle>
              <Button type="button" size="sm" onClick={saveScenario}>
                Save scenario
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-border/80 p-4">
                  <p className="text-xs text-muted-foreground">Baseline (form)</p>
                  <p className="text-xl font-semibold mt-1 tabular-nums">
                    OMR {Math.round(num(v.baseIncentiveOmr)).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs text-muted-foreground">Projected</p>
                  <p className="text-xl font-semibold mt-1 tabular-nums">
                    OMR {projected.toLocaleString()}
                  </p>
                </div>
                {compare ? (
                  <div
                    className={cn(
                      "rounded-lg border p-4",
                      compare.projectedOmr >= projected
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-brand-green/40 bg-brand-green/5"
                    )}
                  >
                    <p className="text-xs text-muted-foreground">
                      vs saved{" "}
                      <span className="font-medium text-foreground">
                        {compare.name.slice(0, 24)}…
                      </span>
                    </p>
                    <p className="text-xl font-semibold mt-1 tabular-nums">
                      Δ OMR{" "}
                      {(projected - compare.projectedOmr).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 p-4 flex items-center">
                    <p className="text-xs text-muted-foreground">
                      Pick a saved scenario to compare delta.
                    </p>
                  </div>
                )}
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Projection blends deal count, revenue uplift, global commission
                tilt, accelerator multiplier, and average slab multiplier. Wire
                to the accrual engine for production-grade parity.
              </p>
            </CardContent>
            </Card>
          </div>

          <Card className="h-fit border-border/70 shadow-none xl:sticky xl:top-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saved scenarios</CardTitle>
            <p className="text-xs text-muted-foreground">
              Stored in this browser only.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {scenarios.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No saved scenarios yet.
              </p>
            ) : (
              scenarios.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs transition-colors",
                    compareId === s.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {s.name}
                      </p>
                      <p className="text-muted-foreground tabular-nums">
                        OMR {s.projectedOmr.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 font-normal">
                      Compare
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[11px]"
                      onClick={() => loadScenario(s)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[11px]"
                      onClick={() =>
                        setCompareId(compareId === s.id ? null : s.id)
                      }
                    >
                      {compareId === s.id ? "Clear" : "Set compare"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
}
