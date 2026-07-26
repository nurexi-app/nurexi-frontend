"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-col h-screen w-full gap-3">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>

      <div className="flex items-center gap-3">
        <Button
          onClick={
            // Attempt to recover by re-fetching and re-rendering the segment
            () => unstable_retry()
          }
        >
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
