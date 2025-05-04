// "use client";

import { SavedTopics } from "@/components/content/saved-topics";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Saved Topics - SEO Analytics",
  description: "Manage your branded keywords for SEO analysis",
});

export default function SavedTopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Saved Topics</h1>
          <p className="text-muted-foreground">View and manage your saved topic ideas</p>
        </div>
      </div>
      
      <SavedTopics />
    </div>
  );
}