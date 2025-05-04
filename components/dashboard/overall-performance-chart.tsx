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

interface PerformanceDataPoint {
  date: Date;
  clicks: number;
  impressions: number;
}

interface OverallPerformanceChartProps {
  performanceData: PerformanceDataPoint[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export function OverallPerformanceChart({
  performanceData,
  dateRange,
}: OverallPerformanceChartProps) {
  // Calculate totals
  const totalClicks = performanceData.reduce((sum, day) => sum + day.clicks, 0);
  const totalImpressions = performanceData.reduce(
    (sum, day) => sum + day.impressions,
    0
  );

  // Format data for chart
  const chartData = performanceData.map((day) => ({
    date: format(new Date(day.date), "MMM dd"),
    clicks: day.clicks,
    impressions: day.impressions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
        <div className="text-sm text-muted-foreground">
          {dateRange.startDate} to {dateRange.endDate}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </span>
            <span className="text-2xl font-bold">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Total Impressions
            </span>
            <span className="text-2xl font-bold">{totalImpressions.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                isAnimationActive={true}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="hsl(var(--chart-1))"
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
                stroke="hsl(var(--chart-2))"
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
