import { prisma } from "@/lib/db";

/**
 * Fetches daily performance data from Google Search Console for a specific site
 * @param siteUrl The URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @param accessToken Google OAuth access token
 * @returns Array of daily performance data (date, clicks, impressions, ctr, position)
 */
export async function getDailySiteData(
  siteUrl: string,
  startDate: string,
  endDate: string,
  accessToken: string
) {
  try {
    // Construct the request body for the GSC API
    const requestBody = {
      startDate,
      endDate,
      dimensions: ["date"],
      rowLimit: 5000, // Maximum number of rows to return
    };

    // Encode the siteUrl for use in the API URL
    const encodedSiteUrl = encodeURIComponent(siteUrl);

    // Call the GSC API
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch GSC data: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Transform the API response into a format suitable for our database
    const dailyData = data.rows?.map((row: any) => ({
      date: row.keys[0], // The date is the first (and only) key
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })) || [];

    return dailyData;
  } catch (error) {
    console.error("Error fetching GSC daily data:", error);
    throw error;
  }
}

/**
 * Refreshes an expired Google OAuth token
 * @param userId The ID of the user whose token needs to be refreshed
 * @returns A valid access token
 */
export async function refreshGoogleToken(userId: string): Promise<string> {
  try {
    // Fetch the user's Google account
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "google",
      },
    });

    if (!account || !account.refresh_token) {
      throw new Error("No Google account or refresh token found");
    }

    // Check if the token is expired
    const isExpired = account.expires_at && account.expires_at * 1000 < Date.now();

    // If the token is still valid, return it
    if (!isExpired && account.access_token) {
      return account.access_token;
    }

    // If the token is expired, refresh it
    const clientId = process.env.AUTH_GOOGLE_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET;
    
    // Validate OAuth credentials
    if (!clientId || !clientSecret) {
      console.error("Missing OAuth credentials in environment variables");
      throw new Error("Google OAuth credentials not configured. Please check your environment variables.");
    }
    
    console.log("Refreshing token with client ID:", clientId.substring(0, 5) + "...");
    
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    // Handle error response
    if (!response.ok) {
      let errorMessage = `Failed to refresh token: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = `Failed to refresh token: ${errorData.error_description || errorData.error || response.statusText}`;
        console.error("Token refresh error details:", errorData);
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Update the account with the new token
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000 + data.expires_in),
      },
    });

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Google token:", error);
    throw error;
  }
}

/**
 * Gets a valid Google access token for a user, refreshing if necessary
 * @param userId The ID of the user
 * @returns A valid access token
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  try {
    // Fetch the user's Google account
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "google",
      },
    });

    if (!account) {
      throw new Error("No Google account found");
    }

    // Check if the token is expired
    const isExpired = account.expires_at && account.expires_at * 1000 < Date.now();

    // If the token is still valid, return it
    if (!isExpired && account.access_token) {
      return account.access_token;
    }

    // If the token is expired, refresh it
    return await refreshGoogleToken(userId);
  } catch (error) {
    console.error("Error getting valid access token:", error);
    throw error;
  }
}

/**
 * Fetches dimension-based performance data from Google Search Console
 * @param siteUrl The URL of the site to fetch data for
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @param dimensions Array of dimensions to fetch (e.g., ["query"], ["page"], ["country"], ["device"])
 * @param accessToken Google OAuth access token
 * @param filters Optional filters to apply (e.g., for branded/non-branded queries)
 * @param rowLimit Maximum number of rows to return (default: 100)
 * @param startRow Starting row for pagination (default: 0)
 * @returns Array of dimension performance data with metrics
 */
export async function getDimensionData(
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  accessToken: string,
  filters?: {
    dimension: string;
    operator: string;
    expression: string;
  }[],
  rowLimit: number = 100,
  startRow: number = 0
) {
  try {
    // Construct the request body for the GSC API
    const requestBody: any = {
      startDate,
      endDate,
      dimensions,
      rowLimit,
      startRow,
    };

    // Add dimension filters if provided
    if (filters && filters.length > 0) {
      requestBody.dimensionFilterGroups = [
        {
          filters,
        },
      ];
    }

    // Encode the siteUrl for use in the API URL
    const encodedSiteUrl = encodeURIComponent(siteUrl);

    // Call the GSC API
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch GSC dimension data: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Transform the API response into a more usable format
    const dimensionData = data.rows?.map((row: any) => {
      // Create an object with dimension values as keys
      const dimensionValues: Record<string, string> = {};
      dimensions.forEach((dimension, index) => {
        dimensionValues[dimension] = row.keys[index];
      });

      // Return the dimension values along with the metrics
      return {
        ...dimensionValues,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      };
    }) || [];

    return {
      rows: dimensionData,
      totalRows: data.responseAggregationType === "byPage" ? data.rows?.length || 0 : data.rows?.length || 0,
      hasNextPage: dimensionData.length === rowLimit, // If we got exactly rowLimit results, there might be more
    };
  } catch (error) {
    console.error("Error fetching GSC dimension data:", error);
    throw error;
  }
}

/**
 * Creates a filter for branded or non-branded queries
 * @param brandedKeywords Array of branded keywords
 * @param branded Whether to filter for branded (true) or non-branded (false) queries
 * @returns Filter configuration for the GSC API
 */
export function createBrandedFilter(brandedKeywords: string[], branded: boolean = true): {
  dimension: string;
  operator: string;
  expression: string;
}[] {
  if (!brandedKeywords.length) {
    return [];
  }

  // Escape special regex characters in keywords
  const escapedKeywords = brandedKeywords.map(keyword => 
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // Create a regex pattern that matches any of the branded keywords
  const pattern = escapedKeywords.join('|');

  return [
    {
      dimension: "query",
      operator: branded ? "CONTAINS" : "NOT_CONTAINS",
      expression: pattern,
    },
  ];
}
