"use client";

import { ArrowRight } from "lucide-react";
import PracticeConfigModal from "./PracticeConfigModal";

interface PracticeCardProps {
  id: number;
  name: string;
  questionCount: number;
  description?: string;
  image?: string;
}

const PracticeCard = ({
  id,
  name,
  questionCount,
  description = "Practice questions to strengthen your knowledge",
  image,
}: PracticeCardProps) => {
  return (
    <PracticeConfigModal id={id} name={name}>
      <button
        type="button"
        className="group block w-full text-left h-44 rounded-2xl overflow-hidden relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
      {/* ── background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
        style={{
          backgroundImage: `url("${image || `https://placehold.co/400x200?text=${encodeURIComponent(name)}`}")`,
        }}
      />

      {/* ── gradient overlays ── */}
      {/* base dark scrim for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
      {/* subtle colour tint from bottom */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/30" />

      {/* ── hover shine ── */}
      <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ── border ── */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300" />

      {/* ── content ── */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* top: question count pill */}
        <div className="flex justify-end">
          <span className="text-[11px] font-semibold tracking-wide bg-white/15 backdrop-blur-md border border-white/20 text-white/90 rounded-full px-2.5 py-1">
            {questionCount} Qs
          </span>
        </div>

        {/* bottom: name + description + arrow */}
        <div className="space-y-1">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-white font-bold text-[15px] leading-snug tracking-tight line-clamp-1">
                {name}
              </h3>
              <p className="text-white/55 text-[12px] leading-relaxed line-clamp-2 mt-0.5">
                {description}
              </p>
            </div>

            {/* arrow button */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white group-hover:border-white group-hover:scale-110">
              <ArrowRight
                size={14}
                className="text-white group-hover:text-black duration-200 group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      </button>
    </PracticeConfigModal>
  );
};

export default PracticeCard;
