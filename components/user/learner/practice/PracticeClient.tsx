"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { Question } from "@/lib/types/questions";
import { endExam, startPractice } from "@/lib/features/exam/examSlice";
import { Button } from "@/components/ui/button";
import Questions from "../exam/Questions";

interface PracticeClientProps {
  questions: Question[];
}

const PracticeClient = ({ questions }: PracticeClientProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { status, score } = useAppSelector((store) => store.exam);

  // Initialize practice session

  // Handle answer selection

  // Handle exit
  const handleExit = () => {
    dispatch(endExam());
    router.push(`/learner/practice`);
  };

  const handlePracticeAgain = () => {
    dispatch(startPractice({ questions, mode: "learning" }));
  };

  // Show loading while initializing
  // if (storeQuestions.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-pulse text-muted-foreground">
  //         Loading practice session...
  //       </div>
  //     </div>
  //   );
  // }

  // Show completion screen
  if (status === "completed") {
    return (
      <div className="container max-w-2xl mx-auto py-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Practice Complete!</h1>
        <p className="text-muted-foreground mb-4">
          You got {score.correct} out of {score.total} questions correct
        </p>
        <div className="text-4xl font-bold text-primary mb-8">
          {score.percentage}%
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleExit}>
            Back to Subjects
          </Button>
          <Button onClick={() => handlePracticeAgain()}>Practice Again</Button>
        </div>
      </div>
    );
  }

  return <Questions fetchedQuestions={questions} examCode={"learning"} />;
};

export default PracticeClient;
