import { DashboardHeader } from "@/components/ui/custom/dashbaord-header";
import { SettingsNav } from "@/components/account-settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Account Settings"
        text="Manage your account preferences and settings."
      />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="w-48">
          <SettingsNav />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
