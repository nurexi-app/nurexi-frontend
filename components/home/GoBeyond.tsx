import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const GoBeyond = () => {
  return (
    <section className="mx-auto grid max-w-360 gap-14 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-2 lg:items-center lg:gap-24 lg:px-16 lg:py-40">
      <div className="relative aspect-4/4 overflow-hidden rounded-[2rem] bg-muted sm:aspect-5/4 lg:aspect-4/4.5">
        <Image
          src="/assets/image2.png"
          alt="Learner using Nurexi on a phone"
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover! object-right"
        />
      </div>
      <div className="max-w-140">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-accent">
          Learn, then apply
        </p>
        <h2 className="text-[clamp(2.6rem,4.6vw,5rem)] font-semibold leading-[1.07] tracking-[-0.055em]">
          Go beyond getting the answer right.
        </h2>
        <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
          Good preparation gives you room to learn and opportunities to use what
          you have learned. Build understanding through resources and put it to
          work through practice.
        </p>
        <Link
          href="/resources"
          className="arrow-link mt-9 inline-flex min-h-12 items-center gap-3 border-b border-primary text-base font-semibold transition-colors hover:text-accent  focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Read nursing resources{" "}
          <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-5" />
        </Link>
      </div>
    </section>
  );
};

export default GoBeyond;
