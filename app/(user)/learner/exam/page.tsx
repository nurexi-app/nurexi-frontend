import ExamTypeCard from "@/components/user/learner/exam/ExamTypeCard";
import Header from "@/components/user/learner/exam/Header";
import SelectExamType from "@/components/user/learner/exam/SelectExamType";
import DashboardCaption from "@/components/web/DashboardCaption";
import { createClient } from "@/lib/supabase/server";

export default async function MockExamPage() {
  const supabase = await createClient();
  // const { data: exams } = await supabase.from("exams").select("*");
  const { data: exams } = await supabase.from("exams").select(
    `
      *,
      exam_session (
        id,
        session_name,
        year
      )
    `,
  );

  return (
    <>
      <DashboardCaption heading="Exam" text="Write your preferred mock exam" />

      <section className="p-4 space-y-6">
        <Header />

        {/* <SelectExamType examsData={exams || []} /> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams?.map((exam) => (
            <ExamTypeCard
              key={exam.id}
              {...exam}
              sessions={exam.exam_sessions}
            />
          ))}
        </div>
      </section>
    </>
  );
}
