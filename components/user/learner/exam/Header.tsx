"use client";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { setExamType } from "@/lib/features/exam/examSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const examType = useAppSelector((state) => state.exam.examType);
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Mock Exams</h1>
        <p className="text-muted-foreground">
          Practice under real exam conditions
        </p>
      </div>

      {examType !== "all" && (
        <Button onClick={() => dispatch(setExamType("all"))}>Back</Button>
      )}
    </div>
  );
};

export default Header;
