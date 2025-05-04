
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { getCurrentUser } from "@/lib/session";
import { SafeUser } from "@/types/user-types";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";
import Link from "next/link";
import { Home, SquareTerminal, Sparkles } from "lucide-react";

export const TopMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/dashboard/account-settings/general",
    icon: SquareTerminal,
  },
];

export async function TopNavUser() {
  const currentUser: SafeUser | null = await getCurrentUser();
  if (!currentUser) {
    redirect(appConfig.auth.login);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded">
          {currentUser && (
            <>
              {currentUser.image && currentUser.name && (
                <AvatarImage
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="rounded-full"
                />
              )}
              <AvatarFallback className="rounded">
                {currentUser?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {currentUser && (
                <>
                  {currentUser.image && currentUser.name && (
                    <AvatarImage
                      src={currentUser.image}
                      alt={currentUser.name}
                    />
                  )}
                  <AvatarFallback className="rounded-full">
                    {currentUser?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{currentUser.name}</span>
              <span className="truncate text-xs">{currentUser.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {currentUser?.hasAccess && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={appConfig.lemonsqueezy.billingRoute}>
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {TopMenu.map((item) => (
            <Link href={item.url}>
              <DropdownMenuItem key={item.title} className="cursor-pointer">
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
