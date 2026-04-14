"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const slabSchema = z.object({
  id: z.string(),
  minAchievementPct: z.coerce.number(),
  maxAchievementPct: z.coerce.number(),
  commissionPct: z.coerce.number(),
  payoutMultiplier: z.coerce.number(),
});

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  product: z.string().min(1, "Product is required"),
  region: z.string().min(1, "Region is required"),
  channel: z.enum(["agent", "broker", "staff"]),
  roleScope: z.string(),
  conditions: z.object({
    excludeChannels: z.array(z.string()).default([]),
    allowedRegions: z.array(z.string()).default([]),
    allowedStaffIds: z.array(z.string()).default([]),
  }).optional(),
  slabs: z.array(slabSchema),
});

type FormValues = z.infer<typeof formSchema>;

const PRODUCT_OPTIONS = [
  "Retail Motor - Comprehensive",
  "Retail Motor - TP",
  "Motor Fleet - Comprehensive",
  "Motor Fleet - TP",
];

const CHANNEL_OPTIONS = ["agent", "broker", "staff"] as const;

const REGION_OPTIONS = ["Muscat", "Dhofar", "Sohar", "Salalah", "National", "Batinah"];

export function CommissionRulesModule({
  initialRules,
  versions,
}: {
  initialRules: CommissionRuleSet[];
  versions: RuleVersionMeta[];
}) {
  const [rules, setRules] = React.useState<CommissionRuleSet[]>(initialRules);
  const [selectedId, setSelectedId] = React.useState(initialRules[0]?.id ?? "");

  const selectedRule = rules.find((r) => r.id === selectedId) || rules[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...selectedRule,
      channel: selectedRule.channel || "agent",
      conditions: selectedRule.conditions || {
        excludeChannels: [],
        allowedRegions: [],
        allowedStaffIds: [],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slabs",
  });

  // Sync form when selected rule changes
  React.useEffect(() => {
    if (selectedRule) {
      form.reset({
        ...selectedRule,
        channel: selectedRule.channel || "agent",
        conditions: selectedRule.conditions || {
          excludeChannels: [],
          allowedRegions: [],
          allowedStaffIds: [],
        },
      });
    }
  }, [selectedId, selectedRule, form]);

  const onSave = (values: FormValues) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === values.id
          ? {
            ...r,
            ...values,
            status: "draft",
            version: `${r.version.split("-")[0]}-draft`,
            updatedAt: new Date().toISOString(),
            updatedBy: "Sara Al-Mansoori",
          } as CommissionRuleSet
          : r
      )
    );
    toast.success("Changes saved as draft.");
  };

  const publishVersion = () => {
    const v = `2026.${Math.floor(Math.random() * 9) + 2}`;
    setRules((prev) =>
      prev.map((r) =>
        r.id === selectedId
          ? {
            ...r,
            status: "active",
            version: v,
            effectiveFrom: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString(),
            updatedBy: "Policy Admin",
          }
          : r
      )
    );
    toast.success(`Published as v${v}.`);
  };

  if (!selectedRule) {
    return (
      <p className="text-sm text-muted-foreground p-8">No rule sets configured.</p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,250px)_1fr]">
      {/* Sidebar */}
      <Card className="h-fit border-border/70 shadow-none lg:sticky lg:top-4 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Rule packs</CardTitle>
          <CardDescription className="text-xs">
            Configuration snapshots.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] lg:h-[500px]">
            <div className="space-y-px p-2">
              {rules.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    "flex w-full flex-col items-start rounded-md border px-3 py-2.5 text-left text-xs transition-all",
                    r.id === selectedId
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-transparent hover:bg-muted/50"
                  )}
                >
                  <span className="font-semibold text-foreground truncate w-full">{r.name}</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-muted-foreground font-mono uppercase text-[10px]">
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
                      className="h-4 px-1 text-[9px] font-medium capitalize"
                    >
                      {r.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            {/* Header Card */}
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight">
                    {selectedRule.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define scope and tiered commission logic.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" variant="outline">
                    Save Draft
                  </Button>
                  <Button type="button" size="sm" onClick={publishVersion}>
                    Publish
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Product Field */}
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Product</FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between h-9 text-xs font-normal border-muted-foreground/20",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value || "Select product..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[300px]">
                            <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                              {PRODUCT_OPTIONS.map((opt) => (
                                <DropdownMenuRadioItem key={opt} value={opt} className="text-xs">
                                  {opt}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Channel Field */}
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Channel</FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-9 text-xs font-normal border-muted-foreground/20 capitalize"
                              >
                                {field.value}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                              {CHANNEL_OPTIONS.map((opt) => (
                                <DropdownMenuRadioItem key={opt} value={opt} className="text-xs capitalize">
                                  {opt}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Region Field */}
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Primary Region</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-xs border-muted-foreground/20" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-md">
                  <span className="flex items-center gap-1">
                    Effective: <strong className="text-foreground">{selectedRule.effectiveFrom}</strong>
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    Last edit: <strong className="text-foreground">{selectedRule.updatedAt.replace("T", " ")}</strong>
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span>By: {selectedRule.updatedBy}</span>
                </div>
              </CardContent>
            </Card>

            {/* Conditions Section */}
            <Card className="border-border/70 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-sm font-semibold">Exclusion & Inclusion Rules</CardTitle>
                <CardDescription className="text-xs">
                  Restrict this rule set to specific channels, regions, or staff.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 grid gap-6 sm:grid-cols-3">
                {/* Exclude Channels */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Exclude Channels</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between h-8 text-xs font-normal">
                        {form.watch("conditions.excludeChannels")?.length || 0} selected
                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {CHANNEL_OPTIONS.map((opt) => {
                        const current = form.getValues("conditions.excludeChannels") || [];
                        const checked = current.includes(opt);
                        return (
                          <DropdownMenuCheckboxItem
                            key={opt}
                            checked={checked}
                            onCheckedChange={(val) => {
                              const next = val
                                ? [...current, opt]
                                : current.filter((c) => c !== opt);
                              form.setValue("conditions.excludeChannels", next);
                            }}
                            className="text-xs capitalize"
                          >
                            {opt}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Allowed Regions */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Allowed Regions</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between h-8 text-xs font-normal">
                        {form.watch("conditions.allowedRegions")?.length || 0} selected
                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {REGION_OPTIONS.map((opt) => {
                        const current = form.getValues("conditions.allowedRegions") || [];
                        const checked = current.includes(opt);
                        return (
                          <DropdownMenuCheckboxItem
                            key={opt}
                            checked={checked}
                            onCheckedChange={(val) => {
                              const next = val
                                ? [...current, opt]
                                : current.filter((c) => c !== opt);
                              form.setValue("conditions.allowedRegions", next);
                            }}
                            className="text-xs"
                          >
                            {opt}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Allowed Staff IDs */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Staff Selector</Label>
                  <FormControl>
                    <Input
                      placeholder="e.g. ST-001, ST-002"
                      className="h-8 text-xs"
                      value={form.watch("conditions.allowedStaffIds")?.join(", ") || ""}
                      onChange={(e) => {
                        const vals = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                        form.setValue("conditions.allowedStaffIds", vals);
                      }}
                    />
                  </FormControl>
                  <p className="text-[10px] text-muted-foreground">Comma separated staff IDs.</p>
                </div>
              </CardContent>
            </Card>

            {/* Slabs Section */}
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-semibold">Tiers & Achievement Slabs</CardTitle>
                  <CardDescription className="text-xs">
                    Linear mapping of performance to percentage.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 gap-1.5"
                  onClick={() => append({
                    id: `s-${Date.now()}`,
                    minAchievementPct: 0,
                    maxAchievementPct: 100,
                    commissionPct: 5,
                    payoutMultiplier: 1
                  })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add tier
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">Min %</TableHead>
                        <TableHead className="text-xs">Max %</TableHead>
                        <TableHead className="text-xs">Commission %</TableHead>
                        <TableHead className="text-xs">Payable amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id} className="group">
                          <TableCell className="py-2 pl-4">
                            <Input
                              {...form.register(`slabs.${index}.minAchievementPct`)}
                              type="number"
                              className="h-8 text-[11px] font-mono border-muted-foreground/20"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              {...form.register(`slabs.${index}.maxAchievementPct`)}
                              type="number"
                              className="h-8 text-[11px] font-mono border-muted-foreground/20"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="relative">
                              <Input
                                {...form.register(`slabs.${index}.commissionPct`)}
                                type="number"
                                step="0.1"
                                className="h-8 text-[11px] font-mono pr-6 border-muted-foreground/20"
                              />
                              <span className="absolute right-2 top-1.5 text-[10px] text-muted-foreground">%</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              {...form.register(`slabs.${index}.payoutMultiplier`)}
                              type="number"
                              step="0.01"
                              className="h-8 text-[11px] font-mono border-muted-foreground/20"
                            />
                          </TableCell>
                          <TableCell className="py-2 pr-4 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {fields.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/10">
                    <p className="text-xs italic">No tiers defined.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Version History */}
            <Card className="border-border/70 shadow-none bg-muted/20">
              <CardHeader className="py-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Version history</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="grid gap-2">
                  {versions.slice(0, 3).map((v) => (
                    <li
                      key={v.version}
                      className="flex items-center justify-between px-3 py-1.5 rounded-md border border-border/50 bg-background/50 text-[11px]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{v.label}</span>
                        <span className="text-muted-foreground/60">{v.effectiveFrom}</span>
                      </div>
                      <Badge
                        variant={
                          v.status === "active"
                            ? "success"
                            : v.status === "draft"
                              ? "warning"
                              : "secondary"
                        }
                        className="h-4 px-1 text-[9px] font-normal capitalize"
                      >
                        {v.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

