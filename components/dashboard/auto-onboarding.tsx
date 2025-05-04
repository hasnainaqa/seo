"use client";

import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/ui/custom/empty-placeholder";
import { LineChart, RefreshCw } from "lucide-react";
import { useState } from "react";
import { autoOnboardUser } from "@/actions/onboarding-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AutoOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnboarding = async () => {
    setIsLoading(true);
    try {
      const result = await autoOnboardUser();
      
      if (result.success) {
        toast.success("Successfully connected to your Google Search Console sites");
        // Refresh the page to show the newly tracked websites
        router.refresh();
      } else {
        toast.error(result.message || "Failed to connect to Google Search Console");
      }
    } catch (error) {
      toast.error("An error occurred during onboarding");
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmptyPlaceholder className="border-none">
      <div className="flex flex-col items-center justify-center text-center p-8 w-full">
        <LineChart className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Welcome to SEO Analytics!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect to your Google Search Console account to track your websites and view performance data.
        </p>
        <Button 
          onClick={handleOnboarding} 
          disabled={isLoading}
          className="mt-4 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Connect to Google Search Console
            </>
          )}
        </Button>
      </div>
    </EmptyPlaceholder>
  );
}
