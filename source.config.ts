import { defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import z from "zod";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "app/(marketing)/blog/_content",
  // add required frontmatter properties
  schema: frontmatterSchema.extend({
    authorName: z.string().optional(),
    authorImage: z.string().optional(),
    description: z.string(),
    date: z.string().date().or(z.date()),
    featuredImage: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});
