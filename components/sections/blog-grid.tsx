import { SectionHeader } from "@/components/ui/custom/section-headers";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { BlogPageProps } from "@/types/content-types";
import { Badge } from "@/components/ui/badge";

export default function BlogGrid({ posts }: { posts: BlogPageProps[] }) {
  return (
    <SectionHeader className="container mx-auto max-w-7xl md:pt-20">
      <SectionHeader.HeaderContent>
        <SectionHeader.Heading>Blog</SectionHeader.Heading>
        <SectionHeader.Text>
          Startups & Corporations sharing our vision at Fazier
        </SectionHeader.Text>
      </SectionHeader.HeaderContent>

      <SectionHeader.Content>
        {/* Regular grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <article
              key={post.url}
              className="group relative flex flex-col space-y-2"
            >
              {post.data.featuredImage && (
                <Image
                  src={post.data.featuredImage}
                  alt={post.data.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors"
                  priority={index <= 1}
                />
              )}
              <div className="flex flex-col space-y-2 ">
                {post.data?.tags && post.data?.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {post.data.tags.map((tag) => (
                      <Badge key={tag} className="" variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl font-extrabold">{post.data.title}</h2>
                {post.data.description && (
                  <p className="text-muted-foreground">{post.data.description}</p>
                )}
                <div className="flex items-center gap-4">
                  {post.data.authorName && post.data.authorImage && (
                    <div className="flex items-center">
                      <Image
                        src={post.data.authorImage}
                        alt={post.data.authorName}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                      <p className="text-sm text-muted-foreground ">
                        {post.data.authorName}
                      </p>
                    </div>
                  )}
                  {post.data.date && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.data.date.toString())}
                    </p>
                  )}
                </div>
                <Link href={post.url} className="absolute inset-0">
                  <span className="sr-only">View Article</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionHeader.Content>
    </SectionHeader>
  );
}
