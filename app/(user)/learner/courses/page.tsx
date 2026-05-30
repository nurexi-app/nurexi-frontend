import DashboardCaption from "@/components/web/DashboardCaption";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnerCourseCard } from "@/components/web/LearnerCourseCard";
import { dashboardCourses } from "@/lib/exports/courses";
import { DashboardCourseInterface } from "@/lib/types/course";
import Link from "next/link";

// const myCourses = []; // mocked empty

export default function Page() {
  return (
    <>
      <DashboardCaption
        heading="Your courses"
        text="Start your learning for the day!"
      />

      {dashboardCourses.length === 0 ? (
        <div className="flex flex-col items-center py-16 bg-white h-full text-center gap-3">
          <Inbox className="text-muted-foreground" size={36} />
          <p className="text-muted-foreground w-3/4 max-w-[500px] text-sm">
            Nurexi courses are officially on the way! We are currently building
            a premium learning experience to help you level up your skills. Stay
            tuned—our first batch of expert-led courses is dropping soon!
          </p>
          <Link href="/learner/exam">
            <Button>Explore Exams</Button>
          </Link>
        </div>
      ) : (
        <div className="grid mt-4 grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {dashboardCourses.map((course: DashboardCourseInterface) => (
            <LearnerCourseCard
              key={course.id}
              img={course.thumbnail}
              title={course.title}
              author={course.author.name}
              verified={course.author.verified}
              progress={course.progress}
            />
          ))}
        </div>
      )}
    </>
  );
}
