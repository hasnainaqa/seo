import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
});

export type UserAuthSchema = z.infer<typeof userAuthSchema>;

export const generalSettingsSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 50 characters long" })
    .max(50, { message: "Name cannot exceed 100 characters" }),
  email: z.string().email().optional().readonly(),
  image: z.string().optional(),
});

export type GeneralSettingsSchema = z.infer<typeof generalSettingsSchema>;

// Branded Keywords Schema
export const brandedKeywordSchema = z.object({
  id: z.string().optional(),
  keyword: z
    .string({ required_error: "Keyword is required" })
    .min(1, { message: "Keyword cannot be empty" })
    .max(100, { message: "Keyword cannot exceed 100 characters" }),
});

export type BrandedKeywordSchema = z.infer<typeof brandedKeywordSchema>;

// Rule Schema for Topic Clusters and Content Groups
export const ruleSchema = z.object({
  type: z.enum(["contains", "startsWith", "endsWith", "equals", "regex"], {
    required_error: "Rule type is required",
  }),
  value: z
    .string({ required_error: "Rule value is required" })
    .min(1, { message: "Rule value cannot be empty" }),
});

export type RuleSchema = z.infer<typeof ruleSchema>;

// Topic Cluster Schema
export const topicClusterSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  rules: z
    .array(ruleSchema)
    .min(1, { message: "At least one rule is required" }),
});

export type TopicClusterSchema = z.infer<typeof topicClusterSchema>;

// Content Group Schema
export const contentGroupSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  rules: z
    .array(ruleSchema)
    .min(1, { message: "At least one rule is required" }),
});

export type ContentGroupSchema = z.infer<typeof contentGroupSchema>;
