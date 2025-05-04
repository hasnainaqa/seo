"use client";

import Link from "next/link";
import SupportButton from "@/components/shared/supportButton";
import Icons from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

// A simple error boundary to show a nice error page if something goes wrong (Error Boundary)
// Users can contanct support, go to the main page or try to reset/refresh to fix the error
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center text-center gap-6 p-6">
        <div className="p-6 rounded-xl">
          <Icons.error width={600} height={400} />
        </div>

        <p className="font-medium md:text-xl md:font-semibold">
          Something went wrong 🥲
        </p>
        <p className="text-red-500">{error?.message}</p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={reset} className="gap-2 font-semibold">
            <RefreshCcw className="size-5" />
            Refresh
          </Button>
          <SupportButton />
          <Link
            href="/"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "gap-2 font-semibold"
            )}
          >
            <Icons.home className="size-5" fill="currentColor" />
            Home
          </Link>
        </div>
      </div>
    </>
  );
}
