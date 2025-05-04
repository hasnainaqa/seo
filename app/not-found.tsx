import Icons from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Not found | SEO Analytics",
  canonicalUrlRelative: "/not-found",
});

export default function NotFound() {
  return (
    <div className="grid h-screen place-content-center bg-background px-4">
      <div className="text-center">
        <Icons.notFound width={600} height={400} className="mx-auto" />
        <h1 className="mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          Uh-oh!
        </h1>
        <p className="mt-4 text-muted-foreground">We can't find that page.</p>
        <Link
          href="/"
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "mt-8 gap-2 font-semibold"
          )}
        >
          <Icons.home className="size-5" fill="currentColor" />
          Back To Home
        </Link>
      </div>
    </div>
  );
}
