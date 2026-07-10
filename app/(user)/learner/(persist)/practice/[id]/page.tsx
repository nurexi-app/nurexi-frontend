import PracticeClient from "@/components/user/learner/practice/PracticeClient";
import { GetUserProfile } from "@/lib/actions/auth";
import { GetPracticeQuestions } from "@/lib/actions/practice-actions";
import { Suspense } from "react";

interface ParamsProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ limit?: string; difficulty?: string }>;
}
const Page = async ({ params, searchParams }: ParamsProps) => {
  const { id } = await params;
  const { limit, difficulty } = await searchParams;
  const user = await GetUserProfile();
  
  const filters = {
    limit: limit ? parseInt(limit, 10) : 20,
    difficulty: difficulty || "all",
  };
  
  const questions = await GetPracticeQuestions(user?.id, id, filters);
  return (
    <Suspense fallback={<h3>Loading...</h3>}>
      <PracticeClient questions={questions} />
    </Suspense>
  );
};

export default Page;
