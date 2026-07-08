// components/educator/EditCourse.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import CourseOverviewForm from "./CourseOverviewForm";
import CourseSection from "./CourseSections";
import { CourseProvider } from "@/context/CourseProvider";
import Quiz from "./Quiz";
import CoursePricing from "./CoursePricing";
import {
  LayoutList,
  BookOpen,
  HelpCircle,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const courseUploadTabs = [
  {
    label: "Overview",
    value: "course-overview",
    icon: LayoutList,
    description: "Title, description, image",
  },
  {
    label: "Content",
    value: "course-content",
    icon: BookOpen,
    description: "Sections and lessons",
  },
  {
    label: "Quizzes",
    value: "course-quiz",
    icon: HelpCircle,
    description: "Per-section quizzes",
  },
  {
    label: "Pricing",
    value: "course-pricing",
    icon: DollarSign,
    description: "Price and discounts",
  },
];

const EditCourse = ({ course, userId }: { course: any; userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section") || "course-overview";

  const currentTabIndex = courseUploadTabs.findIndex(
    (t) => t.value === currentSection,
  );
  const currentTab = courseUploadTabs[currentTabIndex];

  const navigate = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("section", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <CourseProvider courseData={course} userId={userId}>
      <div className="py-4 px-3 rounded-xl bg-white">
        {/* ── sticky tab bar ── */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-md pb-4">
          {/* desktop: full tab bar */}
          <div className="hidden sm:grid grid-cols-4 gap-1 p-1 bg-muted rounded-xl">
            {courseUploadTabs.map(
              ({ icon: Icon, label, value, description }) => {
                const isActive = currentSection === value;
                return (
                  <button
                    key={value}
                    onClick={() => navigate(value)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-all text-center",
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-[12px] font-semibold leading-none">
                      {label}
                    </span>
                    <span className="text-[10px] leading-none hidden lg:block opacity-70">
                      {description}
                    </span>
                  </button>
                );
              },
            )}
          </div>

          {/* mobile: scrollable pill row */}
          <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {courseUploadTabs.map(({ icon: Icon, label, value }) => {
              const isActive = currentSection === value;
              return (
                <button
                  key={value}
                  onClick={() => navigate(value)}
                  className={cn(
                    "flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full border text-[12px] font-semibold transition-all",
                    isActive
                      ? "bg-secondaryLight border-secondary text-secondaryDark"
                      : "border-border text-muted-foreground bg-background hover:border-secondary/50",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* breadcrumb showing current position */}
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground px-1">
            <span>Course</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">
              {currentTab?.label}
            </span>
            {currentTab?.description && (
              <>
                <span className="text-border">·</span>
                <span>{currentTab.description}</span>
              </>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* ── tab content ── */}
        {currentSection === "course-overview" && (
          <CourseOverviewForm course={course} userId={userId} />
        )}
        {currentSection === "course-content" && <CourseSection />}
        {currentSection === "course-pricing" && (
          <CoursePricing courseData={course} />
        )}
        {currentSection === "course-quiz" && <Quiz />}
      </div>
    </CourseProvider>
  );
};

export default EditCourse;
