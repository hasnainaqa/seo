"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateContent, getSavedTopics } from "@/lib/content-generation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  keywords: z.string().min(3, "Keywords are required"),
});

type FormValues = z.infer<typeof formSchema>;

// Define the props interface
interface ContentGeneratorProps {
  topic?: any;
}

export function ContentGenerator({ topic: initialTopic }: ContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [content, setContent] = useState<any | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(initialTopic || null);
  const [activeTab, setActiveTab] = useState("editor");
  const router = useRouter();

  // Initialize form with topic data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedTopic?.title || "",
      keywords: selectedTopic?.keywords ? selectedTopic.keywords.join(", ") : "",
    },
  });

  // Fetch saved topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        const response = await getSavedTopics();
        
        if (response.error) {
          toast.error("Error", {
            description: response.error,
          });
        } else {
          setTopics(response.topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("Error", {
          description: "Failed to fetch saved topics. Please try again.",
        });
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  // Update form when selected topic changes
  useEffect(() => {
    if (selectedTopic) {
      form.setValue("title", selectedTopic.title || "");
      form.setValue("keywords", selectedTopic.keywords ? selectedTopic.keywords.join(", ") : "");
    }
  }, [selectedTopic, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Parse keywords from comma-separated string
      const keywordsArray = values.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      if (keywordsArray.length === 0) {
        toast.error("Error", {
          description: "Please provide at least one keyword",
        });
        setLoading(false);
        return;
      }

      const response = await generateContent({
        topicId: selectedTopic?.id,
        title: values.title,
        keywords: keywordsArray,
        websiteId: selectedTopic?.websiteId,
      });

      if (response.error) {
        toast.error("Error", {
          description: response.error,
        });
      } else {
        setContent(response.content);
        toast.success("Success", {
          description: "Content generated successfully",
        });
        
        // Navigate to the post page if a post was created
        if (response.post) {
          router.push(`/dashboard/content/post/${response.post.id}`);
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Error", {
        description: "Failed to generate content. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Topic Selection */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Select a Topic</CardTitle>
          <CardDescription>
            Choose a topic to generate content for or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTopics ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No saved topics found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push("/dashboard/content/topics")}
              >
                Create New Topic
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div 
                    key={topic.id}
                    className={`p-4 rounded-md border cursor-pointer transition-colors ${
                      selectedTopic?.id === topic.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <h3 className="font-medium">{topic.title}</h3>
                    {topic.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {topic.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {topic.keywords?.slice(0, 3).map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {topic.keywords?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{topic.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Topic Details */}
      {selectedTopic ? (
        <Card>
          <CardHeader>
            <CardTitle>Topic Details</CardTitle>
            <CardDescription>
              Review and edit the topic details before generating content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{selectedTopic?.description}</p>
              
              <h3 className="font-medium">Keywords</h3>
              <div className="flex flex-wrap gap-1">
                {selectedTopic?.keywords?.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              {selectedTopic?.searchIntent && (
                <>
                  <h3 className="font-medium">Search Intent</h3>
                  <Badge variant="outline">{selectedTopic.searchIntent}</Badge>
                </>
              )}
              
              {selectedTopic?.website && (
                <>
                  <h3 className="font-medium">Website</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTopic.website.name || selectedTopic.website.siteUrl}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Generate Content */}
      {selectedTopic ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>
              Customize the title and keywords for your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for your content" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear, engaging title that includes your main keyword
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of keywords to include in your content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}

      {/* Generated Content Preview */}
      {content && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content Preview</CardTitle>
            <CardDescription>
              Preview your generated content before saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="meta">Metadata</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="w-full">
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content.markdown}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="markdown">
                <ScrollArea className="h-[500px] w-full rounded-md border">
                  <pre className="p-4 text-sm">{content.markdown}</pre>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="meta">
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-medium">Meta Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {content.meta?.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Keywords</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {content.meta?.keywords?.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-medium">Word Count</h3>
                      <p className="text-sm text-muted-foreground">
                        {content.meta?.wordCount || "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Read Time</h3>
                      <p className="text-sm text-muted-foreground">
                        {content.meta?.estimatedReadTime ? `${content.meta.estimatedReadTime} min` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}