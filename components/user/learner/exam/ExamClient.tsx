"use client";
import Completed from "@/components/user/learner/exam/Completed";
import Questions from "@/components/user/learner/exam/Questions";
import { useAppSelector } from "@/hooks/StoreHooks";
const ExamClient = ({
  questions,
  examCode,
  userId,
  displayName,
  examCount,
}: {
  questions: any[];
  examCode: string;
  userId: string;
  displayName: string;
  examCount: number;
}) => {
  const examStatus = useAppSelector((store) => store.exam.status);

  return (
    <div className="bg-white py-2 md:mt-2 px-6.25">
      {examStatus === "completed" && (
        <Completed
          examCode={examCode}
          userId={userId}
          examCount={examCount}
          displayName={displayName}
        />
      )}
      {(examStatus === "in-progress" || examStatus === "review") && (
        <Questions fetchedQuestions={questions} examCode={examCode} />
      )}
    </div>
  );
};

export default ExamClient;
