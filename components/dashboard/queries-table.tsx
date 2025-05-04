"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { ArrowDown, ArrowUp, Tag, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the type for query data
export interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  isBranded?: boolean;
  topicCluster?: string;
}

// Define the columns for the queries table
export const queryColumns = [
  {
    accessorKey: "query" as keyof QueryData,
    header: "Query",
    cell: (row: QueryData) => {
      // Handle unknown query case
      if (row.query === "Unknown query") {
        return (
          <div className="font-medium text-muted-foreground">
            Unknown query
          </div>
        );
      }
      
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{row.query}</span>
            {row.isBranded && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                Branded
              </Badge>
            )}
          </div>
          {row.topicCluster && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Tag className="h-3 w-3 mr-1" />
              <span>{row.topicCluster}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clicks" as keyof QueryData,
    header: "Clicks",
    cell: (row: QueryData) => formatNumber(row.clicks),
  },
  {
    accessorKey: "impressions" as keyof QueryData,
    header: "Impressions",
    cell: (row: QueryData) => formatNumber(row.impressions),
  },
  {
    accessorKey: "ctr" as keyof QueryData,
    header: "CTR",
    cell: (row: QueryData) => formatPercentage(row.ctr),
  },
  {
    accessorKey: "position" as keyof QueryData,
    header: "Position",
    cell: (row: QueryData) => {
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

interface QueriesTableProps {
  data: QueryData[];
  pageSize?: number;
}

export function QueriesTable({ data, pageSize = 10 }: QueriesTableProps) {
  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Search className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No query data available</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or date range to see more data.
        </p>
      </div>
    );
  }
  
  return (
    <DataTable
      columns={queryColumns}
      data={data}
      pageSize={pageSize}
      showPagination={true}
    />
  );
}
