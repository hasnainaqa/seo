"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings, AlertTriangle } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function SettingsNav() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      title: "General",
      href: "/dashboard/account-settings/general",
      icon: <Settings className="size-4" />,
      variant: "ghost",
    },
    {
      title: "Billing",
      href: "/dashboard/account-settings/billing",
      icon: <CreditCard className="size-4" />,
      variant: "ghost",
    },
    {
      title: "Danger Zone",
      href: "/dashboard/account-settings/danger",
      icon: <AlertTriangle className="size-4" />,
      variant: "ghost",
    },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={item.variant}
          className={cn(
            "justify-start",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
