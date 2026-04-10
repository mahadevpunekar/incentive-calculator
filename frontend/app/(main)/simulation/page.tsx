"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
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

const schema = z.object({
  extraDeals: z.coerce.number().int().min(0).max(50),
  upliftPercent: z.coerce.number().min(-20).max(40),
});

type Values = z.infer<typeof schema>;

const BASE = 42180;

export default function SimulationPage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { extraDeals: 2, upliftPercent: 5 },
  });
  const v = form.watch();

  const projected = useMemo(() => {
    const dealLift = v.extraDeals * 950;
    const pctLift = BASE * (v.upliftPercent / 100);
    return Math.round(BASE + dealLift + pctLift);
  }, [v.extraDeals, v.upliftPercent]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Scenario simulation"
        description="Sensitivity-style preview for “close more deals” and KPI uplift scenarios. Numbers are illustrative."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Scenario builder</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adjust inputs to compare current vs projected payout.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
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
                <Button type="button" variant="secondary">
                  Reset
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">
              Side-by-side summary for stakeholder reviews.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/80 p-4">
                <p className="text-xs text-muted-foreground">Current (mock)</p>
                <p className="text-xl font-semibold mt-1 tabular-nums">
                  OMR {BASE.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs text-muted-foreground">Projected</p>
                <p className="text-xl font-semibold mt-1 tabular-nums">
                  OMR {projected.toLocaleString()}
                </p>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most impactful lever in this prototype: additional deals (fixed
              OMR per deal) plus percent uplift applied to the baseline accrual.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
