import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-360 items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.23em] text-accent">Error 404</p>
          <h1 className="mt-6 text-[clamp(3rem,6vw,6rem)] font-semibold leading-none tracking-[-0.06em]">This page took a wrong turn.</h1>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">The page may have moved, or the address may be incomplete. Return home or browse Nurexi&apos;s nursing resources.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-6">
              <Link href="/"><ArrowLeft aria-hidden="true" /> Return home</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
              <Link href="/resources">Browse resources <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-3/2 overflow-hidden rounded-4xl bg-card">
          <Image src="/assets/notfound.png" alt="Nurse looking thoughtfully at a page not found message" fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
        </div>
      </div>
    </main>
  );
}
