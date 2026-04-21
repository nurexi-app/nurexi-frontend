import ShowAvailablePracticeSubject from "@/components/user/learner/practice/ShowAvailablePracticeSubject";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import { GetSubjectsWithCounts } from "@/lib/actions/practice-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice",
  description: "Practice your nursing skills",
};

export default async function Page() {
  const user = await GetUserProfile();
  const subjects = await GetSubjectsWithCounts(user?.id);

  console.log(subjects);
  // const practiceQuestions = await GetPracticeQuestions(user?.id, subject[0].id);
  return (
    <>
      <DashboardCaption
        heading="Choose a Course!"
        text="Take your time. Learn deeply. Build confidence."
      />
      <ShowAvailablePracticeSubject subjectsObject={subjects} />
    </>
  );
}
