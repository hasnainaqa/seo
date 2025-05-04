"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getSavedPosts, deletePost } from "@/lib/content-generation";
import { PostList } from "./post-list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SavedPosts() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSavedPosts();
        
        if (!isMounted) return;
        
        if (response.error) {
          // Check if it's a model not available error
          if (response.error.includes("model not available") || 
              response.error.includes("not found in Prisma schema")) {
            setError("Posts feature is not yet available. Please run database migrations first.");
            // Don't show toast for this expected error
          } else {
            toast.error("Error", {
              description: response.error
            });
            setError("Failed to load posts. Please try again later.");
          }
        } else {
          setPosts(response.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (!isMounted) return;
        
        toast.error("Error", {
          description: "Failed to fetch saved posts. Please try again."
        });
        setError("Failed to load posts. Please try again later.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      setDeletingId(postId);
      const response = await deletePost(postId);
      
      if (response.success) {
        toast.success("Post deleted successfully");
        // Refresh the posts list
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        toast.error("Error", {
          description: response.error || "Failed to delete post"
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error", {
        description: "Failed to delete post. Please try again."
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Posts</CardTitle>
        <CardDescription>
          View and manage your saved blog posts.
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
          <PostList posts={posts} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </CardContent>
    </Card>
  );
}
