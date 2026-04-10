"use client";

import * as React from "react";
import { toast } from "sonner";

import { ApprovalPipeline } from "@/components/modules/approval-pipeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/lib/mock-api/types";

function stageLabel(k: ApprovalStageKey) {
  return k === "sales" ? "Sales" : k === "ops" ? "Operations" : "Finance";
}

export function WorkflowModule({ initial }: { initial: ApprovalQueueItem[] }) {
  const [items, setItems] = React.useState<ApprovalQueueItem[]>(initial);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [action, setAction] = React.useState<"approve" | "reject">("approve");
  const [activeItem, setActiveItem] = React.useState<ApprovalQueueItem | null>(
    null
  );
  const [comment, setComment] = React.useState("");

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
                ? {
                    ...s,
                    status: "rejected" as const,
                    actor,
                    actedAt: now,
                    comment: comment || "Rejected",
                  }
                : s
            ),
          };
        }
        /* approve */
        const order: ApprovalStageKey[] = ["sales", "ops", "finance"];
        const idx = order.indexOf(it.currentStage);
        const next = order[idx + 1];
        const newStages = it.stages.map((s) =>
          s.stage === it.currentStage
            ? {
                ...s,
                status: "complete" as const,
                actor,
                actedAt: now,
                comment: comment || undefined,
              }
            : s
        );
        if (!next) {
          return { ...it, status: "approved" as const, stages: newStages };
        }
        return {
          ...it,
          currentStage: next,
          stages: newStages.map((s) =>
            s.stage === next && s.status === "pending"
              ? { ...s, status: "pending" as const }
              : s
          ),
        };
      })
    );

    toast.success(
      action === "approve"
        ? "Approval recorded — workflow advanced."
        : "Rejection recorded."
    );
    setDialogOpen(false);
    setActiveItem(null);
  };

  const filter = (status: ApprovalQueueStatus) =>
    items.filter((i) => i.status === status);

  const renderList = (list: ApprovalQueueItem[]) => (
    <div className="grid gap-3">
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center text-sm text-muted-foreground">
          No items in this queue.
        </p>
      ) : (
        list.map((item) => (
          <Card
            key={item.id}
            className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <CardHeader className="space-y-2 pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-sm font-semibold leading-snug">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                  {item.id}
                </Badge>
              </div>
              <ApprovalPipeline stages={item.stages} />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">Amount</span>{" "}
                  OMR {item.amountOmr.toLocaleString()}
                </span>
                <span>
                  <span className="font-medium text-foreground">Submitted</span>{" "}
                  {item.submitter} · {item.submittedAt.replace("T", " ")}
                </span>
                {item.status === "pending" ? (
                  <span>
                    <span className="font-medium text-foreground">With</span>{" "}
                    {stageLabel(item.currentStage)}
                  </span>
                ) : null}
              </div>
              {item.status === "pending" ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => openDialog(item, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => openDialog(item, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  {item.status === "approved"
                    ? "Fully approved — finance may settle."
                    : "Rejected — submitter notified (mock)."}
                </p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending{" "}
            <span className="ml-1 rounded-md bg-background/80 px-1.5 py-0 text-[10px]">
              {filter("pending").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderList(filter("pending"))}</TabsContent>
        <TabsContent value="approved">
          {renderList(filter("approved"))}
        </TabsContent>
        <TabsContent value="rejected">
          {renderList(filter("rejected"))}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve step" : "Reject request"}
            </DialogTitle>
            <DialogDescription>
              {activeItem?.title}. Comments are stored in the audit trail (mock).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add a comment for the audit trail…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={action === "reject" ? "destructive" : "default"}
              onClick={submitAction}
            >
              {action === "approve" ? "Confirm approve" : "Confirm reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
