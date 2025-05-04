"use server";

import { uploadToCloud, removeFromCloud } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/session";

// Upload a new file with authentication
export const uploadFileToCloud = async (file: File) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { status: "error", message: "Unauthorized" };
    }

    if (!file) {
      return { status: "error", message: "No file provided" };
    }

    const url = await uploadToCloud(file);
    return { status: "success", url };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
};

// Remove a file with authentication
export const removeFileFromCloud = async (url: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { status: "error", message: "Unauthorized" };
    }

    if (!url) {
      return { status: "error", message: "No URL provided" };
    }

    const result = await removeFromCloud(url);
    return { status: "success", deleted: result };
  } catch (error) {
    console.error("Remove error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to remove file",
    };
  }
};

// Replace a file with authentication
export const replaceFileOnCloud = async (newFile: File, oldUrl: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { status: "error", message: "Unauthorized" };
    }

    if (!newFile || !oldUrl) {
      return { status: "error", message: "Missing file or URL" };
    }

    // Try to remove the old file but don't fail if it doesn't exist
    try {
      await removeFromCloud(oldUrl);
    } catch (removeError) {
      console.warn("Could not remove previous file:", removeError);
      // Continue with upload anyway
    }

    const newUrl = await uploadToCloud(newFile);
    return { status: "success", url: newUrl };
  } catch (error) {
    console.error("Replace error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to replace file",
    };
  }
};
