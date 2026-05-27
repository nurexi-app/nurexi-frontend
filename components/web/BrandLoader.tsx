"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PATHS = [
  "M368.524 46.1681H412.895L412.895 162.383C412.895 197.719 399.536 231.429 376.082 255.276L269.377 363.769C245.923 387.616 232.564 421.326 232.564 456.662V553.908H186.458L186.458 429.793C186.458 389.126 204.129 350.964 233.899 327.338L271.917 297.165L329.985 240.505C354.48 216.605 368.524 182.128 368.524 145.893V46.1681Z",
  "M50.5961 172.029H95.8835V423.788H50.5961V172.029Z",
  "M550.536 427.971H505.249V176.212H550.536V427.971Z",
  "M413.784 46.1681V96.5199H187.348V46.1681H413.784Z",
  "M186.215 553.832V503.48H412.652V553.832H186.215Z",
  "M50.5961 423.788L50.5956 373.436H175.555L175.375 374C170.276 389.947 168.324 406.927 169.652 423.788H50.5961Z",
  "M549.404 172.029V222.38H424.445L424.625 221.817C429.724 205.87 431.676 188.889 430.348 172.029H549.404Z",
  "M231.746 46.1681V136.509C231.746 183.945 197.159 222.399 154.494 222.399H50.5957L50.9112 171.952H133.708C163.368 171.952 187.412 145.219 187.412 112.243L187.096 46.1681H231.746Z",
  "M368.254 553.832V463.491C368.254 416.055 402.841 377.601 445.506 377.601H549.404L549.089 428.048H466.292C436.632 428.048 412.588 454.781 412.588 487.757L412.904 553.832H368.254Z",
  "M310.613 0V158.83C310.613 242.228 249.805 309.835 174.796 309.835H0L0.945364 259.195H167.848C219.011 259.195 261.605 215.528 265.746 158.83V7.68308e-05L310.613 0Z",
  "M289.387 600V441.17C289.387 357.772 350.195 290.165 425.204 290.165H600L599.055 340.805H432.152C380.989 340.805 338.395 384.472 334.254 441.17V600L289.387 600Z",
];

export default function BrandLoader({
  message = "Loading your study workspace...",
}: {
  message?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const paths = svgRef.current?.querySelectorAll("path");
      if (!paths) return;

      // 1. Structural entrance stagger for layout elements
      gsap.fromTo(
        [".loader-logo-frame", ".loader-text-area", ".loader-track-wrapper"],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      );

      // 2. Your core drawing loop (Enhanced duration & fluid ease configuration)
      paths.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.15,
          delay: i * 0.05,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/85 backdrop-blur-xl select-none"
    >
      {/* Immersive radial glow directly behind the loader content */}
      <div
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none opacity-20 filter blur-[80px]"
        style={{
          background: "radial-gradient(circle, #6CB4EE 0%, #5FD2B1 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 z-10 w-full max-w-sm px-6">
        {/* ─── LOGO FRAME CONTAINER ─── */}
        <div className="loader-logo-frame relative flex items-center justify-center">
          {/* Subtle slow-pulsing background ring */}
          <div className="absolute -inset-4 rounded-full border border-primary/5 bg-primary/1 scale-100 animate-[pulse_3s_ease-in-out_infinite]" />

          {/* The clean glassmorphic shield container */}
          <div className="relative h-20 w-20 rounded-2xl bg-white/2 dark:bg-black/5 border border-white/10 dark:border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center p-3.5">
            <svg
              ref={svgRef}
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_0_12px_rgba(108,180,238,0.4)]"
            >
              <defs>
                <linearGradient
                  id="logo-grad"
                  x1="600"
                  y1="300"
                  x2="0"
                  y2="300"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6CB4EE" />
                  <stop offset="1" stopColor="#5FD2B1" />
                </linearGradient>
              </defs>

              {PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="url(#logo-grad)"
                  strokeWidth={
                    24
                  } /* Boosted stroke width slightly for deeper neon definition */
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* ─── TEXT AREA ─── */}
        <div className="loader-text-area text-center space-y-1.5 mt-2">
          <h2 className="text-[13px] font-semibold text-foreground tracking-wide font-mono uppercase opacity-90">
            {message}
          </h2>
          <p className="text-[11px] text-muted-foreground/80 max-w-[240px] mx-auto leading-relaxed">
            Assembling clinical case scenarios and structural configurations...
          </p>
        </div>

        {/* ─── MINI PROGRESS TRACK BAR ─── */}
        <div className="loader-track-wrapper w-32 h-[3px] bg-muted/40 rounded-full overflow-hidden relative">
          <div
            className="h-full absolute top-0 left-0 rounded-full w-1/2 animate-[indeterminate_1.5s_infinite_ease-in-out]"
            style={{
              background: "linear-gradient(90deg, #6CB4EE, #5FD2B1)",
            }}
          />
        </div>
      </div>

      {/* Global styling injection for the specialized indeterminate bar motion */}
      <style>{`
        @keyframes indeterminate {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 110%; width: 30%; }
        }
      `}</style>
    </div>
  );
}
