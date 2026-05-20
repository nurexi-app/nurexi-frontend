import CreateCourse from "@/components/user/educator/course-upload/CreateCourse";
import ManageCourse from "@/components/user/educator/course-upload/ManageCourse";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import { getEducatorCourses } from "@/lib/actions/course-action";

export default async function UploadCourse() {
  const userData = await GetUserProfile();
  const allCourses = await getEducatorCourses(userData?.id);

  return (
    <>
      <DashboardCaption
        heading="Course Upload & Management"
        text="Create, organise and manage your course content"
      />

      <main className="md:px-2 mt-4">
        <CreateCourse userId={userData?.id} />
        <ManageCourse allCourses={allCourses} />
      </main>
    </>
  );
}
