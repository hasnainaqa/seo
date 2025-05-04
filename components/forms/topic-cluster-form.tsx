"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { TopicCluster } from "@prisma/client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { topicClusterSchema, TopicClusterSchema, RuleSchema } from "@/lib/validation-schemas";
import { saveTopicCluster, deleteTopicCluster } from "@/actions/gsc-setting-actions";

interface TopicClusterFormProps {
  topicClusters: TopicCluster[];
}

type RuleType = "contains" | "startsWith" | "endsWith" | "equals" | "regex";

const RULE_TYPES: { value: RuleType; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "equals", label: "Equals" },
  { value: "regex", label: "Regex" },
];

export function TopicClusterForm({ topicClusters }: TopicClusterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingCluster, setEditingCluster] = useState<TopicCluster | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<TopicClusterSchema>({
    resolver: zodResolver(topicClusterSchema),
    defaultValues: {
      name: "",
      rules: [{ type: "contains", value: "" }],
    },
  });

  // Use field array for dynamic rules
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset({
        name: "",
        rules: [{ type: "contains", value: "" }],
      });
      setEditingCluster(null);
    }
  };

  // Set form values when editing a cluster
  const handleEdit = (cluster: TopicCluster) => {
    setEditingCluster(cluster);
    form.reset({
      id: cluster.id,
      name: cluster.name,
      rules: (cluster.rules as RuleSchema[]) || [{ type: "contains", value: "" }],
    });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = async (data: TopicClusterSchema) => {
    setIsSubmitting(true);
    
    try {
      const result = await saveTopicCluster(data);
      
      if (result.status === "success") {
        toast.success(result.message || "Topic cluster saved successfully");
        setIsDialogOpen(false);
        form.reset({
          name: "",
          rules: [{ type: "contains", value: "" }],
        });
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, errors]) => {
            if (field.startsWith("rules.")) {
              const [_, index, subField] = field.split(".");
              form.setError(`rules.${index}.${subField}` as any, { 
                type: "server", 
                message: errors[0] 
              });
            } else {
              form.setError(field as any, { 
                type: "server", 
                message: errors[0] 
              });
            }
          });
        } else {
          toast.error(result.message || "Failed to save topic cluster");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cluster deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    
    try {
      const result = await deleteTopicCluster(id);
      
      if (result.status === "success") {
        toast.success(result.message || "Topic cluster deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete topic cluster");
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
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Topic Cluster
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingCluster ? "Edit Topic Cluster" : "Create Topic Cluster"}</DialogTitle>
              <DialogDescription>
                Define a topic cluster with a name and rules to group related keywords.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SEO Analytics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Rules</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ type: "contains", value: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3">
                      <FormField
                        control={form.control}
                        name={`rules.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select rule type" />
                              </SelectTrigger>
                              <SelectContent>
                                {RULE_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`rules.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-[2]">
                            <FormControl>
                              <Input placeholder="Value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="mt-1"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove rule</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Topic Cluster"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {topicClusters.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {topicClusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{cluster.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(cluster)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cluster.id)}
                      disabled={isDeleting === cluster.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rules:</h4>
                  <ul className="space-y-1">
                    {(cluster.rules as RuleSchema[])?.map((rule, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{RULE_TYPES.find(t => t.value === rule.type)?.label || rule.type}:</span>{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">{rule.value}</code>
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No rules defined</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Topic Clusters</CardTitle>
            <CardDescription>
              You haven&apos;t created any topic clusters yet. Create your first one to start analyzing related keywords together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Topic Cluster
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
