"use client";

import KeyFeatureSlide from "@/components/web/SwiperSlider";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "/assets/icons/practiceQuestion.svg",
    heading: "Practice Question Bank",
    text: "Access hundreds of NMCN-style questions to test your knowledge",
  },
  {
    icon: "/assets/icons/mockExam.svg",
    heading: "Mock Exams",
    text: "Simulate the real NMCN exam experience and build the confidence to ace it on test day.",
  },
  {
    icon: "/assets/icons/progressTracking.svg",
    heading: "Progress Tracking",
    text: "Monitor your improvement with detailed insights and stay on track toward exam success.",
  },
  {
    icon: "/assets/icons/educatorClasses.svg",
    heading: "Educator Content & Classes",
    text: "Learn directly from experienced nurses and educators through guided lessons and live classes",
  },
  {
    icon: "/assets/icons/mobileFriendly.svg",
    heading: "Mobile Friendly",
    text: "Study anytime, anywhere with a seamless experience across all your devices.",
  },
  {
    icon: "/assets/icons/feedback.svg",
    heading: "Personalized Feedback",
    text: "Get tailored insights and recommendations to strengthen your weak areas and boost your performance.",
  },
];

export default function KeyFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const centerSlideRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const isMobile = window.innerWidth < 768;

      gsap.fromTo(
        headingRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scale: 1,
          ease: "power1",
          scrollTrigger: {
            trigger: headingRef.current,
            start: isMobile ? "top 95%" : "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Animate left column cards
      const leftCards =
        leftColumnRef.current?.querySelectorAll(".feature-card");
      if (leftCards && leftCards.length) {
        gsap.fromTo(
          leftCards,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scale: 1,
            stagger: 0.15,
            ease: "power1",
            scrollTrigger: {
              trigger: leftColumnRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Animate center slide
      gsap.fromTo(
        centerSlideRef.current,
        {
          scale: 0.95,
          opacity: 0,
          y: 40,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power1",
          scrollTrigger: {
            trigger: centerSlideRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Animate right column cards
      const rightCards =
        rightColumnRef.current?.querySelectorAll(".feature-card");
      if (rightCards && rightCards.length) {
        gsap.fromTo(
          rightCards,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,

            stagger: 0.15,
            ease: "power1",
            scrollTrigger: {
              trigger: rightColumnRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="container py-4 lg:py-12.5" id="key">
      <h1 ref={headingRef} className="text-center font-medium mt-8 mb-4">
        Key Features
      </h1>

      <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
        {/* Left Column - First 3 features */}
        <div ref={leftColumnRef} className="flex flex-col gap-6 lg:gap-3.5">
          {features.slice(0, 3).map(({ icon, text, heading }, idx) => (
            <div
              key={idx}
              className="feature-card flex p-4 lg:p-8.5 border-[0.5px] border-secondary/15 shadow-md hover:shadow-2xl transition-all duration-300 gap-2 text-center items-center justify-center flex-col"
            >
              <Image
                src={icon}
                alt={heading + " image"}
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12"
              />
              <h2 className="font-semibold">{heading}</h2>
              <p className="bodyText">{text}</p>
            </div>
          ))}
        </div>

        {/* Center Slide */}
        <div ref={centerSlideRef}>
          <KeyFeatureSlide />
        </div>

        {/* Right Column - Last 3 features */}
        <div ref={rightColumnRef} className="flex flex-col gap-6 lg:gap-3.5">
          {features.slice(-3).map(({ icon, text, heading }, idx) => (
            <div
              key={idx}
              className="feature-card flex p-4 lg:p-8.5 border-[0.5px] border-secondary/15 shadow-md hover:shadow-2xl transition-all duration-300 gap-2 text-center items-center justify-center flex-col"
            >
              <Image
                src={icon}
                alt={heading + " image"}
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12"
              />
              <h2 className="font-semibold">{heading}</h2>
              <p className="bodyText">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
