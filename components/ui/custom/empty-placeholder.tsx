import * as React from "react";

import { cn } from "@/lib/utils";
import Icons from "@/components/shared/icons";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center rounded-lg border border-dashed p-8 text-center shadow-xs animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  icon: any;
  ref?:
    | ((instance: SVGSVGElement | null) => void)
    | React.RefObject<SVGSVGElement>
    | null;
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  icon,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = icon;

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex size-20 items-center justify-center rounded bg-muted">
      <Icon className={cn("size-10", className)} {...props} />
    </div>
  );
};

interface EmptyPlacholderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlacholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

interface EmptyPlaceholderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
