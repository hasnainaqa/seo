import { SidebarNavItems } from "@/components/layouts/dashboard/sidebar-nav-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarUpgradeCard } from "@/components/layouts/dashboard/sidebar-upgrade-card";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { SafeUser } from "@/types/user-types";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";

export async function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const currentUser: SafeUser | null = await getCurrentUser();
  if (!currentUser) {
    redirect(appConfig.auth.login);
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="Logo"
                  className="rounded-lg"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {appConfig.appName}
                </span>
                <span className="truncate text-xs">{appConfig.appTagline}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavItems />
      </SidebarContent>
      <SidebarFooter className="overflow-hidden">
        {!currentUser?.hasAccess && <SidebarUpgradeCard />}
      </SidebarFooter>
    </Sidebar>
  );
}
