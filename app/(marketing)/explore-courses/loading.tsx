import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ExploreCoursesLoading() {
  return (
    <div className="p-4 container mt-18 my-6">
      {/* Skeleton for SearchHeader */}
      <div className="grid grid-cols-12 mb-4 items-center gap-8">
        <div className="col-span-12 md:col-span-3">
          <Skeleton className="h-10 w-3/4" />
        </div>
        <div className="col-span-12 md:col-span-7">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Skeletons for Course Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col">
            <CardHeader className="md:h-53 h-36 w-full p-0 m-0">
              <Skeleton className="h-full w-full rounded-t-lg rounded-b-none" />
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-3 flex-1 flex flex-col mt-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex items-center gap-2 mt-auto pt-4 border-t">
                <div className="flex-1">
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-24 ml-auto shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for Pagination */}
      <div className="mt-6 md:mt-10 flex justify-center">
        <Skeleton className="h-10 w-75" />
      </div>
    </div>
  );
}
