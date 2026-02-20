import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { setExamStatus, submitExam } from "@/lib/features/exam/examSlice";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Timer = () => {
  const { duration, startedAt, status } = useAppSelector((store) => store.exam);
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
        dispatch(submitExam());
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
  }, [status, startedAt, duration]);

  return (
    <p className={`${timeRemaining < 600 && "text-destructive"}`}>
      Time left:{formatTime(timeRemaining)}
    </p>
  );
};

export default Timer;
