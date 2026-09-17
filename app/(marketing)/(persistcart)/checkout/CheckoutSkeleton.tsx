import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-300 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-10 h-16 max-w-xl rounded-2xl" />
        <Skeleton className="mt-5 h-6 max-w-2xl rounded-xl" />
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    </main>
  );
}
