import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BrandedKeywordForm } from "@/components/forms/branded-keyword-form";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Branded Keywords Settings",
  description: "Manage your branded keywords for SEO analysis",
});

export default async function BrandedKeywordsPage() {
  // Get the current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.hasAccess) {
    redirect("/dashboard/billing");
  }

  // Fetch existing branded keywords for the user
  const brandedKeywords = await prisma.brandedKeyword.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Branded Keyword</h1>
        <p className="text-muted-foreground mt-2">
          Set up branded keyword to monitor your brand&apos;s performance in search results.
          We recommend adding branded keywords that are unique to your brand and are not generic terms.
        </p>
      </div>

      <BrandedKeywordForm brandedKeywords={brandedKeywords} />
    </div>
  );
}
