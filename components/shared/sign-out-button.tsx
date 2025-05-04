"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type SignOutButtonProps = {
  children?: React.ReactNode;
};

export function SignOutButton({ children }: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut();
  };
  return (
    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      {children || "Log out"}
    </DropdownMenuItem>
  );
}
