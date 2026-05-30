import Link from "next/link";
import { Button } from "@/components/ui/button";
import Back from "@/components/helpers/Back";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h2>
      <p className="mt-4 text-muted-foreground max-w-[600px]">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved, deleted, or never existed.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Back />
        <Button asChild size="lg">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
