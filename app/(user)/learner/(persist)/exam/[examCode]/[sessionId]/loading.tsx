import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-white py-4 md:mt-2 px-6 space-y-8 animate-in fade-in duration-500">
      {/* Header / Timer area */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-10 w-[120px] rounded-md" />
      </div>
      
      {/* Question Text Area */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-16 mb-6" /> {/* Question number */}
        <Skeleton className="h-6 w-[90%]" />
        <Skeleton className="h-6 w-[75%]" />
        <Skeleton className="h-6 w-[80%]" />
      </div>

      {/* Options */}
      <div className="space-y-4 pt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 border p-4 rounded-lg">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-[60%]" />
          </div>
        ))}
      </div>
      
      {/* Bottom navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        <Skeleton className="h-10 w-[100px]" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-sm hidden sm:block" />
          ))}
          <Skeleton className="h-8 w-[100px] rounded-sm sm:hidden block" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
