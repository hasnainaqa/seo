"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ContentGroup } from "@prisma/client";

interface ContentGroupFilterProps {
  contentGroups: ContentGroup[];
  onFilterChange: (selectedIds: string[] | null) => void;
  initialSelectedIds?: string[];
}

export function ContentGroupFilter({
  contentGroups,
  onFilterChange,
  initialSelectedIds = [],
}: ContentGroupFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  // Toggle selection of a content group
  const toggleContentGroup = (id: string) => {
    setSelectedIds((current) => {
      const isSelected = current.includes(id);
      return isSelected
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedIds([]);
  };

  // Use useEffect to notify parent component when selectedIds changes
  useEffect(() => {
    onFilterChange(selectedIds.length > 0 ? selectedIds : null);
  }, [selectedIds, onFilterChange]);

  // Get names of selected content groups for display
  const getSelectedNames = () => {
    return selectedIds
      .map((id) => contentGroups.find((group) => group.id === id)?.name)
      .filter(Boolean) as string[];
  };

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedIds.length > 0 ? (
              <span className="truncate">
                {selectedIds.length} content group{selectedIds.length > 1 ? "s" : ""} selected
              </span>
            ) : (
              "Filter by content group"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search content groups..." />
            <CommandEmpty>No content groups found.</CommandEmpty>
            <CommandGroup>
              {contentGroups.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No content groups defined. Create content groups in settings.
                </div>
              ) : (
                contentGroups.map((group) => (
                  <CommandItem
                    key={group.id}
                    value={group.name}
                    onSelect={() => toggleContentGroup(group.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(group.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {group.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {getSelectedNames().map((name) => (
            <Badge key={name} variant="secondary">
              {name}
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-muted-foreground"
            onClick={clearSelections}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
