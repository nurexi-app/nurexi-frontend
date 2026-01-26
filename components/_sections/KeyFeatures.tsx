import KeyFeatureSlide from "@/components/web/SwiperSlider";
import Image from "next/image";

const features = [
  {
    icon: "/assets/icons/practiceQuestion.svg",
    heading: "Practice Question Bank",
    text: "Access hundreds of NMCN-style questions to test your knowledge",
  },
  {
    icon: "/assets/icons/mockExam.svg",
    heading: "Mock Exams",
    text: "Simulate the real NMCN exam experience and build the confidence to ace it on test day.",
  },
  {
    icon: "/assets/icons/progressTracking.svg",
    heading: "Progress Tracking",
    text: "Monitor your improvement with detailed insights and stay on track toward exam success.",
  },
  {
    icon: "/assets/icons/educatorClasses.svg",
    heading: "Educator Content & Classes",
    text: "Learn directly from experienced nurses and educators through guided lessons and live classes",
  },
  {
    icon: "/assets/icons/mobileFriendly.svg",
    heading: "Mobile Friendly",
    text: "Study anytime, anywhere with a seamless experience across all your devices.",
  },
  {
    icon: "/assets/icons/feedback.svg",
    heading: "Personalized Feedback",
    text: "Get tailored insights and recommendations to strengthen your weak areas and boost your performance.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="container py-4 lg:py-12.5" id="key">
      <h1 className="text-center font-medium mt-8 mb-4">Key Features</h1>

      <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
        <div className="flex flex-col gap-6 lg:gap-3.5">
          {[...features].splice(0, 3).map(({ icon, text, heading }, idx) => (
            <div
              className="flex p-4 lg:p-8.5 border-[0.5px] border-secondary/15 shadow-md hover:shadow-2xl transition-all duration-150 gap-2 text-center items-center justify-center flex-col"
              key={idx}
            >
              <Image
                src={icon}
                alt={heading + "image"}
                width={48}
                height={48}
                className="h-12 w-12"
              />

              <h2 className="font-semibold">{heading}</h2>

              <p className="bodyText">{text}</p>
            </div>
          ))}
        </div>

        <KeyFeatureSlide />

        <div className="flex flex-col gap-6 lg:gap-3.5">
          {[...features].splice(-3).map(({ icon, text, heading }, idx) => (
            <div
              className="flex p-4 lg:p-8.5 border-[0.5px] border-secondary/15 shadow-md hover:shadow-2xl transition-all duration-150 gap-2 text-center items-center justify-center flex-col"
              key={idx}
            >
              <Image
                src={icon}
                alt={heading + "image"}
                width={48}
                height={48}
                className="h-12 w-12"
              />

              <h2 className="font-semibold">{heading}</h2>

              <p className="bodyText">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
