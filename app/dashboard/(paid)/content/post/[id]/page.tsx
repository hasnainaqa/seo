import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/ui/custom/dashbaord-header";
import { PostViewer } from "@/components/content/post-viewer";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/seo/metadata";

interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  return constructMetadata({
    title: post ? `Post: ${post.title}` : "View Post",
    description: "View your generated content",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  // Get the current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.hasAccess) {
    redirect("/dashboard/account-settings/billing");
  }

  // Get the post
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      topic: true,
      website: {
        select: {
          id: true,
          siteUrl: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading={post.title}
        text={post.metaDescription || "Generated content"}
      />

      <PostViewer post={post} />
    </div>
  );
}
