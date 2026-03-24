"use client";

import ExamTypeCard from "@/components/web/ExamTypeCard";
import { useAppSelector } from "@/hooks/StoreHooks";
import ExamSession from "./ExamSession";

const SelectExamType = ({ examsData }: { examsData: any[] }) => {
  const { examType } = useAppSelector((store) => store.exam);
  return (
    <>
      {/* ALL EXAM TYPES */}
      {/* {examType === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examsData.map((exam) => (
            <ExamTypeCard key={exam.id} {...exam} />
          ))}
        </div>
      )} */}

      <ExamSession />
    </>
  );
};

export default SelectExamType;
