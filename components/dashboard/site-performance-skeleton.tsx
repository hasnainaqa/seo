import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SitePerformanceSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>

        <Tabs defaultValue="clicks">
          <TabsList className="grid grid-cols-4 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </TabsList>
          
          <TabsContent value="clicks" className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
