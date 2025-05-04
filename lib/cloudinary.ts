import "server-only";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const baseUploadPath = "uploads";

// Define a type for image URLs
type ImageUrl = string;

// Extract the public id from the url
export function extractPublicId(url: string): string {
  try {
    if (!url) throw new Error("Empty URL provided");
    const urlObject = new URL(url);
    const pathSegments = urlObject.pathname.split("/").filter(Boolean);

    const uploadIndex = pathSegments.findIndex(
      (segment) =>
        ["image", "video", "raw"].includes(segment) &&
        pathSegments[uploadIndex + 1] === "upload"
    );

    if (uploadIndex !== -1 && uploadIndex + 2 < pathSegments.length) {
      let startIndex = uploadIndex + 2;

      if (
        startIndex < pathSegments.length &&
        /^v\d+$/.test(pathSegments[startIndex])
      ) {
        startIndex++;
      }

      if (startIndex < pathSegments.length) {
        const publicIdParts = pathSegments.slice(startIndex);
        return publicIdParts.join("/").replace(/\.[^/.]+$/, "");
      }
    }

    const versionIndex = pathSegments.findIndex((segment) =>
      /^v\d+$/.test(segment)
    );
    if (versionIndex !== -1 && versionIndex + 1 < pathSegments.length) {
      const publicIdWithFolder = pathSegments.slice(versionIndex + 1).join("/");
      return publicIdWithFolder.replace(/\.[^/.]+$/, "");
    }

    const filteredSegments = pathSegments.filter(
      (segment) => !segment.includes("_") && !segment.includes(",")
    );

    if (filteredSegments.length > 0) {
      return filteredSegments.join("/").replace(/\.[^/.]+$/, "");
    }

    throw new Error("Could not determine public ID pattern from URL");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to extract public_id from URL: ${message}`);
  }
}

// Upload a file to Cloudinary
export async function uploadToCloud(
  file: File,
  options: {
    resource_type?: "image" | "video" | "raw" | "auto";
    folder?: string;
  } = {}
): Promise<ImageUrl> {
  try {
    const { resource_type = "auto", folder = baseUploadPath } = options;
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type, folder }, (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload successful but no result returned"));
        })
        .end(buffer);
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Remove a file from Cloudinary using its URL
export async function removeFromCloud(url: ImageUrl): Promise<boolean> {
  try {
    if (!url) {
      throw new Error("No URL provided for deletion");
    }
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!url.includes(cloudName!)) {
      console.warn("Not a Cloudinary URL, skipping deletion:", url);
      return false;
    }

    const publicId = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(publicId);
    
    return result.result === 'ok';
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error(`Deletion failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}