"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Clock, ChevronRight, ArrowRight, User, Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  ApprovalQueueItem,
  ApprovalQueueStatus,
  ApprovalStageKey,
  ApprovalStageState,
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
      "flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all shadow-sm",
      status === "complete" && "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      status === "rejected" && "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400",
      status === "pending" && "border-border bg-muted/50 text-muted-foreground",
    )}>
      {status === "complete" && <Check className="h-4 w-4 stroke-[3]" />}
      {status === "rejected" && <X className="h-4 w-4 stroke-[3]" />}
      {status === "pending" && <Clock className="h-4 w-4 stroke-[2]" />}
    </div>
  );
}

export function WorkflowModule({ initial }: { initial: ApprovalQueueItem[] }) {
  const [items, setItems] = React.useState<ApprovalQueueItem[]>(initial);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [action, setAction] = React.useState<"approve" | "reject">("approve");
  const [activeItem, setActiveItem] = React.useState<ApprovalQueueItem | null>(null);
  const [comment, setComment] = React.useState("");
  const [filterTab, setFilterTab] = React.useState<ApprovalQueueStatus>("pending");

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

    toast.success(action === "approve" ? "Approval recorded." : "Rejection recorded.");
    setDialogOpen(false);
    setActiveItem(null);
  };

  const filteredItems = items.filter((i) => i.status === filterTab);

  return (
    <div className="space-y-6">
      <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)} className="w-full">
        <TabsList className="bg-muted/50 p-1 border border-border rounded-xl">
          <TabsTrigger value="pending" className="rounded-lg px-6 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Pending Approval
            <Badge variant="secondary" className="ml-2 bg-background/20 text-inherit">{items.filter(i => i.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg px-6 data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterTab} className="mt-6 space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="border-dashed py-20 text-center bg-muted/10">
              <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">No batches found in {filterTab} queue</p>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={cn(
                  "border-border overflow-hidden transition-all duration-300",
                  expandedId === item.id ? "ring-2 ring-orange-500/20 shadow-lg border-orange-500/40" : "shadow-sm hover:shadow-md"
                )}
              >
                <div 
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-all"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-xl font-black text-xs shadow-inner border transition-all duration-500",
                      item.status === 'approved' ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-600" :
                      item.status === 'rejected' ? "bg-red-600/10 border-red-500/30 text-red-600" :
                      "bg-orange-600/10 border-orange-500/30 text-orange-600"
                    )}>
                      {item.id.slice(-3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                        {item.title}
                        {item.status === 'pending' && (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                        )}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                          <User className="h-3 w-3" /> {item.submitter}
                        </span>
                        <div className="h-3 w-px bg-border" />
                        <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {item.submittedAt.split('T')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block w-32 h-1 bg-muted rounded-full overflow-hidden relative">
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
                    <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest leading-none mb-1">Incentive Amt</p>
                      <p className="text-lg font-black tracking-tighter text-emerald-600">OMR {item.amountOmr.toLocaleString()}</p>
                    </div>
                    <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", expandedId === item.id && "rotate-90 text-orange-600")} />
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="px-5 pb-6 border-t border-border bg-muted/5 animate-in slide-in-from-top-2 duration-300">
                    <div className="py-4 border-b border-border/50 mb-4 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="px-2 py-0.5 rounded bg-orange-600/10 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                             Protocol Phase {STAGE_ORDER.indexOf(item.currentStage) + 1} of 4
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                             {item.currentStage === 'ops' ? 'Initialization' : stageLabels[STAGE_ORDER[STAGE_ORDER.indexOf(item.currentStage) - 1]]}
                             <ArrowRight className="h-3 w-3" />
                             <span className="text-foreground">{stageLabels[item.currentStage]}</span>
                          </span>
                       </div>
                       <div className="text-[10px] font-bold text-muted-foreground/60 italic">
                          Last activity: {item.stages.find(s => s.status === 'complete' || s.status === 'rejected')?.actedAt?.split('T')[1].slice(0, 5) || 'Just now'}
                       </div>
                    </div>
                    <div className="py-6 overflow-x-auto no-scrollbar">
                      <div className="flex items-center min-w-[600px] px-4">
                        {STAGE_ORDER.map((s, i) => {
                          const stage = item.stages.find(st => st.stage === s)!;
                          const isCurrent = item.currentStage === s && item.status === 'pending';
                          return (
                            <React.Fragment key={s}>
                              <div className="flex flex-col items-center gap-2 group relative">
                                <StatusDot status={stage.status} />
                                <div className="flex flex-col items-center">
                                  <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    stage.status === 'complete' ? "text-emerald-600" : 
                                    stage.status === 'rejected' ? "text-red-600" :
                                    isCurrent ? "text-orange-600" : "text-muted-foreground/40"
                                  )}>
                                    {stageLabels[s]}
                                  </span>
                                  {stage.actor && <span className="text-[8px] font-bold text-muted-foreground/50">{stage.actor}</span>}
                                </div>
                              </div>
                              {i < STAGE_ORDER.length - 1 && (
                                <div className="flex-1 h-0.5 bg-border mx-4 relative">
                                  <div className={cn(
                                    "absolute inset-0 transition-all duration-500",
                                    item.stages[i+1]?.status !== 'pending' ? "bg-emerald-500" : "bg-transparent"
                                  )} />
                                  <ArrowRight className={cn(
                                    "absolute left-1/2 -ml-2 -mt-2 h-4 w-4 bg-muted/5",
                                    item.stages[i+1]?.status !== 'pending' ? "text-emerald-500" : "text-border"
                                  )} />
                                </div>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Batch Detail Summary</h4>
                          <div className="rounded-xl bg-background border border-border p-4 shadow-inner">
                             <p className="text-xs font-bold text-foreground/80 leading-relaxed italic">"{item.detail}"</p>
                          </div>
                          {item.status === 'pending' && (
                             <div className="flex gap-3 pt-2">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest px-8 shadow-lg shadow-emerald-500/20" onClick={() => openDialog(item, 'approve')}>Approve Stage</Button>
                                <Button variant="outline" className="border-red-500/20 text-red-600 font-bold text-[10px] hover:bg-red-500/10" onClick={() => openDialog(item, 'reject')}>Reject</Button>
                             </div>
                          )}
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Audit Progression Log</h4>
                          <div className="space-y-3">
                            {item.stages.filter(s => s.status !== 'pending' || s.comment).map(s => (
                              <div key={s.stage} className="flex gap-3 border-l-2 border-orange-500/20 pl-4 py-1">
                                <span className="text-lg shrink-0">{stageIcons[s.stage]}</span>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-foreground uppercase">{stageLabels[s.stage]} Gate</span>
                                    <Badge variant={s.status === 'complete' ? 'success' : 'destructive'} className="text-[8px] py-0 px-1.5 uppercase font-black">{s.status}</Badge>
                                  </div>
                                  <p className="text-xs font-bold text-muted-foreground leading-tight">{s.comment || 'System validated & moved to next gate.'}</p>
                                  <p className="text-[9px] font-black text-muted-foreground/40 uppercase">Logged By {s.actor || 'System'} · {s.actedAt?.replace('T', ' ') || 'Pending'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">{action === "approve" ? "Confirm Approval Step" : "Confirm Rejection"}</DialogTitle>
            <DialogDescription className="text-xs font-medium">This action will be logged in the immutable audit trail for {activeItem?.id}.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add mandatory audit comment or context…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] bg-muted/30 border-border font-medium text-xs focus:ring-orange-500/20"
          />
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="font-bold text-xs" onClick={() => setDialogOpen(false)}>Abort</Button>
            <Button
              variant={action === "reject" ? "destructive" : "default"}
              className="font-black text-[10px] uppercase tracking-widest px-8 shadow-xl"
              onClick={submitAction}
            >
              {action === "approve" ? "Commit Approval" : "Commit Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
