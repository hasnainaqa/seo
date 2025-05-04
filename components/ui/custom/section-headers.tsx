import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Main SectionHeader Component (Container) ---

interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <section
      className={cn(
        "container mx-auto max-w-7xl pb-20 pt-20 md:pb-32 md:pt-32", // Base SectionSpacing styles
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

// --- Sub-components --- 

// Header Content Wrapper
interface SectionHeaderContentProps extends React.HTMLAttributes<HTMLDivElement> {}

SectionHeader.HeaderContent = function SectionHeaderContent({ className, children, ...props }: SectionHeaderContentProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl space-y-4 pb-16 text-center", // Base SectionHeaderContent styles
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Badge
interface SectionBadgeProps extends React.HTMLAttributes<HTMLDivElement> { // Use HTMLDivElement for Badge wrapper or adjust if needed
  children: React.ReactNode;
  className?: string;
}

SectionHeader.Badge = function SectionBadge({ className, children, ...props }: SectionBadgeProps) {
  // The original SectionBadge directly rendered the Badge component.
  // We wrap it slightly differently or pass props directly if Badge accepts HTMLDivElement props.
  // Assuming Badge itself handles layout/styling based on its parent.
  return (
    <Badge className={cn(className)} {...props}>
      {children}
    </Badge>
  );
};

// Heading
interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

SectionHeader.Heading = function SectionHeading({ className, children, ...props }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "mx-auto mt-4 text-3xl font-bold tracking-tight sm:text-5xl", // Base SectionHeading styles
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

// Text/Description
interface SectionTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

SectionHeader.Text = function SectionText({ className, children, ...props }: SectionTextProps) {
  return (
    <p
      className={cn(
        "pt-1 text-xl text-muted-foreground", // Base SectionText styles
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// Section Content Wrapper (for content below the header)
interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

SectionHeader.Content = function SectionContent({ className, children, ...props }: SectionContentProps) {
  // This corresponds to the div that previously wrapped 'children' in the old SectionHeader
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};
