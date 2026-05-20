"use client";

import { Button } from "@/components/ui/button";
import { createCourse } from "@/lib/actions/course-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateCourse = ({ userId }: { userId: string }) => {
  const router = useRouter();
  async function handleCreateCourse() {
    toast("starting ");
    try {
      const response = await createCourse(userId);
      if (response.success) {
        toast.success("course created successfully");
        router.push(`/educator/courses/${response.courseData?.id}/edit`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  return (
    <div>
      <Button
        className="bg-secondary hover:bg-secondary! bodyText font-medium"
        onClick={() => {
          handleCreateCourse();
        }}
      >
        New Course
      </Button>
    </div>
  );
};

export default CreateCourse;
