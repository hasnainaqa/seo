"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { BrandedKeyword } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brandedKeywordSchema, BrandedKeywordSchema } from "@/lib/validation-schemas";
import { addBrandedKeyword, deleteBrandedKeyword } from "@/actions/gsc-setting-actions";

interface BrandedKeywordFormProps {
  brandedKeywords: BrandedKeyword[];
}

export function BrandedKeywordForm({ brandedKeywords }: BrandedKeywordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<BrandedKeywordSchema>({
    resolver: zodResolver(brandedKeywordSchema),
    defaultValues: {
      keyword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: BrandedKeywordSchema) => {
    setIsSubmitting(true);
    
    try {
      const result = await addBrandedKeyword(data);
      
      if (result.status === "success") {
        toast.success(result.message || "Branded keyword added successfully");
        form.reset();
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, errors]) => {
            form.setError(field as any, { 
              type: "server", 
              message: errors[0] 
            });
          });
        } else {
          toast.error(result.message || "Failed to add branded keyword");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyword deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    
    try {
      const result = await deleteBrandedKeyword(id);
      
      if (result.status === "success") {
        toast.success(result.message || "Branded keyword deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete branded keyword");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Branded Keyword</CardTitle>
          <CardDescription>
            Add keywords that are specific to your brand. These will be used to filter branded vs non-branded traffic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a branded keyword" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Keyword"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {brandedKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Branded Keywords</CardTitle>
            <CardDescription>
              These keywords are used to identify branded search queries in your analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {brandedKeywords.map((keyword) => (
                <li 
                  key={keyword.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <span>{keyword.keyword}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(keyword.id)}
                    disabled={isDeleting === keyword.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
