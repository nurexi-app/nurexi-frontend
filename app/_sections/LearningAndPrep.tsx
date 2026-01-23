import Image from "next/image";

const options = [
  {
    heading: "Sign up & Set Goals",
    text: "Create your account, set your study goals, and personalize your exam prep journey.",
    src: "/assets/icons/Target.svg",
  },
  {
    heading: "Explore Courses Practice, Take Mocks",
    text: "Dive into practice questions, attempt mock exams, and learn through interactive classes.",
    src: "/assets/icons/machineLearning.svg",
  },
  {
    heading: "Track Your Progress & Improve",
    text: "Review your results, identify weak spots, and watch your performance improve with every session",
    src: "/assets/icons/Thinking.svg",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F0F8FF] py-12 px-4" id="How">
      <div className="mx-auto text-center md:text-left mt-10 max-w-150 mb-18 space-y-3">
        <h2 className="text-2xl font-medium">
          Learning & Prep for Health Careers
        </h2>
        <p className="bodyText text-grey">
          From practice questions to mock exams and detailed explanations,
          Nursify brings complete exam prep closer to every nursing student.
        </p>
      </div>

      <div className="grid container grid-cols-1 md:grid-cols-6 gap-4">
        <div className="rounded-2xl px-6 py-8 space-y-16 lg:space-y-8 col-span-full md:col-span-4 bg-background">
          {options.map(({ src, heading, text }, index) => (
            <div className="flex items-center  justify-between" key={index}>
              <div className="">
                <h3 className="font-medium mb-2.5">{heading}</h3>
                <p className="bodyText leading-2.5 text-grey max-w-[75%]  ">
                  {text}
                </p>
              </div>
              <div className="relative w-20 h-20 lg:w-23.75 lg:h-23.75">
                <Image src={src} fill alt="icon" />
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2 relative h-full">
          <Image
            src={"/assets/howItWorks.png"}
            fill
            alt="how it works image"
            // className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
