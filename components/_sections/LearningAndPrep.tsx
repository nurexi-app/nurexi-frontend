"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mx-auto text-center md:text-left mt-10 max-w-150 mb-18 space-y-3"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-2xl font-medium"
        >
          Learning & Prep for Health Careers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bodyText text-grey"
        >
          From practice questions to mock exams and detailed explanations,
          Nurexi brings complete exam prep closer to every nursing student.
        </motion.p>
      </motion.div>

      <div className="grid container grid-cols-1 md:grid-cols-6 gap-4">
        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="rounded-2xl px-6 py-8 space-y-16 lg:space-y-8 col-span-full md:col-span-4 bg-background"
        >
          {options.map(({ src, heading, text }, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-between group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Text */}
              <div>
                <h3 className="font-medium mb-2.5">{heading}</h3>
                <p className="bodyText leading-2.5 text-grey max-w-[75%]">
                  {text}
                </p>
              </div>

              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative w-20 h-20 lg:w-23.75 lg:h-23.75"
              >
                <Image src={src} fill alt="icon" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-sm:hidden md:col-span-2 relative h-full"
        >
          <Image src={"/assets/howItWorks.png"} fill alt="how it works image" />
        </motion.div>
      </div>
    </section>
  );
}
