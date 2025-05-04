"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { fetchUserSites } from "@/actions/gsc-actions";
import { syncUserGSCData } from "@/actions/sync-actions";
import { revalidatePath } from "next/cache";

/**
 * Checks if a user has completed onboarding (has tracked websites)
 * @returns Boolean indicating if the user has tracked websites
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    // Check if the user has any tracked websites
    const websiteCount = await prisma.website.count({
      where: {
        userId: user.id,
        tracked: true,
      },
    });

    return websiteCount > 0;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

/**
 * Tracks websites in the database without redirecting
 * @param siteUrls Array of site URLs to track
 * @param userId User ID to associate with the websites
 */
async function trackSitesWithoutRedirect(siteUrls: string[], userId: string) {
  try {
    // Process each selected site
    for (const siteUrl of siteUrls) {
      // Create or update the website record
      await prisma.website.upsert({
        where: {
          siteUrl,
        },
        update: {
          tracked: true,
        },
        create: {
          userId: userId,
          siteUrl,
          tracked: true,
        },
      });
    }

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    console.error("Error tracking sites:", error);
    throw error;
  }
}

/**
 * Automatically onboards a user by fetching their GSC sites and tracking them
 * @returns Object with success status and message
 */
export async function autoOnboardUser() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if user already has tracked websites
    const hasTrackedWebsites = await hasCompletedOnboarding();
    if (hasTrackedWebsites) {
      return {
        success: true,
        message: "User already has tracked websites",
      };
    }

    // Fetch sites from Google Search Console
    const sites = await fetchUserSites();

    if (!sites || sites.length === 0) {
      return {
        success: false,
        message: "No sites found in Google Search Console",
      };
    }

    // Get the site URLs
    const siteUrls = sites.map((site: any) => site.siteUrl);

    // Track all sites without redirecting
    await trackSitesWithoutRedirect(siteUrls, user.id);

    // Sync GSC data for the user
    await syncUserGSCData();

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Successfully tracked ${siteUrls.length} websites and initiated data sync`,
    };
  } catch (error) {
    console.error("Error in auto onboarding:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during onboarding",
    };
  }
}
