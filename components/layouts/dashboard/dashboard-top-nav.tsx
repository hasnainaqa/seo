import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { TopNavUser } from "@/components/layouts/dashboard/top-nav-user";
import { Separator } from "@/components/ui/separator";
import { CommandMenu } from "@/components/shared/command-manue";

export function DashboardTopNav() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CommandMenu />
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <TopNavUser />
      </div>
    </header>
  );
}

