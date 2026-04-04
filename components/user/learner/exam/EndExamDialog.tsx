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
  const { answers, questions, score, examType, session } = useAppSelector(
    (store) => store.exam,
  );
  const performanceBySubject = useAppSelector(selectPerformanceBySubject);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
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

    const response = await saveExamResult(payload);

    if (response.success && response.streakIncreased) {
      toast.success(`🔥 ${response.newStreak} day streak!`, {
        duration: 5000,
      });
    } else if (response.success) {
      toast.success("Results saved successfully!");
    } else if (!response.success) {
      toast.error(response.error || "Failed to save results");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setOpen(false);
    dispatch(submitExam());
  };

  const handleQuit = () => {
    dispatch(endExam());
    router.push("/learner/exam");
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
