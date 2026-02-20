"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const heroImages = [
  "/assets/keyFeatures.jpg",
  "/assets/hero2.png",
  "/assets/hero3.png",
  "/assets/stethoscope.png",
];

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
              priority={idx === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
