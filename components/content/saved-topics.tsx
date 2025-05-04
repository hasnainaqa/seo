"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TopicList } from "./topic-list";
import { getSavedTopics } from "@/lib/content-generation";
import { toast } from "sonner";

export function SavedTopics() {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSavedTopics();
        
        if (!isMounted) return;
        
        if (response.error) {
          // Check if it's a model not available error
          if (response.error.includes("model not available") || 
              response.error.includes("not found in Prisma schema")) {
            setError("Topics feature is not yet available. Please run database migrations first.");
            // Don't show toast for this expected error
          } else {
            toast.error("Error", {
              description: response.error
            });
            setError("Failed to load topics. Please try again later.");
          }
        } else {
          setTopics(response.topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        if (!isMounted) return;
        
        toast.error("Error", {
          description: "Failed to fetch saved topics. Please try again."
        });
        setError("Failed to load topics. Please try again later.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopics();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Topics</CardTitle>
        <CardDescription>
          View and manage your saved topic ideas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <TopicList topics={topics} showWebsite />
        )}
      </CardContent>
    </Card>
  );
}
