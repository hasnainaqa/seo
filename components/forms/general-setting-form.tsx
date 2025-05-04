"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generalSettingsSchema,
  GeneralSettingsSchema,
} from "@/lib/validation-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Save } from "lucide-react";
import { updateUserProfile } from "@/actions/account-setting-actions";
import { SafeUser } from "@/types/user-types";
import { uploadFileToCloud } from "@/actions/file-actions";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function GeneralSettingForm({ user }: { user: SafeUser }) {
  const [isUploading, setIsUploading] = useState(false);
  const { update } = useSession();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.image || null
  );

  const form = useForm<GeneralSettingsSchema>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);

      // Replace the old image with the new one
      const result = await uploadFileToCloud(file);
      if (result.status === "success") {
        setValue("image", result.url);
      } else {
        toast.error("Error while uploading avatar");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const result = await updateUserProfile(data);

    if (result.status === "success") {
      update();
      toast.success("Profile updated successfully");
    } else if (result.errors && result.errors.fieldErrors) {
      // Set field errors in the form if they exist
      Object.entries(result.errors.fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          form.setError(field as any, {
            type: "server",
            message: errors[0],
          });
        }
      });
      toast.error("Please correct the errors in the form");
    } else {
      toast.error("Error while updating profile");
    }
  });

  return (
    <Card className="shadow-none max-w-3xl">
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Your main account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar Field */}
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                {avatarPreview ? (
                  <AvatarImage
                    src={avatarPreview}
                    alt={user?.name || ""}
                  />
                ) : (
                  <AvatarFallback className="text-xl">
                    {user?.name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Change avatar"
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <FormDescription className="text-xs">
                  JPG, GIF or PNG. 1MB Max.
                </FormDescription>
              </div>
            </div>

            <Separator />

            {/* Name Field */}
            <div className="space-y-2">
              <FormLabel>Name</FormLabel>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Your name as it appears across the platform
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Email Field */}
            <div className="space-y-2">
              <FormLabel>Email address</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={user?.email || ""}
                  className="pl-10"
                  disabled
                />
              </div>
              <FormDescription>
                Used to sign in and for important notifications
              </FormDescription>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSubmit()}
          disabled={isSubmitting || isUploading}
          className="mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
