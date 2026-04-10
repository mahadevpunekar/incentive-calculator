import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardAlert } from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

function AlertBlock({ alert }: { alert: DashboardAlert }) {
  const styles =
    alert.severity === "critical"
      ? {
          border: "border-l-destructive",
          iconWrap: "text-destructive",
          Icon: ShieldAlert,
        }
      : alert.severity === "warning"
        ? {
            border: "border-l-[hsl(var(--brand-amber))]",
            iconWrap: "text-[hsl(var(--brand-amber))]",
            Icon: AlertTriangle,
          }
        : {
            border: "border-l-border",
            iconWrap: "text-muted-foreground",
            Icon: Info,
          };

  const { border, iconWrap, Icon } = styles;

  return (
    <div
      className={cn(
        "group rounded-md border border-border/60 border-l-[3px] bg-card py-2.5 pl-2.5 pr-2.5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "transition-all duration-200 ease-out",
        "hover:border-border hover:bg-muted/25 hover:shadow-[0_3px_10px_rgba(15,23,42,0.06)]",
        border
      )}
    >
      <div className="flex gap-2.5">
        <span
          className={cn(
            "mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/15",
            "transition-colors duration-200 group-hover:bg-muted/35",
            iconWrap
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {alert.severity === "info" ? "Information" : alert.severity}
          </p>
          <p className="text-xs font-semibold leading-snug text-foreground">
            {alert.title}
          </p>
          <p className="text-xs font-medium tabular-nums leading-snug text-foreground">
            {alert.metric}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {alert.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DashboardAlertsPanel({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <Card className="w-full rounded-lg border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
      <CardHeader className="space-y-0.5 p-4 pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">
          Alerts & breaches
        </CardTitle>
        <CardDescription className="text-xs leading-snug">
          Severity uses red and amber; informational items use brand accent.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 p-4 pt-0 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        {alerts.map((a) => (
          <AlertBlock key={a.id} alert={a} />
        ))}
      </CardContent>
    </Card>
  );
}
