"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiInsight } from "@/lib/mock-api/gwp-types";

export function AiInsightsPanel({ insights }: { insights: AiInsight[] }) {
  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-sm">
            🤖
          </div>
          <CardTitle className="text-sm font-semibold">AI Insights</CardTitle>
          <span className="ml-auto rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
            {insights.length} insights
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={insight.id}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-white/5 bg-black/10 p-3",
              "hover:bg-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer",
              "animate-in fade-in slide-in-from-left-2"
            )}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
          >
            <span className="text-lg shrink-0 mt-0.5">{insight.icon}</span>
            <div className="min-w-0 space-y-0.5">
              <p className={cn(
                "text-xs font-semibold",
                insight.severity === "positive" && "text-emerald-400",
                insight.severity === "warning" && "text-amber-400",
                insight.severity === "neutral" && "text-blue-400",
              )}>
                {insight.title}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {insight.description}
              </p>
            </div>
            <div className={cn(
              "shrink-0 h-2 w-2 rounded-full mt-1.5",
              insight.severity === "positive" && "bg-emerald-500",
              insight.severity === "warning" && "bg-amber-500",
              insight.severity === "neutral" && "bg-blue-500",
            )} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
