import Image from "next/image";

const faqs = [
  {
    heading: "What is Nurexi?",
    text: "Nurexi is a learning and exam prep platform designed to help nursing students pass the NMCN exam with confidence. It offers practice questions, mock exams, educator-led classes, and performance tracking tools.",
  },
  {
    heading: "How does Nurexi work?",
    text: "You sign up, set your study goals, and start learning through question banks, mock exams, and classes. Nurexi tracks your progress and provides personalized feedback to help you improve.",
  },
  {
    heading: "Who creates the content on Nurexi?",
    text: "Our questions and study materials are developed by experienced nurses and certified educators who understand the NMCN exam structure and what students need to succeed.",
  },
];
export default function FAQSection() {
  return (
    <section className="container py-16" id="faqs">
      <h3 className="text-center font-medium mb-10">FAQ</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {faqs.map(({ heading, text }, index) => (
          <div
            className="h-60 px-6 py-7.5 border-[0.5px] border-primary/15 "
            key={index}
          >
            <Image
              src={"/assets/icons/questionMark.svg"}
              alt={heading + "image"}
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <h3 className=" font-medium text-black/80 mb-5.5 mt-3.5">
              {heading}
            </h3>
            <p className="bodyText text-grey">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
