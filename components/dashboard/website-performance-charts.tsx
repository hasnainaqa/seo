"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { DailyPerformanceData } from "@prisma/client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WebsitePerformanceChartsProps {
  performanceData: DailyPerformanceData[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export function WebsitePerformanceCharts({
  performanceData,
  dateRange,
}: WebsitePerformanceChartsProps) {
  // Format data for charts
  const chartData = performanceData.map((data) => ({
    date: format(new Date(data.date), "MMM dd"),
    clicks: data.clicks,
    impressions: data.impressions,
    ctr: parseFloat((data.ctr * 100).toFixed(2)),
  }));

  // Calculate totals and averages
  const totalClicks = performanceData.reduce((sum, data) => sum + data.clicks, 0);
  const totalImpressions = performanceData.reduce((sum, data) => sum + data.impressions, 0);
  const avgCtr = performanceData.length > 0
    ? parseFloat(((performanceData.reduce((sum, data) => sum + data.ctr, 0) / performanceData.length) * 100).toFixed(2))
    : 0;

  // Define chart configs
  const clicksImpressionsConfig: ChartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--chart-1))",
    },
    impressions: {
      label: "Impressions",
      color: "hsl(var(--chart-2))",
    },
  };

  const ctrConfig: ChartConfig = {
    ctr: {
      label: "CTR (%)",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCtr}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clicks-impressions">
            <TabsList className="mb-4">
              <TabsTrigger value="clicks-impressions">Clicks & Impressions</TabsTrigger>
              <TabsTrigger value="ctr">CTR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clicks-impressions" className="h-[300px]">
              <ChartContainer 
                config={clicksImpressionsConfig} 
                className="min-h-[300px] w-full"
              >
                <AreaChart accessibilityLayer data={chartData}>
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
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelKey="date"
                        labelFormatter={(label: string) => `Date: ${label}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-clicks)"
                    fill="var(--color-clicks)"
                    fillOpacity={0.3}
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="var(--color-impressions)"
                    fill="var(--color-impressions)"
                    fillOpacity={0.3}
                    yAxisId="right"
                  />
                </AreaChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="ctr" className="h-[300px]">
              <ChartContainer 
                config={ctrConfig} 
                className="min-h-[300px] w-full"
              >
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (chartData.length > 14) {
                        const index = chartData.findIndex(item => item.date === value);
                        return index % 3 === 0 ? value : '';
                      }
                      return value;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelKey="date"
                        labelFormatter={(label: string) => `Date: ${label}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="ctr"
                    fill="var(--color-ctr)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
