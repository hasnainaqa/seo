import { appConfig } from "@/lib/app-config";
import { Metadata, Viewport } from "next";

/**
 * Generates SEO metadata for Next.js pages.
 * This function returns a comprehensive set of metadata tags for optimal SEO performance.
 */
export const constructMetadata = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  authors,
  extraTags,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: "website" | "article" | "profile";
  };
  canonicalUrlRelative?: string;
  authors?: Array<{ name: string; url?: string }>;
  extraTags?: Record<string, string>;
} = {}): Metadata => {
  return {
    // Up to 50 characters: what your app offers
    title: title || appConfig.appTagline,
    // Up to 160 characters: how your app helps the user
    description: description || appConfig.appDescription,
    // Keywords separated by commas. Defaults to your app name
    keywords: keywords || [appConfig.appName],
    applicationName: appConfig.appName,
    // Base URL for fully qualified URLs in metadata (e.g., for OpenGraph images)
    metadataBase: new URL(`${appConfig.domainUrl}/`),
    // Authors for article pages
    ...(authors && { authors }),

    // Default OG image - add opengraph-image.(jpg|jpeg|png|gif) to /app folder for automatic OG images
    // Default Twitter image - add twitter-image.(jpg|jpeg|png|gif) to /app folder for automatic Twitter images
    ...(openGraph?.images && {
      openGraph: {
        title: openGraph?.title || appConfig.appName,
        description: openGraph?.description || appConfig.appDescription,
        url: openGraph?.url || `${appConfig.domainUrl}/`,
        siteName: openGraph?.siteName || appConfig.appName,
        locale: openGraph?.locale || "en_US",
        type: openGraph?.type || "website",
        images: openGraph.images,
      },

      twitter: {
        title: openGraph?.title || appConfig.appName,
        description: openGraph?.description || appConfig.appDescription,
        card: "summary_large_image",
        creator: "@hasan_afzal8",
        images: openGraph.images,
      },
    }),

    // Adds a canonical URL if provided
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    // Merge any extra tags
    ...extraTags,
  };
};

/**
 * Generates viewport metadata for Next.js pages.
 */
export const getViewportMetadata = (): Viewport => {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    viewportFit: "cover",
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: appConfig.colors.primary,
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: appConfig.colors.primary,
      },
    ],
    colorScheme: "light dark",
  };
};

/**
 * Usage examples:
 *
 * Basic usage in page.tsx:
 * ```
 * export const metadata = constructMetadata({
 *   title: "Page Title",
 *   description: "Page description",
 *    openGraph: {
 *       type: "article",
 *       images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: post.title }]
 *    },
 * canonicalUrlRelative: "/"
 * });
 *
 *
 *  Only need in layout.tsx
 * export const viewport = getViewportMetadata();
 * 
 * ```
 */
