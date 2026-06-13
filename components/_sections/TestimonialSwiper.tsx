"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import TestimonialCard from "./TestimonialCard";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const TestimonialSwiper = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 7000,
      }}
      loop
      allowTouchMove={true}
      keyboard={true}
      centeredSlides={true}
      spaceBetween={16}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <SwiperSlide key={index} className="pb-6">
          <TestimonialCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialSwiper;
