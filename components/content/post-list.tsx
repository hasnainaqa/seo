"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostListProps {
  posts: any[];
  onDelete?: (postId: string) => Promise<void>;
  deletingId?: string | null;
}

export function PostList({ posts, onDelete, deletingId }: PostListProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const toggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{post.title}</CardTitle>
              {post.topic && (
                <CardDescription>
                  Topic: {post.topic.title}
                </CardDescription>
              )}
              {post.website && (
                <CardDescription>
                  Website: {post.website.name || post.website.siteUrl}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <p className={`text-sm text-muted-foreground ${expandedPostId === post.id ? '' : 'line-clamp-2'}`}>
                {post.metaDescription || "No description available"}
              </p>
              
              {post.metaDescription && post.metaDescription.length > 120 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0 h-auto py-1 text-xs"
                  onClick={() => toggleExpand(post.id)}
                >
                  {expandedPostId === post.id ? "Show less" : "Show more"}
                </Button>
              )}
              
              <div className="mt-2 flex flex-wrap gap-1">
                {post.keywords?.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                {post.wordCount && (
                  <span>{post.wordCount} words</span>
                )}
                {post.estimatedReadTime && (
                  <span>{post.estimatedReadTime} min read</span>
                )}
                <span>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <div className="flex items-center justify-between px-6 py-3 bg-muted/50">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/content/post/${post.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Post
                </Link>
              </Button>
              
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(post.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
