"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { TopicList } from "@/components/content/topic-list";
import { generateTopicIdeas } from "@/lib/content-generation";
import { toast } from "sonner";

// Form schema
const formSchema = z.object({
  keywords: z.array(z.string()).min(1, "Add at least one keyword"),
  description: z.string().optional(),
  count: z.coerce.number().int().min(1).max(10),
});

type FormValues = z.infer<typeof formSchema>;

export function TopicGenerator() {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: [],
      description: "",
      count: 5,
    },
  });

  // Add a keyword to the list
  const addKeyword = () => {
    if (!keyword.trim()) return;

    const currentKeywords = form.getValues("keywords");
    if (currentKeywords.includes(keyword.trim())) {
      toast.error("Duplicate keyword", {
        description: "This keyword is already in the list.",
      });
      return;
    }

    form.setValue("keywords", [...currentKeywords, keyword.trim()]);
    setKeyword("");
  };

  // Remove a keyword from the list
  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue(
      "keywords",
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const response = await generateTopicIdeas({
        keywords: values.keywords,
        description: values.description || "",
        count: values.count,
      });

      if (response.error) {
        toast.error("Error", {
          description: response.error,
        });
      } else {
        setTopics(response.topics);
      }
    } catch (error) {
      console.error("Error generating topics:", error);
      toast.error("Error", {
        description: "Failed to generate topics. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Topic Ideas</CardTitle>
        <CardDescription>
          Enter keywords and a description to generate SEO-optimized topic
          ideas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Enter a keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addKeyword}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Display selected keywords */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((kw, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                      >
                        <span>{kw}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeKeyword(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <FormDescription>
                    Add keywords related to your content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you're looking for in more detail"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide more context to get more relevant topic ideas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Topics</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormDescription>
                    How many topic ideas to generate (1-10).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Topics"
              )}
            </Button>
          </form>
        </Form>

        {topics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Generated Topics</h3>
            <TopicList topics={topics} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
