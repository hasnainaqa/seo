import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/ui/custom/dashbaord-header";
import { ContentGenerator } from "@/components/content/content-generator";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/seo/metadata";

interface ContentPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ContentPageProps) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
  });

  return constructMetadata({
    title: topic ? `Generate Content: ${topic.title}` : "Generate Content",
    description: "Create SEO-optimized content for your website",
  });
}

export default async function ContentPage({ params }: ContentPageProps) {
  // Get the current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.hasAccess) {
    redirect("/dashboard/account-settings/billing");
  }

  // Get the topic
  const topic = await prisma.topic.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      website: {
        select: {
          id: true,
          siteUrl: true,
          name: true,
        },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading={`Generate Content: ${topic.title}`}
        text="Create SEO-optimized content based on your topic"
      />

      <ContentGenerator topic={topic} />
    </div>
  );
}
