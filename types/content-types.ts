import { InferPageType } from "fumadocs-core/source";
import { blog } from "@/lib/source";

export type BlogPageProps = InferPageType<typeof blog>;

export type MoreArticlesProps = {
  next: BlogPageProps | null;
  previous: BlogPageProps | null;
};
