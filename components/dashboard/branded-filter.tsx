"use client";

import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { BrandedKeyword } from "@prisma/client";

interface BrandedFilterProps {
  onFilterChange: (filter: "all" | "branded" | "non-branded") => void;
  initialValue?: "all" | "branded" | "non-branded";
  brandedKeywords?: BrandedKeyword[];
}

export function BrandedFilter({ 
  onFilterChange, 
  initialValue = "all",
  brandedKeywords = []
}: BrandedFilterProps) {
  const [filter, setFilter] = useState<"all" | "branded" | "non-branded">(initialValue);

  const handleValueChange = (value: string) => {
    if (value === "all" || value === "branded" || value === "non-branded") {
      setFilter(value);
      onFilterChange(value);
    }
  };

  // Display the count of branded keywords if available
  const getBrandedLabel = () => {
    if (brandedKeywords.length > 0) {
      return `Branded (${brandedKeywords.length})`;
    }
    return "Branded";
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="branded-filter" className="text-sm font-medium">
          Filter Queries
        </Label>
        {brandedKeywords.length === 0 && (
          <span className="text-xs text-muted-foreground">
            No branded keywords defined. Define them in settings.
          </span>
        )}
      </div>
      <ToggleGroup 
        type="single" 
        id="branded-filter"
        value={filter}
        onValueChange={handleValueChange}
        className="justify-start"
      >
        <ToggleGroupItem value="all" aria-label="Show all queries">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="branded" aria-label="Show only branded queries">
          {getBrandedLabel()}
        </ToggleGroupItem>
        <ToggleGroupItem value="non-branded" aria-label="Show only non-branded queries">
          Non-Branded
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
