import { NotificationsModule } from "@/components/modules/notifications-module";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/mock-api/client";

export default async function NotificationsPage() {
  const [rules, campaigns] = await Promise.all([
    api.getNotificationRules(),
    api.getNotificationCampaigns(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <PageHeader
        title="Notifications"
        description="Channel routing for operational alerts and campaign-style outreach. Connect SMS, email, and WhatsApp providers in integrations."
      />
      <NotificationsModule
        initialRules={rules}
        initialCampaigns={campaigns}
      />
    </div>
  );
}
