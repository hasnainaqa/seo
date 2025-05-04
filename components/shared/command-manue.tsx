"use client";
import React from "react";
import { 
  Laptop, 
  Moon, 
  Sun, 
  Search,
  LayoutDashboard,
  Tag,
  FolderKanban,
  Layers,
  PenTool,
  Bookmark,
  FilePlus,
  Save,
  Settings,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Navigation items matching the sidebar
interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<any>;
  items?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationItems: NavGroup[] = [
  {
    title: "Platform",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Topic Clusters",
        href: "/dashboard/topic-clusters",
        icon: FolderKanban,
      },
      {
        title: "Generate Topics",
        href: "/dashboard/content/topics",
        icon: PenTool,
      },
      {
        title: "Saved Topics",
        href: "/dashboard/content/saved-topics",
        icon: Bookmark,
      },
      {
        title: "Generate Posts",
        href: "/dashboard/content/posts",
        icon: FilePlus,
      },
      {
        title: "Saved Posts",
        href: "/dashboard/content/saved-posts",
        icon: Save,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Account Settings",
        items: [
          {
            title: "General",
            href: "/dashboard/account-settings/general",
            icon: Settings,
          },
          {
            title: "Billing",
            href: "/dashboard/account-settings/billing",
            icon: CreditCard,
          },
        ],
      },
    ],
  },
];

export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64"
        onClick={() => setOpen(true)}
      >
        <Search
          aria-hidden="true"
          className="absolute left-1.5 top-1/2 -translate-y-1/2"
        />
        <span className="ml-3">Search</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog modal open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <ScrollArea type="hover" className="h-80 pr-1">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {/* Navigation Items */}
            {navigationItems.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((navItem) => {
                  if (navItem.href) {
                    const Icon = navItem.icon || ChevronRight;
                    return (
                      <CommandItem
                        key={navItem.href}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.href as string));
                        }}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {navItem.title}
                      </CommandItem>
                    );
                  }

                  if (navItem.items) {
                    return navItem.items.map((subItem) => {
                      const Icon = subItem.icon || ChevronRight;
                      return (
                        <CommandItem
                          key={subItem.href}
                          value={subItem.title}
                          onSelect={() => {
                            runCommand(() => router.push(subItem.href as string));
                          }}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {subItem.title}
                        </CommandItem>
                      );
                    });
                  }
                  
                  return null;
                })}
              </CommandGroup>
            ))}

            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                <Sun className="mr-2 h-4 w-4" /> <span>Light</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme("system"))}
              >
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </CommandItem>
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
}
