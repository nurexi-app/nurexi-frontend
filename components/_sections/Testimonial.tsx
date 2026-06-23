import Image from "next/image";
import LoveShape from "../web/LoveShape";
import TestimonialCTA from "./TestimonialCTA";
import TestimonialSwiper from "./TestimonialSwiper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Star from "../web/Star";
import CountUp from "../helpers/CountUp";
import {
  getApprovedTestimonials,
  getTestimonialStats,
} from "@/lib/actions/testimonial-actions";
const Testimonial = async () => {
  // const [testimonialStats, approvedTestimonials] = await Promise.all([
  //   getTestimonialStats(),
  //   getApprovedTestimonials(),
  // ]);

  // console.log("log obj: ", {
  //   stats: testimonialStats,
  //   testimonials: approvedTestimonials,
  // });
  return (
    <section className="bg-[#F0F8FF] py-12 px-4" id="testimonials">
      <div className=" max-w-150 mx-auto mb-8">
        <h3 className="text-2xl md:text-3xl text-center mb-4 font-normal">
          People love us and it shows.
        </h3>

        <div className=" flex justify-between  h-40 mb-4 md:mb-0 md:h-64 w-full ">
          <div className="basis-[30%]  h-[100px] lg:w-48 lg:h-50  flex flex-col justify-center items-center text-center gap-2 md:h-[160px]  bg-[#4541FE] ml-8 rounded-t-[1rem] md:rounded-t-[2rem] rounded-br-[1rem] md:rounded-br-[2rem]">
            <h5 className="text-white font-bold text-3xl md:text-4xl">
              <CountUp to={10} from={0} duration={3} />
              <span>K+</span>
            </h5>
            <h6 className="text-white subText">Positive reviews*</h6>
          </div>

          <LoveShape className="basis-[32%] h-[97.6px] lg:h-[204.61px] self-center" />

          <div className="basis-[32%]  h-[100px] lg:w-48 lg:h-50 flex flex-col justify-center p-4  gap-2 md:h-[160px]  bg-white rounded-t-[1rem] md:rounded-t-[2rem] rounded-br-[1rem] md:rounded-br-[2rem]">
            <h5 className="text-black font-semibold text-lg md:text-2xl">
              <CountUp to={500} from={0} duration={3} /> <span>+</span>
            </h5>
            <h6 className="text-black subText">Exam focused Questions</h6>

            <Image
              src={"/Logo.svg"}
              alt="logo"
              width={40}
              height={40}
              className="hidden md:block"
            />
          </div>
        </div>

        <div className=" flex justify-between gap-4 md:gap-8  w-full ">
          <div className=" -mt-6 w-[100px] md:w-[150px] h-[100px] lg:w-48 lg:h-50  flex flex-col justify-center items-center text-center gap-2 md:h-[160px]  bg-[#D9C6FF] ml-4 rounded-t-[1rem] md:rounded-t-[2rem] md:rounded-br-[2rem] rounded-br-[1rem] basis-[30%]">
            <div className="bg-black px-2 py-1 -mb-2 rounded-2xl">
              <Star ratingNumber={5} className="w-3 h-3" />
            </div>
            <h5 className="text-black font-semibold text-3xl md:text-4xl">
              <CountUp to={4.5} from={0} duration={3} /> / 5
            </h5>
            <h6 className="text-black subText">Overall rating*</h6>
          </div>

          <div className="h-36 md:h-72 basis-7/10 flex flex-col justify-center bg-[#0F1722] text-white p-2 md:p-6 rounded-b-[1rem] md:rounded-b-[2rem] rounded-tr-[1rem] md:rounded-tr-[2rem]">
            <p className="mb-4 text-[8px] md:text-lg">
              I built Nurexi to make NMCN exam prep simple and stress-free. With
              practice questions, mock tests, and free resources to keep you
              clinically grounded, my goal is to ensure you walk into exam day
              fully prepared and confident.
            </p>

            <div className="flex gap-4 items-center">
              <Avatar className="md:size-15 size-10">
                <AvatarImage src={""} />
                <AvatarFallback className="">OC</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium text-sm">Ochife Ogechukwu</p>
                <p className="subText text-[#78767D4D]">Creator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" container  mb-16">
        <TestimonialSwiper />
      </div>
      <TestimonialCTA />
    </section>
  );
};

export default Testimonial;
