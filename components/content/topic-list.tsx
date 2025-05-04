"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, ExternalLink, Trash2 } from "lucide-react";
import { deleteTopic } from "@/lib/content-generation";
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

interface TopicListProps {
  topics: any[];
  showWebsite?: boolean;
}

export function TopicList({ topics, showWebsite = false }: TopicListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (topicId: string) => {
    try {
      setLoading(topicId);
      const response = await deleteTopic(topicId);
      
      if (response.success) {
        toast.success("Success", {
          description: "Topic deleted successfully"
        });
        router.refresh();
      } else {
        toast.error("Error", {
          description: response.error || "Failed to delete topic"
        });
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Error", {
        description: "Failed to delete topic. Please try again."
      });
    } finally {
      setLoading(null);
    }
  };

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">No topics found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              {topic.searchIntent && (
                <Badge variant="outline" className="w-fit">
                  {topic.searchIntent}
                </Badge>
              )}
              {showWebsite && topic.website && (
                <CardDescription>
                  Website: {topic.website.name || topic.website.siteUrl}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{topic.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {topic.keywords?.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/content/${topic.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Generate Content
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this topic? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(topic.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
