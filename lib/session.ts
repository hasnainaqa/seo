"use server";
import "server-only";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  try {
    const session = await auth();
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          customerId: true,
          variantId: true,
          hasAccess: true,
        },
      });
      if (user) return user;
    }
    return null;
  } catch {
    return null;
  }
});
