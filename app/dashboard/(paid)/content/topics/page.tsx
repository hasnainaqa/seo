// "use client";

import { TopicGenerator } from "@/components/content/topic-generator";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Generate Topics - SEO Analytics",
  description: "Manage your branded keywords for SEO analysis",
});


export default function TopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Generate Topics</h1>
          <p className="text-muted-foreground">Create SEO-optimized topic ideas for your content</p>
        </div>
      </div>
      
      <TopicGenerator />
    </div>
  );
}