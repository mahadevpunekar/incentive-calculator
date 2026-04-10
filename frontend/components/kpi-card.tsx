import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiCardProps = {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
};

export function KpiCard({
  label,
  value,
  change,
  trend = "neutral",
  className,
}: KpiCardProps) {
  const Icon =
    trend === "up"
      ? ArrowUpRight
      : trend === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <Card
      className={cn(
        "rounded-lg border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-px hover:border-primary/25 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3.5 pb-1">
        <CardTitle className="text-xs font-medium leading-tight text-muted-foreground">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted/25",
            "transition-colors duration-200",
            trend === "up" && "text-foreground",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
      </CardHeader>
      <CardContent className="space-y-1 px-3.5 pb-3.5 pt-0">
        <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground sm:text-xl">
          {value}
        </p>
        {change ? (
          <p className="text-[11px] leading-snug text-muted-foreground">
            {change}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
