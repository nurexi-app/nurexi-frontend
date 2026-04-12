"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HelporQuestions() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Select the children of the inner div (h5, p, and Button)
      const elements =
        containerRef.current?.querySelectorAll(".animate-reveal");

      if (elements) {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Trigger when the section is 85% down the screen
            toggleActions: "restart none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15, // Creates the sequential reveal effect
          ease: "power3.out",
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="bg-secondaryDarkActive h-60 py-12 pb-15 text-center flex items-center flex-col text-white"
    >
      <div className="gap-2 flex items-center flex-col max-w-200">
        <h5 className="text-2xl animate-reveal">
          Need help or any additional questions?
        </h5>
        <p className="bodyText mb-4 animate-reveal">
          Reach out directly! We&apos;re here to help you every step of the way.
        </p>

        <div className="animate-reveal">
          <Button asChild>
            <Link href={`mailto:nurexi.team@gmail.com`}>Get in touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
