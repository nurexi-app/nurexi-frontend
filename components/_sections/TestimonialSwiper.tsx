"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import TestimonialCard from "./TestimonialCard";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Ike Buchi",
    role: "Student",
    rating: 5,
    avatarFallback: "IB",
    text: "I love the practice questions on Nurexi! They helped me prepare thoroughly for my exams. The explanations are clear and easy to understand.",
  },
  {
    name: "Chioma Adebayo",
    role: "Nursing Student",
    rating: 5,
    avatarFallback: "CA",
    text: "The mock tests feel exactly like the real NMCN exam. It timed me perfectly and built my confidence so much before the big day.",
  },
  {
    name: "Tunde Olatunji",
    role: "Midwifery Candidate",
    rating: 5,
    avatarFallback: "TO",
    text: "Those free clinical resources are a lifesaver. They didn't just help me pass my tests, they actually made me a better, more grounded clinician.",
  },
  {
    name: "Aminat Bello",
    role: "Student Nurse",
    rating: 5,
    avatarFallback: "AB",
    text: "I was struggling with drug calculations until I used Nurexi. The step-by-step breakdowns make difficult topics incredibly simple to grasp.",
  },
  {
    name: "Emeka Okafor",
    role: "Repeat Candidate",
    rating: 5,
    avatarFallback: "EO",
    text: "After failing my first attempt, Nurexi changed everything for me. The structured progress tracking showed me exactly where I needed to improve.",
  },
  {
    name: "Funmi Okon",
    role: "Final Year Student",
    rating: 5,
    avatarFallback: "FO",
    text: "Highly recommended for any Nigerian nursing student! The platform is completely stress-free to navigate and worth every single second.",
  },
];

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
      {testimonials.map((item, index) => (
        <SwiperSlide key={index} className="pb-6">
          <TestimonialCard testimonial={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialSwiper;
