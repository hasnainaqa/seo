import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/app-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/",
    },
    sitemap: `${appConfig.domainUrl}/sitemap.xml`,
    host: appConfig.domainUrl,
  };
}
