"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const schema = z.object({
  revenue: z.coerce.number().min(0, "Revenue must be positive"),
  dealsClosed: z.coerce.number().int().min(0),
  kpiScore: z.coerce.number().min(0).max(100),
});

type Values = z.infer<typeof schema>;

function estimatePayout(v: Values) {
  const base = Math.min(v.revenue * 0.04, 25000);
  const dealBonus = v.dealsClosed * 120;
  const kpiMult = 0.85 + (v.kpiScore / 100) * 0.35;
  return Math.round((base + dealBonus) * kpiMult);
}

export function CalculatorForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      revenue: 420000,
      dealsClosed: 14,
      kpiScore: 88,
    },
  });

  const values = form.watch();
  const projected = estimatePayout(values);

  function onSubmit(data: Values) {
    toast.success("Scenario saved (mock)", {
      description: `Estimated payout: OMR ${estimatePayout(data).toLocaleString()}`,
    });
  }

  return (
    <Card className="shadow-none max-w-xl">
      <CardHeader>
        <CardTitle>Inputs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Client-side estimate for prototyping. Replace with rule engine API.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenue (OMR)</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" {...field} />
                  </FormControl>
                  <FormDescription>
                    Written premium or sales value for the period.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dealsClosed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deals closed</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kpiScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Composite KPI score</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" {...field} />
                  </FormControl>
                  <FormDescription>0–100 weighted KPI index (mock).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="rounded-lg border border-border/80 bg-muted/30 px-4 py-3 text-sm">
              <p className="text-muted-foreground">Estimated payout (mock)</p>
              <p className="text-2xl font-semibold tracking-tight mt-1">
                OMR {projected.toLocaleString()}
              </p>
            </div>
            <Button type="submit">Recalculate &amp; save scenario</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
