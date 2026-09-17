import { SampleQuiz } from "./sample-quiz";

const Quiz = () => {
  return (
    <section id="sample-question" className="scroll-mt-20 bg-secondary/60">
      <div className="mx-auto grid max-w-360 gap-12 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-16">
        <div className="max-w-122.5">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-accent">
            A moment to practice
          </p>
          <h2 className="text-[clamp(2.6rem,4.4vw,4.8rem)] font-semibold leading-[1.08] tracking-[-0.055em]">
            Ready to put your thinking to work?
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
            Try a short nursing question. Take your time, choose an answer, and
            see the reasoning before you move on.
          </p>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            This sample is for practice. Your answers here are not saved.
          </p>
        </div>
        <SampleQuiz />
      </div>
    </section>
  );
};

export default Quiz;
