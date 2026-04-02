"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-text-line", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
      })
        .from(
          ".heroHeading",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.3",
        )
        .from(
          ".heroParagraph",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.3",
        )
        .from(
          ".hero-buttons",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          imageRef.current,
          {
            scale: 0.96,
            opacity: 0,
            x: 40,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        );
    },
    { scope: containerRef },
  );

  const handleGetStarted = () => {
    router.push("/learner");
  };

  const handleExplore = () => {
    router.push("/learner/exam");
  };

  return (
    <section ref={containerRef} className="container mt-22 mb-6 lg:my-12.5 ">
      <div className="flex items-center flex-col md:flex-row gap-4 justify-between">
        {/* Hero Text */}
        <div ref={textRef} className="md:basis-[48%]    tex-left">
          <p className="hero-text-line bodyText mb-3 md:mb-6.5 text-primary w-fit p-2 rounded-2xl">
            ✨ Reliable Learning, Anytime
          </p>
          <h1 className="heroText heroHeading font-normal px-0  max-sm:w-[80vw]    mb-2.5">
            <span className="hero-text-line">
              The easiest way to prepare and
            </span>
            <span className="hero-text-line">
              <span className="font-semibold"> Pass</span> your
              <span className="font-semibold">NMCN</span> exams
            </span>
          </h1>
          <p className="heroParagraph">
            Ace your Nursing exam with expert guidance, realistic practice
            tests, and smart tools built to boost your confidence.
          </p>
          <div className="hero-buttons flex flex-col md:flex-row items-center gap-2 max-sm:justify-center mt-6">
            <Button
              onClick={handleGetStarted}
              className="hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 ease-out w-full md:w-fit"
            >
              Get Started
            </Button>
            <Button
              variant={"outline"}
              onClick={handleExplore}
              className="hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 ease-out w-full md:w-fit "
            >
              Explore
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div
          ref={imageRef}
          className="md:basis-[50%] w-full h-80 md:h-130 relative"
        >
          <Image
            src={"/assets/heroImage.png"}
            alt="hero image"
            className="object-contain"
            fill
            priority={true}
            sizes="(max-width: 768px) 100%, (max-width: 1200px) 650px"
          />
        </div>
      </div>
    </section>
  );
}
