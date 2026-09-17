import { BookOpen, CheckCircle2, ClipboardList } from "lucide-react";
const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Find your starting point",
    description:
      "Explore study resources and choose the preparation that fits where you are today.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Put knowledge into practice",
    description:
      "Work through questions that help you think, decide, and learn from each answer.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Keep moving forward",
    description:
      "Return to your learning with a clearer sense of what to work on next.",
  },
];

const Path = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-360 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="max-w-200">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-primary-foreground/80">
            A path you can follow
          </p>
          <h2 className="text-[clamp(2.5rem,4.5vw,4.75rem)] font-semibold leading-[1.08] tracking-[-0.055em]">
            Preparation feels different when you know where to go next.
          </h2>
        </div>
        <div className="mt-16 grid gap-10 border-t border-white/20 pt-10 md:grid-cols-3 md:gap-12">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number}>
              <div className="mb-10 flex items-center justify-between text-primary-foreground/80">
                <span className="text-sm font-medium">{number} / 03</span>
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.6} />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-4 max-w-85 text-base leading-relaxed text-primary-foreground/75">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Path;
