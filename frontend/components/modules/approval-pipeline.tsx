"use client";

import { Check, Circle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ApprovalStageState } from "@/lib/mock-api/types";

export function ApprovalPipeline({ stages }: { stages: ApprovalStageState[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-0">
      {stages.map((s, i) => (
        <div key={s.stage} className="flex items-center">
          {i > 0 ? (
            <span className="mx-1 hidden h-px w-4 bg-border sm:block" aria-hidden />
          ) : null}
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium sm:text-xs",
              s.status === "complete" &&
                "border-brand-green/40 bg-brand-green/10 text-[hsl(152_55%_26%)] dark:text-[hsl(152_45%_52%)]",
              s.status === "rejected" &&
                "border-destructive/40 bg-destructive/10 text-destructive",
              s.status === "pending" &&
                "border-border/80 bg-muted/30 text-muted-foreground"
            )}
          >
            {s.status === "complete" ? (
              <Check className="h-3 w-3 shrink-0" aria-hidden />
            ) : s.status === "rejected" ? (
              <XCircle className="h-3 w-3 shrink-0" aria-hidden />
            ) : (
              <Circle className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
            )}
            <span>{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
