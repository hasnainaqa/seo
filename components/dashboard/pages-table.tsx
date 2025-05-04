"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";

// Define the type for page data
export interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Define the columns for the pages table
export const pageColumns = [
  {
    accessorKey: "page" as keyof PageData,
    header: "Page",
    cell: (row: PageData) => {
      const page = row.page;
      
      // Handle "Unknown page" case
      if (page === "Unknown page") {
        return (
          <div className="font-medium text-muted-foreground">
            Unknown page
          </div>
        );
      }
      
      // For valid URLs, make them clickable
      const displayUrl = page.replace(/^https?:\/\//, "");
      const fullUrl = page.startsWith("http") ? page : `https://${page}`;
      
      return (
        <div className="font-medium flex items-center">
          <span className="truncate max-w-[250px]" title={page}>
            {displayUrl}
          </span>
          <a 
            href={fullUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="sr-only">Open page</span>
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "clicks" as keyof PageData,
    header: "Clicks",
    cell: (row: PageData) => formatNumber(row.clicks),
  },
  {
    accessorKey: "impressions" as keyof PageData,
    header: "Impressions",
    cell: (row: PageData) => formatNumber(row.impressions),
  },
  {
    accessorKey: "ctr" as keyof PageData,
    header: "CTR",
    cell: (row: PageData) => formatPercentage(row.ctr),
  },
  {
    accessorKey: "position" as keyof PageData,
    header: "Position",
    cell: (row: PageData) => {
      const position = row.position;
      const formattedPosition = position.toFixed(1);
      
      // Add visual indicator for position (lower is better)
      return (
        <div className="flex items-center gap-1">
          <span>{formattedPosition}</span>
          {position <= 10 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-amber-500" />
          )}
        </div>
      );
    },
  },
];

interface PagesTableProps {
  data: PageData[];
  pageSize?: number;
}

export function PagesTable({ data, pageSize = 10 }: PagesTableProps) {
  return (
    <DataTable
      columns={pageColumns}
      data={data}
      pageSize={pageSize}
      showPagination={true}
    />
  );
}
