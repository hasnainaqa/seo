import { blogPosts } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const blog = loader({
  baseUrl: "/blog",
  source: createMDXSource(blogPosts),
});
