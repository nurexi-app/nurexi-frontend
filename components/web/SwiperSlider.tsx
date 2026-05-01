"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import hero1 from "@/public/assets/keyFeatures.jpg";
import hero2 from "@/public/assets/hero2.png";
import hero3 from "@/public/assets/hero3.png";
import hero4 from "@/public/assets/stethoscope.png";

const heroImages = [hero1, hero2, hero3, hero4];

export default function KeyFeatureSlide() {
  return (
    <div className="w-full h-[95%] rounded-2xl hidden md:block relative overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        allowTouchMove={false} // ❌ no swiping by user
        slidesPerView={1}
        className="w-full h-full"
      >
        {heroImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={src}
              alt={`Hero image ${idx + 1}`}
              fill
              className="object-cover rounded-2xl"
              fetchPriority={idx === 0 ? "high" : "low"}
              placeholder="blur"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
