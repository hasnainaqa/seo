"use server";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  GeneralSettingsSchema,
  generalSettingsSchema,
} from "@/lib/validation-schemas";
import { removeFileFromCloud } from "@/actions/file-actions";
import { User } from "@prisma/client";

export const updateUserProfile = async (data: GeneralSettingsSchema) => {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const validationResult = generalSettingsSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten(),
      };
    }

    // Extract the validated data
    const validatedData = validationResult.data;

    // Update the user profile with validated data
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: validatedData.name,
        image: validatedData.image,
      } as Partial<User>,
    });

    if (currentUser.image) {
      await removeFileFromCloud(currentUser.image);
    }

    revalidatePath("dashboard/profile");
    return { status: "success" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { status: "error" };
  }
};
