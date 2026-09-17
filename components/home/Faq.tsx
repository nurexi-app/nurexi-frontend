import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
const Faq = () => {
  return (
    <section className="mx-auto grid max-w-360 gap-10 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-16">
      <div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-accent">
          Good to know
        </p>
        <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-semibold leading-[1.1] tracking-[-0.055em]">
          A little more clarity before you begin.
        </h2>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          className="border-t border-border"
        >
          <AccordionItem value="start" className="border-border">
            <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline">
              Where should I start?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
              Explore the learning and practice options, then pick the place
              that fits your current goal. You can also try the sample question
              above first.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quiz" className="border-border">
            <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline">
              Does the sample question track my progress?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
              No. This short sample is here to give you a feel for practice.
              Your choices on this page are not saved.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="more" className="border-border">
            <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline">
              Where can I find more information?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
              Browse Nurexi to see the learning and practice options available
              to you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link
          href="/faq"
          className="arrow-link mt-8 inline-flex min-h-11 items-center gap-2 text-base font-semibold underline underline-offset-4 hover:text-accent"
        >
          Visit the FAQ <ArrowRight aria-hidden="true" data-link-arrow="forward" className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default Faq;
