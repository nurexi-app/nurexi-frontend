"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCreateCourse from "@/hooks/useCreateCourse";
import { Upload } from "lucide-react";

const QuickActions = ({ userId }: { userId: string }) => {
  const { handleCreateCourse } = useCreateCourse(userId);
  return (
    <div className="mt-2 md:mt-4 gap-4 flex items-center justify-between">
      <Card
        className="bg-secondaryDarker p-2 basis-1/2 rounded-md border-0 cursor-pointer duration-150 hover:scale-[1.02] transition-all"
        onClick={() => handleCreateCourse()}
      >
        <CardContent className=" flex items-center justify-between h-30">
          <div className="">
            <h5 className="text-white font-medium text-lg">
              Upload New Course
            </h5>
            <small className="text-white text-xs">
              Create and structure your course content
            </small>
          </div>
          <Upload className="text-white" />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
