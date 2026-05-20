import EditCourse from "@/components/user/educator/course-upload/EditCourse";
import { getCourse } from "@/lib/actions/course-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Course",
};

const CourseEditPage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  return (
    <div>
      <EditCourse course={course} />
    </div>
  );
};

export default CourseEditPage;
