"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FILTER_CHANNELS,
  FILTER_PRODUCTS,
  FILTER_STAFF,
} from "@/lib/mock-slices";

function num(x: unknown, fallback = 0): number {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

const schema = z.object({
  channel: z.string().min(1),
  product: z.string().min(1),
  staff: z.string().min(1),
  gwpOmr: z.coerce.number().min(0),
  targetOmr: z.coerce.number().min(1),
});

type Values = z.infer<typeof schema>;

/**
 * Illustrative slab: under 80% → 0%; 80–100% → 4–7%; over 100% → up to ~9%.
 * Incentive amount = GWP × (incentive% / 100).
 */
function computeIncentive(v: Values) {
  const gwp = num(v.gwpOmr);
  const target = num(v.targetOmr);
  const achievement = target > 0 ? (gwp / target) * 100 : 0;
  let incentivePct = 0;
  if (achievement < 80) incentivePct = 0;
  else if (achievement <= 100) {
    const t = (achievement - 80) / 20;
    incentivePct = 4 + t * 3;
  } else {
    const over = Math.min(achievement - 100, 30);
    incentivePct = 7 + (over / 30) * 2;
  }
  const incentiveAmount = (gwp * incentivePct) / 100;
  return {
    achievementPct: achievement,
    incentivePct,
    incentiveAmount,
  };
}

const channelOpts = FILTER_CHANNELS.filter((c) => c !== "All");
const productOpts = FILTER_PRODUCTS.filter((p) => p !== "All");
const staffOpts = FILTER_STAFF.filter((s) => s !== "All");

export function CalculatorForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      channel: "Direct",
      product: "Motor",
      staff: "ST-001",
      gwpOmr: 420000,
      targetOmr: 400000,
    },
  });

  const values = form.watch();
  const out = computeIncentive(values);

  function onSubmit(data: Values) {
    const r = computeIncentive(data);
    toast.success("Scenario noted (mock)", {
      description: `Achievement ${r.achievementPct.toFixed(1)}% · Incentive OMR ${Math.round(r.incentiveAmount).toLocaleString()}`,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Channel, product, and staff select the slice of the plan book. GWP
            and target drive achievement; the mock slab map below turns that
            into incentive % and OMR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          {...field}
                        >
                          {channelOpts.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          {...field}
                        >
                          {productOpts.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="staff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          {...field}
                        >
                          {staffOpts.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gwpOmr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GWP (OMR)</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Written premium in scope for the period.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetOmr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target (OMR)</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Assigned target for the same slice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Save scenario (mock)</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-primary/25 bg-primary/[0.06] shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Outputs (live)</CardTitle>
            <CardDescription className="text-xs">
              Updates as you change inputs — same numeric coercion as production
              forms to avoid string math bugs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Achievement %
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {out.achievementPct.toFixed(1)}%
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                GWP ÷ target × 100
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Incentive %
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {out.incentivePct.toFixed(2)}%
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                From mock slab curve (0% below 80% achievement)
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Incentive amount
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                OMR {Math.round(out.incentiveAmount).toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                GWP × incentive % ÷ 100
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Slab logic (illustrative)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <p>
              <strong className="text-foreground">&lt; 80%</strong> achievement
              → no incentive % (0%).
            </p>
            <p>
              <strong className="text-foreground">80% – 100%</strong> → linear
              ramp from 4% to 7% on GWP.
            </p>
            <p>
              <strong className="text-foreground">&gt; 100%</strong> → up to 9%
              for strong over-performance (capped in this demo).
            </p>
            <p className="pt-1 border-t border-border/60">
              Rule-engine uplifts from the policy screen would stack on top in a
              full implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
