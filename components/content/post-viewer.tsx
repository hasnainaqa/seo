"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { default as ReactMarkdown } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Pencil, Trash2, Copy } from "lucide-react";
import { deletePost } from "@/lib/content-generation";
import { toast } from "sonner";
import type { AlertDialog as AlertDialogType } from "@radix-ui/react-alert-dialog";
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

interface PostViewerProps {
  post: any;
}

export function PostViewer({ post }: PostViewerProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deletePost(post.id);
      
      if (response.success) {
        toast.success("Success", {
          description: "Post deleted successfully"
        });
        router.push("/dashboard/content");
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
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast.success("Copied", {
        description: "Content copied to clipboard"
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Error", {
        description: "Failed to copy content to clipboard"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/content">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Markdown
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
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
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              {post.topic && (
                <CardDescription>
                  Topic: {post.topic.title}
                </CardDescription>
              )}
            </div>
            {post.topic && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/content/${post.topic.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Topic
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-1">
            {post.keywords?.map((keyword: string, index: number) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            {post.wordCount && (
              <span>{post.wordCount} words</span>
            )}
            {post.estimatedReadTime && (
              <span>{post.estimatedReadTime} min read</span>
            )}
            <span>
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="w-full">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </TabsContent>
            
            <TabsContent value="markdown">
              <pre className="p-4 rounded-md bg-muted text-sm overflow-auto max-h-[500px]">
                {post.content}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {post.metaDescription && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Meta Description</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.metaDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
