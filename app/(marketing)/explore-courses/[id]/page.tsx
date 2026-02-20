import CourseContentAccordion from "@/components/courses/CourseContentAccordion";
import CourseHero from "@/components/courses/CourseHero";
import EnrollCard from "@/components/courses/EnrolCard";
import InstructorCard from "@/components/courses/InstructorCard";
import { publicCourses } from "@/lib/exports/courses";

export default function CoursePage() {
  const course = publicCourses[0];

  return (
    <main className="mx-auto flex container mt-16 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT */}
        <section className="space-y-6">
          <CourseHero course={course} />
          <CourseContentAccordion />
          <InstructorCard />
        </section>

        {/* RIGHT */}
        <aside className="max-sm:-order-1 block">
          <EnrollCard course={course} />
        </aside>
      </div>
    </main>
  );
}
