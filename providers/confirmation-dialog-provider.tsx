"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmationDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
}

interface ConfirmationDialogContextType {
  showConfirmation: (options: ConfirmationDialogOptions) => Promise<boolean>;
}

const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmationDialog must be used within a ConfirmationDialogProvider"
    );
  }
  return context;
};

export function ConfirmationDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationDialogOptions>({
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showConfirmation = (options: ConfirmationDialogOptions) => {
    setOptions({ ...options });
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      resolveRef?.(true);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    resolveRef?.(false);
    setOpen(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmation }}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) handleCancel();
          setOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle
              className={options.icon ? "flex items-center gap-2" : ""}
            >
              {options.icon && options.icon}
              {options.title}
            </DialogTitle>
            <DialogDescription>{options.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {options.cancelText}
            </Button>
            <Button
              variant={options.variant}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                options.confirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationDialogContext.Provider>
  );
}
