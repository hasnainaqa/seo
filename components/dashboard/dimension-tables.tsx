"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueriesTable, QueryData } from "@/components/dashboard/queries-table";
import { PagesTable, PageData } from "@/components/dashboard/pages-table";
import { CountriesTable, CountryData } from "@/components/dashboard/countries-table";
import { DevicesTable, DeviceData } from "@/components/dashboard/devices-table";
import { BrandedFilter } from "@/components/dashboard/branded-filter";
import { ContentGroupFilter } from "@/components/dashboard/content-group-filter";
import { TopicClusterFilter } from "@/components/dashboard/topic-cluster-filter";
import { 
  getTopQueries, 
  getTopPages, 
  getTopCountries, 
  getTopDevices,
  getUserBrandedKeywords,
  getUserContentGroups,
  getUserTopicClusters
} from "@/actions/gsc-actions";
import { Loader2, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandedKeyword, ContentGroup, TopicCluster } from "@prisma/client";

interface DimensionTablesProps {
  siteUrl: string;
  startDate: string;
  endDate: string;
}

export function DimensionTables({ siteUrl, startDate, endDate }: DimensionTablesProps) {
  const [activeTab, setActiveTab] = useState("queries");
  const [brandedFilter, setBrandedFilter] = useState<"all" | "branded" | "non-branded">("all");
  const [selectedContentGroupIds, setSelectedContentGroupIds] = useState<string[] | null>(null);
  const [selectedTopicClusterIds, setSelectedTopicClusterIds] = useState<string[] | null>(null);
  
  const [queriesData, setQueriesData] = useState<QueryData[]>([]);
  const [pagesData, setPagesData] = useState<PageData[]>([]);
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [devicesData, setDevicesData] = useState<DeviceData[]>([]);
  
  const [brandedKeywords, setBrandedKeywords] = useState<BrandedKeyword[]>([]);
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([]);
  const [topicClusters, setTopicClusters] = useState<TopicCluster[]>([]);
  
  const [isLoadingQueries, setIsLoadingQueries] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Fetch user settings (branded keywords, content groups, topic clusters)
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const [brandedKeywordsData, contentGroupsData, topicClustersData] = await Promise.all([
          getUserBrandedKeywords(),
          getUserContentGroups(),
          getUserTopicClusters()
        ]);
        
        setBrandedKeywords(brandedKeywordsData);
        setContentGroups(contentGroupsData);
        setTopicClusters(topicClustersData);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Fetch queries data
  const fetchQueriesData = async () => {
    setIsLoadingQueries(true);
    try {
      const result = await getTopQueries(
        siteUrl, 
        startDate, 
        endDate, 
        brandedFilter,
        selectedContentGroupIds || undefined,
        selectedTopicClusterIds || undefined
      );
      setQueriesData(result.rows || []);
    } catch (error) {
      console.error("Error fetching queries data:", error);
    } finally {
      setIsLoadingQueries(false);
    }
  };

  // Fetch pages data
  const fetchPagesData = async () => {
    setIsLoadingPages(true);
    try {
      const result = await getTopPages(
        siteUrl, 
        startDate, 
        endDate,
        selectedContentGroupIds || undefined,
        selectedTopicClusterIds || undefined
      );
      setPagesData(result.rows || []);
    } catch (error) {
      console.error("Error fetching pages data:", error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Fetch countries data
  const fetchCountriesData = async () => {
    setIsLoadingCountries(true);
    try {
      const result = await getTopCountries(
        siteUrl, 
        startDate, 
        endDate
      );
      setCountriesData(result.rows || []);
    } catch (error) {
      console.error("Error fetching countries data:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // Fetch devices data
  const fetchDevicesData = async () => {
    setIsLoadingDevices(true);
    try {
      const result = await getTopDevices(
        siteUrl, 
        startDate, 
        endDate
      );
      setDevicesData(result.rows || []);
    } catch (error) {
      console.error("Error fetching devices data:", error);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "queries") {
      fetchQueriesData();
    } else if (activeTab === "pages") {
      fetchPagesData();
    } else if (activeTab === "countries") {
      fetchCountriesData();
    } else if (activeTab === "devices") {
      fetchDevicesData();
    }
  }, [activeTab, startDate, endDate, siteUrl]);

  // Refetch queries when branded filter or content filters change
  useEffect(() => {
    if (activeTab === "queries") {
      fetchQueriesData();
    }
  }, [brandedFilter, selectedContentGroupIds, selectedTopicClusterIds]);

  // Refetch pages when content filters change
  useEffect(() => {
    if (activeTab === "pages") {
      fetchPagesData();
    }
  }, [selectedContentGroupIds, selectedTopicClusterIds]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle branded filter change
  const handleBrandedFilterChange = (filter: "all" | "branded" | "non-branded") => {
    setBrandedFilter(filter);
  };

  // Handle content group filter change
  const handleContentGroupFilterChange = (ids: string[] | null) => {
    setSelectedContentGroupIds(ids);
  };

  // Handle topic cluster filter change
  const handleTopicClusterFilterChange = (ids: string[] | null) => {
    setSelectedTopicClusterIds(ids);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setBrandedFilter("all");
    setSelectedContentGroupIds(null);
    setSelectedTopicClusterIds(null);
  };

  // Check if any filters are active
  const hasActiveFilters = 
    brandedFilter !== "all" || 
    selectedContentGroupIds !== null || 
    selectedTopicClusterIds !== null;

  // Save filter preferences to localStorage
  useEffect(() => {
    const filterPreferences = {
      brandedFilter,
      selectedContentGroupIds,
      selectedTopicClusterIds
    };
    
    localStorage.setItem('gscFilterPreferences', JSON.stringify(filterPreferences));
  }, [brandedFilter, selectedContentGroupIds, selectedTopicClusterIds]);

  // Load filter preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('gscFilterPreferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setBrandedFilter(preferences.brandedFilter || "all");
        setSelectedContentGroupIds(preferences.selectedContentGroupIds || null);
        setSelectedTopicClusterIds(preferences.selectedTopicClusterIds || null);
      } catch (error) {
        console.error("Error loading saved filter preferences:", error);
      }
    }
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Performance by Dimension</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingSettings ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ContentGroupFilter 
                contentGroups={contentGroups}
                onFilterChange={handleContentGroupFilterChange}
                initialSelectedIds={selectedContentGroupIds || []}
              />
              
              <TopicClusterFilter 
                topicClusters={topicClusters}
                onFilterChange={handleTopicClusterFilterChange}
                initialSelectedIds={selectedTopicClusterIds || []}
              />
              
              <div className="hidden lg:block"></div>
            </div>
            
            <Tabs defaultValue="queries" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="queries">Queries</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="queries">
                {activeTab === "queries" && (
                  <>
                    <BrandedFilter 
                      onFilterChange={handleBrandedFilterChange} 
                      initialValue={brandedFilter}
                      brandedKeywords={brandedKeywords}
                    />
                    
                    {isLoadingQueries ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <QueriesTable data={queriesData} pageSize={10} />
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="pages">
                {activeTab === "pages" && (
                  isLoadingPages ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <PagesTable data={pagesData} pageSize={10} />
                  )
                )}
              </TabsContent>
              
              <TabsContent value="countries">
                {activeTab === "countries" && (
                  isLoadingCountries ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <CountriesTable data={countriesData} pageSize={10} />
                  )
                )}
              </TabsContent>
              
              <TabsContent value="devices">
                {activeTab === "devices" && (
                  isLoadingDevices ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <DevicesTable data={devicesData} pageSize={10} />
                  )
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
