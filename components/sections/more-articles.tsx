import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MoreArticlesProps } from "@/types/content-types";

export const MoreArticles = ({
  moreArticles,
}: {
  moreArticles: MoreArticlesProps;
}) => {
  const { next, previous } = moreArticles;

  if (!next && !previous) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-8">
      {/* <h3 className="mb-6 font-heading text-xl text-foreground">More Articles</h3> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {previous ? (
          <Link
            href={previous.url}
            className="group flex flex-col space-y-2 rounded-md border p-5 transition-colors duration-300 hover:bg-muted/50"
          >
            <div className="flex items-center text-sm text-primary">
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span>Previous</span>
            </div>
            <h4 className="text-lg text-foreground font-medium">
              {previous.data.title}
            </h4>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {previous.data.description}
            </p>
            {previous.data.date && (
              <p className="text-xs text-muted-foreground">
                {formatDate(previous.data.date.toString())}
              </p>
            )}
          </Link>
        ) : (
          <div></div>
        )}

        {next && (
          <Link
            href={next.url}
            className="group flex flex-col space-y-2 rounded-md border p-5 transition-colors duration-300 hover:bg-muted/50"
          >
            <div className="flex items-center justify-end text-sm text-primary">
              <span>Next</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
            <h4 className="text-lg text-foreground font-medium text-right">
              {next.data.title}
            </h4>
            <p className="line-clamp-2 text-sm text-muted-foreground text-right">
              {next.data.description}
            </p>
            {next.data.date && (
              <p className="text-xs text-muted-foreground text-right">
                {formatDate(next.data.date.toString())}
              </p>
            )}
          </Link>
        )}
      </div>
    </div>
  );
};
