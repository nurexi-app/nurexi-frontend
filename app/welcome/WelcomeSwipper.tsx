"use client";

import { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ClipboardCheck,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import GoalCard from "./GoalCard";
import { useRouter } from "next/navigation";
import { Welcome } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function WelcomeSwipper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const toggleGoal = (idx: number) => {
    setSelectedGoals(
      (prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx) // remove
          : [...prev, idx], // add
    );
  };

  const router = useRouter();
  return (
    <section className="relative max-w-203 w-full  bg-background min-h-102.5 p-6 lg:p-16 flex flex-col">
      {/* Skip */}
      {activeIndex < 2 && (
        <Button
          variant={"link"}
          className="absolute right-6 top-6 text-sm text-muted-foreground hover:text-primary"
          onClick={() => {
            router.push(`${process.env.NEXT_PUBLIC_APP_URL}/learner`);
          }}
        >
          Skip
        </Button>
      )}

      {/* Content: state-driven slider */}
      <div className="flex-1 w-full h-full grid place-items-center overflow-hidden relative">
        <div
          className="flex h-full  max-w-full transition-transform duration-500"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            width: `${2 * 100}%`,
          }}
        >
          {/* Slide 0 */}
          <div className="w-full shrink-0 h-full flex flex-col items-center justify-center text-center gap-4">
            <GraduationCap className="h-12 w-12 text-primary" />

            <h1 className=" font-semibold">Welcome to Nurexi</h1>

            <p className="text-muted-foreground bodyText max-w-md">
              Your comprehensive platform for nursing exam preparation,
              practice, and progress tracking.
            </p>

            <p className="text-sm text-muted-foreground max-w-md">
              Join thousands of nursing students who are achieving their dreams
              with personalised learning paths and comprehensive practice
              materials.
            </p>
          </div>

          {/* Slide 1 */}
          {/* <div className="w-full shrink-0 h-full flex flex-col justify-center gap-4">
            <h2 className="text-xl font-semibold text-center">
              What’s your learning goal?
            </h2>

            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  icon: BookOpen,
                  title: "Exam Prep",
                  text: "Prepare confidently for nursing exams",
                },
                {
                  icon: ClipboardCheck,
                  title: "Practice",
                  text: "Sharpen skills with real questions",
                },
                {
                  icon: Brain,
                  title: "Mastery",
                  text: "Build deep clinical understanding",
                },
              ].map((g, idx) => (
                <GoalCard
                  key={idx}
                  icon={g.icon}
                  title={g.title}
                  text={g.text}
                  selected={selectedGoals.includes(idx)}
                  onClick={() => toggleGoal(idx)}
                />
              ))}
            </div>
          </div> */}

          {/* Slide 2 */}
          <div className="w-full shrink-0 h-full  flex flex-col items-center justify-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />

            <h2 className="text-2xl font-semibold">You’re all set</h2>

            <p className="text-muted-foreground max-w-md">
              Let’s start building consistency, confidence, and competence — one
              session at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={clsx(
              " rounded-full transition-all",
              activeIndex === i
                ? "w-8 bg-primary h-2"
                : "w-2.5 rounded-full border h-2.5 bg-muted",
            )}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex((v) => Math.max(0, v - 1))}
        >
          Back
        </Button>

        <Button
          className="self-end"
          onClick={async () => {
            if (activeIndex === 1) {
              try {
                const res = await Welcome();
                if (res.success) {
                  if (!res.complete) {
                    toast.success("Welcome to Nurexi");
                  }
                  router.push(`${process.env.NEXT_PUBLIC_APP_URL}/learner`);
                }
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(error.message);
                }
                toast.error("Something went wrong");
                console.log(error);
              }
            } else {
              setActiveIndex((v) => Math.min(1, v + 1));
            }
          }}
        >
          {activeIndex === 1 ? "Get started" : "Next"}
        </Button>
      </div>
    </section>
  );
}
