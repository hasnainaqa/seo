"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  subDays,
  subMonths,
  isEqual,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeProps {
  startDate: Date;
  endDate: Date;
  baseUrl: string;
}

type PresetRange = {
  name: string;
  label: string;
  range: () => { from: Date; to: Date };
};

export function DateRangeSelector({
  startDate,
  endDate,
  baseUrl,
}: DateRangeProps) {
  const router = useRouter();
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: startDate,
    to: endDate,
  });

  // Define preset date ranges
  const presets: PresetRange[] = [
    {
      name: "last7Days",
      label: "Last 7 Days",
      range: () => ({
        from: subDays(new Date(), 7),
        to: new Date(),
      }),
    },
    {
      name: "last14Days",
      label: "Last 14 Days",
      range: () => ({
        from: subDays(new Date(), 14),
        to: new Date(),
      }),
    },
    {
      name: "last28Days",
      label: "Last 28 Days",
      range: () => ({
        from: subDays(new Date(), 28),
        to: new Date(),
      }),
    },
    {
      name: "last30Days",
      label: "Last 30 Days",
      range: () => ({
        from: subDays(new Date(), 30),
        to: new Date(),
      }),
    },
    {
      name: "lastMonth",
      label: "Last Month",
      range: () => {
        const today = new Date();
        const oneMonthAgo = subMonths(today, 1);
        return {
          from: oneMonthAgo,
          to: today,
        };
      },
    },
    {
      name: "last3Months",
      label: "Last 3 Months",
      range: () => ({
        from: subMonths(new Date(), 3),
        to: new Date(),
      }),
    },
    {
      name: "last12Months",
      label: "Last 12 Months",
      range: () => ({
        from: subMonths(new Date(), 12),
        to: new Date(),
      }),
    },
    {
      name: "thisYear",
      label: "This Year",
      range: () => ({
        from: startOfYear(new Date()),
        to: new Date(),
      }),
    },
  ];

  // Check if current date range matches a preset
  const getCurrentPreset = (): string => {
    if (!date.from || !date.to) return presets[0].name;

    for (const preset of presets) {
      const range = preset.range();
      if (
        (isEqual(date.from, range.from) ||
          (date.from.getFullYear() === range.from.getFullYear() &&
            date.from.getMonth() === range.from.getMonth() &&
            date.from.getDate() === range.from.getDate())) &&
        (isEqual(date.to, range.to) ||
          (date.to.getFullYear() === range.to.getFullYear() &&
            date.to.getMonth() === range.to.getMonth() &&
            date.to.getDate() === range.to.getDate()))
      ) {
        return preset.name;
      }
    }
    return presets[0].name;
  };

  // Handle preset selection
  const handlePresetChange = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      const range = preset.range();
      setDate({
        from: range.from,
        to: range.to,
      });

      // Auto-apply when selecting a preset
      const formattedStartDate = format(range.from, "yyyy-MM-dd");
      const formattedEndDate = format(range.to, "yyyy-MM-dd");

      router.push(
        `${baseUrl}?start=${formattedStartDate}&end=${formattedEndDate}`
      );
    }
  };

  return (
    <div className="flex items-center">
      <Select value={getCurrentPreset()} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.name} value={preset.name}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
