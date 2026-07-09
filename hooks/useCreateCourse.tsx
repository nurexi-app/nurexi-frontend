"use client";

import { createCourse } from "@/lib/actions/course-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useCreateCourse = (userId: string) => {
  const router = useRouter();
  const handleCreateCourse = async () => {
    const coursePromise = createCourse(userId).then((response) => {
      if (!response.success) {
        throw new Error("Failed to create course");
      }
      return response.courseData;
    });
    toast.promise(coursePromise, {
      loading: "Creating your course...",
      success: (courseData) => {
        router.push(`/educator/courses/${courseData?.id}/edit`);
        return "Course created successfully";
      },
      error: (err) => err.message || "Something went wrong",
    });
  };

  return { handleCreateCourse };
};

export default useCreateCourse;
