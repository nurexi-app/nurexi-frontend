"use client";
import Completed from "@/components/user/learner/exam/Completed";
import NMCNQuestions from "@/components/user/learner/exam/NMCNQuestion";
import { useAppContext } from "@/context/AppProvider";
const ClientPage = () => {
  const { showResult } = useAppContext();

  return (
    <div className="bg-white py-2 md:mt-2 px-6.25">
      {showResult ? <Completed /> : <NMCNQuestions />}
    </div>
  );
};

export default ClientPage;
