import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatBadgeProps = {
  label: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  variant?: BadgeProps["variant"];
};

export function StatBadge({
  label,
  trend = "neutral",
  className,
  variant,
}: StatBadgeProps) {
  const Icon =
    trend === "up"
      ? ArrowUpRight
      : trend === "down"
        ? ArrowDownRight
        : Minus;

  const resolvedVariant =
    variant ??
    (trend === "up"
      ? "success"
      : trend === "down"
        ? "destructive"
        : "secondary");

  return (
    <Badge
      variant={resolvedVariant}
      className={cn("gap-1 font-normal tabular-nums", className)}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
}
