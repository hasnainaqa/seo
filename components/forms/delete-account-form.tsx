"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useConfirmationDialog } from "@/providers/confirmation-dialog-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteAccountForm() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showConfirmation } = useConfirmationDialog();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirmation({
      title: "Delete Account",
      description:
        "Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.",
      confirmText: "Delete Account",
      cancelText: "Cancel",
      variant: "destructive",
      icon: <AlertTriangle className="size-5 text-destructive" />,
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      // This is a placeholder for the actual delete account API call
      // await deleteUserAccount();

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Account deleted successfully");
      // Sign out and redirect to home page
      router.push("/auth/signout");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="shadow-none max-w-3xl">
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
        <CardDescription>Careful, these actions are permanent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 text-sm">
          <AlertTriangle className="size-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            Please Note: Deleting your account will not end your subscription,
            please make sure to end it in{" "}
            <Button variant="link" className="h-auto p-0 text-sm text-primary">
              billing section
            </Button>{" "}
            prior to deleting account.
          </p>
        </div>
      </CardContent>
      <CardFooter className="text-base">
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Deleting Account...
            </>
          ) : (
            <>
              <Trash2 className="mr-1 size-4" />
              Delete my account
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
