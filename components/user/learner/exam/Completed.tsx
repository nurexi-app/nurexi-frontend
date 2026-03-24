"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Award from "@/components/web/Success";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { restartExam, reviewExam } from "@/lib/features/exam/examSlice";
import PerformanceBySubject from "./PerformanceBySubject";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Completed = ({ examCode }: { examCode: string }) => {
  const router = useRouter();
  const { score } = useAppSelector((store) => store.exam);
  const dispatch = useAppDispatch();
  // h-[calc(100vh-6rem)] lg:h-[calc(100vh-9rem)]
  return (
    <div className="mt-4 md:mt-6 p-4 min-h-[70dvh] relative">
      <FaTimes
        onClick={() => {
          router.push(`/learner/exam/${examCode}`);
        }}
        className="text-red-500 text-2xl absolute cursor-pointer top-0 right-0"
      />
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

      <Progress className="my-2" value={score?.percentage} />

      <PerformanceBySubject />

      <div className="flex items-center w-full justify-center gap-4">
        <Button onClick={() => dispatch(reviewExam())} variant={"outline"}>
          View Explanations
        </Button>
        <Button onClick={() => dispatch(restartExam())}>Retake Exam</Button>
      </div>
    </div>
  );
};

export default Completed;
