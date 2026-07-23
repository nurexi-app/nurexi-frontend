import CourseContentAccordion from "@/components/courses/CourseContentAccordion";
import CourseHero from "@/components/courses/CourseHero";
import EnrollCard from "@/components/courses/EnrolCard";
import InstructorCard from "@/components/courses/InstructorCard";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug", slug);
  const supabase = await createClient();
  console.log("starting supabase fetch");
  const { data, error } = await supabase
    .from("courses")
    .select(
      `title,price,discount_value,description,expected_duration,cover_image,discount_expiry, discount_type, has_discount, slug, is_free,difficulty_level, target_audience, what_you_will_learn ,author:educator_id(full_name,avatar_url,bio, professional_title,    verification:educator_verifications!educator_verifications_user_id_fkey (status)) ,
      
    course_sections (
      id,
      title,
      position,
      course_lessons (
        id,
        title,
        content_type,
        duration_seconds,
        is_preview,
        position
      )
    )
      `,
    )
    .eq("is_published", true)
    .eq("is_approved", true)
    .eq("slug", slug)
    .single();
  if (error) console.log("supabase error: ", error);
  if (!data) {
    notFound();
  }
  console.log("data", data);

  const course = data as any;
  return (
    <main className="mx-auto flex container mt-16 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT */}
        <section className="space-y-6">
          <CourseHero course={course} />
          <CourseContentAccordion
            sections={course.course_sections ?? []}
            whatYouWillLearn={course.what_you_will_learn ?? []}
            isEnrolled={false} // boolean — check course_purchases for this user
          />
          <InstructorCard author={course.author} />
        </section>

        {/* RIGHT */}
        <aside className="max-sm:-order-1 h-full block">
          <EnrollCard course={course} />
        </aside>
      </div>
    </main>
  );
}
