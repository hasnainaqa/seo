import { DashboardSidebar } from "@/components/layouts/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardTopNav } from "@/components/layouts/dashboard/dashboard-top-nav";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect(appConfig.auth.login);
  }
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="container mx-auto">
          <DashboardTopNav />
          <div className="flex flex-1 flex-col gap-4 pt-3 pb-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
