import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LearnRootPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      course_sections (
        id,
        position,
        course_lessons (
          id,
          position
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !course) {
    redirect("/learner/courses");
  }

  // Sort sections and lessons to find the very first lesson
  const sortedSections =
    course.course_sections?.sort((a, b) => a.position - b.position) || [];

  if (sortedSections.length === 0) {
    // Handle edge case: Course has no sections yet
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>This course has no content yet.</p>
      </div>
    );
  }

  const firstSection = sortedSections[0];
  const sortedLessons =
    firstSection.course_lessons?.sort((a, b) => a.position - b.position) || [];

  if (sortedLessons.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>The first section has no lessons.</p>
      </div>
    );
  }

  // TODO: Later, check the user's progress in the DB and redirect to their last unwatched lesson.
  // For now, default to the very first lesson in the course.
  const targetLessonId = sortedLessons[0].id;

  // Instantly redirect to the actual lesson URL
  redirect(`/learner/courses/${slug}/learn/${targetLessonId}`);
}
