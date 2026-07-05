"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaBook, FaDollarSign, FaFlipboard, FaUpload } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import CourseOverviewForm from "./CourseOverviewForm";
import CourseSection from "./CourseSections";
import { CourseProvider } from "@/context/CourseProvider";
import Quiz from "./Quiz";
import CoursePricing from "./CoursePricing";

const courseUploadTabs = [
  {
    label: "Course Overview",
    value: "course-overview",
    icon: <FaFlipboard />,
  },
  {
    label: "Course Content",
    value: "course-content",
    icon: <FaBook />,
  },
  {
    label: "Quizzes",
    value: "course-quiz",
    icon: <FaUpload />,
  },
  {
    label: "Course Pricing",
    value: "course-pricing",
    icon: <FaDollarSign />,
  },
];
const EditCourse = ({ course, userId }: { course: any; userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSection = searchParams.get("section") || "course-overview";

  return (
    <CourseProvider courseId={course?.id || ""} userId={userId}>
      <div className="py-6 px-3 rounded bg-white">
        <div className="grid grid-cols-4 justify-center mb-4">
          {courseUploadTabs.map(({ icon, label, value }, i) => {
            const isActive = currentSection === value;
            return (
              <button
                key={i}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("section", value);
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className={`px-1.25 py-2.5 max-w-50 justify-center flex items-center gap-2 cursor-pointer rounded-xl  transition-colors ${
                  isActive
                    ? "bg-secondaryLight text-secondaryDark   "
                    : "bg-transparent text-black/50  hover:bg-secondary/50 hover:text-secondaryDark"
                }`}
              >
                {icon}
                <p className="bodyText max-sm:hidden">{label}</p>
              </button>
            );
          })}
        </div>

        <Separator className="my-6" />

        {currentSection === "course-overview" && (
          <CourseOverviewForm course={course} />
        )}
        {currentSection === "course-content" && <CourseSection />}
        {currentSection === "course-pricing" && <CoursePricing />}
        {currentSection === "course-quiz" && <Quiz />}
      </div>
    </CourseProvider>
  );
};

export default EditCourse;
