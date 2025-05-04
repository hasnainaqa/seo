import { prisma } from "@/lib/db";
import { getDailySiteData, getValidAccessToken } from "@/lib/gsc-api";

// Define the interface for the daily data
interface DailyData {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Default lookback period if no data exists
const DEFAULT_LOOKBACK_DAYS = 30;


function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}


function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}


async function getDateRange(websiteId: string) {
  // Get the latest data point for this website
  const latestData = await prisma.dailyPerformanceData.findFirst({
    where: {
      websiteId,
    },
    orderBy: {
      date: "desc",
    },
  });
  
  // Calculate yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  let startDate;
  
  if (latestData) {
    const latestDate = new Date(latestData.date);
    latestDate.setDate(latestDate.getDate() + 1);
    startDate = latestDate;
  } else {
    startDate = subDays(yesterday, DEFAULT_LOOKBACK_DAYS);
  }
  
  // Format dates as YYYY-MM-DD
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(yesterday),
  };
}


export async function syncGSCData(userId?: string) {
  console.log(userId 
    ? `[SYNC] Starting GSC data sync for user ${userId}` 
    : "[CRON] Starting GSC data sync job"
  );
  
  try {
    // Fetch tracked websites
    const whereClause: any = { tracked: true };
    
    // If userId is provided, only sync for that user's websites
    if (userId) {
      whereClause.userId = userId;
    }
    
    const websites = await prisma.website.findMany({
      where: whereClause,
      include: {
        user: true,
      },
    });
    
    if (websites.length === 0) {
      console.log(userId 
        ? `[SYNC] No tracked websites found for user ${userId}` 
        : "[CRON] No tracked websites found"
      );
      return;
    }
    
    console.log(`[SYNC] Found ${websites.length} tracked websites to sync`);
    
    // Process each website
    const results = await Promise.allSettled(
      websites.map(async (website) => {
        try {
          // Get the date range for this website
          const { startDate, endDate } = await getDateRange(website.id);
          
          // Skip if the start date is after the end date (no new data to fetch)
          if (new Date(startDate) > new Date(endDate)) {
            return {
              siteUrl: website.siteUrl,
              status: "skipped",
              message: "No new data to fetch",
            };
          }
          
          console.log(`[SYNC] Fetching data for ${website.siteUrl} from ${startDate} to ${endDate}`);
          
          // Get a valid access token for the user
          const accessToken = await getValidAccessToken(website.userId);
          
          // Fetch the GSC data
          const dailyData: DailyData[] = await getDailySiteData(
            website.siteUrl,
            startDate,
            endDate,
            accessToken
          );
          
          if (dailyData.length === 0) {
            return {
              siteUrl: website.siteUrl,
              status: "success",
              message: "No new data available",
            };
          }
          
          // Prepare the data for insertion
          const dataToInsert = dailyData.map((day: DailyData) => ({
            websiteId: website.id,
            date: new Date(day.date),
            clicks: day.clicks,
            impressions: day.impressions,
            ctr: day.ctr,
            position: day.position,
          }));
          
          // Insert the data into the database
          // Instead of using skipDuplicates, we'll handle duplicates manually
          // by creating records one by one and catching unique constraint errors
          let insertedCount = 0;
          for (const item of dataToInsert) {
            try {
              await prisma.dailyPerformanceData.create({
                data: item,
              });
              insertedCount++;
            } catch (err) {
              // Ignore unique constraint errors (duplicates)
              if (!(err instanceof Error && err.message.includes("Unique constraint"))) {
                throw err;
              }
            }
          }
          
          console.log(`[SYNC] Inserted ${insertedCount} new data points for ${website.siteUrl}`);
          
          return {
            siteUrl: website.siteUrl,
            status: "success",
            message: `Inserted ${insertedCount} new data points`,
          };
        } catch (error) {
          console.error(`[SYNC] Error processing website ${website.siteUrl}:`, error);
          return {
            siteUrl: website.siteUrl,
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );
    
    // Count successes and errors
    const stats = {
      total: results.length,
      success: results.filter((r) => r.status === "fulfilled" && (r.value as any).status === "success").length,
      error: results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && (r.value as any).status === "error")).length,
      skipped: results.filter((r) => r.status === "fulfilled" && (r.value as any).status === "skipped").length,
    };
    
    console.log(`[SYNC] GSC data sync completed: ${JSON.stringify(stats)}`);
    return stats;
  } catch (error) {
    console.error("[SYNC] Error in GSC sync job:", error);
    throw error;
  }
}