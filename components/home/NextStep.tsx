import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NextStep = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-360 gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:px-16">
        <div className="max-w-182.5">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-primary-foreground/80">
            Your next step starts here
          </p>
          <h2 className="text-[clamp(2.7rem,4.8vw,5.25rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
            Make room for the kind of preparation that moves you forward.
          </h2>
          <p className="mt-7 max-w-140 text-lg leading-relaxed text-primary-foreground/75">
            Find a way to learn and practice that fits your nursing journey.
          </p>
          <Link
            href="/explore"
            className="arrow-link mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary-foreground px-8 font-semibold text-primary transition-colors hover:bg-secondary  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
          >
            Browse exam prep bundles{" "}
            <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-5" />
          </Link>
        </div>
        <div className="relative aspect-5/4 overflow-hidden rounded-[2rem] bg-secondary">
          <Image
            src="/assets/image1.png"
            alt="Nursing students studying together"
            fill
            sizes="(max-width: 1024px) 100vw, 37vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default NextStep;
