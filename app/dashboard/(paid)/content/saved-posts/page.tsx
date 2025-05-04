// "use client";

import { SavedPosts } from "@/components/content/saved-posts";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Saved Posts - SEO Analytics",
  description: "Manage your branded keywords for SEO analysis",
});

export default function SavedPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Saved Posts</h1>
          <p className="text-muted-foreground">View and manage your saved blog posts</p>
        </div>
      </div>
      
      <SavedPosts />
    </div>
  );
}