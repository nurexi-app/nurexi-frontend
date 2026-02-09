import { useAppContext } from "@/context/AppProvider";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

const Timer = () => {
  const { setShowResult, examDuration } = useAppContext();
  const [timer, setTimer] = useState(examDuration);
  useEffect(() => {
    // Only run if timer is above 0
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (timer <= 0) {
      setShowResult(true);
    }
  }, [timer]);
  return (
    <p className={`${timer < 600 && "text-destructive"}`}>
      Time left:{formatTime(timer)}
    </p>
  );
};

export default Timer;
