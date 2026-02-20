"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ManageCourse from "./ManageCourse";
import { FaBook, FaDollarSign, FaFlipboard, FaUpload } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import CourseOverviewForm from "./CourseOverviewForm";
import CourseSection from "./CourseSections";

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
    label: "Quiz",
    value: "quiz",
    icon: <FaUpload />,
  },
  {
    label: "Course Pricing",
    value: "course-pricing",
    icon: <FaDollarSign />,
  },
];
const CreateOrManage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current 'type' from URL, defaulting to 'create' if not present
  const currentType = searchParams.get("type") || "create";
  // Get current 'section' from URL, defaulting to 'course-overview'
  const currentSection = searchParams.get("section") || "course-overview";

  const tabs = [
    { label: "Create new course", value: "create" },
    { label: "Manage courses", value: "manage" },
  ];

  const handleToggle = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", value);
    // Use router.replace to update the URL without adding a new history entry
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-grey flex items-center gap-0.5 mt-4 w-fit  rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleToggle(tab.value)}
            className={`p-2 text-black cursor-pointer bodyText duration-200 m-1.25  rounded-2xl transition-all ${
              currentType === tab.value
                ? "bg-white  shadow-sm"
                : " hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentType === "create" || currentType === "edit" ? (
        <div className="py-6 px-3 rounded">
          {currentType === "edit" && (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Editing Course:</span>
              <span className="font-semibold text-foreground">
                {/* In a real app, you'd fetch the title using the ID */}{" "}
                {searchParams.get("courseId")
                  ? `ID #${searchParams.get("courseId")}`
                  : "New Course"}
              </span>
            </div>
          )}
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
                  className={`px-1.25 py-2.5 max-w-50 justify-center flex items-center gap-2 cursor-pointer rounded-xl border transition-colors ${
                    isActive
                      ? "bg-secondary  border-primary"
                      : "bg-secondaryLight text-secondaryDark border-transparent hover:bg-secondary/50"
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
            <CourseOverviewForm courseId={searchParams.get("courseId")} />
          )}
          {currentSection === "course-content" && <CourseSection />}
          {currentSection === "course-pricing" && (
            <div className="p-10 text-center border rounded-lg bg-slate-50">
              <h2 className="text-xl font-semibold">Pricing Settings</h2>
            </div>
          )}
          {currentSection === "course-publish" && (
            <div className="p-10 text-center border rounded-lg bg-slate-50">
              <h2 className="text-xl font-semibold">Publish Settings</h2>
            </div>
          )}
        </div>
      ) : (
        <ManageCourse />
      )}
    </>
  );
};

export default CreateOrManage;
