import SelectExamType from "@/components/user/learner/exam/SelectExamType";
import DashboardCaption from "@/components/web/DashboardCaption";

export default function MockExamPage() {
  return (
    <>
      <DashboardCaption heading="Exam" text="Write your preferred mock exam" />

      <section className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mock Exams</h1>
          <p className="text-muted-foreground">
            Practice under real exam conditions
          </p>
        </div>

        <SelectExamType />
      </section>
    </>
  );
}
