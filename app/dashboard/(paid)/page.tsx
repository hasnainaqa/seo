import { DashboardHeader } from "@/components/ui/custom/dashbaord-header";
import { EmptyPlaceholder } from "@/components/ui/custom/empty-placeholder";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo/metadata";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { format, subDays } from "date-fns";
import { SitePerformanceCard } from "@/components/dashboard/site-performance-card";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { SitePerformanceSkeleton } from "@/components/dashboard/site-performance-skeleton";
import { ExternalLink, LineChart, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import { syncUserGSCData, hasGSCData } from "@/actions/sync-actions";
import { toast } from "sonner";
import { AutoOnboarding } from "@/components/dashboard/auto-onboarding";
import { hasCompletedOnboarding } from "@/actions/onboarding-actions";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "View your website performance metrics from Google Search Console",
});

// Default date range (28 days)
const DEFAULT_DAYS = 28;

interface SearchParams {
  start?: string;
  end?: string;
  [key: string]: string | string[] | undefined;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Get the current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.hasAccess) {
    redirect("/dashboard/account-settings/billing");
  }

  // Parse date range from search params
  let startDate: Date;
  let endDate: Date = new Date();
  endDate.setHours(0, 0, 0, 0); // Set to start of day

  // Parse start and end dates from search params if they exist
  if (searchParams.start && searchParams.end) {
    try {
      const parsedStartDate = new Date(searchParams.start as string);
      const parsedEndDate = new Date(searchParams.end as string);
      
      // Validate that the dates are valid
      if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
        startDate = parsedStartDate;
        endDate = parsedEndDate;
      } else {
        // Default to 28 days if dates are invalid
        startDate = subDays(endDate, DEFAULT_DAYS);
      }
    } catch (error) {
      console.error("Error parsing date range:", error);
      // Default to 28 days if there's an error
      startDate = subDays(endDate, DEFAULT_DAYS);
    }
  } else {
    // Default to 28 days if no range is specified
    startDate = subDays(endDate, DEFAULT_DAYS);
  }
  
  // Format dates for display and database query
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <DashboardHeader heading="Dashboard" />
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          baseUrl="/dashboard"
        />
      </div>

      <Suspense fallback={<LoadingState />}>
        <WebsitePerformanceData 
          userId={user.id} 
          startDate={startDate} 
          endDate={endDate}
          formattedStartDate={formattedStartDate}
          formattedEndDate={formattedEndDate}
        />
      </Suspense>
    </>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <SitePerformanceSkeleton key={i} />
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <EmptyPlaceholder className="border-none">
      <div className="flex flex-col items-center justify-center text-center p-8 w-full">
        <ExternalLink className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No websites tracked</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't connected any websites from Google Search Console yet.
        </p>
        <Button 
          asChild
          className="mt-4"
        >
          <a href="/dashboard/sites">Connect Websites</a>
        </Button>
      </div>
    </EmptyPlaceholder>
  );
}

// No data state component
function NoDataState({ dateRange }: { dateRange: { startDate: string; endDate: string } }) {
  return (
    <EmptyPlaceholder className="border-none">
      <div className="flex flex-col items-center justify-center text-center p-8 w-full">
        <LineChart className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No data available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There is no performance data available for the selected date range ({dateRange.startDate} to {dateRange.endDate}).
        </p>
        <form action={async () => {
          try {
            const result = await syncUserGSCData();
            if (result.success) {
              toast.success("Data sync initiated. This may take a few moments.");
            } else {
              toast.error(result.message || "Failed to sync data");
            }
          } catch (error) {
            toast.error("An error occurred while syncing data");
          }
        }}>
          <Button type="submit" className="mt-4 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync GSC Data Now
          </Button>
        </form>
      </div>
    </EmptyPlaceholder>
  );
}

// Website performance data component
async function WebsitePerformanceData({ 
  userId, 
  startDate, 
  endDate,
  formattedStartDate,
  formattedEndDate
}: { 
  userId: string; 
  startDate: Date; 
  endDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;
}) {
  // Check if the user has completed onboarding
  const hasOnboarded = await hasCompletedOnboarding();
  
  // If user hasn't completed onboarding, show the auto-onboarding component
  if (!hasOnboarded) {
    return <AutoOnboarding />;
  }

  // Check if we have any data for this date range
  const hasData = await hasGSCData(userId, startDate, endDate);
  
  // If no data, try to sync if it's a recent date range (last 30 days)
  if (!hasData) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // If the date range is within the last 30 days, trigger a sync
    if (startDate >= thirtyDaysAgo) {
      // We'll trigger the sync only if we're looking at recent data
      try {
        await syncUserGSCData();
      } catch (error) {
        console.error("Error auto-syncing GSC data:", error);
      }
    }
  }

  // Fetch tracked websites for the user
  const websites = await prisma.website.findMany({
    where: {
      userId: userId,
      tracked: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (websites.length === 0) {
    return <EmptyState />;
  }

  // Fetch performance data for each website
  const websitesWithData = await Promise.all(
    websites.map(async (website) => {
      const performanceData = await prisma.dailyPerformanceData.findMany({
        where: {
          websiteId: website.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      return {
        ...website,
        performanceData,
      };
    })
  );

  // Check if there's any data for the selected date range
  const hasPerformanceData = websitesWithData.some(website => website.performanceData.length > 0);

  if (!hasPerformanceData) {
    return <NoDataState dateRange={{ startDate: formattedStartDate, endDate: formattedEndDate }} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {websitesWithData.map((website) => (
          <SitePerformanceCard
            key={website.id}
            website={website}
            performanceData={website.performanceData}
            dateRange={{
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            }}
          />
        ))}
      </div>
    </div>
  );
}
