// import DashboardCaption from "@/components/web/DashboardCaption";
// import { Inbox } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { LearnerCourseCard } from "@/components/web/LearnerCourseCard";
// import { dashboardCourses } from "@/lib/exports/courses";
// import Link from "next/link";

// export default function Page() {
//   return (
//     <>
//       <DashboardCaption
//         heading="Your courses"
//         text="Start your learning for the day!"
//       />

//       {dashboardCourses.length === 0 ? (
//         <div className="flex flex-col items-center py-16 bg-white h-full text-center gap-3">
//           <Inbox className="text-muted-foreground" size={36} />
//           <p className="text-muted-foreground w-3/4 max-w-125 text-sm">
//             Nurexi courses are officially on the way! We are currently building
//             a premium learning experience to help you level up your skills. Stay
//             tuned—our first batch of expert-led courses is dropping soon!
//           </p>
//           <Link href="/learner/exam">
//             <Button>Explore Exams</Button>
//           </Link>
//         </div>
//       ) : (
//         <div className="grid mt-4 grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
//           {dashboardCourses.map((course: any) => (
//             <LearnerCourseCard
//               key={course.id}
//               img={course.cover_image}
//               title={course.title}
//               author={course.author.full_name}
//               verified={course.author.verified}
//               progress={course.progress}
//             />
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MyLearningPage() {
  const supabase = await createClient();

  // 1. Get the current logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">Please log in to view your courses.</div>
    );
  }

  // 2. Fetch the courses this user is enrolled in
  // NOTE: Adjust 'course_enrollments' to match your actual table name
  const { data: enrollments, error } = await supabase
    .from("course_enrollments")
    .select(
      `
      course_id,
      courses (
        id,
        title,
        slug,
        cover_image,
        author:educator_id (full_name)
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching enrollments:", error);
  }

  const enrolledCourses = enrollments?.map((e) => e.courses) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20 border-dashed">
          <h2 className="text-xl font-semibold mb-2">
            {/* You haven't enrolled in any courses yet. */}
            Coming soon
          </h2>
          <p className="text-muted-foreground mb-6">
            Discover new skills and start learning today.
          </p>
          <Link href="/learner/exam">
            <Button>Browse Exams</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {enrolledCourses.map((course: any) => (
            <div
              key={course.id}
              className="group border rounded-xl overflow-hidden flex flex-col bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Cover Image */}
              <div className="aspect-video relative bg-muted overflow-hidden">
                {course.cover_image ? (
                  <Image
                    src={course.cover_image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.author?.full_name || "Instructor"}
                </p>

                <div className="mt-auto">
                  {/* TODO: Add a linear progress bar here later */}
                  <Link
                    href={`/learner/courses/${course.slug}/learn`}
                    className="w-full"
                  >
                    <Button variant="default" className="w-full">
                      Start Course
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
