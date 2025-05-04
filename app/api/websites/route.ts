import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all websites for the user
    const websites = await prisma.website.findMany({
      where: {
        userId: user.id,
        tracked: true, // Only get tracked websites
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        siteUrl: true,
        name: true,
      },
    });

    return NextResponse.json({ websites });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 }
    );
  }
}
