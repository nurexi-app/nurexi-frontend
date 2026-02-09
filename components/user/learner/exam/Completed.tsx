"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Award from "@/components/web/Success";
import { useAppContext } from "@/context/AppProvider";

const Completed = () => {
  const { answeredQuestionsProgress, setShowResult } = useAppContext();
  return (
    <div className="mt-12.5 min-h-[70dvh]">
      <div className="flex items-center flex-col mb-6 text-center">
        <Award />
        <div className="space-y-2">
          <h4>Exam Complete!</h4>
          <p className="bodyText text-muted-foreground">Here is your result</p>
        </div>

        <div className="space-y-2">
          <p className="bodyText text-muted-foreground">Your score</p>
          <h4>36/50</h4>
        </div>
        <div className="space-y-2">
          <p className="bodyText text-muted-foreground">Accuracy</p>
          <h4>72%</h4>
        </div>
      </div>

      <Progress value={answeredQuestionsProgress} />

      <div className="flex items-center gap-2">
        <Button onClick={() => setShowResult(false)} variant={"outline"}>
          View Explanations
        </Button>
        <Button onClick={() => setShowResult(false)}>Retake Exam</Button>
      </div>
    </div>
  );
};

export default Completed;
