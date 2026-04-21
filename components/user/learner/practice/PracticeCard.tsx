"use client";

import { useAppDispatch } from "@/hooks/StoreHooks";
import { setMode } from "@/lib/features/exam/examSlice";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

interface PracticeCardProps {
  id: number;
  name: string;
  questionCount: number;
  description?: string;
  imageUrl?: string;
}

const PracticeCard = ({
  id,
  name,
  questionCount,
  description = "Practice questions to strengthen your knowledge",
  imageUrl = "https://fudndaljoprnyhpidjkm.supabase.co/storage/v1/object/public/subject_images/pharmacology/pharmacology.jpg",
}: PracticeCardProps) => {
  const dispatch = useAppDispatch();
  return (
    <Link
      onClick={() => {
        dispatch(setMode("learning"));
      }}
      href={`/learner/practice/${id}`}
      className="h-40 block"
    >
      <div
        className="h-full w-full space-y-4 group/item border-[0.5px] transition duration-200 cursor-pointer bg-background hover:shadow border-secondaryLightActive rounded-[10px] p-4 pb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url("${imageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-black/20 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <p className="text-white/80 text-sm mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 text-xs rounded-full text-white">
              {questionCount} questions
            </span>
            <MdKeyboardArrowRight
              size={20}
              className="text-white group-hover/item:translate-x-1 transition duration-200"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PracticeCard;
