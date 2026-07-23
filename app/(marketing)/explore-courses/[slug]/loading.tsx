import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CoursePageLoading() {
  return (
    <main className="mx-auto flex container mt-16 px-4 py-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 w-full">
        {/* LEFT */}
        <section className="space-y-6 w-full">
          {/* Skeleton for CourseHero */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 md:w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          {/* Main content placeholder */}
          <Skeleton className="h-75 w-full rounded-xl" />

          {/* Skeleton for CourseContentAccordion / What you will learn */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Skeleton for InstructorCard */}
          <Card>
            <CardContent className="p-6 flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT */}
        <aside className="max-sm:-order-1 h-full block w-full">
          {/* Skeleton for EnrollCard */}
          <Card className="md:sticky border top-20">
            <div className="relative aspect-video rounded-t-lg overflow-hidden">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            <CardContent className="p-4 space-y-4">
              {/* Features List */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Pricing */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Enroll Button */}
              <Skeleton className="h-10 w-full" />

              {/* Guarantee */}
              <div className="flex justify-center">
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
