"use client";

import { Button } from "@/components/ui/button";
import { createCustomerPortalAction } from "@/actions/payment-actions";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerPortalButton({
  className = "",
}: {
  className?: string;
}) {
  let [isPending, startTransition] = useTransition();

  const handlePortalClick = () => {
    // Handle the customer portal process
    startTransition(async () => {
      const result = await createCustomerPortalAction();
      if (result.status === "success" && result.url) {
        // Redirect to the LemonSqueezy customer portal
        window.location.href = result.url;
      } else {
        // Handle error (could show a toast notification here)
        console.log("Failed to create customer portal session");
      }
    });
  };

  return (
    <Button
      className={cn("px-4 py-2", className)}
      disabled={isPending}
      onClick={handlePortalClick}
    >
      {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
      Manage Subscription
    </Button>
  );
}
