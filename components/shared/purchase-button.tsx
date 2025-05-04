"use client";
 
import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction } from "@/actions/payment-actions";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";
 
export function PurchaseButton({
  variantId,
  className = "",
}: {
  variantId: string;
  className?: string;
}) {
  let [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
 
  const handlePurchaseClick = () => {
    if (!session) {
      redirect(appConfig.auth.login);
    }
 
    // Handle the checkout process
    startTransition(async () => {
      const result = await createCheckoutSessionAction(variantId);
      if (result.status === "success" && result.url) {
        // Redirect to the LemonSqueezy checkout page
        window.location.href = result.url;
      } else {
        // Handle error (could show a toast notification here)
        console.log("Failed to create checkout session");
      }
    });
  };
 
  return (
    <Button
      className={cn("w-full px-12 py-6 font-bold text-base", className)}
      disabled={isPending}
      onClick={handlePurchaseClick}
    >
      {isPending && <Loader2 className="mr-2 animate-spin" />}
      Purchase Now
    </Button>
  );
}