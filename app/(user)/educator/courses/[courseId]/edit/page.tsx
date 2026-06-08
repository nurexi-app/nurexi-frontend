import EditCourse from "@/components/user/educator/course-upload/EditCourse";
import { getCourse } from "@/lib/actions/course-action";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GetUserId } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Course",
};

const CourseEditPage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = await params;
  const [course, userId] = await Promise.all([
    getCourse(courseId),
    GetUserId(),
  ]);

  if (!userId) {
    redirect("/login");
  }

  if (userId !== course.educator_id) {
    redirect("/educator/courses");
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="text-muted-foreground">
          The course you are looking for doesn't exist.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/educator/courses">
            <MdKeyboardArrowLeft /> Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <EditCourse course={course} userId={userId} />
    </div>
  );
};

export default CourseEditPage;
