"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getTopQueries, 
  getTopPages, 
  getTopDevices 
} from "@/actions/gsc-actions";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Cell 
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
  fullPath?: string;
  color?: string;
}

interface DimensionChartsProps {
  siteUrl: string;
  startDate: string;
  endDate: string;
}

export function DimensionCharts({
  siteUrl,
  startDate,
  endDate,
}: DimensionChartsProps) {
  const [activeTab, setActiveTab] = useState("queries");
  const [queriesData, setQueriesData] = useState<any[]>([]);
  const [pagesData, setPagesData] = useState<any[]>([]);
  const [devicesData, setDevicesData] = useState<any[]>([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "queries" && queriesData.length === 0 && !isLoadingQueries) {
        setIsLoadingQueries(true);
        try {
          const data = await getTopQueries(siteUrl, startDate, endDate);
          setQueriesData(data.rows || []);
        } catch (error) {
          console.error("Error fetching queries data:", error);
        } finally {
          setIsLoadingQueries(false);
        }
      } else if (activeTab === "pages" && pagesData.length === 0 && !isLoadingPages) {
        setIsLoadingPages(true);
        try {
          const data = await getTopPages(siteUrl, startDate, endDate);
          setPagesData(data.rows || []);
        } catch (error) {
          console.error("Error fetching pages data:", error);
        } finally {
          setIsLoadingPages(false);
        }
      } else if (activeTab === "devices" && devicesData.length === 0 && !isLoadingDevices) {
        setIsLoadingDevices(true);
        try {
          const data = await getTopDevices(siteUrl, startDate, endDate);
          setDevicesData(data.rows || []);
        } catch (error) {
          console.error("Error fetching devices data:", error);
        } finally {
          setIsLoadingDevices(false);
        }
      }
    };

    fetchData();
  }, [activeTab, siteUrl, startDate, endDate]);

  // Prepare data for bar charts
  const prepareQueriesChartData = (data: any[]): ChartDataItem[] => {
    if (!data || data.length === 0) return [];

    // Sort by clicks in descending order
    const sortedData = [...data].sort((a, b) => b.clicks - a.clicks);
    
    // Take top 5 items
    const top5 = sortedData.slice(0, 5);
    
    // Create chart data
    const chartData: ChartDataItem[] = top5.map((item) => ({
      name: item.query.length > 15 ? item.query.substring(0, 15) + '...' : item.query,
      value: item.clicks,
      fullPath: item.query,
    }));
    
    return chartData;
  };

  const preparePagesChartData = (data: any[]): ChartDataItem[] => {
    if (!data || data.length === 0) return [];

    // Sort by clicks in descending order
    const sortedData = [...data].sort((a, b) => b.clicks - a.clicks);
    
    // Take top 5 items
    const top5 = sortedData.slice(0, 5);
    
    // Create chart data
    const chartData: ChartDataItem[] = top5.map((item) => {
      // Extract path from URL
      let displayName = '';
      try {
        const url = new URL(item.page);
        const path = url.pathname === '/' ? 'Homepage' : url.pathname;
        displayName = path.length > 15 ? path.substring(0, 15) + '...' : path;
      } catch (e) {
        displayName = item.page.length > 15 ? item.page.substring(0, 15) + '...' : item.page;
      }
      
      return {
        name: displayName,
        value: item.clicks,
        fullPath: item.page,
      };
    });
    
    return chartData;
  };

  const prepareDevicesChartData = (data: any[]): ChartDataItem[] => {
    if (!data || data.length === 0) return [];

    // Sort by clicks in descending order
    const sortedData = [...data].sort((a, b) => b.clicks - a.clicks);
    
    // Create chart data
    const chartData: ChartDataItem[] = sortedData.map((item) => ({
      name: item.device,
      value: item.clicks,
      fullPath: item.device,
    }));
    
    return chartData;
  };

  // Prepare chart data
  const queriesChartData = prepareQueriesChartData(queriesData);
  const pagesChartData = preparePagesChartData(pagesData);
  const devicesChartData = prepareDevicesChartData(devicesData);

  // Define chart colors
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // Define chart configs
  const queriesConfig: ChartConfig = {
    value: {
      label: "Clicks",
      color: "hsl(var(--chart-1))",
    },
  };

  const pagesConfig: ChartConfig = {
    value: {
      label: "Clicks",
      color: "hsl(var(--chart-2))",
    },
  };

  const devicesConfig: ChartConfig = {
    value: {
      label: "Clicks",
      color: "hsl(var(--chart-3))",
    },
  };

  // Loading state
  const isLoading = 
    (activeTab === "queries" && queriesData.length === 0 && !isLoadingQueries) || 
    (activeTab === "pages" && pagesData.length === 0 && !isLoadingPages) || 
    (activeTab === "devices" && devicesData.length === 0 && !isLoadingDevices);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Dimension</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="queries">Top Queries</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queries" className="h-[250px]">
            {isLoadingQueries ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : queriesData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer 
                config={queriesConfig} 
                className="min-h-[250px] w-full"
              >
                <BarChart 
                  accessibilityLayer 
                  data={queriesChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelKey="name"
                        labelFormatter={(label: string) => {
                          const item = queriesChartData.find(item => item.name === label);
                          return item?.fullPath || label;
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="value">
                    {queriesChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          
          <TabsContent value="pages" className="h-[250px]">
            {isLoadingPages ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : pagesData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer 
                config={pagesConfig} 
                className="min-h-[250px] w-full"
              >
                <BarChart 
                  accessibilityLayer 
                  data={pagesChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelKey="name"
                        labelFormatter={(label: string) => {
                          const item = pagesChartData.find(item => item.name === label);
                          return item?.fullPath || label;
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="value">
                    {pagesChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
          
          <TabsContent value="devices" className="h-[250px]">
            {isLoadingDevices ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : devicesData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer 
                config={devicesConfig} 
                className="min-h-[250px] w-full"
              >
                <BarChart 
                  accessibilityLayer 
                  data={devicesChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelKey="name"
                        labelFormatter={(label: string) => label}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="value">
                    {devicesChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
