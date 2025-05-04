import { appConfig } from "@/lib/app-config";
import {
  AggregateRating,
  Article,
  Offer,
  SoftwareApplication,
  WithContext,
} from "schema-dts";

/**
 * Schema.org markup for enhanced search results
 * https://schema.org/
 */

/**
 * Test your schema here.
 * https://search.google.com/test/rich-results
 * These are the schema which are available
 * https://developers.google.com/search/docs/appearance/structured-data/search-gallery
 */

/**
 * Generate Article Schema.org markup for blog posts
 */
export function generateArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName = "Site Author",
  tags = [],
  category = "Blog",
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string | Date;
  dateModified?: string | Date;
  authorName?: string;
  tags?: string[];
  category?: string;
}): WithContext<Article> {
  // Format date to ISO string if it exists
  const publishedDate =
    typeof datePublished === "string"
      ? datePublished
      : datePublished.toISOString();

  // Use datePublished as fallback for dateModified
  const modifiedDate = dateModified
    ? typeof dateModified === "string"
      ? dateModified
      : dateModified.toISOString()
    : publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl ? [imageUrl] : [],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${appConfig.domainUrl}/`,
    },
    publisher: {
      "@type": "Person",
      name: authorName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: tags ? tags : [],
    articleSection: category,
  };
}

/**
 * Generate SaaS Schema.org markup for SaaS landing pages
 * This uses SoftwareApplication schema type which is ideal for SaaS products
 */
export function generateSaasSchema({
  name = appConfig.appName,
  description = appConfig.appDescription,
  url = `${appConfig.domainUrl}/`,
  imageUrl = `${appConfig.domainUrl}/icon.png`,
  authorName = "Hasnain Afzal",
  datePublished = "2025-01-01",
  applicationCategory = "WebApplication",
  aggregateRating = {
    ratingValue: "4.9",
    ratingCount: "32",
  },
  price = "40.00",
  priceCurrency = "USD",
  customFields = {},
}: {
  name?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  authorName?: string;
  datePublished?: string;
  applicationCategory?: string;
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
  price?: string;
  priceCurrency?: string;
  customFields?: Record<string, any>;
} = {}): WithContext<SoftwareApplication> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    image: imageUrl,
    url,
    author: {
      "@type": "Person",
      name: authorName,
    },
    datePublished,
    applicationCategory,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      ratingCount: parseInt(aggregateRating.ratingCount),
    } as AggregateRating,
    offers: [
      {
        "@type": "Offer",
        price,
        priceCurrency,
      } as Offer,
    ],
    ...customFields,
  };
}
