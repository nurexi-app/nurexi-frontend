import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LearnLayoutShell } from "@/components/courses/learn/LearnLayoutShell";
import LearnProvider from "@/context/LearnProvider";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      title,
      slug,
      description
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !course) {
    return {
      title: "Learn",
    };
  }

  return {
    title: course.title || "course",
    description: course.description || "",
  };
};

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      slug,
      educator_id,
      course_sections (
        id,
        title,
        position,
        quiz_data,
        course_lessons (
          id,
          title,
          content_type,
          position
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !course) {
    notFound();
  }

  // 2. Fetch the User's Completed Lessons for this Course
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return null;
  }

  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.user.id)
    .eq("course_id", course?.id);

  const completedLessonIds = completions?.map((c) => c.lesson_id) || [];

  return (
    <LearnProvider initialCompletedLessons={completedLessonIds} course={course}>
      <LearnLayoutShell curriculum={course.course_sections}>
        {children}
      </LearnLayoutShell>
    </LearnProvider>
  );
}
