import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="container mt-12 my-6 lg:my-12.5">
      <div className="flex items-center flex-col md:flex-row gap-4 justify-between">
        {/* hero text */}
        <div className="md:basis-[48%] max-sm:text-center">
          <p className="bodyText  mb-6.5 text-primary">
            – Reliable Learning, Anytime
          </p>
          <h1 className="heroText font-normal mb-2.5">
            The easiest way to prepare and{" "}
            <span className="font-semibold">Pass</span> your{" "}
            <span className="font-semibold">NMCN</span> exams
          </h1>
          <div className="flex items-center gap-2 max-sm:justify-center">
            <Button className="hover:scale-105 transition-all duration-150 ease-in-out">
              Get Started
            </Button>
            <Button variant={"outline"}>Explore</Button>
          </div>
        </div>

        <div className="md:basis-[50%] w-full  h-80 md:h-130  relative">
          <Image
            src={"/assets/heroImage.png"}
            alt="hero image"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </section>
  );
}
