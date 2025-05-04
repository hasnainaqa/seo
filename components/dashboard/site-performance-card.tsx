"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";

// Define types for the component props
interface PerformanceData {
  id: string;
  websiteId: string;
  date: Date;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Website {
  id: string;
  siteUrl: string;
  name?: string | null;
  performanceData: PerformanceData[];
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface SitePerformanceCardProps {
  website: Website;
  performanceData: PerformanceData[];
  dateRange: DateRange;
}

export function SitePerformanceCard({
  website,
  performanceData,
  dateRange,
}: SitePerformanceCardProps) {
  // Calculate summary metrics
  const totalClicks = performanceData.reduce((sum, day) => sum + day.clicks, 0);
  const totalImpressions = performanceData.reduce(
    (sum, day) => sum + day.impressions,
    0
  );
  
  // Calculate averages
  const avgCtr = performanceData.length
    ? performanceData.reduce((sum, day) => sum + day.ctr, 0) /
      performanceData.length
    : 0;
  
  const avgPosition = performanceData.length
    ? performanceData.reduce((sum, day) => sum + day.position, 0) /
      performanceData.length
    : 0;

  // Format data for charts
  const chartData = performanceData.map((day) => ({
    date: format(new Date(day.date), "MMM dd"),
    clicks: day.clicks,
    impressions: day.impressions,
    ctr: Math.round(day.ctr * 10000) / 100, // Convert to percentage with 2 decimal places
    position: Math.round(day.position * 100) / 100, // Round to 2 decimal places
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg">
          {website.name || website.siteUrl}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {dateRange.startDate} to {dateRange.endDate}
        </p>
        <Link 
          href={`/dashboard/website/${website.id}`}
          className="text-sm text-primary hover:underline mt-2 inline-block"
        >
          View detailed analytics
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Clicks
            </span>
            <span className="text-2xl font-bold">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Impressions
            </span>
            <span className="text-2xl font-bold">{totalImpressions.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              CTR
            </span>
            <span className="text-2xl font-bold">{(avgCtr * 100).toFixed(2)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Position
            </span>
            <span className="text-2xl font-bold">{avgPosition.toFixed(1)}</span>
          </div>
        </div>

        {/* Combined Clicks & Impressions Chart */}
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Show fewer ticks on small screens
                  if (chartData.length > 14) {
                    const index = chartData.findIndex(item => item.date === value);
                    return index % 3 === 0 ? value : '';
                  }
                  return value;
                }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 7 }}
                yAxisId="left"
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="impressions"
                name="Impressions"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 7 }}
                yAxisId="right"
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
