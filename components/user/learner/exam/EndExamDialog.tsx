"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { endExam, submitExam } from "@/lib/features/exam/examSlice";
import { selectPerformanceBySubject } from "@/lib/features/exam/customSelector";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { saveExamResult } from "@/lib/actions/exam-actions";

const EndExamDialog = ({
  type = "finish",
  children,
}: {
  type: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { answers, questions, score, examType, session, mode } = useAppSelector(
    (store) => store.exam,
  );
  const performanceBySubject = useAppSelector(selectPerformanceBySubject);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (mode === "learning") {
      dispatch(submitExam());
      return;
    }
    setIsSaving(true);

    // Calculate totals from performanceBySubject
    let totalCorrect = 0;
    let totalQuestions = 0;

    Object.values(performanceBySubject).forEach((subject: any) => {
      totalCorrect += subject.correct;
      totalQuestions += subject.total;
    });

    const payload = {
      correctCount: totalCorrect,
      totalQuestions: totalQuestions,
      performanceBySubject: performanceBySubject,
      sessionId: session?.toString() || "",
    };

    try {
      const response = await saveExamResult(payload);

      if (response.streakIncreased) {
        toast.success(`🔥 ${response.newStreak} day streak!`, {
          duration: 5000,
        });
      } else {
        toast.success("Results saved successfully!");
      }

      setIsSaving(false);
      setOpen(false);
      dispatch(submitExam());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save results",
      );
      setIsSaving(false);
    }
  };

  const handleQuit = () => {
    dispatch(endExam());
    router.push(mode === "learning" ? "/learner/practice" : "/learner/exam");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You have answered {answers.length} out of {questions.length}{" "}
            questions.
          </DialogDescription>

          <DialogDescription>
            This action cannot be undone. This will submit your exam.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {type === "finish" ? (
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={handleQuit}>
              Quit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndExamDialog;
