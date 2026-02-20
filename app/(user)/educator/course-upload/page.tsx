import DashboardCaption from "@/components/web/DashboardCaption";
import CreateOrManage from "@/components/user/educator/course-upload/CreateOrManage";
import { Suspense } from "react";

export default function UploadCourse() {
  return (
    <>
      <DashboardCaption
        heading="Course Upload & Management"
        text="Create, organise and manage your course content"
      />

      <main className="md:px-2">
        <Suspense fallback={<div>Loading...</div>}>
          <CreateOrManage />
        </Suspense>
      </main>
    </>
  );
}
