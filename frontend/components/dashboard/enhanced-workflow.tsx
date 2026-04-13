"use client";

import * as React from "react";
import { Check, X, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type {
  ApprovalQueueItem, ApprovalQueueStatus, ApprovalStageKey, ApprovalStageState,
} from "@/lib/mock-api/types";

const STAGE_ORDER: ApprovalStageKey[] = ["ops", "sales", "finance", "payout"];

const stageLabels: Record<ApprovalStageKey, string> = {
  ops: "Operations",
  sales: "Sales",
  finance: "Finance",
  payout: "Payout",
};

const stageIcons: Record<ApprovalStageKey, string> = {
  ops: "⚙️",
  sales: "📋",
  finance: "💰",
  payout: "✅",
};

function StatusDot({ status }: { status: ApprovalStageState["status"] }) {
  return (
    <div className={cn(
      "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all duration-500 shadow-sm",
      status === "complete" && "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20",
      status === "rejected" && "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20",
      status === "pending" && "border-border bg-muted text-muted-foreground",
    )}>
      {status === "complete" && <Check className="h-5 w-5 stroke-[3]" />}
      {status === "rejected" && <X className="h-5 w-5 stroke-[3]" />}
      {status === "pending" && <Clock className="h-4 w-4 stroke-[2.5]" />}
    </div>
  );
}

function WorkflowStepper({ stages, currentStage }: { stages: ApprovalStageState[]; currentStage: ApprovalStageKey }) {
  return (
    <div className="flex items-center gap-1.5 py-4 overflow-x-auto no-scrollbar">
      {stages.map((stage, i) => {
        const isCurrent = stage.stage === currentStage && stage.status === "pending";
        return (
          <React.Fragment key={stage.stage}>
            <div className={cn(
              "flex flex-col items-center gap-2 min-w-[84px] rounded-2xl p-3 transition-all duration-300 border",
              isCurrent ? "bg-orange-600/5 border-orange-500 shadow-sm" : "border-transparent",
            )}>
              <StatusDot status={stage.status} />
              <div className="flex flex-col items-center">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  stage.status === "complete" ? "text-emerald-700 dark:text-emerald-400" :
                  stage.status === "rejected" ? "text-red-700 dark:text-red-400" :
                  isCurrent ? "text-orange-700 dark:text-orange-400" : "text-muted-foreground"
                )}>
                  {stageLabels[stage.stage]}
                </span>
                {stage.actor && (
                  <span className="text-[9px] font-bold text-muted-foreground/60 truncate max-w-[80px]">
                    {stage.actor}
                  </span>
                )}
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex-1 min-w-[20px] h-px bg-border relative">
                <div className={cn(
                  "absolute inset-0 transition-all duration-700",
                  stages[i + 1]?.status !== "pending" ? "bg-emerald-500" : "bg-transparent"
                )} />
                <ArrowRight className={cn(
                  "absolute left-1/2 -ml-2 -mt-2 h-4 w-4 transition-colors duration-500",
                  stages[i + 1]?.status !== "pending" ? "text-emerald-500" : "text-border"
                )} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DataPreview({ item }: { item: ApprovalQueueItem }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {[
        { label: "Transaction", value: `OMR ${item.amountOmr.toLocaleString()}`, color: "text-emerald-700 dark:text-emerald-400" },
        { label: "Initiator", value: item.submitter, color: "text-blue-700 dark:text-blue-400" },
        { label: "Timestamp", value: item.submittedAt.replace("T", " ").slice(0, 16), color: "text-indigo-700 dark:text-indigo-400" },
        { label: "Active Phase", value: stageLabels[item.currentStage], color: "text-orange-700 dark:text-orange-400" },
      ].map((d) => (
        <div key={d.label} className="rounded-xl border border-border bg-muted/30 p-3 shadow-inner group hover:bg-muted/50 transition-all">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em]">{d.label}</p>
          <p className={cn("text-xs font-black mt-1 truncate tracking-tight", d.color)}>{d.value}</p>
        </div>
      ))}
    </div>
  );
}

export function EnhancedWorkflowApproval({ initial }: { initial: ApprovalQueueItem[] }) {
  const [items, setItems] = React.useState<ApprovalQueueItem[]>(initial);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [action, setAction] = React.useState<"approve" | "reject">("approve");
  const [activeItem, setActiveItem] = React.useState<ApprovalQueueItem | null>(null);
  const [comment, setComment] = React.useState("");
  const [tab, setTab] = React.useState<ApprovalQueueStatus>("pending");

  const openDialog = (item: ApprovalQueueItem, a: "approve" | "reject") => {
    setActiveItem(item);
    setAction(a);
    setComment("");
    setDialogOpen(true);
  };

  const submitAction = () => {
    if (!activeItem) return;
    const now = new Date().toISOString().slice(0, 19);
    const actor = "Sara Al-Mansoori";

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== activeItem.id) return it;
        if (action === "reject") {
          return {
            ...it,
            status: "rejected" as ApprovalQueueStatus,
            stages: it.stages.map((s) =>
              s.stage === it.currentStage
                ? { ...s, status: "rejected" as const, actor, actedAt: now, comment: comment || "Rejected" }
                : s
            ),
          };
        }
        const idx = STAGE_ORDER.indexOf(it.currentStage);
        const next = STAGE_ORDER[idx + 1];
        const newStages = it.stages.map((s) =>
          s.stage === it.currentStage
            ? { ...s, status: "complete" as const, actor, actedAt: now, comment: comment || undefined }
            : s
        );
        if (!next) return { ...it, status: "approved" as const, stages: newStages };
        return { ...it, currentStage: next, stages: newStages };
      })
    );

    toast.success(action === "approve" ? "Approval recorded — workflow advanced." : "Rejection recorded.");
    setDialogOpen(false);
    setActiveItem(null);
  };

  const filteredItems = items.filter((i) => i.status === tab);

  const tabCounts = {
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  return (
    <>
      <Card className="border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
        <CardHeader className="pb-3 border-b border-border bg-muted/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-black tracking-tight uppercase">Approval Pipeline Management</CardTitle>
              <CardDescription className="text-xs font-medium italic">Monitor and authorize incentive disbursements through multi-stage logical gates</CardDescription>
            </div>
            {/* Flow diagram mini */}
            <div className="hidden xl:flex items-center gap-2">
              {STAGE_ORDER.map((s, i) => (
                <React.Fragment key={s}>
                  <span className="px-3 py-1 rounded-full bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 shadow-sm">
                    <span>{stageIcons[s]}</span>
                    {stageLabels[s]}
                  </span>
                  {i < STAGE_ORDER.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/30" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 bg-muted/30 p-1 rounded-2xl border border-border w-fit shadow-inner">
            {(["pending", "approved", "rejected"] as ApprovalQueueStatus[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                  tab === t
                    ? t === "pending" ? "bg-orange-600 text-white shadow-lg scale-105" :
                      t === "approved" ? "bg-emerald-600 text-white shadow-lg scale-105" :
                      "bg-red-600 text-white shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {t}
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[9px] tabular-nums">{tabCounts[t]}</span>
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-muted/20 px-4 py-16 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Queue Matrix Empty</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border border-border bg-background shadow-sm overflow-hidden transition-all duration-300",
                    expandedId === item.id && "ring-2 ring-orange-500/20 shadow-xl border-orange-500/30"
                  )}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition-all group"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-xl font-mono text-[10px] font-black border transition-all duration-500 shadow-sm",
                        item.status === "approved" && "border-emerald-500/50 text-emerald-600 bg-emerald-500/5 dark:text-emerald-400",
                        item.status === "rejected" && "border-red-500/50 text-red-600 bg-red-500/5 dark:text-red-400",
                        item.status === "pending" && "border-orange-500/50 text-orange-600 bg-orange-500/5 dark:text-orange-400",
                      )}>
                        ID-{item.id.split("-")[1] || item.id}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black tracking-tight truncate group-hover:text-orange-600 transition-colors uppercase flex items-center gap-2">
                          {item.title}
                          {item.status === "pending" && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                          )}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground leading-tight truncate">{item.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 shrink-0">
                      <div className="hidden md:block w-24 h-1 bg-muted rounded-full overflow-hidden relative">
                        <div 
                          className={cn(
                            "absolute inset-y-0 left-0 transition-all duration-1000",
                            item.status === 'approved' ? "bg-emerald-500 w-full" :
                            item.status === 'rejected' ? "bg-red-500 w-full" :
                            item.currentStage === 'ops' ? "bg-orange-500 w-1/4" :
                            item.currentStage === 'sales' ? "bg-orange-500 w-2/4" :
                            item.currentStage === 'finance' ? "bg-orange-500 w-3/4" :
                            "bg-orange-500 w-full"
                          )}
                        />
                      </div>
                      <span className="text-base font-black tabular-nums tracking-tighter text-emerald-700 dark:text-emerald-400">
                        OMR {item.amountOmr.toLocaleString()}
                      </span>
                      <ChevronRight className={cn(
                        "h-5 w-5 text-muted-foreground transition-all duration-300",
                        expandedId === item.id && "rotate-90 text-orange-600 translate-x-1"
                      )} />
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedId === item.id && (
                    <div className="border-t border-border px-6 py-6 animate-in slide-in-from-top-4 fade-in duration-500 bg-muted/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-orange-600/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/20 shadow-sm">
                           Phase {STAGE_ORDER.indexOf(item.currentStage) + 1} / 4
                        </div>
                        <div className="h-px flex-1 bg-border/40" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                           Next: {STAGE_ORDER[STAGE_ORDER.indexOf(item.currentStage) + 1] ? stageLabels[STAGE_ORDER[STAGE_ORDER.indexOf(item.currentStage) + 1]] : 'Finalized'}
                        </div>
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border pb-2">Logical Progression Flow</h4>
                      <WorkflowStepper stages={item.stages} currentStage={item.currentStage} />
                      <DataPreview item={item} />

                      {/* Stage comments */}
                      {item.stages.filter((s) => s.comment).length > 0 && (
                        <div className="space-y-3 mt-4 bg-background rounded-2xl border border-border p-5">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Log — Decrypted Trail</p>
                          <div className="space-y-3">
                            {item.stages.filter((s) => s.comment).map((s) => (
                              <div key={s.stage} className="flex flex-col gap-1 border-l-2 border-border pl-4 py-1">
                                <div className="flex items-center justify-between">
                                  <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    s.status === "complete" ? "text-emerald-600" : "text-red-600"
                                  )}>
                                    {stageLabels[s.stage]} Phase
                                  </span>
                                  {s.actedAt && <span className="text-[9px] font-bold text-muted-foreground/40">{s.actedAt.replace("T", " ").slice(0, 16)}</span>}
                                </div>
                                <span className="text-xs font-bold text-foreground/80">{s.comment}</span>
                                <span className="text-[9px] font-black text-muted-foreground/50 uppercase italic">Logged by {s.actor}</span>
                              </div>
                            ))}
                          </div>
                      </div>
                      )}

                      {item.status === "pending" && (
                        <div className="flex gap-3 mt-4">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest px-6 shadow-lg shadow-emerald-500/20" onClick={() => openDialog(item, "approve")}>
                            ✓ Confirm Approval
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-bold px-6" onClick={() => openDialog(item, "reject")}>
                            ✗ Escalate Rejection
                          </Button>
                        </div>
                      )}

                      {item.status !== "pending" && (
                        <div className={cn(
                          "rounded-xl p-4 flex items-center gap-3 border shadow-sm",
                          item.status === "approved" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700" : "bg-red-500/5 border-red-500/20 text-red-700"
                        )}>
                          {item.status === "approved" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          <p className="text-xs font-black uppercase tracking-widest leading-none">
                            {item.status === "approved" ? "Workflow Finalized — Transaction Authorization Complete" : "Workflow Terminated — Request Denied and Archived"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve Step" : "Reject Request"}</DialogTitle>
            <DialogDescription>{activeItem?.title}. Comments stored in audit trail.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add a comment for the audit trail…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant={action === "reject" ? "destructive" : "default"}
              onClick={submitAction}
            >
              {action === "approve" ? "Confirm Approve" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
