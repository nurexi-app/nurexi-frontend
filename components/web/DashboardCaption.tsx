"use client";
import { motion } from "framer-motion";

const DashboardCaption = ({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) => {
  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="hidden md:flex h-29.25 rounded-[10px] px-4 bg-linear-to-r from-[#0C3A5F] via-[#2d76b1] to-[#6CB4EE] bg-[length:200%_200%] text-white/82 overflow-hidden flex-col justify-center relative gap-2"
    >
      <div className="relative z-10">
        <h2 className="max-sm:text-lg">{heading}</h2>
        <p>{text}</p>
      </div>

      {/* Animated Circles */}
      {[
        { size: "h-24 w-24", color: "from-[#a9ceec] to-[#388fd6]", delay: 0 },
        {
          size: "h-27 w-27",
          color: "from-[#a9ceec62] to-[#0e283d1c]",
          delay: 0.5,
        },
        {
          size: "h-35 w-35",
          color: "from-[#1b304162] to-[#222f3a1c]",
          delay: 1,
        },
      ].map((circle, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: circle.delay,
            ease: "easeInOut",
          }}
          className={`absolute -right-14 translate-x-1 bg-radial ${circle.color} rounded-full ${circle.size}`}
        />
      ))}
    </motion.div>
  );
};

export default DashboardCaption;

export function MobileCaptionHeaderCaption({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="md:hidden">
      <p className="font-normal text-sm leading-[130%]">{title}</p>
      <p className="font-normal text-[10px] leading-[130%]">{text}</p>
    </div>
  );
}
