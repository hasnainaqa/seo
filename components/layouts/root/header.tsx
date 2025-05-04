import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { ModeToggle } from "@/components/shared/mode-toggle";
import Logo from "@/components/ui/custom/logo";
import { appConfig } from "@/lib/app-config";

const TopMenu = [
  
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Contact", href: "/#contact" },

];

export default function Header() {
  return (
    <header className="w-full py-4 transition-all duration-300 z-50 bg-background/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
          </div>
          <div className="items-center flex gap-6">
            <div className="flex items-center">
              {TopMenu.map((menu, idx) =>
                  (
                  <Link
                    key={idx}
                    className={cn(
                      "text-muted-foreground",
                      navigationMenuTriggerStyle,
                      buttonVariants({ variant: "ghost" })
                    )}
                    href={menu.href}
                  >
                    {menu.name}
                  </Link>
                )
              )}
            </div>
            <ModeToggle />
            <div className="flex gap-2">
              <Link
                href={appConfig.auth.login}
                className={buttonVariants({ variant: "ghost" })}
              >
                Log in
              </Link>
              <Link
                href={appConfig.auth.signUp}
                className={buttonVariants({ variant: "default" })}
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      href={appConfig.auth.login}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Log in
                    </Link>
                    <Link
                      href={appConfig.auth.signUp}
                      className={buttonVariants({ variant: "default" })}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
