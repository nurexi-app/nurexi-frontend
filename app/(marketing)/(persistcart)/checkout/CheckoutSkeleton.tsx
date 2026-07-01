import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
  return (
    <div className="container mt-18 mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-md" /> {/* Back Button */}
        <Skeleton className="h-8 w-32" /> {/* Title */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary Skeleton */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <Skeleton className="h-6 w-36" /> {/* Section Title */}
            {/* Simulated Item Rows */}
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between py-2 border-b">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" /> {/* Item Name */}
                    <Skeleton className="h-4 w-16" /> {/* Item Qty */}
                  </div>
                  <Skeleton className="h-5 w-20" /> {/* Item Price */}
                </div>
              ))}
            </div>
            {/* Pricing Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="border-t pt-2 flex justify-between">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section Skeleton */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <Skeleton className="h-6 w-44" /> {/* Section Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Input Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input Box */}
              <Skeleton className="h-3 w-56" /> {/* Input Subtext */}
            </div>
            <Skeleton className="w-full h-12 rounded-md" /> {/* Pay Button */}
            <Skeleton className="h-3 w-64 mx-auto" /> {/* Footer Subtext */}
          </div>
        </div>
      </div>
    </div>
  );
}
