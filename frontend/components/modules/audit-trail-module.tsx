"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { AuditTrailEntry } from "@/lib/mock-api/types";
import { cn } from "@/lib/utils";

const entityVariant: Record<
  AuditTrailEntry["entityType"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  rule: "default",
  payout: "secondary",
  approval: "outline",
  scenario: "secondary",
};

export function AuditTrailModule({ entries }: { entries: AuditTrailEntry[] }) {
  const [openId, setOpenId] = React.useState<string | null>(entries[0]?.id ?? null);

  return (
    <div className="rounded-xl border border-border/80 bg-card">
      <div className="divide-y divide-border/60">
        {entries.map((e) => {
          const open = openId === e.id;
          return (
            <Collapsible
              key={e.id}
              open={open}
              onOpenChange={(o) => setOpenId(o ? e.id : null)}
            >
              <div className="flex flex-col gap-0 sm:flex-row sm:items-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto flex-1 justify-start rounded-none px-4 py-3 text-left hover:bg-muted/40"
                  >
                    <ChevronDown
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0 transition-transform",
                        open && "rotate-180"
                      )}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={entityVariant[e.entityType]}
                          className="text-[10px] font-normal capitalize"
                        >
                          {e.entityType}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {e.action}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {e.entityLabel}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {e.actor} · {e.at.replace("T", " ")}
                      </p>
                    </div>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="grid gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 sm:grid-cols-2">
                  <div className="rounded-md border border-border/60 bg-background p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Before
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-foreground">
                      {e.beforeSummary}
                    </p>
                  </div>
                  <div className="rounded-md border border-primary/25 bg-primary/[0.04] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      After
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-foreground">
                      {e.afterSummary}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
