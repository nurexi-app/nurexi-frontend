import PracticeClient from "@/components/user/learner/practice/PracticeClient";
import { GetUserProfile } from "@/lib/actions/auth";
import { GetPracticeQuestions } from "@/lib/actions/practice-actions";
import { Suspense } from "react";

interface ParamsProps {
  params: Promise<{ id: string }>;
}
const Page = async ({ params }: ParamsProps) => {
  const { id } = await params;
  const user = await GetUserProfile();
  const questions = await GetPracticeQuestions(user?.id, id, 20);
  console.log(questions);
  return (
    <Suspense fallback={<h3>Loading...</h3>}>
      <PracticeClient questions={questions} />
    </Suspense>
  );
};

export default Page;
