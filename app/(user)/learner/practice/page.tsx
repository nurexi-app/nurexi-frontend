import ShowAvailablePracticeSubject from "@/components/user/learner/practice/ShowAvailablePracticeSubject";
import DashboardCaption from "@/components/web/DashboardCaption";
export default function Page() {
  return (
    <>
      <DashboardCaption
        heading="Choose a Course!"
        text="Take your time. Learn deeply. Build confidence."
      />
      <ShowAvailablePracticeSubject />
    </>
  );
}
