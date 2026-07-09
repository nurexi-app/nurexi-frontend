"use client";

import { Button } from "@/components/ui/button";
import useCreateCourse from "@/hooks/useCreateCourse";
import { PlusCircle } from "lucide-react";

const CreateCourse = ({ userId }: { userId: string }) => {
  const { handleCreateCourse } = useCreateCourse(userId);
  return (
    <div>
      <Button
        className="bg-secondary z-50 absolute bottom-5 right-5 hover:bg-secondary! bodyText font-medium"
        onClick={() => {
          handleCreateCourse();
        }}
      >
        <PlusCircle /> Create Course
      </Button>
    </div>
  );
};

export default CreateCourse;
