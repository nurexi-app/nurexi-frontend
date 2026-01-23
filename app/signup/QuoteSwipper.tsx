"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const quotes = [
  // Original / modern
  "How very little can be done under the spirit of fear. — Florence Nightingale",
  "Nursing isn’t just about passing exams; it’s about purpose. Every concept you master prepares you to make a real difference.",
  "Behind every correct answer is a patient who depends on your knowledge.",
  "You’re not just studying to pass — you’re studying to save lives.",
  "Every difficult question is sharpening the nurse you’re becoming.",
  "Consistency beats cramming. Mastery beats memorisation.",
  "What you’re learning today becomes someone’s hope tomorrow.",

  // Florence Nightingale
  "Nursing is an art: and if it is to be made an art, it requires as exclusive a devotion as painting or sculpture. — Florence Nightingale",

  "Let whoever is in charge keep this simple question in mind: how can I provide for this right thing to be always done? — Florence Nightingale",

  // Other nursing / care philosophy
  "To care for those who once cared for us is one of the highest honours.",
  "Nurses are there when the last breath is taken — and when the first breath is drawn.",
  "The character of a nurse is as important as the knowledge they possess.",
  "Caring is the essence of nursing.",

  // Closing motivation
  "This effort compounds. Stay with it.",
  "Exams test memory. Practice builds competence.",
  "You’re training for real moments, not just marks.",
];

export default function QuoteSwiper() {
  return (
    <div className="w-full left-1/2 -translate-1/2 absolute bottom-0 max-w-md overflow-hidden">
      <Swiper
        direction="vertical"
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={5}
        loop
        speed={700}
        autoplay={{
          delay: 5600,
          disableOnInteraction: false,
        }}
        className="h-27.5"
      >
        {quotes.map((quote, index) => (
          <SwiperSlide key={index}>
            <div className="h-27.5 rounded-xl border bg-card px-4 py-3 flex flex-col justify-around">
              <p className="bodyText leading-snug line-clamp-3">“{quote}”</p>

              <span className="text-xs font-semibold text-primary">Nurexi</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
