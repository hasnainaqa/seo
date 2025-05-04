import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { format, subDays } from "date-fns";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { DashboardHeader } from "@/components/ui/custom/dashbaord-header";
import { WebsitePerformanceCharts } from "@/components/dashboard/website-performance-charts";
import { DimensionCharts } from "@/components/dashboard/dimension-charts";
import { DimensionTables } from "@/components/dashboard/dimension-tables";
import { constructMetadata } from "@/lib/seo/metadata";

// Default date range (28 days)
const DEFAULT_DAYS = 28;

interface SearchParams {
  start?: string;
  end?: string;
  [key: string]: string | string[] | undefined;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const website = await prisma.website.findUnique({
    where: { id: params.id },
  });

  return constructMetadata({
    title: website ? `${website.siteUrl} - Dashboard` : "Website Dashboard",
    description: "View detailed performance metrics for your website",
  });
}

export default async function WebsiteDashboardPage({
  params,
  searchParams,
}: {
  params: { id: string };
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

  // Get the website
  const website = await prisma.website.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  if (!website) {
    notFound();
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
      if (
        !isNaN(parsedStartDate.getTime()) &&
        !isNaN(parsedEndDate.getTime())
      ) {
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

  // Fetch performance data for the website
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <DashboardHeader heading={website.siteUrl} />
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          baseUrl={`/dashboard/website/${website.id}`}
        />
      </div>

      {/* Performance Charts */}
      <WebsitePerformanceCharts
        performanceData={performanceData}
        dateRange={{
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }}
      />

      {/* Dimension Charts */}
      <DimensionCharts
        siteUrl={website.siteUrl}
        startDate={formattedStartDate}
        endDate={formattedEndDate}
      />

      {/* Dimension Tables */}
      <div className="mt-8">
        <DimensionTables
          siteUrl={website.siteUrl}
          startDate={formattedStartDate}
          endDate={formattedEndDate}
        />
      </div>
    </div>
  );
}
