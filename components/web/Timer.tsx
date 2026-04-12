"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { submitExam } from "@/lib/features/exam/examSlice";
import { selectPerformanceBySubject } from "@/lib/features/exam/customSelector";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveExamResult } from "@/lib/actions/exam-actions";

const Timer = () => {
  const { duration, startedAt, status, score, questions, session } =
    useAppSelector((store) => store.exam);
  const performanceBySubject = useAppSelector(selectPerformanceBySubject);
  const dispatch = useAppDispatch();

  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (status !== "in-progress" && !startedAt) return;

    if (status === "review") return;

    const interval = setInterval(() => {
      if (!startedAt) return;

      const timeElasped = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = duration - timeElasped;

      if (remaining <= 0) {
        setTimeRemaining(0);
        clearInterval(interval);

        // Save results before submitting
        // In Timer.tsx, when time runs out
        const saveAndSubmit = async () => {
          // Calculate totals from performanceBySubject
          let totalCorrect = 0;
          let totalQuestions = 0;

          Object.values(performanceBySubject).forEach((subject) => {
            totalCorrect += subject.correct;
            totalQuestions += subject.total;
          });

          const result = {
            correctCount: totalCorrect,
            totalQuestions: totalQuestions,
            performanceBySubject: performanceBySubject,
            sessionId: session?.toString() || "",
          };

          const response = await saveExamResult(result);

          if (response.success && response.streakIncreased) {
            toast.success(`🔥 ${response.newStreak} day streak!`);
          } else if (!response.success) {
            toast.error("Failed to save exam result");
          }

          dispatch(submitExam());
        };

        saveAndSubmit();

        toast("Time up!", {
          duration: 5000,
          description: (
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">
              Please work faster next time
            </div>
          ),
        });
      }

      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    status,
    startedAt,
    duration,
    session,
    dispatch,
    score,
    performanceBySubject,
    questions,
  ]);

  return (
    <p className={`${timeRemaining < 600 && "text-destructive"}`}>
      Time left:{formatTime(timeRemaining)}
    </p>
  );
};

export default Timer;
