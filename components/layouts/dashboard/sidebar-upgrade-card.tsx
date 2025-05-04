"use client";
import { useState, useEffect } from "react";
import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarUpgradeCard() {
  const [show, setShow] = useState(false);
  const { state } = useSidebar();

  useEffect(() => {
    if (state) {
      setTimeout(() => {
        setShow(state === "expanded" ? true : false);
      }, 100);
    }
  }, [state]);

  return (
    show && (
      <Card className="rounded-lg bg-muted/50 p-4 shadow-none border-1">
        <CardHeader className="px-0">
          <CardTitle className="flex gap-4">
            <Crown size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">On Trial</span>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Unlock all features and get unlimited access to our support team.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 px-0">
          <Button size="sm" className="w-full">
            Upgrade
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Button>
        </CardContent>
      </Card>
    )
  );
}
