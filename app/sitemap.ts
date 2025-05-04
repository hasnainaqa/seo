import { MetadataRoute } from "next";
import { appConfig } from "@/lib/app-config";
import { blog } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  // all the single pages like home, blog, pricing etc
  const staticPages = [
    {
      url: `${appConfig.domainUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${appConfig.domainUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Alll the single blog pages
  const blogEntries = blog.getPages().map((post) => ({
    url: `${appConfig.domainUrl}/blog/${post.slugs[0]}`,
    lastModified: post.data.date ? new Date(post.data.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...blogEntries, ...staticPages];
}
