"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Award from "@/components/web/Success";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";

const Completed = () => {
  const { score } = useAppSelector((store) => store.exam);
  const dispatch = useAppDispatch();
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
          <h4>
            {score?.correct}/{score?.total}
          </h4>
        </div>
        <div className="space-y-2">
          <p className="bodyText text-muted-foreground">Accuracy</p>
          <h4>{score?.percentage}%</h4>
        </div>
      </div>

      <Progress value={score?.percentage} />

      <div className="flex items-center w-full justify-center gap-4">
        <Button
          onClick={() => console.log("view explanations")}
          variant={"outline"}
        >
          View Explanations
        </Button>
        <Button onClick={() => console.log("retake exam")}>Retake Exam</Button>
      </div>
    </div>
  );
};

export default Completed;
