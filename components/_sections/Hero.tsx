"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import MockQuizCard from "../web/MockQuiz";

function FloatingBadge({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 14,
        padding: "6px 12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontSize: 12,
        fontWeight: 600,
        color: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.5 })
        .from(
          ".hero-text-line",
          { y: 28, opacity: 0, duration: 0.65, stagger: 0.07 },
          "-=0.2",
        )
        .from(".hero-para", { y: 16, opacity: 0, duration: 0.55 }, "-=0.3")
        .from(".hero-buttons", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          ".hero-right",
          { opacity: 0, x: 30, duration: 0.75, ease: "power2.out" },
          "-=0.5",
        )
        .from(".hero-badge-1", { opacity: 0, y: 10, duration: 0.4 }, "-=0.3")
        .from(".hero-badge-2", { opacity: 0, y: -10, duration: 0.4 }, "-=0.2");
    },
    { scope: containerRef },
  );

  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 oklch(78.07% 0.117 166.71 / 0.35); }
          70% { box-shadow: 0 0 0 10px oklch(78.07% 0.117 166.71 / 0); }
          100% { box-shadow: 0 0 0 0 oklch(78.07% 0.117 166.71 / 0); }
        }
        .badge-float { animation: floatY 4s ease-in-out infinite; }
        .badge-float-delay { animation: floatY 4s ease-in-out infinite; animation-delay: 2s; }
        .cta-pulse { animation: pulse-ring 2.5s ease infinite; animation-delay: 2.5s; }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .hero-right {
            margin-top: 1rem;
          }
        }
      `}</style>

      <section
        ref={containerRef}
        className="container px-4 sm:px-6 mx-auto mt-20 md:mt-20 mb-8 sm:mb-10 lg:mt-24 lg:mb-16"
      >
        <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-8 justify-between">
          {/* LEFT - Text Content */}
          <div className="w-full  ">
            <h1 className="font-normal mb-4" style={{ lineHeight: 1.2 }}>
              <span className="hero-text-line text-3xl sm:text-4xl lg:text-5xl font-light text-gray-700">
                The easiest way to
              </span>
              <span className="hero-text-line text-3xl sm:text-4xl lg:text-5xl my-2">
                <span
                  className="font-bold inline-block mx-1 sm:mx-2"
                  style={{ color: "oklch(55% 0.117 166.71)" }}
                >
                  Pass <br />
                </span>
                your <span className="font-bold">Nursing </span>
              </span>
              <span className="hero-text-line  text-3xl sm:text-4xl lg:text-5xl font-light text-gray-700">
                exams
              </span>
            </h1>

            <p className="hero-para text-sm sm:text-base text-gray-500 leading-relaxed mb-6 sm:mb-8 max-w-md">
              Ace your Nursing exam with expert guidance, realistic practice
              tests, and smart tools built to boost your confidence.
            </p>

            <div className="hero-buttons flex flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push("/learner")}
                className="cta-pulse w-1/2 sm:w-auto hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
                size="default"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/learner/exam")}
                className="w-1/2 sm:w-auto hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
                size="default"
              >
                Explore exams →
              </Button>
            </div>

            <div className="mt-6 sm:mt-8 flex items-center gap-4 hero-para">
              <div className="flex -space-x-2">
                {["#7dcf90", "#5db87a", "#3d9e62", "#2a7a4b"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {["N", "R", "X", "I"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                <span className="font-semibold text-gray-700">1,500+</span>{" "}
                nurses & students trust our prep platform
              </p>
            </div>
          </div>

          {/* RIGHT - Quiz Card */}
          <div
            className="hero-right w-full  relative"
            style={{ paddingTop: 20, paddingBottom: 20 }}
          >
            {/* glow effect - hidden on small screens */}
            <div
              className="hidden sm:block"
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "radial-gradient(ellipse 75% 65% at 50% 50%, oklch(78.07% 0.117 166.71 / 0.12) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* badge top-left - reposition for mobile */}
            <div
              className="hero-badge-1 badge-float"
              style={{
                position: "absolute",
                top: -8,
                left: 0,
                zIndex: 10,
              }}
            >
              <FloatingBadge>
                <span className="hidden xs:inline">Try it now</span>
                <span className="inline xs:hidden">Try</span>
              </FloatingBadge>
            </div>

            {/* badge bottom-right - reposition for mobile */}
            <div
              className="hero-badge-2 badge-float-delay"
              style={{
                position: "absolute",
                bottom: -8,
                right: 0,
                zIndex: 10,
              }}
            >
              <FloatingBadge>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "oklch(78.07% 0.117 166.71)",
                    display: "inline-block",
                  }}
                />
                <span className="hidden xs:inline">Interactive quiz</span>
                <span className="inline xs:hidden">Quiz</span>
              </FloatingBadge>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <MockQuizCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
