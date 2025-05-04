"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
  brandedKeywordSchema, 
  topicClusterSchema, 
  contentGroupSchema 
} from "@/lib/validation-schemas";

type ActionResponse = {
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Adds a new branded keyword for the current user
 * @param data Branded keyword data
 * @returns Action response
 */
export async function addBrandedKeyword(data: z.infer<typeof brandedKeywordSchema>): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Validate input data
    const validationResult = brandedKeywordSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    // Create the branded keyword in the database
    await prisma.brandedKeyword.create({
      data: {
        userId: user.id,
        keyword: validationResult.data.keyword,
      },
    });

    // Revalidate the branded keywords page
    revalidatePath("/dashboard/account-settings/branded-keywords");

    return {
      status: "success",
      message: "Branded keyword added successfully",
    };
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        status: "error",
        message: "This keyword is already in your branded keywords list",
      };
    }

    console.error("Error adding branded keyword:", error);
    return {
      status: "error",
      message: "Failed to add branded keyword",
    };
  }
}

/**
 * Deletes a branded keyword
 * @param id Branded keyword ID
 * @returns Action response
 */
export async function deleteBrandedKeyword(id: string): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Verify ownership and delete the keyword
    const keyword = await prisma.brandedKeyword.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!keyword) {
      return {
        status: "error",
        message: "Branded keyword not found or you don't have permission to delete it",
      };
    }

    await prisma.brandedKeyword.delete({
      where: {
        id,
      },
    });

    // Revalidate the branded keywords page
    revalidatePath("/dashboard/account-settings/branded-keywords");

    return {
      status: "success",
      message: "Branded keyword deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting branded keyword:", error);
    return {
      status: "error",
      message: "Failed to delete branded keyword",
    };
  }
}

/**
 * Saves (creates or updates) a topic cluster
 * @param data Topic cluster data
 * @returns Action response
 */
export async function saveTopicCluster(data: z.infer<typeof topicClusterSchema>): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Validate input data
    const validationResult = topicClusterSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, name, rules } = validationResult.data;

    // Create or update the topic cluster
    if (id) {
      // Verify ownership
      const existingCluster = await prisma.topicCluster.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existingCluster) {
        return {
          status: "error",
          message: "Topic cluster not found or you don't have permission to update it",
        };
      }

      // Update existing topic cluster
      await prisma.topicCluster.update({
        where: {
          id,
        },
        data: {
          name,
          rules,
        },
      });
    } else {
      // Create new topic cluster
      await prisma.topicCluster.create({
        data: {
          userId: user.id,
          name,
          rules,
        },
      });
    }

    // Revalidate the topic clusters page
    revalidatePath("/dashboard/account-settings/topic-clusters");

    return {
      status: "success",
      message: `Topic cluster ${id ? "updated" : "created"} successfully`,
    };
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        status: "error",
        message: "A topic cluster with this name already exists",
      };
    }

    console.error("Error saving topic cluster:", error);
    return {
      status: "error",
      message: "Failed to save topic cluster",
    };
  }
}

/**
 * Deletes a topic cluster
 * @param id Topic cluster ID
 * @returns Action response
 */
export async function deleteTopicCluster(id: string): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Verify ownership and delete the topic cluster
    const cluster = await prisma.topicCluster.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!cluster) {
      return {
        status: "error",
        message: "Topic cluster not found or you don't have permission to delete it",
      };
    }

    await prisma.topicCluster.delete({
      where: {
        id,
      },
    });

    // Revalidate the topic clusters page
    revalidatePath("/dashboard/account-settings/topic-clusters");

    return {
      status: "success",
      message: "Topic cluster deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting topic cluster:", error);
    return {
      status: "error",
      message: "Failed to delete topic cluster",
    };
  }
}

/**
 * Saves (creates or updates) a content group
 * @param data Content group data
 * @returns Action response
 */
export async function saveContentGroup(data: z.infer<typeof contentGroupSchema>): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Validate input data
    const validationResult = contentGroupSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, name, rules } = validationResult.data;

    // Create or update the content group
    if (id) {
      // Verify ownership
      const existingGroup = await prisma.contentGroup.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existingGroup) {
        return {
          status: "error",
          message: "Content group not found or you don't have permission to update it",
        };
      }

      // Update existing content group
      await prisma.contentGroup.update({
        where: {
          id,
        },
        data: {
          name,
          rules,
        },
      });
    } else {
      // Create new content group
      await prisma.contentGroup.create({
        data: {
          userId: user.id,
          name,
          rules,
        },
      });
    }

    // Revalidate the content groups page
    revalidatePath("/dashboard/account-settings/content-groups");

    return {
      status: "success",
      message: `Content group ${id ? "updated" : "created"} successfully`,
    };
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        status: "error",
        message: "A content group with this name already exists",
      };
    }

    console.error("Error saving content group:", error);
    return {
      status: "error",
      message: "Failed to save content group",
    };
  }
}

/**
 * Deletes a content group
 * @param id Content group ID
 * @returns Action response
 */
export async function deleteContentGroup(id: string): Promise<ActionResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    // Verify ownership and delete the content group
    const group = await prisma.contentGroup.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!group) {
      return {
        status: "error",
        message: "Content group not found or you don't have permission to delete it",
      };
    }

    await prisma.contentGroup.delete({
      where: {
        id,
      },
    });

    // Revalidate the content groups page
    revalidatePath("/dashboard/account-settings/content-groups");

    return {
      status: "success",
      message: "Content group deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting content group:", error);
    return {
      status: "error",
      message: "Failed to delete content group",
    };
  }
}
