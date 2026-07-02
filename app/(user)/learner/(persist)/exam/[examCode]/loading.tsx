import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import DashboardCaption from "@/components/web/DashboardCaption";

export default function Loading() {
  return (
    <>
      {/* Dashboard Caption Skeleton */}
      <DashboardCaption
        heading={"exam"}
        text={`Select a session to start your exam`}
      />

      <section className="p-4 space-y-6">
        {/* Exam Info Card Skeleton */}
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-full max-w-[400px]" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Selection Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-[180px] mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
