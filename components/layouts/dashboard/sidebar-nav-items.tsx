"use client";
import { ChevronRight, Badge } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Settings2,
  CreditCard,
  Send,
  type LucideIcon,
  FilePlus,
  LayoutDashboard,
  Tag,
  FolderKanban,
  Layers,
  PenTool,
  Bookmark,
  Save,
  LifeBuoy,
} from "lucide-react";

export interface SecondaryNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  badge?: React.ReactNode;
}

export interface NavGroup {
  title?: string;
  navGroup: NavItem[];
  items?: NavItem[];
}

const mainNavItems: NavGroup[] = [
  {
    title: "Platform",
    navGroup: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Branded Keywords",
        href: "/dashboard/branded-keywords",
        icon: Tag,
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
      {
        title: "Account Settings",
        icon: Settings,
        items: [
          {
            title: "General",
            href: "/dashboard/account-settings/general",
            icon: Settings2,
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

const secondaryNavItems: SecondaryNavItem[] = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

export function SidebarNavItems() {
  return (
    <>
      <MainNav />
      <SecondaryNav />
    </>
  );
}

export function MainNav() {
  return mainNavItems.map(({ title, navGroup }) => (
    <NavGroup title={title} items={navGroup} key={title} />
  ));
}

export function NavGroup({
  title,
  items,
}: {
  items: NavItem[];
  title: string | undefined;
}) {
  const { state } = useSidebar();
  const currentPath = usePathname();

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.href}`;

          if (!item.items)
            return (
              <SidebarMenuLink
                key={key}
                item={item}
                currentPath={currentPath}
              />
            );

          if (state === "collapsed")
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                currentPath={currentPath}
              />
            );

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item}
              currentPath={currentPath}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: React.ReactNode }) => (
  <Badge className="rounded px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(currentPath, item)}
        tooltip={item.title}
      >
        {item.href && (
          <Link href={item.href} onClick={() => setOpenMobile(false)}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(currentPath, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items &&
              item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(currentPath, subItem)}
                  >
                    {subItem.href && (
                      <Link
                        href={subItem.href}
                        onClick={() => setOpenMobile(false)}
                      >
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.title}</span>
                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                      </Link>
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(currentPath, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items &&
            item.items.map((sub) => (
              <DropdownMenuItem key={`${sub.title}-${sub.href}`} asChild>
                {sub.href && (
                  <Link
                    href={sub.href}
                    className={`${checkIsActive(currentPath, sub) ? "bg-secondary" : ""}`}
                  >
                    {sub.icon && <sub.icon />}
                    <span className="max-w-52 text-wrap">{sub.title}</span>
                    {sub.badge && (
                      <span className="ml-auto text-xs">{sub.badge}</span>
                    )}
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(currentPath: string, item: NavItem, mainNav = false) {
  return (
    currentPath === item.href || // /endpint?search=param
    currentPath.split("?")[0] === item.href || // endpoint
    !!item?.items?.filter((i) => i.href === currentPath).length || // if child nav is active
    (mainNav &&
      currentPath.split("/")[1] !== "" &&
      currentPath.split("/")[1] === item?.href?.split("/")[1])
  );
}

export function SecondaryNav() {
  return (
    <div className="mt-auto">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
