"use client";
import Completed from "@/components/user/learner/exam/Completed";
import NMCNQuestions from "@/components/user/learner/exam/NMCNQuestion";
import { useAppSelector } from "@/hooks/StoreHooks";
const ClientPage = () => {
  const examStatus = useAppSelector((store) => store.exam.status);

  return (
    <div className="bg-white py-2 md:mt-2 px-6.25">
      {examStatus === "completed" && <Completed />}
      {examStatus === "in-progress" && <NMCNQuestions />}
    </div>
  );
};

export default ClientPage;
