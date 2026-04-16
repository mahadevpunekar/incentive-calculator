"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { 
  Info, 
  Send, 
  Calculator, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Activity,
  Trophy
} from "lucide-react";

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
import { cn } from "@/lib/utils";

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

// Mock mapping for auto-fill logic - expanding to ensure values appear for all staff
const STAFF_PERFORMANCE_MAP: Record<string, { gwp: number; target: number }> = {
  // Specific combinations
  "Direct-Motor-ST-001": { gwp: 420000, target: 400000 },
  "Broker-Marine-ST-002": { gwp: 185000, target: 200000 },
  "Bancassurance-Medical-ST-003": { gwp: 620000, target: 550000 },
  "Online-Motor-ST-004": { gwp: 310000, target: 300000 },
  "Direct-Property-ST-005": { gwp: 850000, target: 750000 },
  "Broker-Engineering-ST-006": { gwp: 440000, target: 480000 },
  "Direct-Motor-ST-007": { gwp: 390000, target: 350000 },
  "Broker-Medical-ST-008": { gwp: 510000, target: 450000 },
  // Staff base defaults (fallback for any channel/product)
  "ST-001": { gwp: 400000, target: 380000 },
  "ST-002": { gwp: 210000, target: 220000 },
  "ST-003": { gwp: 580000, target: 500000 },
  "ST-004": { gwp: 300000, target: 300000 },
  "ST-005": { gwp: 720000, target: 650000 },
  "ST-006": { gwp: 410000, target: 450000 },
  "ST-007": { gwp: 350000, target: 320000 },
  "ST-008": { gwp: 480000, target: 440000 },
};

/**
 * Illustrative slab: under 80% → 0%; 80–100% → 4–7%; over 100% → up to ~9%.
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
      staff: "",
      gwpOmr: 0,
      targetOmr: 0,
    },
  });

  const { watch, setValue } = form;
  const values = watch();
  
  // Explicit handle for auto-fill on user selection
  const handleAutoFill = (channel?: string, product?: string, staff?: string) => {
    const c = channel || watch("channel");
    const p = product || watch("product");
    const s = staff || watch("staff");
    
    if (!s) return; // Only trigger if a staff is selected
    
    const specificKey = `${c}-${p}-${s}`;
    const fallbackKey = s;
    
    const mockData = STAFF_PERFORMANCE_MAP[specificKey] || STAFF_PERFORMANCE_MAP[fallbackKey];
    
    if (mockData) {
      setValue("gwpOmr", mockData.gwp);
      setValue("targetOmr", mockData.target);
    }
  };

  const out = computeIncentive(values);

  function onSubmit(data: Values) {
    toast.success("Shared for approval", {
      description: `Incentive scenario for ${data.staff} has been submitted.`,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    });
  }

  const isFormValid = values.gwpOmr > 0 && values.targetOmr > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card className="border-border/70 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
               <Calculator className="h-4 w-4 text-orange-500" />
               <CardTitle className="text-sm font-black uppercase tracking-tight">Inputs</CardTitle>
            </div>
            <CardDescription className="text-xs font-medium">
              Select variables to simulate incentive outcomes. GWP and Target will auto-fill based on selection.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Channel</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-bold focus:ring-1 focus:ring-orange-500/50"
                            {...field}
                          >
                            {channelOpts.map((c) => (
                              <option key={c} value={c}>{c}</option>
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-2 text-sm font-bold focus:ring-1 focus:ring-orange-500/50"
                            {...field}
                          >
                            {productOpts.map((p) => (
                              <option key={p} value={p}>{p}</option>
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-2 text-sm font-bold focus:ring-1 focus:ring-orange-500/50"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleAutoFill(undefined, undefined, e.target.value);
                            }}
                          >
                            <option value="">Select Staff</option>
                            {staffOpts.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gwpOmr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GWP (OMR)</FormLabel>
                        <FormControl>
                          <div className="relative">
                             <Input 
                               className="h-10 pl-3 pr-12 font-semibold tabular-nums" 
                               inputMode="decimal" 
                               {...field} 
                             />
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Liquid</div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetOmr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target (OMR)</FormLabel>
                        <FormControl>
                          <div className="relative">
                             <Input 
                               className="h-10 pl-3 pr-12 font-semibold tabular-nums" 
                               inputMode="decimal" 
                               {...field} 
                             />
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Goal</div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full sm:w-auto px-8 font-black uppercase tracking-widest gap-2 h-11 bg-orange-600 hover:bg-orange-700 hover:scale-[1.02] transition-all shadow-lg shadow-orange-500/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send for Approval
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Highlighted Slab Logic Section */}
        <Card className="border-orange-500/30 bg-orange-500/[0.03] shadow-none overflow-hidden group">
          <CardHeader className="pb-3 border-b border-orange-500/10 flex flex-row items-center justify-between">
            <div className="space-y-1">
               <CardTitle className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                 <HelpCircle className="h-3 w-3" />
                 Slab logic (Illustrative)
               </CardTitle>
               <CardDescription className="text-[10px] font-medium italic">Standard incentive tiers for FY25 planning period</CardDescription>
            </div>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
               <Info className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-5 pb-5 grid sm:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-orange-200/50 pr-4 last:border-0">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Threshold</p>
              </div>
              <p className="text-xs leading-relaxed">
                <strong className="text-foreground">&lt; 80%</strong> achievement → no incentive % <span className="text-red-600 font-bold">(0%)</span>.
              </p>
            </div>
            <div className="space-y-2 border-r border-orange-200/50 pr-4 last:border-0">
              <div className="flex items-center gap-1.5 text-blue-500">
                <Activity className="h-3 w-3" />
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Linear Ramp</p>
              </div>
              <p className="text-xs leading-relaxed">
                <strong className="text-foreground">80% – 100%</strong> → linear scale from <span className="text-blue-600 font-bold">4% to 7%</span> on GWP.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Trophy className="h-3 w-3" />
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Accelerator</p>
              </div>
              <p className="text-xs leading-relaxed">
                <strong className="text-foreground">&gt; 100%</strong> → up to <span className="text-emerald-600 font-bold">9%</span> for capped over-performance.
              </p>
            </div>
          </CardContent>
          <div className="px-5 py-2 bg-muted/5 border-t border-orange-500/10">
             <p className="text-[9px] font-medium text-muted-foreground/60 italic">
               Note: Rule-engine uplifts from policy-level triggers stack on top of these base tiers.
             </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-primary/25 bg-primary/[0.06] shadow-none sticky top-6">
          <CardHeader className="pb-2 border-b border-primary/10">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary/70">Outputs (live)</CardTitle>
            <CardDescription className="text-[10px] font-medium">Real-time simulation results</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-6 text-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Achievement %
              </p>
              <p className="text-3xl font-black tabular-nums tracking-tighter">
                {out.achievementPct.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                 <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", out.achievementPct >= 80 ? "bg-emerald-500" : "bg-amber-500")} 
                      style={{ width: `${Math.min(out.achievementPct, 100)}%` }} 
                    />
                 </div>
              </div>
            </div>
            <Separator className="bg-primary/10" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Incentive %
              </p>
              <p className="text-3xl font-black tabular-nums tracking-tighter text-blue-600">
                {out.incentivePct.toFixed(2)}%
              </p>
              <p className="text-[9px] font-bold text-muted-foreground/60 italic uppercase">Applied Slab: {out.achievementPct >= 100 ? "Accelerator" : out.achievementPct >= 80 ? "Linear" : "N/A"}</p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Final Incentive
              </p>
              <p className="text-3xl font-black tabular-nums tracking-tighter text-emerald-600">
                OMR {Math.round(out.incentiveAmount).toLocaleString()}
              </p>
              <p className="text-[9px] font-bold text-muted-foreground/60 italic uppercase tracking-tighter">Calculated as GWP × {out.incentivePct.toFixed(2)}%</p>
            </div>
          </CardContent>
          <div className="p-4 bg-muted/20 border-t border-primary/10">
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50">
                <Info className="h-3 w-3" />
                <span>Simulation only. Subject to audit.</span>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
