"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { syncGSCData } from "@/cron/sync-gsc-data";
import { revalidatePath } from "next/cache";

/**
 * Syncs GSC data for a specific user's websites
 * This is used when a user first signs up or has no data
 */
export async function syncUserGSCData() {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Find tracked websites for this user
    const websites = await prisma.website.findMany({
      where: {
        userId: user.id,
        tracked: true,
      },
    });

    if (websites.length === 0) {
      return {
        success: false,
        message: "No tracked websites found",
      };
    }

    // Run the sync job for this specific user
    await syncGSCData(user.id);

    // Revalidate the dashboard page to show the new data
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "GSC data sync initiated",
    };
  } catch (error) {
    console.error("Error syncing GSC data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks if a user has any GSC data for the given date range
 * @param userId User ID
 * @param startDate Start date
 * @param endDate End date
 * @returns Boolean indicating if data exists
 */
export async function hasGSCData(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  try {
    // Find websites for this user
    const websites = await prisma.website.findMany({
      where: {
        userId,
        tracked: true,
      },
      select: {
        id: true,
      },
    });

    if (websites.length === 0) {
      return false;
    }

    // Check if there's any performance data for these websites in the date range
    const websiteIds = websites.map((website) => website.id);
    const dataCount = await prisma.dailyPerformanceData.count({
      where: {
        websiteId: {
          in: websiteIds,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return dataCount > 0;
  } catch (error) {
    console.error("Error checking for GSC data:", error);
    return false;
  }
}
