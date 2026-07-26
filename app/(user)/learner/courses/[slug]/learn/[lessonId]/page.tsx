import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CourseVideoPlayer } from "@/components/courses/learn/CourseVideoPlayer";
import LessonTabs from "@/components/courses/learn/LessonTabs";
import { PdfViewer } from "@/components/courses/learn/PdfViewer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { lessonId } = await params;
  const supabase = await createClient();

  // Fetch the specific lesson data
  const { data: lesson, error } = await supabase
    .from("course_lessons")
    .select(
      `
      id,
      title,
      content_type,
      asset
    `,
    )
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    console.log(error);
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-background ">
      <section className="w-full bg-black flex  justify-center max-h-[70vh]">
        <div className="w-full max-w-300">
          {lesson.content_type === "video" ? (
            <CourseVideoPlayer lesson={lesson} />
          ) : lesson.content_type === "pdf" && lesson.asset?.filename ? (
            <PdfViewer lesson={lesson} />
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center flex-col">
              <span className="text-muted-foreground">Text Lesson</span>
            </div>
          )}
        </div>
      </section>

      {/* ── TABBED CONTENT AREA ── */}
      <section className="flex-1 mt-4 bg-background">
        <LessonTabs lessonContent={null} />
      </section>
    </div>
  );
}
