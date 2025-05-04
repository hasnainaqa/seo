"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getValidAccessToken,
  getDimensionData,
  createBrandedFilter,
} from "@/lib/gsc-api";
import { BrandedKeyword } from "@prisma/client";

/**
 * Fetches the list of websites available in the user's Google Search Console account
 * @returns Array of site URLs from Google Search Console
 */
export async function fetchUserSites() {
  try {
    // Get the current user
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch the user's Google account to get the access token
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "google",
      },
    });

    if (!account || !account.access_token) {
      throw new Error("Google account not connected or missing access token");
    }

    // Check if token is expired and refresh if needed
    // This will be implemented in a separate function later

    // Call the Google Search Console API to get the list of sites
    const response = await fetch(
      "https://www.googleapis.com/webmasters/v3/sites",
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch sites: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    // Return the list of site URLs
    return data.siteEntry || [];
  } catch (error) {
    console.error("Error fetching user sites:", error);
    throw error;
  }
}

/**
 * Tracks selected websites in the database
 * @param selectedSiteUrls Array of site URLs to track
 */
export async function trackSites(selectedSiteUrls: string[]) {
  try {
    // Get the current user
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Process each selected site
    for (const siteUrl of selectedSiteUrls) {
      // Create or update the website record
      await prisma.website.upsert({
        where: {
          siteUrl,
        },
        update: {
          tracked: true,
        },
        create: {
          userId: user.id,
          siteUrl,
          tracked: true,
        },
      });
    }

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    // Redirect to the dashboard overview
    redirect("/dashboard/overview");
  } catch (error) {
    console.error("Error tracking sites:", error);
    throw error;
  }
}

/**
 * Fetches top queries data from Google Search Console
 * @param siteUrl URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @param brandedFilterType Optional filter for branded/non-branded queries (all, branded, non-branded)
 * @param contentGroupIds Optional array of content group IDs to filter by
 * @param topicClusterIds Optional array of topic cluster IDs to filter by
 * @returns Top queries data with metrics
 */
export async function getTopQueries(
  siteUrl: string,
  startDate: string,
  endDate: string,
  brandedFilterType: "all" | "branded" | "non-branded" = "all",
  contentGroupIds?: string[],
  topicClusterIds?: string[]
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        userId,
        siteUrl,
        tracked: true,
      },
    });

    if (!website) {
      throw new Error("Website not found or not tracked");
    }

    // Get access token
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Get branded keywords if needed
    let brandedKeywords: BrandedKeyword[] = [];
    if (brandedFilterType !== "all") {
      brandedKeywords = await prisma.brandedKeyword.findMany({
        where: {
          userId,
        },
      });
    }

    // Get content group rules if filtering by content group
    let contentGroupRules: any[] = [];
    if (contentGroupIds && contentGroupIds.length > 0) {
      const contentGroups = await prisma.contentGroup.findMany({
        where: {
          id: {
            in: contentGroupIds,
          },
          userId,
        },
        select: {
          rules: true,
        },
      });

      contentGroupRules = contentGroups.flatMap(
        (group) => group.rules as any[]
      );
    }

    // Get topic cluster rules if filtering by topic cluster
    let topicClusterRules: any[] = [];
    if (topicClusterIds && topicClusterIds.length > 0) {
      const topicClusters = await prisma.topicCluster.findMany({
        where: {
          id: {
            in: topicClusterIds,
          },
          userId,
        },
        select: {
          rules: true,
        },
      });

      topicClusterRules = topicClusters.flatMap(
        (cluster) => cluster.rules as any[]
      );
    }

    // Create combined filters
    const filters = createCombinedFilters(
      brandedFilterType,
      brandedKeywords,
      contentGroupRules,
      topicClusterRules
    );

    // Fetch dimension data
    const data = await getDimensionData(
      siteUrl,
      startDate,
      endDate,
      ["query"],
      accessToken,
      filters,
      100
    );

    // Get the branded keywords for checking
    const brandedKeywordsArray = brandedKeywords.map((bk) =>
      bk.keyword.toLowerCase()
    );

    // Get topic clusters for mapping
    const topicClusterMap = new Map();
    if (topicClusterIds && topicClusterIds.length > 0) {
      const topicClusters = await prisma.topicCluster.findMany({
        where: {
          id: {
            in: topicClusterIds,
          },
          userId,
        },
        select: {
          id: true,
          name: true,
          rules: true,
        },
      });

      topicClusters.forEach((cluster) => {
        const clusterRules = cluster.rules as any[];
        clusterRules.forEach((rule) => {
          if (rule.field === "query" && rule.value) {
            const value = rule.value.toLowerCase();
            topicClusterMap.set(value, cluster.name);
          }
        });
      });
    }

    return {
      rows:
        data.rows?.map((row: any) => {
          // Check if row exists
          if (!row) {
            console.warn("Received empty row data from GSC API");
            return {
              query: "Unknown query",
              clicks: 0,
              impressions: 0,
              ctr: 0,
              position: 0,
            };
          }

          const query = row.query || "Unknown query";
          const queryLower = query.toLowerCase();

          // Check if this is a branded query
          const isBranded = brandedKeywordsArray.some((keyword) =>
            queryLower.includes(keyword)
          );

          // Check if this query belongs to a topic cluster
          let topicCluster = undefined;
          for (const [pattern, clusterName] of topicClusterMap.entries()) {
            if (queryLower.includes(pattern)) {
              topicCluster = clusterName;
              break;
            }
          }

          return {
            query,
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
            isBranded,
            topicCluster,
          };
        }) || [],
    };
  } catch (error) {
    console.error("Error getting top queries:", error);
    throw error;
  }
}

/**
 * Fetches top pages data from Google Search Console
 * @param siteUrl URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @param contentGroupIds Optional array of content group IDs to filter by
 * @param topicClusterIds Optional array of topic cluster IDs to filter by
 * @returns Top pages data with metrics
 */
export async function getTopPages(
  siteUrl: string,
  startDate: string,
  endDate: string,
  contentGroupIds?: string[],
  topicClusterIds?: string[]
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Verify site ownership
    const website = await prisma.website.findFirst({
      where: {
        userId,
        siteUrl,
        tracked: true,
      },
    });

    if (!website) {
      throw new Error("Website not found or not tracked");
    }

    // Get access token
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Get content group rules if filtering by content group
    let contentGroupRules: any[] = [];
    if (contentGroupIds && contentGroupIds.length > 0) {
      const contentGroups = await prisma.contentGroup.findMany({
        where: {
          id: {
            in: contentGroupIds,
          },
          userId,
        },
        select: {
          rules: true,
        },
      });

      contentGroupRules = contentGroups.flatMap(
        (group) => group.rules as any[]
      );
    }

    // Get topic cluster rules if filtering by topic cluster
    let topicClusterRules: any[] = [];
    if (topicClusterIds && topicClusterIds.length > 0) {
      const topicClusters = await prisma.topicCluster.findMany({
        where: {
          id: {
            in: topicClusterIds,
          },
          userId,
        },
        select: {
          rules: true,
        },
      });

      topicClusterRules = topicClusters.flatMap(
        (cluster) => cluster.rules as any[]
      );
    }

    // Create filters for pages based on content groups and topic clusters
    const filters = createPageFilters(contentGroupRules, topicClusterRules);

    // Fetch dimension data
    const data = await getDimensionData(
      siteUrl,
      startDate,
      endDate,
      ["page"],
      accessToken,
      filters,
      100
    );

    return {
      rows:
        data.rows?.map((row: any) => {
          // Check if row exists
          if (!row) {
            console.warn("Received empty row data from GSC API");
            return {
              page: "Unknown page",
              clicks: 0,
              impressions: 0,
              ctr: 0,
              position: 0,
            };
          }

          return {
            page: row.page || "Unknown page",
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          };
        }) || [],
    };
  } catch (error) {
    console.error("Error getting top pages:", error);
    throw error;
  }
}

/**
 * Fetches top countries data from Google Search Console
 * @param siteUrl URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Top countries data with metrics
 */
export async function getTopCountries(
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Verify site ownership
    const website = await prisma.website.findFirst({
      where: {
        userId,
        siteUrl,
        tracked: true,
      },
    });

    if (!website) {
      throw new Error("Website not found or not tracked");
    }

    // Get access token
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Fetch dimension data
    const data = await getDimensionData(
      siteUrl,
      startDate,
      endDate,
      ["country"],
      accessToken,
      undefined,
      100
    );

    return {
      rows:
        data.rows?.map((row: any) => {
          // Check if row exists
          if (!row) {
            console.warn("Received empty row data from GSC API");
            return {
              country: "Unknown",
              clicks: 0,
              impressions: 0,
              ctr: 0,
              position: 0,
            };
          }

          return {
            country: row.country || "Unknown",
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          };
        }) || [],
    };
  } catch (error) {
    console.error("Error getting top countries:", error);
    throw error;
  }
}

/**
 * Fetches top devices data from Google Search Console
 * @param siteUrl URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Top devices data with metrics
 */
export async function getTopDevices(
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Verify site ownership
    const website = await prisma.website.findFirst({
      where: {
        userId,
        siteUrl,
        tracked: true,
      },
    });

    if (!website) {
      throw new Error("Website not found or not tracked");
    }

    // Get access token
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Fetch dimension data
    const data = await getDimensionData(
      siteUrl,
      startDate,
      endDate,
      ["device"],
      accessToken,
      undefined,
      100
    );

    return {
      rows:
        data.rows?.map((row: any) => {
          // Check if row exists
          if (!row) {
            console.warn("Received empty row data from GSC API");
            return {
              device: "Unknown",
              clicks: 0,
              impressions: 0,
              ctr: 0,
              position: 0,
            };
          }

          return {
            device: row.device || "Unknown",
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          };
        }) || [],
    };
  } catch (error) {
    console.error("Error getting top devices:", error);
    throw error;
  }
}

// Helper function to create combined filters for queries
function createCombinedFilters(
  brandedFilterType: "all" | "branded" | "non-branded",
  brandedKeywords: BrandedKeyword[],
  contentGroupRules: any[],
  topicClusterRules: any[]
): { dimension: string; operator: string; expression: string }[] | undefined {
  let allFilters: {
    dimension: string;
    operator: string;
    expression: string;
  }[] = [];

  // Add branded/non-branded filter if applicable
  if (brandedFilterType !== "all" && brandedKeywords.length > 0) {
    // Create a filter for branded/non-branded queries
    const isBranded = brandedFilterType === "branded";
    const operator = isBranded ? "CONTAINS" : "NOT_CONTAINS";

    // Add a filter for each branded keyword
    brandedKeywords.forEach((keyword) => {
      allFilters.push({
        dimension: "query",
        operator,
        expression: keyword.keyword,
      });
    });
  }

  // Add content group filters if applicable
  if (contentGroupRules.length > 0) {
    const queryRules = contentGroupRules.filter(
      (rule) => rule.field === "query" && rule.operator && rule.value
    );

    queryRules.forEach((rule) => {
      allFilters.push({
        dimension: "query",
        operator: convertOperator(rule.operator),
        expression: rule.value,
      });
    });
  }

  // Add topic cluster filters if applicable
  if (topicClusterRules.length > 0) {
    const queryRules = topicClusterRules.filter(
      (rule) => rule.field === "query" && rule.operator && rule.value
    );

    queryRules.forEach((rule) => {
      allFilters.push({
        dimension: "query",
        operator: convertOperator(rule.operator),
        expression: rule.value,
      });
    });
  }

  return allFilters.length > 0 ? allFilters : undefined;
}

// Helper function to create page filters
function createPageFilters(
  contentGroupRules: any[],
  topicClusterRules: any[]
): { dimension: string; operator: string; expression: string }[] | undefined {
  let allFilters: {
    dimension: string;
    operator: string;
    expression: string;
  }[] = [];

  // Convert content group rules to page filters
  if (contentGroupRules.length > 0) {
    const pageRules = contentGroupRules.filter(
      (rule) => rule.field === "page" && rule.operator && rule.value
    );

    pageRules.forEach((rule) => {
      allFilters.push({
        dimension: "page",
        operator: convertOperator(rule.operator),
        expression: rule.value,
      });
    });
  }

  // Convert topic cluster rules to page filters
  if (topicClusterRules.length > 0) {
    const pageRules = topicClusterRules.filter(
      (rule) => rule.field === "page" && rule.operator && rule.value
    );

    pageRules.forEach((rule) => {
      allFilters.push({
        dimension: "page",
        operator: convertOperator(rule.operator),
        expression: rule.value,
      });
    });
  }

  return allFilters.length > 0 ? allFilters : undefined;
}

// Helper function to create a filter based on rules
function createRuleBasedFilter(
  rules: any[]
): { dimension: string; operator: string; expression: string }[] | null {
  const queryRules = rules.filter(
    (rule) => rule.field === "query" && rule.operator && rule.value
  );

  if (queryRules.length === 0) {
    return null;
  }

  return queryRules.map((rule) => ({
    dimension: "query",
    operator: convertOperator(rule.operator),
    expression: rule.value,
  }));
}

// Helper function to convert our operator to GSC API operator
function convertOperator(operator: string) {
  switch (operator) {
    case "contains":
      return "CONTAINS";
    case "equals":
      return "EQUALS";
    case "notContains":
      return "NOT_CONTAINS";
    case "notEquals":
      return "NOT_EQUALS";
    default:
      return "CONTAINS";
  }
}

// Get user's branded keywords
export async function getUserBrandedKeywords() {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Get branded keywords
    const brandedKeywords = await prisma.brandedKeyword.findMany({
      where: {
        userId,
      },
    });

    return brandedKeywords;
  } catch (error) {
    console.error("Error getting branded keywords:", error);
    throw error;
  }
}

// Get user's content groups
export async function getUserContentGroups() {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Get content groups
    const contentGroups = await prisma.contentGroup.findMany({
      where: {
        userId,
      },
    });

    return contentGroups;
  } catch (error) {
    console.error("Error getting content groups:", error);
    throw error;
  }
}

// Get user's topic clusters
export async function getUserTopicClusters() {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;

    // Get topic clusters
    const topicClusters = await prisma.topicCluster.findMany({
      where: {
        userId,
      },
    });

    return topicClusters;
  } catch (error) {
    console.error("Error getting topic clusters:", error);
    throw error;
  }
}
