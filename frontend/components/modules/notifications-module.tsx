"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, MessageCircle, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type {
  NotificationAlertRule,
  NotificationCampaignDraft,
  NotificationChannelId,
} from "@/lib/mock-api/types";

const channelMeta: Record<
  NotificationChannelId,
  { label: string; icon: typeof Mail }
> = {
  email: { label: "Email", icon: Mail },
  sms: { label: "SMS", icon: Smartphone },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
};

export function NotificationsModule({
  initialRules,
  initialCampaigns,
}: {
  initialRules: NotificationAlertRule[];
  initialCampaigns: NotificationCampaignDraft[];
}) {
  const [rules, setRules] = React.useState(initialRules);
  const [campaigns] = React.useState(initialCampaigns);
  const [campaignName, setCampaignName] = React.useState("");
  const [campaignBody, setCampaignBody] = React.useState("");
  const [campaignChannel, setCampaignChannel] =
    React.useState<NotificationChannelId>("email");

  const toggleRuleChannel = (
    ruleId: string,
    ch: NotificationChannelId,
    on: boolean
  ) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const channels = on
          ? Array.from(new Set([...r.channels, ch]))
          : r.channels.filter((c) => c !== ch);
        return { ...r, channels };
      })
    );
  };

  const toggleRuleEnabled = (ruleId: string, enabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r))
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-base">Alert triggers</CardTitle>
          <CardDescription className="text-xs">
            Route system events to channels. Backend will enforce provider
            credentials and throttling.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Rule</TableHead>
                <TableHead className="text-xs">Trigger</TableHead>
                <TableHead className="text-xs text-center">On</TableHead>
                <TableHead className="text-xs">Channels</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[140px] text-xs font-medium">
                    {r.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.trigger}
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={r.enabled}
                      onCheckedChange={(v) =>
                        toggleRuleEnabled(r.id, v === true)
                      }
                      aria-label={`Enable ${r.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(channelMeta) as NotificationChannelId[]).map(
                        (ch) => {
                          const M = channelMeta[ch].icon;
                          const on = r.channels.includes(ch);
                          return (
                            <label
                              key={ch}
                              className="flex cursor-pointer items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-[10px]"
                            >
                              <Checkbox
                                checked={on}
                                onCheckedChange={(v) =>
                                  toggleRuleChannel(r.id, ch, v === true)
                                }
                              />
                              <M className="h-3 w-3 opacity-70" />
                              {channelMeta[ch].label}
                            </label>
                          );
                        }
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle className="text-base">Campaign builder</CardTitle>
            <CardDescription className="text-xs">
              Compose one-off or scheduled outreach to producer cohorts (mock).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Campaign name</Label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q2 target nudge"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Primary channel</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                value={campaignChannel}
                onChange={(e) =>
                  setCampaignChannel(e.target.value as NotificationChannelId)
                }
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Message body</Label>
              <Textarea
                value={campaignBody}
                onChange={(e) => setCampaignBody(e.target.value)}
                placeholder="Merge fields: {{name}}, {{target_pct}}, …"
                className="min-h-[120px] text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  toast.success("Draft saved (mock).");
                }}
              >
                Save draft
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toast.success("Campaign queued for approval (mock).");
                  setCampaignName("");
                  setCampaignBody("");
                }}
              >
                Submit for send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-muted-foreground">{c.audience}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal capitalize">
                    {c.channel}
                  </Badge>
                  <Badge
                    variant={
                      c.status === "sent"
                        ? "success"
                        : c.status === "scheduled"
                          ? "secondary"
                          : "warning"
                    }
                    className="capitalize font-normal"
                  >
                    {c.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
