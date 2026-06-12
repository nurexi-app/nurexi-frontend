import { Skeleton } from "@/components/ui/skeleton";

export function SectionListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-secondary bg-secondaryLight p-4"
        >
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function QuizFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuizPageSkeleton() {
  return (
    <div className="pb-20">
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="basis-[35%]">
          <div className="mb-4">
            <Skeleton className="h-6 w-32 mb-1.5" />
            <Skeleton className="h-4 w-48" />
          </div>
          <SectionListSkeleton />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <QuizFormSkeleton />
        </div>
      </div>
    </div>
  );
}
