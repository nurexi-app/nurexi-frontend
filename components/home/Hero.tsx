import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
const Hero = () => {
  return (
    <section className="relative mx-auto grid max-w-360 gap-12 px-6 pb-20 pt-16 sm:px-10 sm:pt-24 lg:grid-cols-[1fr_0.94fr] lg:items-center lg:gap-14 lg:px-16 lg:pb-28 lg:pt-28">
      <div className="relative z-10 max-w-170">
        <p className="mb-7 text-xs font-bold uppercase tracking-[0.23em] text-accent">
          Nursing exam preparation, with direction
        </p>
        <h1 className="text-[clamp(3.25rem,6vw,6.75rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
          Study with purpose.{" "}
          <span className="text-accent">Walk in prepared.</span>
        </h1>
        <p className="mt-8 max-w-135 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Make every study session count. Explore nursing resources, practice
          what you know, and take your next step with confidence.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/learner"
            className="arrow-link inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-accent  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Explore Nurexi{" "}
            <ArrowRight
              aria-hidden="true"
              data-link-arrow="forward"
              className="size-5"
            />
          </Link>
          <Link
            href="/resources"
            className="arrow-link inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Browse free resources{" "}
            <ArrowRight
              aria-hidden="true"
              data-link-arrow="forward"
              className="size-4"
            />
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="relative aspect-4/4.5 overflow-hidden rounded-[2rem] bg-muted sm:aspect-5/4 lg:aspect-[4/4.7]">
          <Image
            src="/assets/confidentNurse.png"
            alt="Nursing student smiling while holding a phone"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-center "
          />
        </div>
        <div className="absolute -bottom-5 left-4 max-w-62.5 rounded-2xl bg-white p-5 shadow-[0_18px_50px_rgba(13,55,51,0.13)] sm:left-6 sm:max-w-72.5 sm:p-6">
          <span className="mb-3 inline-flex size-9 items-center justify-center rounded-full bg-secondary text-accent">
            <CheckCircle2 aria-hidden="true" className="size-5" />
          </span>
          <p className="text-lg font-semibold leading-snug tracking-tight">
            A more focused way to prepare.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
