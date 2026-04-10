import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "Incentive plan builder",
    body: "Slabs, tiers, multipliers, and seasonal overlays. Persist as versioned plans per team/role.",
  },
  {
    title: "KPI configuration",
    body: "Weighting matrix and data bindings for each KPI dimension used in scoring.",
  },
  {
    title: "Approvals",
    body: "Gate payouts with manager and finance checkpoints before release to payroll.",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Administration"
        description="Control plane for plans, users, and workflows. Forms will map to NestJS admin modules."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.title} className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">
                UI shell only — connect CRUD to `/api/admin/*`.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
