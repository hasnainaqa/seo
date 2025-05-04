import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Steps } from "fumadocs-ui/components/steps";
import type { MDXComponents } from "mdx/types";
import { type ComponentProps, type FC } from "react";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MoreArticles } from "@/components/sections/more-articles";
import type { BlogPageProps, MoreArticlesProps } from "@/types/content-types";

export default async function SingleArticle({
  page,
  moreArticles,
}: {
  page: BlogPageProps;
  moreArticles: MoreArticlesProps;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Post Header */}
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {page.data?.tags && page.data?.tags.length > 0 && (
            <div className="flex items-center gap-2">
              {page.data.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="py-1 px-3 text-sm rounded-lg"
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {page.data.date && (
            <time
              dateTime={
                typeof page.data.date === "string"
                  ? page.data.date
                  : page.data.date.toISOString()
              }
              className="text-sm font-medium text-muted-foreground"
            >
              Published on {formatDate(page.data.date.toString())}
            </time>
          )}
        </div>

        <h1 className="inline-block font-bold text-4xl leading-tight lg:text-5xl">
          {page.data.title}
        </h1>

        {page.data.description && (
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            {page.data.description}
          </p>
        )}

        {page.data.authorName && page.data.authorImage && (
          <div className="flex items-center space-x-3 pt-2">
            <Image
              src={page.data.authorImage}
              alt={page.data.authorName}
              width={40}
              height={40}
              className="rounded-full h-10 w-10 object-cover"
            />
            <div>
              <p className="font-medium text-foreground">
                {page.data.authorName}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Featured Image */}
          {page.data.featuredImage && (
            <div className="relative w-full mb-10 overflow-hidden rounded-xl">
              <div className="aspect-[16/9] w-full">
                <Image
                  src={page.data.featuredImage}
                  alt={page.data.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <div className="rounded-md mb-10">
            <InlineTOC items={page.data.toc} />
          </div>
          <article className="prose prose-slate dark:prose-invert max-w-none mb-10">
            <page.data.body
              components={{
                ...defaultMdxComponents,
                ...((await import("lucide-react")) as unknown as MDXComponents),
                Files: Files as FC<ComponentProps<typeof Files>>,
                File: File as FC<ComponentProps<typeof File>>,
                Folder: Folder as FC<ComponentProps<typeof Folder>>,
                Tab: Tab as FC<ComponentProps<typeof Tab>>,
                Tabs: Tabs as FC<ComponentProps<typeof Tabs>>,
                Accordion: Accordion as FC<ComponentProps<typeof Accordion>>,
                Accordions: Accordions as FC<ComponentProps<typeof Accordions>>,
                Card: Card as FC<ComponentProps<typeof Card>>,
                Cards: Cards as FC<ComponentProps<typeof Cards>>,
                Callout: Callout as FC<ComponentProps<typeof Callout>>,
                Steps: Steps as FC<ComponentProps<typeof Steps>>,
                ImageZoom: ImageZoom as FC<ComponentProps<typeof ImageZoom>>,
              }}
            />
          </article>
          <div>
            <MoreArticles moreArticles={moreArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
